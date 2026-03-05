'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Code2, Zap, Rocket } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HeroNew() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Rockstar-style multi-layer parallax effects with smooth easing
  const y1 = useTransform(scrollY, [0, 1200], [0, 400]);
  const y2 = useTransform(scrollY, [0, 1200], [0, -300]);
  const y3 = useTransform(scrollY, [0, 1000], [0, 150]);
  const opacity = useTransform(scrollY, [0, 600, 1000], [1, 1, 0]);

  // Deterministic seeded random for hydration-safe floating particles
  function seededRandom(seed: number) {
    let x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }
  const scale = useTransform(scrollY, [0, 1000], [1, 0.85]);
  const textY = useTransform(scrollY, [0, 800], [0, -100]);
  const textOpacity = useTransform(scrollY, [0, 500, 900], [1, 1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 scroll-section">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden parallax-layer">
        {/* Moving Gradient Orbs */}
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-primary-500/30 to-accent-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-l from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Floating Particles (hydration-safe) */}
        {[...Array(20)].map((_, i) => {
          const left = (seededRandom(i + 1) * 100).toFixed(8);
          const top = (seededRandom(i + 100) * 100).toFixed(8);
          const duration = 3 + seededRandom(i + 200) * 2;
          const delay = seededRandom(i + 300) * 2;
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${left}%`,
                top: `${top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
              }}
            />
          );
        })}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity, scale, y: textY }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32 parallax-layer"
      >
        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-10 left-10"
            animate={{
              y: [0, -20, 0],
              rotate: [0, 10, 0],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            <Code2 className="w-12 h-12 text-cyan-400/50" />
          </motion.div>

          <motion.div
            className="absolute top-20 right-20"
            animate={{
              y: [0, 20, 0],
              rotate: [0, -10, 0],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          >
            <Zap className="w-10 h-10 text-purple-400/50" />
          </motion.div>

          <motion.div
            className="absolute bottom-32 left-32"
            animate={{
              y: [0, -15, 0],
              x: [0, 10, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, delay: 0.5 }}
          >
            <Rocket className="w-10 h-10 text-pink-400/50" />
          </motion.div>
        </div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            <Code2 className="w-5 h-5 text-cyan-400" />
          </motion.div>
          <span className="text-sm font-semibold text-white">
            World-class Products Built by Great Teams
          </span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </motion.div>

        {/* Main Heading with Gradient Animation */}
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ opacity: textOpacity }}
          className="text-6xl sm:text-7xl lg:text-8xl font-black mb-6 leading-tight"
        >
          <motion.span
            className="block bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundSize: '200% 200%' }}
          >
            Build Innovative
          </motion.span>
          <motion.span
            className="block bg-gradient-to-r from-cyan-200 via-purple-200 to-pink-200 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear', delay: 0.5 }}
            style={{ backgroundSize: '200% 200%' }}
          >
            Software Solutions
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ opacity: textOpacity }}
          className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12"
        >
          Transform your ideas into reality with{' '}
          <span className="text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text font-bold">
            cutting-edge technologies
          </span>{' '}
          and expert development teams. From web to mobile, we deliver excellence.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ opacity: textOpacity }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="#solutions">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="group px-10 py-5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-2xl flex items-center gap-3 relative overflow-hidden"
              style={{ backgroundSize: '200% 100%' }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            >
              <span className="relative z-10">Explore Solutions</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform relative z-10" />
            </motion.button>
          </Link>

          <Link href="/store">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all shadow-xl"
            >
              View Products
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats with Animation */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          style={{ y: y3, opacity: textOpacity }}
          className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20"
        >
          {[
            { number: '600+', label: 'Happy Clients', icon: '👥' },
            { number: '50+', label: 'Countries', icon: '🌍' },
            { number: '100%', label: 'Commitment', icon: '⚡' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.1, y: -5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-black text-white mb-1">{stat.number}</div>
              <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 opacity-30">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#1e1b4b', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#0f172a', stopOpacity: 1 }} />
            </linearGradient>
          </defs>
          <path d="M0,64 C360,120 1080,0 1440,64 L1440,120 L0,120 Z" fill="url(#waveGradient)" />
        </svg>
      </div>
    </section>
  );
}
