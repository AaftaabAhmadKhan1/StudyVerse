#!/usr/bin/env python3
"""
Slide Extractor — Downloads a YouTube video and extracts unique slides as a PDF.
Uses AI vision (OpenRouter) to identify slides and deduplicate by content.

Usage: python extract_slides.py <youtube_url> <output_dir>
"""

import sys, os, json, shutil, subprocess, tempfile, glob, base64, re, time
from pathlib import Path
from urllib import request as urlreq

def log(obj):
    print(json.dumps(obj), flush=True)

def get_ffmpeg():
    if shutil.which("ffmpeg"):
        return "ffmpeg"
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except ImportError:
        return None

def load_api_key():
    """Load OPENROUTER_API_KEY from .env.local in the project root."""
    project_root = Path(__file__).parent.parent
    for env_file in ['.env.local', '.env']:
        p = project_root / env_file
        if p.exists():
            for line in p.read_text(encoding='utf-8').splitlines():
                line = line.strip()
                if line.startswith('OPENROUTER_API_KEY='):
                    val = line.split('=', 1)[1].strip().strip('"').strip("'")
                    if val:
                        return val
    return os.environ.get('OPENROUTER_API_KEY', '')

def download_video(url, output_path):
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "-f", "best[height<=480]/best",
        "-o", str(output_path) + ".%(ext)s",
        "--no-playlist", "--no-warnings", "--no-check-certificates",
        url
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
    if proc.returncode != 0:
        raise RuntimeError(f"yt-dlp failed: {proc.stderr[:500]}")
    for f in sorted(output_path.parent.glob(f"{output_path.stem}.*")):
        if f.is_file() and f.suffix.lower() in ('.mp4', '.webm', '.mkv', '.avi', '.mov', '.flv', '.3gp'):
            return f
    raise RuntimeError("Downloaded video file not found")

def extract_frames(ffmpeg_path, video_path, frames_dir, interval=3):
    cmd = [
        ffmpeg_path, "-i", str(video_path),
        "-vf", f"fps=1/{interval}", "-q:v", "2", "-vsync", "vfr",
        str(frames_dir / "frame_%05d.jpg"), "-y"
    ]
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=600)
    if proc.returncode != 0:
        raise RuntimeError(f"ffmpeg failed: {proc.stderr[:500]}")
    return sorted(glob.glob(str(frames_dir / "frame_*.jpg")))

def hash_prefilter(frame_paths):
    """Quick hash-based pre-filter to remove obviously identical consecutive frames."""
    from PIL import Image
    import imagehash

    if not frame_paths:
        return []

    filtered = [frame_paths[0]]
    prev_hash = imagehash.phash(Image.open(frame_paths[0]).convert('L').resize((128, 128)), hash_size=8)

    for fp in frame_paths[1:]:
        try:
            h = imagehash.phash(Image.open(fp).convert('L').resize((128, 128)), hash_size=8)
            if abs(h - prev_hash) > 5:  # Loose threshold — just removes near-identical consecutive
                filtered.append(fp)
                prev_hash = h
        except Exception:
            continue
    return filtered

def image_to_base64(path, max_size=512):
    """Convert image to base64 data URL, resized for API efficiency."""
    from PIL import Image
    img = Image.open(path)
    img.thumbnail((max_size, max_size))
    import io
    buf = io.BytesIO()
    img.save(buf, format='JPEG', quality=75)
    b64 = base64.b64encode(buf.getvalue()).decode('utf-8')
    return f"data:image/jpeg;base64,{b64}"

