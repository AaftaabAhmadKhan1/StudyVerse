# Live Working Demo

**Project Name:** PW StudyVerse
**Current Environment:** Production (Vercel Edge Network)

## 🌐 Primary Live URL
👉 **[https://pw-study-verse.vercel.app](https://pw-study-verse.vercel.app)** 

*(Note: Vercel alias has been successfully mapped to the primary deployment)*

---

## 🧪 Testing Instructions for Judges/Reviewers

1. **Student Onboarding Flow**
   * Visit the URL above.
   * Add a few YouTube channels to your "My Channels" dashboard (Using the search bar).
   * Notice the ad-free, distraction-free rendering of the videos.

2. **Digital Library (LocalStorage Check)**
   * Click on a video and click the "Save" or "Watch Later" icon.
   * Navigate to the **Library** tab on the left sidebar to see your saved content.
   * *Refresh the page* to verify your context persists without needing a backend server database.

3. **Live Section Filtering**
   * Navigate to the **Live** tab.
   * Observe that the system strictly queries the YouTube API and filters exclusively for `isLive` and `upcoming` broadcasts, dropping VODs entirely.

4. **StoryTutor AI**
   * Access the AI Tutor feature.
   * Input a topic (e.g., "Newton's Laws of Motion").
   * Review the dynamically generated JSON-to-UI story and take the multiple-choice quiz.

5. **Admin Dashboard Revamp**
   * Navigate to the mock Admin panel (`/admin`).
   * Verify the streamlined interface for global channel management and announcements.