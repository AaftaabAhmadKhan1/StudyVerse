'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function ProductNavigation() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/40 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h1 className="text-base font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                HIPPARCHUS
              </h1>
              <p className="text-xs text-gray-400">TECHNOLOGIES</p>
            </div>
          </Link>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <Link href="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium transition-all"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </motion.button>
            </Link>

            <Link href="/store">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl text-white font-semibold shadow-lg"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Store</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