def ai_analyze_batch(image_paths, api_key):
    """Send a batch of frames to AI and get classification + content description.

    Returns list of dicts: {"path": ..., "is_slide": bool, "content": "..."}
    """
    if not image_paths:
        return []

    # Build content array with all images
    content = [
        {
            "type": "text",
            "text": (
                "You are analyzing frames extracted from a YouTube lecture video.\n"
                "For EACH image below (numbered 1 to N), determine:\n"
                "1. Is it a PRESENTATION SLIDE / digital content / notes shown on screen? Or is it a CAMERA shot of a teacher/person/classroom?\n"
                "2. If it IS a slide, describe its MAIN CONTENT in exactly 8-12 words.\n\n"
                "Rules:\n"
                "- A slide has text, diagrams, formulas, bullet points, or digital content\n"
                "- A teacher/camera frame shows a person talking, classroom, whiteboard with teacher visible prominently\n"
                "- If a slide has a small teacher overlay/webcam in corner but the main content is a slide, mark it as SLIDE\n"
                "- If teacher is the main focus and slide is tiny/absent, mark as CAMERA\n\n"
                "Reply ONLY in this exact format, one line per image:\n"
                "1|SLIDE|description of slide content here\n"
                "2|CAMERA|\n"
                "3|SLIDE|description of slide content here\n"
                "...\n"
            )
        }
    ]

    for i, ip in enumerate(image_paths, 1):
        content.append({"type": "text", "text": f"Image {i}:"})
        content.append({
            "type": "image_url",
            "image_url": {"url": image_to_base64(ip)}
        })

    payload = {
        "model": "google/gemini-2.0-flash-001",
        "messages": [{"role": "user", "content": content}],
        "max_tokens": 2000,
        "temperature": 0.1,
    }

    data = json.dumps(payload).encode('utf-8')
    req = urlreq.Request(
        "https://openrouter.ai/api/v1/chat/completions",
        data=data,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://ytwallah.com",
        },
    )

    try:
        with urlreq.urlopen(req, timeout=60) as resp:
            result = json.loads(resp.read().decode('utf-8'))
    except Exception as e:
        raise RuntimeError(f"AI API call failed: {str(e)[:300]}")

    reply = result.get("choices", [{}])[0].get("message", {}).get("content", "")

    # Parse response
    results = []
    for line in reply.strip().splitlines():
        line = line.strip()
        if not line or '|' not in line:
            continue
        parts = line.split('|', 2)
        if len(parts) < 2:
            continue
        try:
            idx = int(parts[0].strip()) - 1
        except ValueError:
            continue
        classification = parts[1].strip().upper()
        desc = parts[2].strip() if len(parts) > 2 else ""

        if 0 <= idx < len(image_paths):
            results.append({
                "path": image_paths[idx],
                "is_slide": classification == "SLIDE",
                "content": desc,
            })

    # Fill in any missing indices as CAMERA
    found_indices = {r["path"] for r in results}
    for ip in image_paths:
        if ip not in found_indices:
            results.append({"path": ip, "is_slide": False, "content": ""})

    return results

def ai_filter_and_dedup(frame_paths, api_key):
    """Use AI to identify slides and deduplicate by content description."""
    BATCH_SIZE = 8  # Send 8 images per API call

    all_slides = []

    for i in range(0, len(frame_paths), BATCH_SIZE):
        batch = frame_paths[i:i + BATCH_SIZE]
        try:
            results = ai_analyze_batch(batch, api_key)
            for r in results:
                if r["is_slide"] and r["content"]:
                    all_slides.append(r)
        except Exception as e:
            # On API error, fall back to including all frames in batch
            for fp in batch:
                all_slides.append({"path": fp, "is_slide": True, "content": f"frame_{i}"})
        time.sleep(0.3)  # Rate limit

    if not all_slides:
        return []

    # Deduplicate by content similarity
    unique = []
    seen_contents = []

    for slide in all_slides:
        content = slide["content"].lower().strip()
        is_dup = False
        for seen in seen_contents:
            if content_similar(content, seen):
                is_dup = True
                break
        if not is_dup:
            unique.append(slide["path"])
            seen_contents.append(content)

    return unique

def content_similar(a, b, threshold=0.6):
    """Check if two content descriptions are similar using word overlap."""
    words_a = set(a.lower().split())
    words_b = set(b.lower().split())
    if not words_a or not words_b:
        return a == b
    intersection = words_a & words_b
    union = words_a | words_b
    jaccard = len(intersection) / len(union) if union else 0
    return jaccard >= threshold

