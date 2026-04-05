#!/usr/bin/env python3
"""
Handwritten Notes Generator — Extracts transcript from YouTube video,
uses AI to create comprehensive study notes, renders as beautiful handwritten PDF.

Usage: python generate_notes.py <youtube_url> <output_dir>
"""

import sys, os, json, subprocess, base64, textwrap, math, random
from pathlib import Path
from urllib import request as urlreq

# ─── Logging ────────────────────────────────────────────────────────────────
def log(obj):
    print(json.dumps(obj, ensure_ascii=False), flush=True)

# ─── Config ─────────────────────────────────────────────────────────────────
def load_env():
    """Load all API keys from .env.local or .env and return dict."""
    keys = {}
    project_root = Path(__file__).parent.parent
    for env_file in ['.env.local', '.env']:
        p = project_root / env_file
        if p.exists():
            for line in p.read_text(encoding='utf-8').splitlines():
                line = line.strip()
                if '=' in line and not line.startswith('#'):
                    k, v = line.split('=', 1)
                    keys[k.strip()] = v.strip().strip('"').strip("'")
    # Also check env vars
    for k in ['OPENROUTER_API_KEY', 'HUGGINGFACE_API_KEY', 'GEMINI_API_KEY']:
        if k not in keys or not keys[k] or 'your_' in keys[k].lower():
            env_val = os.environ.get(k, '')
            if env_val:
                keys[k] = env_val
    return keys

def _is_real_key(val):
    return val and len(val) > 10 and 'your_' not in val.lower() and 'placeholder' not in val.lower()

# ─── Transcript Extraction ──────────────────────────────────────────────────
def get_transcript(url):
    """Get video transcript using yt-dlp auto-subtitles."""
    cmd = [
        sys.executable, "-m", "yt_dlp",
        "--write-auto-sub", "--sub-lang", "en,hi",
        "--sub-format", "vtt", "--skip-download",
        "-o", "-",
        "--no-playlist", "--no-warnings", "--no-check-certificates",
        url
    ]
    import tempfile
    with tempfile.TemporaryDirectory(prefix="notes_") as tmp:
        cmd_with_output = [
            sys.executable, "-m", "yt_dlp",
            "--write-auto-sub", "--sub-lang", "en,hi",
            "--sub-format", "vtt", "--skip-download",
            "-o", os.path.join(tmp, "video"),
            "--no-playlist", "--no-warnings", "--no-check-certificates",
            url
        ]
        subprocess.run(cmd_with_output, capture_output=True, text=True, timeout=60)

        # Find the subtitle file
        transcript = ""
        for f in sorted(Path(tmp).glob("*.vtt")):
            transcript = parse_vtt(f.read_text(encoding='utf-8', errors='replace'))
            if transcript.strip():
                break

    if not transcript.strip():
        # Fallback: try to get description
        cmd2 = [sys.executable, "-m", "yt_dlp", "--get-description", "--no-warnings", url]
        proc = subprocess.run(cmd2, capture_output=True, text=True, timeout=30)
        if proc.returncode == 0 and proc.stdout.strip():
            transcript = proc.stdout.strip()

    return transcript

def parse_vtt(vtt_text):
    """Parse VTT subtitle file into clean transcript text."""
    lines = []
    seen = set()
    for line in vtt_text.splitlines():
        line = line.strip()
        # Skip headers, timestamps, position tags
        if not line or line.startswith("WEBVTT") or line.startswith("Kind:") or line.startswith("Language:"):
            continue
        if "-->" in line:
            continue
        if line.startswith("NOTE"):
            continue
        # Remove HTML tags and VTT positioning
        import re
        clean = re.sub(r'<[^>]+>', '', line)
        clean = re.sub(r'\{[^}]+\}', '', clean)
        clean = clean.strip()
        if clean and clean not in seen:
            seen.add(clean)
            lines.append(clean)
    return ' '.join(lines)

def get_video_title(url):
    try:
        cmd = [sys.executable, "-m", "yt_dlp", "--get-title", "--no-warnings", url]
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        title = proc.stdout.strip()[:100] if proc.returncode == 0 else "Lecture Notes"
        return title if title else "Lecture Notes"
    except:
        return "Lecture Notes"

