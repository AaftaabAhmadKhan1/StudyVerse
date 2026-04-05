export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0a0520] text-white px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <div className="space-y-5 text-white/75 leading-7">
          <p>
            PW StudyVerse uses YouTube API Services and official YouTube embeds to organize and
            display public Physics Wallah content in a study-first interface.
          </p>
          <p>
            By using this app, you are also subject to the{' '}
            <a
              className="text-purple-300 underline"
              href="https://www.youtube.com/t/terms"
              target="_blank"
              rel="noreferrer"
            >
              YouTube Terms of Service
            </a>{' '}
            and the{' '}
            <a
              className="text-purple-300 underline"
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noreferrer"
            >
              Google Privacy Policy
            </a>
            .
          </p>
          <p>
            We store only the minimum app data needed for the study experience, such as saved
            channels, notes, preferences, and session information.
          </p>
          <p>
            PW StudyVerse does not claim ownership of YouTube-hosted videos, thumbnails, channel
            content, or creator materials. Those remain subject to their original platform terms
            and creator ownership.
          </p>
        </div>
      </div>
    </main>
  );
}