def create_pdf(image_paths, output_pdf):
    from fpdf import FPDF
    from PIL import Image

    if not image_paths:
        raise RuntimeError("No slides found in this video. The video may not contain slide-based content.")

    pdf = FPDF()
    pdf.set_auto_page_break(False)

    for img_path in image_paths:
        img = Image.open(img_path)
        w, h = img.size
        if w >= h:
            pdf.add_page(orientation='L')
            page_w, page_h = 297, 210
        else:
            pdf.add_page(orientation='P')
            page_w, page_h = 210, 297

        margin = 5
        avail_w = page_w - 2 * margin
        avail_h = page_h - 2 * margin
        scale = min(avail_w / w, avail_h / h)
        img_w = w * scale
        img_h = h * scale
        x = margin + (avail_w - img_w) / 2
        y = margin + (avail_h - img_h) / 2
        pdf.image(img_path, x=x, y=y, w=img_w, h=img_h)

    pdf.output(str(output_pdf))
    return output_pdf

def main():
    if len(sys.argv) < 3:
        log({"status": "error", "message": "Usage: extract_slides.py <youtube_url> <output_dir>"})
        sys.exit(1)

    url = sys.argv[1]
    output_dir = Path(sys.argv[2])
    output_dir.mkdir(parents=True, exist_ok=True)

    ffmpeg_path = get_ffmpeg()
    if not ffmpeg_path:
        log({"status": "error", "message": "ffmpeg not found. Install imageio-ffmpeg or ffmpeg."})
        sys.exit(1)

    api_key = load_api_key()
    if not api_key:
        log({"status": "error", "message": "OPENROUTER_API_KEY not found in .env.local"})
        sys.exit(1)

    work_dir = Path(tempfile.mkdtemp(prefix="slides_"))
    frames_dir = work_dir / "frames"
    frames_dir.mkdir()

    try:
        # Step 1: Download video
        log({"status": "downloading", "progress": 10})
        video_path = work_dir / "video"
        video_path = download_video(url, video_path)
        log({"status": "downloading", "progress": 35})

        # Step 2: Extract frames every 3 seconds
        log({"status": "extracting", "progress": 40})
        frames = extract_frames(ffmpeg_path, video_path, frames_dir, interval=3)
        log({"status": "extracting", "progress": 55, "frames": len(frames)})

        # Step 3: Hash pre-filter (removes identical consecutive frames quickly)
        log({"status": "filtering", "progress": 58})
        prefiltered = hash_prefilter(frames)
        log({"status": "filtering", "progress": 62, "slides_found": len(prefiltered)})

        # Step 4: AI analysis — classify slides vs teacher + deduplicate by content
        log({"status": "deduplicating", "progress": 65})
        unique_slides = ai_filter_and_dedup(prefiltered, api_key)
        log({"status": "deduplicating", "progress": 88, "unique": len(unique_slides)})

        # Step 5: Generate PDF
        log({"status": "generating_pdf", "progress": 90})

        try:
            title_cmd = [sys.executable, "-m", "yt_dlp", "--get-title", "--no-warnings", url]
            title_proc = subprocess.run(title_cmd, capture_output=True, text=True, timeout=30)
            title = title_proc.stdout.strip()[:80] if title_proc.returncode == 0 else "slides"
            title = "".join(c if c.isalnum() or c in " -_" else "_" for c in title).strip()
        except Exception:
            title = "slides"
        if not title:
            title = "slides"

        pdf_path = output_dir / f"{title}.pdf"
        create_pdf(unique_slides, pdf_path)
        log({"status": "done", "progress": 100, "pdf": str(pdf_path), "slides": len(unique_slides)})

    except Exception as e:
        log({"status": "error", "message": str(e)})
        sys.exit(1)
    finally:
        try:
            shutil.rmtree(work_dir, ignore_errors=True)
        except Exception:
            pass

if __name__ == "__main__":
    main()
