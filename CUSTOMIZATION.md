# Customization Guide - Style Atlas

This guide will help you customize Style Atlas to match your brand and requirements.

## 🎨 Branding Customization

### 1. Change Company Name & Logo

**Update in multiple files:**

#### `src/app/layout.tsx` - Page Title

```typescript
export const metadata: Metadata = {
  title: 'Your Brand Name - Your Tagline',
  description: 'Your custom description',
  keywords: ['your', 'keywords'],
};
```

#### `src/components/Footer.tsx` - Footer Branding

```typescript
<h3 className="text-2xl font-bold text-white mb-4">Your Brand</h3>
<p className="text-gray-400 mb-4">
  Your custom description here
</p>
```

#### `src/components/Hero.tsx` - Hero Title

```typescript
<h1>
  Your Custom
  <br />
  <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
    Headline Here
  </span>
</h1>
```

### 2. Change Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    50: '#your-color',  // Lightest
    100: '#your-color',
    // ... continue through
    900: '#your-color', // Darkest
  },
  accent: {
    // Same structure as primary
  }
}
```

**Quick color schemes:**

#### Blue & Orange (Energy)

```typescript
primary: {
  500: '#3b82f6', // Blue
  600: '#2563eb',
},
accent: {
  500: '#f97316', // Orange
  600: '#ea580c',
}
```

#### Green & Teal (Nature)

```typescript
primary: {
  500: '#10b981', // Green
  600: '#059669',
},
accent: {
  500: '#14b8a6', // Teal
  600: '#0d9488',
}
```

#### Purple & Pink (Luxury)

```typescript
primary: {
  500: '#a855f7', // Purple
  600: '#9333ea',
},
accent: {
  500: '#ec4899', // Pink
  600: '#db2777',
}
```

### 3. Change Fonts

Edit `src/app/layout.tsx`:

```typescript
import { YourFont, YourDisplayFont } from 'next/font/google';

const bodyFont = YourFont({
  subsets: ['latin'],
  variable: '--font-body',
});

const displayFont = YourDisplayFont({
  subsets: ['latin'],
  variable: '--font-display',
});
```

**Popular combinations:**

- **Modern**: Roboto + Montserrat
- **Classic**: Lora + Merriweather
- **Elegant**: Raleway + Cormorant Garamond
- **Tech**: IBM Plex Sans + IBM Plex Mono
- **Friendly**: Nunito + Quicksand

## 🌍 Add More Countries

### Step 1: Add Geographic Data

Edit `src/app/api/recommendations/route.ts`:

```typescript
const countryCapitals: CountryCapital = {
  'your-country': {
    capital: 'Capital City',
    lat: 12.3456,
    lon: 78.9012,
  },
  // Add more countries...
};
```

### Step 2: Add Cultural Fashion Data

```typescript
const culturalFashion: { [key: string]: any } = {
  'your-country': {
    traditional: ['Traditional garment 1', 'Traditional garment 2', 'Traditional garment 3'],
    modern: ['Modern style 1', 'Modern style 2'],
    fabrics: ['Common fabric 1', 'Common fabric 2'],
    colors: ['Popular color 1', 'Popular color 2'],
  },
};
```

### Step 3: Test

```bash
npm run dev
# Enter your new country name in the Style Finder
```

## 🎭 Customize Animations

### Change Animation Speed

Edit component files (e.g., `src/components/Hero.tsx`):

```typescript
// Slower animations
transition={{ duration: 1.2 }}

// Faster animations
transition={{ duration: 0.3 }}

// Custom easing
transition={{
  duration: 0.8,
  ease: [0.6, -0.05, 0.01, 0.99]
}}
```

### Add New Animations

In `tailwind.config.ts`:

```typescript
animation: {
  'bounce-slow': 'bounce 3s infinite',
  'spin-slow': 'spin 3s linear infinite',
  'wiggle': 'wiggle 1s ease-in-out infinite',
},
keyframes: {
  wiggle: {
    '0%, 100%': { transform: 'rotate(-3deg)' },
    '50%': { transform: 'rotate(3deg)' },
  },
}
```

### Disable Animations

For accessibility or preference:

```typescript
// In component
<motion.div
  initial={false}  // Disable initial animation
  animate={false}  // Disable all animations
>
```

## 📝 Customize Content

### Hero Section

Edit `src/components/Hero.tsx`:

```typescript
// Change badge text
<span className="text-sm font-medium text-gray-700">
  Your Custom Badge Text
</span>

// Change subtitle
<p className="text-xl sm:text-2xl text-gray-600">
  Your custom subtitle that describes your service
</p>

// Change stats
<div className="text-3xl sm:text-4xl font-bold text-primary-600">
  Your Number
</div>
<div className="text-sm text-gray-600 mt-1">
  Your Label
