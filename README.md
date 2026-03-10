# YT Wallah 🌍✨

![YT Wallah Banner](https://img.shields.io/badge/YT-Wallah-red?style=for-the-badge&logo=youtube)
![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

**YT Wallah** is a distraction-free learning platform that aggregates Physics Wallah YouTube content, allowing students to focus on lectures, live classes, and shorts without the usual YouTube distractions.

## 🚀 Features

- 📺 **Channel Aggregation**: Access all Physics Wallah YouTube channels in one place.
- ⚡ **Distraction-Free**: Pure learning environment without comments or related video distractions.
- 📱 **Responsive Design**: Seamless experience across mobile, tablet, and desktop.
- 🔍 **Search & Filter**: Easily find lectures, batches, and specific topics.
- 💬 **Announcements**: Stay updated with the latest news from the PW team.
- 🎬 **Shorts Reel**: Watch educational shorts in a focused interface.
- 🔴 **Live Tracking**: Real-time status of ongoing live classes across all channels.
- 🔒 **Admin Panel**: Secure dashboard for managing channels, batches, and content.

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15.1 (App Router)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11
- **Icons**: Lucide React
- **Fonts**: Inter & Space Grotesk

### Backend

- **API Routes**: Next.js API Routes
- **Database**: Prisma with SQLite
- **Authentication**: NextAuth.js (v5 Beta)
- **YouTube Integration**: YouTube Data API v3

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Setup Steps

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd "YT Wallah"
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file with the following:

   ```env
   DATABASE_URL="file:./dev.db"
   AUTH_SECRET="your-secret"
   YOUTUBE_API_KEY="your-google-api-key"
   ```

4. **Initialize Database**:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**:

   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
YT Wallah/
├── prisma/               # Database schema and migrations
├── src/
│   ├── app/              # Next.js App Router pages and API
│   ├── components/       # Reusable UI components
│   ├── contexts/         # React Context providers
│   ├── lib/              # Utility functions and shared logic
│   └── data/             # Static data and constants
├── public/               # Static assets
└── vercel.json           # Vercel deployment configuration
```

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Configure environment variables in the Vercel dashboard.
4. Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built for the student community.
