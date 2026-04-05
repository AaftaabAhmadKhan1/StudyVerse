export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#0a0520] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Terms & Compliance</h1>
        <div className="space-y-5 text-white/75 leading-7">
          <p>
            PW StudyVerse is a study companion that uses official YouTube embeds and YouTube API
            Services to help students navigate public PW content in a cleaner interface.
          </p>
          <p>
            The platform must not be used to download, copy, restream, or obscure YouTube player
            branding, controls, or other required player elements.
          </p>
          <p>
            We provide direct links back to YouTube, preserve creator and channel attribution, and
            use YouTube as the source of truth for playback and public metadata.
          </p>
          <p>
            By using PW StudyVerse, you also agree to the{' '}
            <a
              className="text-purple-300 underline"
              href="https://www.youtube.com/t/terms"
              target="_blank"
              rel="noreferrer"
            >
              YouTube Terms of Service
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
