import Link from 'next/link';

export default function NotesExtractorPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto rounded-3xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6 text-yellow-300 text-sm font-medium">
          Compliance Mode
        </div>
        <h1 className="text-4xl font-bold mb-4">URL-Based Notes Extraction Is Disabled</h1>
        <p className="text-white/65 leading-7 mb-5">
          PW StudyVerse no longer supports extracting handwritten notes directly from a YouTube URL
          through unofficial download or transcript scraping flows.
        </p>
        <p className="text-white/65 leading-7 mb-8">
          To keep the product aligned with YouTube embed and API rules, this feature has been
          paused until it can be rebuilt on a clearly permitted source, such as user-provided
          transcripts or publisher-authorized content feeds.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold"
          >
            Back to Home
          </Link>
          <a
            href="https://www.youtube.com/t/terms"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-xl bg-white/10 text-white font-semibold"
          >
            View YouTube Terms
          </a>
        </div>
      </div>
    </main>
  );
}
