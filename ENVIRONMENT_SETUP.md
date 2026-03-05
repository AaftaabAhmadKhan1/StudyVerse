# Environment Setup Instructions

## 🔑 API Keys Setup

To get the most out of Style Atlas, you'll need a free weather API key. The application works without it using demo data, but real weather data provides a better experience.

## OpenWeatherMap API (Recommended)

### Why You Need This

- Provides real-time weather data for any location
- Free tier includes 1,000 calls per day (more than enough!)
- Makes your recommendations more accurate

### How to Get It

1. **Visit OpenWeatherMap**
   - Go to: https://openweathermap.org/api
   - Click "Sign Up" (top right)

2. **Create Account**
   - Enter your details
   - Verify your email
   - Log in

3. **Get API Key**
   - Go to: https://home.openweathermap.org/api_keys
   - You'll see a default API key already created
   - Or click "Generate" to create a new one
   - Copy the key (looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

4. **Add to Your Project**
   - Open `.env.local` in your project root
   - Replace `your_openweather_api_key_here` with your actual key:

   ```
   NEXT_PUBLIC_WEATHER_API_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```

   - Save the file

5. **Restart Server**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

### Verify It Works

1. Open http://localhost:3000
2. Go to "Find Your Style" section
3. Enter any country (e.g., "India")
4. You should see real weather data!

## Optional: AI Enhancement APIs

For future AI enhancements, you can add these free APIs:

### Hugging Face (Optional)

**What it does**: Advanced AI text generation

**Get it**:

1. Visit: https://huggingface.co/settings/tokens
2. Sign up / Log in
3. Click "New token"
4. Copy token
5. Add to `.env.local`:
   ```
   HUGGINGFACE_API_KEY=hf_your_token_here
   ```

**Free tier**: Generous, includes most models

### OpenRouter (Optional)

**What it does**: Access to multiple AI models including free ones

**Get it**:

1. Visit: https://openrouter.ai/
2. Sign up
3. Get API key from dashboard
4. Add to `.env.local`:
   ```
   OPENROUTER_API_KEY=sk-or-your-key-here
   ```

**Free tier**: Some models are completely free

## Environment File Template

Your complete `.env.local` should look like:

```env
# REQUIRED for real weather data
NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_api_key_here

# OPTIONAL for future AI features
HUGGINGFACE_API_KEY=your_huggingface_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
```

## Troubleshooting

### "Invalid API key" error

- Double-check you copied the entire key
- Make sure there are no spaces before/after
- Wait 10 minutes after generating (activation time)

### Weather not showing

- Check if you saved `.env.local`
- Restart the development server
- The app will use demo data if API fails (this is normal)

### Need help?

- OpenWeatherMap docs: https://openweathermap.org/api
- OpenWeatherMap FAQ: https://openweathermap.org/faq

## Security Notes

- ✅ `.env.local` is in `.gitignore` (won't be committed to Git)
- ✅ Never share your API keys publicly
- ✅ Use different keys for production vs development
- ✅ Rotate keys if accidentally exposed

## Deployment

When deploying to Vercel/Netlify/etc:

1. Add environment variables in hosting dashboard
2. Don't commit `.env.local` to Git
3. Use platform's environment variable feature

---

**That's it!** Your Style Atlas is now fully configured. 🎉

Questions? Check the [README.md](README.md) for more info!