</div>
```

### Features Section

Edit `src/components/Features.tsx`:

```typescript
const features = [
  {
    icon: YourIcon, // Import from lucide-react
    title: 'Your Feature Title',
    description: 'Your feature description',
    color: 'from-blue-500 to-cyan-500',
  },
  // Add more features...
];
```

Available icons from Lucide: https://lucide.dev/icons/

### How It Works

Edit `src/components/HowItWorks.tsx`:

```typescript
const steps = [
  {
    icon: YourIcon,
    title: 'Step 1 Title',
    description: 'Step 1 description',
    color: 'bg-blue-500',
  },
  // Modify or add more steps...
];
```

## 🔧 Add New Features

### Add a Newsletter Signup

Create `src/components/Newsletter.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your newsletter logic here
    console.log('Email:', email);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-accent-600">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Stay Updated
        </h2>
        <p className="text-white/90 mb-8">
          Get fashion tips and cultural insights delivered to your inbox
        </p>
        <form onSubmit={handleSubmit} className="flex gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="flex-1 px-4 py-3 rounded-lg"
            required
          />
          <button type="submit" className="px-6 py-3 bg-white text-primary-600 rounded-lg font-semibold">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
```

Add to `src/app/page.tsx`:

```typescript
import Newsletter from "@/components/Newsletter";

export default function Home() {
  return (
    <main>
      {/* ... other components */}
      <Newsletter />
      <Footer />
    </main>
  );
}
```

### Add a Blog Section

Create `src/app/blog/page.tsx`:

```typescript
export default function Blog() {
  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Fashion Blog</h1>
        {/* Add your blog content */}
      </div>
    </div>
  );
}
```

### Add Contact Form

Create `src/components/ContactForm.tsx`:

```typescript
'use client';

import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add your form submission logic
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        className="w-full px-4 py-3 border rounded-lg"
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        className="w-full px-4 py-3 border rounded-lg"
        required
      />
      <textarea
        placeholder="Message"
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        className="w-full px-4 py-3 border rounded-lg h-32"
        required
      />
      <button type="submit" className="px-6 py-3 bg-primary-600 text-white rounded-lg">
        Send Message
      </button>
    </form>
  );
}
```

## 🤖 Enhance AI Integration

### Use Real AI APIs

#### Hugging Face Integration

```typescript
// src/lib/ai.ts
export async function generateWithHuggingFace(prompt: string) {
  const response = await fetch('https://api-inference.huggingface.co/models/gpt2', {
    headers: {
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({ inputs: prompt }),
  });

  const result = await response.json();
  return result;
}
```

#### OpenRouter Integration

```typescript
// src/lib/ai.ts
export async function generateWithOpenRouter(prompt: string) {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemma-7b-it:free',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  const result = await response.json();
  return result;
}
```

## 📊 Add Analytics

### Google Analytics

```bash
npm install @next/third-parties
```

In `src/app/layout.tsx`:

```typescript
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <GoogleAnalytics gaId="G-XXXXXXXXXX" />
      </body>
    </html>
  )
}
```

### Vercel Analytics

```bash
npm install @vercel/analytics
```

In `src/app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## 🎨 Custom CSS

Add custom styles in `src/app/globals.css`:

```css
/* Custom button style */
.btn-custom {
  @apply px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
         text-white rounded-full font-semibold shadow-lg 
         hover:shadow-xl transition-all;
}

/* Custom card style */
.card-custom {
  @apply p-6 bg-white rounded-2xl shadow-lg border border-gray-200
         hover:shadow-xl transition-all;
}
```

## 🔒 Add Authentication

Using NextAuth.js:

```bash
npm install next-auth
```

Create `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
});

export { handler as GET, handler as POST };
```

## 💾 Add Database

Using Supabase:

```bash
npm install @supabase/supabase-js
```

Create `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## 🧪 Testing

Add testing with Jest:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

Create `jest.config.js`:

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
};

module.exports = createJestConfig(customJestConfig);
```

## 📱 Mobile App

Convert to React Native:

- Extract business logic to shared hooks
- Create React Native components
- Use React Native for Web for code sharing

## 🎯 Performance Tips

1. **Lazy load components**:

```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
})
```

2. **Optimize images**:

```typescript
import Image from 'next/image'

<Image
  src="/your-image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority // For above-the-fold images
/>
```

3. **Use React Server Components** (default in Next.js 15)

4. **Implement caching**:

```typescript
export const revalidate = 3600; // Revalidate every hour
```

---

## 🆘 Need Help?

- **Documentation**: Check README.md
- **API Reference**: Check API_DOCUMENTATION.md
- **Features**: Check FEATURES.md
- **Deployment**: Check DEPLOYMENT.md

**Happy Customizing!** 🎨✨