# ─── AI Notes Generation ────────────────────────────────────────────────────
def _build_notes_prompt(transcript, title):
    return f"""You are an expert teacher creating DETAILED, THOROUGH handwritten-style study notes for a student who knows NOTHING about this topic.

LECTURE TITLE: {title}

TRANSCRIPT:
{transcript[:20000]}

Generate extremely detailed study notes in the JSON format shown below. Every concept must be explained fully.

{{
  "title": "Lecture title",
  "subject": "Subject name",
  "sections": [
    {{
      "heading": "Section Heading",
      "content": [
        {{"type": "text", "text": "Detailed paragraph explaining the concept in 4-6 complete sentences. Explain the what, why, and how. Never leave the student confused."}},
        {{"type": "bullet", "items": ["Complete sentence explaining point 1 in full detail", "Complete sentence explaining point 2 in full detail", "Complete sentence explaining point 3 in full detail"]}},
        {{"type": "definition", "term": "Term Name", "meaning": "Complete definition in 2-3 full sentences explaining what this term means, where it is used, and why it is important."}},
        {{"type": "formula", "label": "Name of the Formula", "formula": "E = mc squared"}},
        {{"type": "table", "title": "Comparison Table Title", "headers": ["Column 1", "Column 2", "Column 3"], "rows": [["cell value", "cell value", "cell value"], ["cell value", "cell value", "cell value"]]}},
        {{"type": "flowchart", "title": "Process or Sequence Title", "steps": ["Step 1: Full description", "Step 2: Full description", "Step 3: Full description", "Step 4: Full description"]}},
        {{"type": "diagram", "title": "Diagram Title", "labels": ["Component A", "Component B", "Component C"], "description": "2-3 sentence description explaining how all components relate to each other and what the diagram represents."}},
        {{"type": "important", "text": "Write the key point in a complete sentence. Explain WHY this is important and what happens if a student forgets this."}},
        {{"type": "example", "text": "Worked example: Describe a real-life or numerical example step by step in complete sentences so the student can understand exactly how the concept is applied."}}
      ]
    }}
  ],
  "summary": "Write a detailed summary of the entire lecture in 5-6 complete sentences covering all the major topics discussed.",
  "key_takeaways": ["Complete sentence stating takeaway 1 and why it matters", "Complete sentence stating takeaway 2 and why it matters", "Complete sentence stating takeaway 3 and why it matters", "Complete sentence stating takeaway 4 and why it matters", "Complete sentence stating takeaway 5 and why it matters"]
}}

STRICT RULES — FOLLOW EVERY RULE WITHOUT EXCEPTION:

LANGUAGE AND WRITING STYLE:
- Write in the SAME LANGUAGE as the transcript (Hindi, English, or Hinglish as appropriate)
- NEVER use abbreviations or short forms. Always write the full word:
  * Write "for example" NOT "e.g."
  * Write "that is" NOT "i.e."
  * Write "and so on" NOT "etc."
  * Write "versus" NOT "vs."
  * Write "approximately" NOT "approx."
  * Write "definition" NOT "def."
  * Write "therefore" NOT "therefore" is fine but not "∴"
  * Spell out ALL acronyms the first time they appear, for example "Gross Domestic Product (GDP)"
- Every sentence must be COMPLETE — no sentence fragments, no one-word bullets
- Minimum 4-6 complete sentences in every "text" block
- Every bullet item must be a full, complete sentence (at least 10 words)
- Every definition "meaning" must be 2-3 full sentences

CONTENT DEPTH AND COVERAGE:
- Cover EVERY topic, concept, and example mentioned in the transcript — do not skip anything
- For each concept, explain: (1) what it is, (2) why it exists or matters, (3) how it works, (4) a real-world example
- Include AT LEAST 3-4 tables comparing concepts, properties, or characteristics
- Include AT LEAST 3-4 flowcharts showing processes, sequences, or step-by-step methods
- Include AT LEAST 3-4 labeled diagrams showing components or relationships
- Include ALL formulas mentioned, written out in full with labels
- Include a definition block for EVERY key term introduced
- Include at least one worked example per major topic
- Mark all critical points clearly using "important" blocks

FORMATTING:
- Use PROPER sentences and paragraphs, not note-style fragments
- Each section should have at least 6-8 content blocks (not just 2-3)
- The notes should be detailed enough that a student can pass an exam using ONLY these notes
- Return ONLY valid JSON — no markdown fences, no extra text outside the JSON"""


