'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingBag, Grid3x3, DollarSign, Star, TrendingUp, Package, Filter, Home } from 'lucide-react';

interface StoreSidebarProps {
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  selectedPriceRange?: string;
  onPriceRangeChange?: (range: string) => void;
  selectedRating?: number;
  onRatingChange?: (rating: number) => void;
}

export default function StoreSidebar({
  selectedCategory,
  onCategoryChange,
  selectedPriceRange,
  onPriceRangeChange,
  selectedRating,
  onRatingChange,
}: StoreSidebarProps) {
  // Use editable categories from siteConfig
  let categories: string[] = [];
  if (typeof window !== 'undefined') {
    // Dynamically import to avoid SSR issues
    const siteConfigModule = require('@/data/siteConfig');
    categories = siteConfigModule.getCategories();
  } else {
    categories = ['All', 'Booking', 'Delivery', 'E-Commerce', 'Communication', 'Custom'];
  }
  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under $1500', value: '0-1500' },
    { label: '$1500 - $2000', value: '1500-2000' },
    { label: '$2000 - $2500', value: '2000-2500' },
    { label: 'Above $2500', value: '2500+' },
  ];

  return (
    <motion.div
      initial={{ x: -100 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6 }}
      className="hidden md:flex fixed left-0 top-0 h-screen w-48 lg:w-56 bg-slate-900/40 backdrop-blur-xl border-r border-white/10 z-50 flex-col py-6 px-4 gap-6"
    >
      <div className="flex-1 min-h-0 overflow-y-auto pr-2">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group px-2">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
          >
            <ShoppingBag className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h1 className="text-sm lg:text-base font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              HIPPARCHUS
            </h1>
            <p className="text-xs text-gray-400">TECHNOLOGIES</p>
          </div>
        </Link>

        {/* Back to Home */}
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.02, x: 2 }}
            className="flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </motion.div>
        </Link>

        <div className="h-px bg-white/10" />

        {/* Store Navigation */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 text-white font-semibold text-sm">
            <ShoppingBag className="w-4 h-4 text-purple-400" />
            <span>Store</span>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <Grid3x3 className="w-3.5 h-3.5" />
            <span>Categories</span>
          </div>
          <div className="space-y-1">
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => onCategoryChange?.(category)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-300 border ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-purple-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border-transparent'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/10" />

        {/* Price Range */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Price Range</span>
          </div>
          <div className="space-y-1">
            {priceRanges.map((range) => (
              <motion.button
                key={range.value}
                onClick={() => onPriceRangeChange?.(range.value)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-300 border ${
                  selectedPriceRange === range.value
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border-purple-500/30'
                    : 'text-slate-300 hover:text-white hover:bg-white/5 border-transparent'
                }`}
              >
                {range.label}
              </motion.button>
            ))}
          </div>
        </div>

        <div className="h-px bg-white/10" />

        {/* Quick Links */}
        <div className="space-y-1 mt-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Trending</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg text-sm transition-all"
          >
            <Package className="w-4 h-4" />
            <span>Best Sellers</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
