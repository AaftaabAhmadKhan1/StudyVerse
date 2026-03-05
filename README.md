# Style Atlas 🌍✨

![Style Atlas Banner](https://img.shields.io/badge/Style-Atlas-blue?style=for-the-badge&logo=react)
![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

**Style Atlas** is an AI-powered fashion recommendation platform that helps you discover clothing designs tailored to your country's culture and current weather conditions.

## 🚀 Features

- 🌐 **Global Location Search**: Search ANY city or country worldwide with autocomplete
- 💡 **Smart Autocomplete**: Real-time location suggestions powered by OpenStreetMap
- 🤖 **Interactive AI Animation**: Watch AI process your request in 5 engaging stages
- ☁️ **Weather Integration**: Real-time weather data for any location on Earth
- 🎨 **Cultural Intelligence**: Authentic clothing styles from different cultures worldwide
- 📊 **Progress Tracking**: Visual progress bar showing AI processing stages
- ✨ **AI-Powered**: Smart recommendations using advanced algorithms
- 🎯 **Worldwide Coverage**: 195+ countries, 1000s of cities and towns
- 📱 **Fully Responsive**: Beautiful design on all devices
- ⚡ **Lightning Fast**: Built with Next.js 15 and optimized performance
- 🔒 **Privacy First**: No tracking, secure API calls

## 🛠️ Tech Stack (2026 Standards)

### Frontend

- **Framework**: Next.js 15.1 (App Router)
- **Language**: TypeScript 5.6
- **Styling**: Tailwind CSS 3.4
- **Animations**: Framer Motion 11
- **Icons**: Lucide React
- **Font**: Google Fonts (Inter & Playfair Display)

### Backend

- **API Routes**: Next.js API Routes
- **Weather API**: OpenWeatherMap
- **AI Integration**: Hugging Face / OpenRouter (Free tiers)
- **HTTP Client**: Axios

### Development Tools

- **Package Manager**: npm/yarn/pnpm
- **Linting**: ESLint 9
- **Code Quality**: TypeScript strict mode

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Setup Steps

1. **Clone or navigate to the project directory**:

   ```bash
   cd "Style Atlas"
   ```

2. **Install dependencies**:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**:

   Open `.env.local` and add your API keys:

   ```env
   # Weather API (Required for real weather data)
   NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_api_key

   # Optional: AI APIs for advanced features
   HUGGINGFACE_API_KEY=your_huggingface_key
   OPENROUTER_API_KEY=your_openrouter_key
   ```

   **Get free API keys**:
   - OpenWeatherMap: https://openweathermap.org/api (Free tier: 1000 calls/day)
   - Hugging Face: https://huggingface.co/settings/tokens (Free)
   - OpenRouter: https://openrouter.ai/ (Free tier available)

4. **Run the development server**:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

1. **Visit the homepage** - Experience the beautiful hero section
2. **Scroll to "Find Your Style"** - Interactive style finder section
3. **Start typing any location** - See autocomplete suggestions appear
   - Try: "Paris", "Tokyo", "New York", "Mumbai", "Sydney"
   - Works for cities, countries, towns, regions worldwide
4. **Select from suggestions** - Click any location from the dropdown
5. **Click "Discover"** - Watch the AI animation process your request:
   - 🌍 Analyzing location
   - ☁️ Fetching weather data
   - 🧠 Processing cultural patterns
   - 🪄 Generating designs
   - ✨ Finalizing recommendations
6. **Get recommendations** - Receive AI-powered clothing suggestions based on:
   - Exact location coordinates
   - Real-time weather conditions
   - Local cultural traditions
   - Seasonal appropriateness
   - Modern fashion trends

## 📁 Project Structure

```
Style Atlas/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── recommendations/
│   │   │       └── route.ts          # API endpoint for recommendations
│   │   ├── globals.css                # Global styles
│   │   ├── layout.tsx                 # Root layout
│   │   └── page.tsx                   # Homepage
│   ├── components/
│   │   ├── Hero.tsx                   # Hero section
│   │   ├── Features.tsx               # Features showcase
│   │   ├── HowItWorks.tsx            # Process explanation
│   │   ├── StyleFinder.tsx           # Main recommendation interface
│   │   ├── About.tsx                  # About section
│   │   └── Footer.tsx                 # Footer
│   └── lib/
│       └── utils.ts                   # Utility functions
├── public/                            # Static assets
├── .env.local                         # Environment variables
├── next.config.ts                     # Next.js configuration
├── tailwind.config.ts                 # Tailwind CSS configuration
├── tsconfig.json                      # TypeScript configuration
└── package.json                       # Dependencies
```

## 🌟 Key Components

### StyleFinder Component

The main interactive component that:

- Accepts country input
- Fetches real-time weather data
- Displays weather information
- Shows AI-generated recommendations

### API Route (`/api/recommendations`)

Handles:

- Country validation
- Weather API integration
- Cultural fashion database lookup
- AI-powered recommendation generation
- Temperature-based clothing suggestions

## 🎨 Customization

### Adding New Countries

Edit `src/app/api/recommendations/route.ts`:

```typescript
const countryCapitals: CountryCapital = {
  'your-country': {
    capital: 'Capital City',
    lat: 12.3456,
    lon: 78.9012,
  },
  // ... more countries
};

const culturalFashion: { [key: string]: any } = {
  'your-country': {
    traditional: ['Item 1', 'Item 2'],
    modern: ['Modern style 1', 'Modern style 2'],
    fabrics: ['Fabric 1', 'Fabric 2'],
    colors: ['Color palette'],
  },
};
```

### Styling Customization

Modify `tailwind.config.ts` to change:

- Color schemes
- Animations
- Typography
- Spacing

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

### Build for Production

```bash
npm run build
npm start
```

## 🔧 Troubleshooting

### Weather API not working

- Ensure your API key is correct in `.env.local`
- Check that you haven't exceeded free tier limits
- The app will use mock data if the API fails

### Country not found

- Currently supports major countries
- Add more countries in the `countryCapitals` object

### Build errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version (should be 18+)

## 📈 Future Enhancements

- [ ] Image generation for clothing designs
- [ ] User authentication and saved preferences
- [ ] Shopping integration
- [ ] Social sharing features
- [ ] Multi-language support
- [ ] Advanced AI models (GPT-4, Gemini)
- [ ] Mobile app version

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Built with ❤️ by the Style Atlas Team

## 🙏 Acknowledgments

- OpenWeatherMap for weather data
- Hugging Face for AI capabilities
- Next.js team for the amazing framework
- Tailwind CSS for beautiful styling
- Framer Motion for smooth animations

## 📞 Support

For support, email hello@styleatlas.com or open an issue on GitHub.

---

**Made with ❤️ for fashion enthusiasts worldwide** 🌍✨