def _call_gemini(prompt, api_key):
    """Call Google Gemini API directly (free tier) with retry."""
    import time
    # (model, max_output_tokens)
    models = [("gemini-2.5-flash", 65536), ("gemini-2.0-flash", 16384), ("gemini-2.0-flash-lite", 8192)]
    last_err = None
    for model, max_tokens in models:
        for attempt in range(3):
            try:
                payload = {
                    "contents": [{"parts": [{"text": prompt}]}],
                    "generationConfig": {
                        "temperature": 0.3,
                        "maxOutputTokens": max_tokens,
                    },
                }
                data = json.dumps(payload).encode('utf-8')
                url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
                req = urlreq.Request(url, data=data, headers={"Content-Type": "application/json"})
                with urlreq.urlopen(req, timeout=120) as resp:
                    result = json.loads(resp.read().decode('utf-8'))
                text = result.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                if text:
                    return text
            except Exception as e:
                last_err = e
                if "429" in str(e):
                    wait = (attempt + 1) * 10
                    log({"status": "generating", "progress": 42, "step": f"Rate limited, waiting {wait}s..."})
                    time.sleep(wait)
                else:
                    break  # Non-rate-limit error, try next model
    raise last_err or RuntimeError("Gemini API failed")


def _call_openrouter(prompt, api_key):
    """Call OpenRouter API (Gemini 2.0 Flash)."""
    payload = {
        "model": "google/gemini-2.0-flash-001",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 16000,
        "temperature": 0.3,
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
    with urlreq.urlopen(req, timeout=120) as resp:
        result = json.loads(resp.read().decode('utf-8'))
    return result.get("choices", [{}])[0].get("message", {}).get("content", "")


def _call_huggingface(prompt, api_key):
    """Call HuggingFace Inference API."""
    # Try multiple models
    models = [
        "Qwen/Qwen2.5-72B-Instruct",
        "meta-llama/Meta-Llama-3-8B-Instruct",
        "mistralai/Mistral-7B-Instruct-v0.3",
    ]
    last_err = None
    for model in models:
        try:
            payload = {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 8000,
                "temperature": 0.3,
                "stream": False,
            }
            data = json.dumps(payload).encode('utf-8')
            req = urlreq.Request(
                "https://api-inference.huggingface.co/v1/chat/completions",
                data=data,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
            )
            with urlreq.urlopen(req, timeout=180) as resp:
                result = json.loads(resp.read().decode('utf-8'))
            return result.get("choices", [{}])[0].get("message", {}).get("content", "")
        except Exception as e:
            last_err = e
            continue
    raise last_err or RuntimeError("All HuggingFace models failed")


def repair_json(text):
    """Try to repair truncated/malformed JSON by completing open brackets."""
    # Remove markdown fences
    import re
    text = re.sub(r'^```json\s*', '', text.strip())
    text = re.sub(r'^```\s*', '', text.strip())
    text = re.sub(r'\s*```$', '', text.strip())
    text = text.strip()

    # First try parsing as-is
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try to repair by closing open brackets/braces
    stack = []
    in_string = False
    escape_next = False
    last_valid_pos = 0

    for i, ch in enumerate(text):
        if escape_next:
            escape_next = False
            continue
        if ch == '\\' and in_string:
            escape_next = True
            continue
        if ch == '"':
            in_string = not in_string
        if not in_string:
            if ch in '{[':
                stack.append(ch)
                last_valid_pos = i
            elif ch in '}]':
                if stack:
                    stack.pop()
                    last_valid_pos = i

    if not stack:
        # No unclosed brackets — try parsing the clean text
        try:
            return json.loads(text)
        except Exception:
            pass

    # Truncate to last complete top-level element and close
    # Find the last complete value before truncation
    closing = ''
    for ch in reversed(stack):
        closing += '}' if ch == '{' else ']'

    # Remove trailing comma before closing
    repaired = text.rstrip().rstrip(',') + closing
    try:
        return json.loads(repaired)
    except Exception:
        pass

    # More aggressive: find last complete JSON object/array
    # Trim to last_valid_pos + 1 and close
    trimmed = text[:last_valid_pos + 1].rstrip().rstrip(',')
    stack2 = []
    in_str2 = False
    esc2 = False
    for ch in trimmed:
        if esc2:
            esc2 = False
            continue
        if ch == '\\' and in_str2:
            esc2 = True
            continue
        if ch == '"':
            in_str2 = not in_str2
        if not in_str2:
            if ch in '{[':
                stack2.append(ch)
            elif ch in '}]':
                if stack2:
                    stack2.pop()

    closing2 = ''.join('}' if c == '{' else ']' for c in reversed(stack2))
    final = trimmed + closing2
    try:
        return json.loads(final)
    except Exception as e:
        raise RuntimeError(f"AI returned invalid JSON that could not be repaired: {e}")


def generate_notes_with_ai(transcript, title, env_keys):
    """Send transcript to AI and get structured notes with diagrams, tables, flowcharts."""
    import re
    prompt = _build_notes_prompt(transcript, title)

    reply = ""
    gemini_key = env_keys.get('GEMINI_API_KEY', '')
    or_key = env_keys.get('OPENROUTER_API_KEY', '')
    hf_key = env_keys.get('HUGGINGFACE_API_KEY', '')

    # Try Gemini first, then OpenRouter, then HuggingFace
    if _is_real_key(gemini_key):
        try:
            log({"status": "generating", "progress": 40, "step": "Using Google Gemini Flash..."})
            reply = _call_gemini(prompt, gemini_key)
        except Exception as e:
            log({"status": "generating", "progress": 40, "step": f"Gemini failed: {e}, trying alternatives..."})

    if not reply and _is_real_key(or_key):
        try:
            log({"status": "generating", "progress": 40, "step": "Using OpenRouter (Gemini Flash)..."})
            reply = _call_openrouter(prompt, or_key)
        except Exception as e:
            log({"status": "generating", "progress": 40, "step": f"OpenRouter failed: {e}, trying HuggingFace..."})

    if not reply and _is_real_key(hf_key):
        log({"status": "generating", "progress": 40, "step": "Using HuggingFace (Qwen2.5)..."})
        reply = _call_huggingface(prompt, hf_key)

    if not reply:
        raise RuntimeError("No working AI API key found. Set OPENROUTER_API_KEY or HUGGINGFACE_API_KEY in .env.local")

    # Clean JSON from markdown fences and repair if truncated
    reply = re.sub(r'^```json\s*', '', reply.strip())
    reply = re.sub(r'\s*```$', '', reply.strip())

    return repair_json(reply)

# ─── Beautiful Handwritten PDF Renderer ──────────────────────────────────────
class HandwrittenPDF:
    def __init__(self):
        from fpdf import FPDF
        self.pdf = FPDF('P', 'mm', 'A4')
        self.pdf.set_auto_page_break(True, margin=20)
        self.W = 210
        self.H = 297
        self.margin = 18
        self.content_w = self.W - 2 * self.margin
        self.y = 0

        # Load fonts
        font_dir = Path(__file__).parent / "fonts"
        self.pdf.add_font("Caveat", "", str(font_dir / "Caveat.ttf"))
        self.pdf.add_font("NotoSans", "", str(font_dir / "NotoSansDevanagari.ttf"))

    def _jitter(self, amt=0.3):
        return random.uniform(-amt, amt)

    def _add_page(self):
        self.pdf.add_page()
        self.y = 20
        self._draw_paper_bg()

    def _draw_paper_bg(self):
        """Draw ruled paper background."""
        # Cream background
        self.pdf.set_fill_color(255, 250, 240)
        self.pdf.rect(0, 0, self.W, self.H, 'F')

        # Left margin line (red)
        self.pdf.set_draw_color(220, 100, 100)
        self.pdf.set_line_width(0.3)
        self.pdf.line(self.margin - 3, 0, self.margin - 3, self.H)

        # Horizontal ruled lines
        self.pdf.set_draw_color(200, 210, 230)
        self.pdf.set_line_width(0.15)
        for ly in range(25, self.H - 10, 8):
            self.pdf.line(self.margin - 5, ly, self.W - self.margin + 5, ly)

    def _ensure_space(self, needed):
        if self.y + needed > self.H - 25:
            self._add_page()

    def _write_text(self, text, size=11, color=(30, 30, 50), bold=False, indent=0):
        """Write text with handwriting font, word-wrapped."""
        self.pdf.set_font("Caveat", size=size)
        self.pdf.set_text_color(*color)

        # Calculate available width
        avail = self.content_w - indent
        chars_per_line = max(20, int(avail / (size * 0.38)))

        wrapped = textwrap.wrap(text, width=chars_per_line)
        if not wrapped:
            wrapped = ['']

        line_h = size * 0.45
        for line in wrapped:
            self._ensure_space(line_h + 2)
            x = self.margin + indent + self._jitter(0.4)
            self.pdf.set_xy(x, self.y + self._jitter(0.2))
            # Try Caveat, fallback to NotoSans for Hindi
            try:
                self.pdf.cell(0, line_h, line)
            except:
                self.pdf.set_font("NotoSans", size=size - 1)
                self.pdf.cell(0, line_h, line)
                self.pdf.set_font("Caveat", size=size)
            self.y += line_h + 0.5

    def render_title(self, title, subject=""):
        self._add_page()
        self.y = 35

        # Title box
        box_h = 28 if subject else 20
        self.pdf.set_fill_color(70, 40, 120)
        self.pdf.set_draw_color(90, 50, 150)
        self.pdf.set_line_width(0.5)
        rx = self.margin
        ry = self.y
        self.pdf.rect(rx, ry, self.content_w, box_h, 'DF')

        # Title text
        self.pdf.set_font("Caveat", size=22)
        self.pdf.set_text_color(255, 255, 255)
        self.pdf.set_xy(rx + 5, ry + 3)
        try:
            self.pdf.cell(self.content_w - 10, 10, title[:60], align='C')
        except:
            self.pdf.set_font("NotoSans", size=16)
            self.pdf.cell(self.content_w - 10, 10, title[:60], align='C')

        if subject:
            self.pdf.set_font("Caveat", size=13)
            self.pdf.set_text_color(220, 200, 255)
            self.pdf.set_xy(rx + 5, ry + 15)
            self.pdf.cell(self.content_w - 10, 8, subject, align='C')

        self.y = ry + box_h + 10

    def render_section_heading(self, heading):
        self._ensure_space(18)
        self.y += 5

        # Underlined colored heading
        self.pdf.set_font("Caveat", size=16)
        self.pdf.set_text_color(70, 40, 120)
        x = self.margin + self._jitter()
        self.pdf.set_xy(x, self.y)
        try:
            self.pdf.cell(0, 8, ">> " + heading)
        except:
            self.pdf.set_font("NotoSans", size=13)
            self.pdf.cell(0, 8, heading)
        self.y += 9

        # Underline
        self.pdf.set_draw_color(70, 40, 120)
        self.pdf.set_line_width(0.4)
        self.pdf.line(self.margin, self.y, self.margin + self.content_w * 0.6, self.y + self._jitter(0.3))
        self.y += 4

    def render_text(self, text):
        self._write_text(text, size=11, color=(30, 30, 50))
        self.y += 2

    def render_bullets(self, items):
        for item in items:
            self._ensure_space(8)
            # Bullet symbol
            self._write_text("• " + item, size=11, color=(40, 40, 60), indent=4)
            self.y += 1

    def render_definition(self, term, meaning):
        self._ensure_space(14)
        # Term in color
        self._write_text("[*] " + term + ":", size=12, color=(180, 50, 50), indent=2)
        self._write_text(meaning, size=11, color=(40, 40, 60), indent=8)
        self.y += 2

    def render_formula(self, label, formula):
        self._ensure_space(18)
        # Formula box
        box_x = self.margin + 8
        box_w = self.content_w - 16
        box_h = 16

        self.pdf.set_fill_color(240, 235, 255)
        self.pdf.set_draw_color(120, 80, 180)
        self.pdf.set_line_width(0.3)
        self.pdf.rect(box_x, self.y, box_w, box_h, 'DF')

        # Label
        self.pdf.set_font("Caveat", size=10)
        self.pdf.set_text_color(100, 60, 160)
        self.pdf.set_xy(box_x + 3, self.y + 1)
        self.pdf.cell(0, 5, label)

        # Formula
        self.pdf.set_font("Caveat", size=14)
        self.pdf.set_text_color(30, 30, 80)
        self.pdf.set_xy(box_x + 10, self.y + 7)
        try:
            self.pdf.cell(box_w - 20, 7, formula, align='C')
        except:
            self.pdf.set_font("NotoSans", size=11)
            self.pdf.cell(box_w - 20, 7, formula, align='C')

        self.y += box_h + 4

    def render_table(self, title, headers, rows):
        cols = len(headers)
        if cols == 0:
            return
        col_w = min(40, (self.content_w - 10) / cols)
        table_w = col_w * cols
        row_h = 9
        total_h = row_h * (len(rows) + 1) + 12

        self._ensure_space(total_h)
        self.y += 3

        # Title
        self.pdf.set_font("Caveat", size=12)
        self.pdf.set_text_color(20, 100, 80)
        self.pdf.set_xy(self.margin + 5, self.y)
        self.pdf.cell(0, 6, "[TABLE] " + title)
        self.y += 8

        start_x = self.margin + (self.content_w - table_w) / 2

        # Header row
        self.pdf.set_fill_color(70, 40, 120)
        self.pdf.set_text_color(255, 255, 255)
        self.pdf.set_font("Caveat", size=10)
        for ci, h in enumerate(headers):
            x = start_x + ci * col_w
            self.pdf.set_xy(x, self.y)
            self.pdf.cell(col_w, row_h, str(h)[:15], border=1, align='C', fill=True)
        self.y += row_h

        # Data rows
        self.pdf.set_text_color(30, 30, 50)
        for ri, row in enumerate(rows):
            self.pdf.set_fill_color(250, 245, 255) if ri % 2 == 0 else self.pdf.set_fill_color(255, 250, 240)
            for ci in range(cols):
                cell_val = str(row[ci]) if ci < len(row) else ""
                x = start_x + ci * col_w
                self.pdf.set_xy(x, self.y)
                self.pdf.set_font("Caveat", size=9)
                try:
                    self.pdf.cell(col_w, row_h, cell_val[:20], border=1, align='C', fill=True)
                except:
                    self.pdf.set_font("NotoSans", size=8)
                    self.pdf.cell(col_w, row_h, cell_val[:20], border=1, align='C', fill=True)
            self.y += row_h

        self.y += 4

    def render_flowchart(self, title, steps):
        if not steps:
            return
        box_h = 10
        gap = 6
        total_h = len(steps) * (box_h + gap) + 15

        self._ensure_space(min(total_h, 100))
        self.y += 3

        # Title
        self.pdf.set_font("Caveat", size=12)
        self.pdf.set_text_color(20, 80, 120)
        self.pdf.set_xy(self.margin + 5, self.y)
        self.pdf.cell(0, 6, "[FLOW] " + title)
        self.y += 9

        box_w = min(100, self.content_w - 30)
        center_x = self.margin + self.content_w / 2

        colors = [
            (70, 40, 120), (20, 100, 80), (150, 60, 60),
            (30, 80, 140), (120, 80, 30), (80, 30, 100),
        ]

        for i, step in enumerate(steps):
            self._ensure_space(box_h + gap + 5)
            bx = center_x - box_w / 2
            by = self.y
            cr, cg, cb = colors[i % len(colors)]

            # Rounded box
            self.pdf.set_fill_color(cr, cg, cb)
            self.pdf.set_draw_color(cr, cg, cb)
            self.pdf.set_line_width(0.4)
            self.pdf.rect(bx, by, box_w, box_h, 'DF')

            # Step text
            self.pdf.set_font("Caveat", size=10)
            self.pdf.set_text_color(255, 255, 255)
            self.pdf.set_xy(bx, by + 1)
            try:
                self.pdf.cell(box_w, box_h - 2, f"  {i+1}. {step}"[:45], align='C')
            except:
                self.pdf.set_font("NotoSans", size=8)
                self.pdf.cell(box_w, box_h - 2, f"  {i+1}. {step}"[:45], align='C')

            self.y += box_h

            # Arrow between steps
            if i < len(steps) - 1:
                ax = center_x
                self.pdf.set_draw_color(100, 100, 100)
                self.pdf.set_line_width(0.5)
                self.pdf.line(ax, self.y, ax, self.y + gap - 1)
                # Arrowhead
                self.pdf.line(ax, self.y + gap - 1, ax - 2, self.y + gap - 4)
                self.pdf.line(ax, self.y + gap - 1, ax + 2, self.y + gap - 4)
                self.y += gap

        self.y += 4

    def render_diagram(self, title, labels, description):
        if not labels:
            return
        n = len(labels)
        diagram_h = 55
        self._ensure_space(diagram_h + 15)
        self.y += 3

        # Title
        self.pdf.set_font("Caveat", size=12)
        self.pdf.set_text_color(20, 80, 50)
        self.pdf.set_xy(self.margin + 5, self.y)
        self.pdf.cell(0, 6, "[DIAGRAM] " + title)
        self.y += 9

        cx = self.margin + self.content_w / 2
        cy = self.y + 22
        radius = 18

        # Draw labeled nodes in a circle
        colors = [
            (70, 40, 120), (20, 100, 80), (150, 60, 60),
            (30, 80, 140), (120, 80, 30), (80, 30, 100),
        ]

        positions = []
        for i, label in enumerate(labels[:8]):  # Max 8 labels
            angle = (2 * math.pi * i / n) - math.pi / 2
            px = cx + radius * 1.8 * math.cos(angle)
            py = cy + radius * 1.2 * math.sin(angle)
            positions.append((px, py))

            cr, cg, cb = colors[i % len(colors)]

            # Circle node
            self.pdf.set_fill_color(cr, cg, cb)
            self.pdf.set_draw_color(cr, cg, cb)
            self.pdf.ellipse(px - 8, py - 5, 16, 10, 'DF')

            # Label
            self.pdf.set_font("Caveat", size=8)
            self.pdf.set_text_color(255, 255, 255)
            self.pdf.set_xy(px - 8, py - 3)
            try:
                self.pdf.cell(16, 6, label[:12], align='C')
            except:
                self.pdf.set_font("NotoSans", size=6)
                self.pdf.cell(16, 6, label[:12], align='C')

        # Draw connecting lines
        self.pdf.set_draw_color(150, 150, 180)
        self.pdf.set_line_width(0.3)
        for i in range(len(positions)):
            j = (i + 1) % len(positions)
            self.pdf.line(positions[i][0], positions[i][1], positions[j][0], positions[j][1])

        self.y = cy + radius * 1.3 + 5

        # Description
        if description:
            self._write_text(description, size=9, color=(80, 80, 100), indent=5)
        self.y += 4

    def render_important(self, text):
        self._ensure_space(14)
        box_x = self.margin + 3
        box_w = self.content_w - 6

        # Yellow highlight box
        self.pdf.set_fill_color(255, 248, 220)
        self.pdf.set_draw_color(200, 160, 50)
        self.pdf.set_line_width(0.4)

        # Calculate height
        chars = max(20, int(box_w / (11 * 0.38)))
        lines = textwrap.wrap(text, width=chars)
        box_h = max(10, len(lines) * 5.5 + 6)
        self._ensure_space(box_h + 2)

        self.pdf.rect(box_x, self.y, box_w, box_h, 'DF')

        self.pdf.set_font("Caveat", size=11)
        self.pdf.set_text_color(140, 80, 0)
        self.pdf.set_xy(box_x + 3, self.y + 2)
        self.pdf.cell(0, 5, "** IMPORTANT **")

        self.pdf.set_text_color(60, 40, 0)
        ly = self.y + 7
        for line in lines:
            self.pdf.set_xy(box_x + 5, ly)
            try:
                self.pdf.cell(0, 5, line)
            except:
                self.pdf.set_font("NotoSans", size=9)
                self.pdf.cell(0, 5, line)
                self.pdf.set_font("Caveat", size=11)
            ly += 5

        self.y += box_h + 3

    def render_example(self, text):
        self._ensure_space(10)
        self._write_text("-> Example: " + text, size=10, color=(0, 100, 80), indent=4)
        self.y += 2

    def render_summary(self, summary, takeaways):
        self._ensure_space(30)
        self.y += 5

        # Summary box
        self.pdf.set_fill_color(240, 245, 255)
        self.pdf.set_draw_color(70, 40, 120)
        self.pdf.set_line_width(0.5)

        chars = max(20, int((self.content_w - 16) / (11 * 0.38)))
        summary_lines = textwrap.wrap(summary, width=chars)
        takeaway_lines = takeaways or []
        box_h = max(30, (len(summary_lines) + len(takeaway_lines)) * 6 + 20)
        self._ensure_space(box_h + 5)

        self.pdf.rect(self.margin + 3, self.y, self.content_w - 6, box_h, 'DF')

        self.pdf.set_font("Caveat", size=14)
        self.pdf.set_text_color(70, 40, 120)
        self.pdf.set_xy(self.margin + 8, self.y + 3)
        self.pdf.cell(0, 6, "--- Summary ---")
        ly = self.y + 11

        self.pdf.set_font("Caveat", size=10)
        self.pdf.set_text_color(40, 40, 60)
        for line in summary_lines:
            self.pdf.set_xy(self.margin + 10, ly)
            try:
                self.pdf.cell(0, 5, line)
            except:
                self.pdf.set_font("NotoSans", size=9)
                self.pdf.cell(0, 5, line)
                self.pdf.set_font("Caveat", size=10)
            ly += 5.5

        if takeaway_lines:
            ly += 3
            self.pdf.set_font("Caveat", size=11)
            self.pdf.set_text_color(70, 40, 120)
            self.pdf.set_xy(self.margin + 8, ly)
            self.pdf.cell(0, 5, "Key Takeaways:")
            ly += 6
            self.pdf.set_text_color(40, 40, 60)
            self.pdf.set_font("Caveat", size=10)
            for t in takeaway_lines:
                self.pdf.set_xy(self.margin + 12, ly)
                try:
                    self.pdf.cell(0, 5, "- " + t)
                except:
                    self.pdf.set_font("NotoSans", size=9)
                    self.pdf.cell(0, 5, "- " + t)
                    self.pdf.set_font("Caveat", size=10)
                ly += 5.5

        self.y += box_h + 5

    def render_notes(self, notes_data):
        """Render the full notes structure to PDF."""
        title = notes_data.get("title", "Lecture Notes")
        subject = notes_data.get("subject", "")

        self.render_title(title, subject)

        for section in notes_data.get("sections", []):
            self.render_section_heading(section.get("heading", ""))

            for content in section.get("content", []):
                ctype = content.get("type", "text")

                if ctype == "text":
                    self.render_text(content.get("text", ""))
                elif ctype == "bullet":
                    self.render_bullets(content.get("items", []))
                elif ctype == "definition":
                    self.render_definition(content.get("term", ""), content.get("meaning", ""))
                elif ctype == "formula":
                    self.render_formula(content.get("label", ""), content.get("formula", ""))
                elif ctype == "table":
                    self.render_table(
                        content.get("title", "Table"),
                        content.get("headers", []),
                        content.get("rows", [])
                    )
                elif ctype == "flowchart":
                    self.render_flowchart(content.get("title", ""), content.get("steps", []))
                elif ctype == "diagram":
                    self.render_diagram(
                        content.get("title", ""),
                        content.get("labels", []),
                        content.get("description", "")
                    )
                elif ctype == "important":
                    self.render_important(content.get("text", ""))
                elif ctype == "example":
                    self.render_example(content.get("text", ""))

        # Summary at end
        summary = notes_data.get("summary", "")
        takeaways = notes_data.get("key_takeaways", [])
        if summary or takeaways:
            self.render_summary(summary, takeaways)

    def save(self, output_path):
        self.pdf.output(str(output_path))


# ─── Main ────────────────────────────────────────────────────────────────────
def main():
    if len(sys.argv) < 3:
        log({"status": "error", "message": "Usage: generate_notes.py <youtube_url> <output_dir>"})
        sys.exit(1)

    url = sys.argv[1]
    output_dir = Path(sys.argv[2])
    output_dir.mkdir(parents=True, exist_ok=True)

    api_keys = load_env()
    has_key = (_is_real_key(api_keys.get('GEMINI_API_KEY', ''))
               or _is_real_key(api_keys.get('OPENROUTER_API_KEY', ''))
               or _is_real_key(api_keys.get('HUGGINGFACE_API_KEY', '')))
    if not has_key:
        log({"status": "error", "message": "No AI API key found. Set GEMINI_API_KEY, OPENROUTER_API_KEY, or HUGGINGFACE_API_KEY in .env.local"})
        sys.exit(1)

    try:
        # Step 1: Get video title
        log({"status": "fetching", "progress": 5, "step": "Getting video info..."})
        title = get_video_title(url)
        log({"status": "fetching", "progress": 10, "step": "Fetching transcript..."})

        # Step 2: Get transcript
        transcript = get_transcript(url)
        if not transcript or len(transcript.strip()) < 50:
            raise RuntimeError("Could not extract transcript from this video. The video may not have captions/subtitles.")
        log({"status": "fetching", "progress": 30, "step": f"Transcript: {len(transcript)} chars"})

        # Step 3: Generate notes with AI
        log({"status": "generating", "progress": 35, "step": "AI is creating notes..."})
        notes_data = generate_notes_with_ai(transcript, title, api_keys)
        log({"status": "generating", "progress": 75, "step": "Notes generated!"})

        # Step 4: Render handwritten PDF
        log({"status": "rendering", "progress": 80, "step": "Rendering handwritten PDF..."})
        renderer = HandwrittenPDF()
        renderer.render_notes(notes_data)

        # Save PDF
        safe_title = "".join(c if c.isalnum() or c in " -_" else "_" for c in title).strip()[:60]
        if not safe_title:
            safe_title = "lecture_notes"
        pdf_path = output_dir / f"{safe_title} - Notes.pdf"
        renderer.save(pdf_path)

        sections = len(notes_data.get("sections", []))
        log({"status": "done", "progress": 100, "pdf": str(pdf_path), "sections": sections, "title": title})

    except Exception as e:
        log({"status": "error", "message": str(e)})
        sys.exit(1)

if __name__ == "__main__":
    main()
