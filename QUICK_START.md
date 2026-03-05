# Style Atlas - Quick Start Guide

## 🎯 Getting Started in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Get Free API Key (Optional but Recommended)

1. **OpenWeatherMap** (for real weather data):
   - Visit: https://openweathermap.org/api
   - Sign up for free account
   - Get API key from dashboard
   - Free tier: 1,000 calls/day

### Step 3: Configure Environment

Edit `.env.local` file and add your API key:

```env
NEXT_PUBLIC_WEATHER_API_KEY=your_actual_api_key_here
```

**Note**: The app works without the API key using mock data, but real weather data enhances the experience!

### Step 4: Run the Application

```bash
npm run dev
```

### Step 5: Open Browser

Navigate to: http://localhost:3000

## ✅ Test the Application

1. Go to the "Find Your Style" section
2. Try entering these countries:
   - India
   - Japan
   - USA
   - France
   - Saudi Arabia
   - UK

3. You should see:
   - Weather information for that country
   - Cultural clothing recommendations
   - Weather-adaptive suggestions
   - Traditional and modern fusion styles

## 🎨 Features to Explore

- **Hero Section**: Beautiful animated landing with floating elements
- **Features**: Six key features with hover effects
- **How It Works**: Step-by-step process visualization
- **Style Finder**: Interactive recommendation engine
- **About**: Company information and values
- **Footer**: Complete site navigation

## 🚀 Production Build

```bash
npm run build
npm start
```

## 🌍 Supported Countries (Currently)

The app includes data for 25+ major countries including:

- USA, UK, Canada, Australia
- India, Pakistan, Bangladesh
- Japan, South Korea, China
- France, Germany, Italy, Spain
- Saudi Arabia, UAE, Egypt
- Brazil, Mexico, Nigeria, South Africa
- And more!

## 💡 Pro Tips

1. **Add More Countries**: Edit `src/app/api/recommendations/route.ts`
2. **Customize Colors**: Modify `tailwind.config.ts`
3. **Change Animations**: Update Framer Motion props in components
4. **Add Features**: Extend the API route with more logic

## 🆘 Common Issues

**Q: "Country not found" error?**
A: Make sure to type one of the supported countries or add your country to the database.

**Q: Weather data not showing?**
A: Either add your OpenWeatherMap API key or the app will use demo data.

**Q: Port 3000 is already in use?**
A: Run on different port: `npm run dev -- -p 3001`

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [TypeScript](https://www.typescriptlang.org/docs)

---

**Enjoy building with Style Atlas!** 🎉
