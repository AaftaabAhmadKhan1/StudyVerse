'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ShoppingBag, ArrowRight, Check } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const featuredProducts = [
  {
    id: 'TX8K9L2M4N6P8Q1R3S5T7V9W',
    name: 'Taxi Booking Solution',
    tagline: 'Uber-style ride booking',
    price: 1999,
    image: '/taxi-booking.jpg',
    features: ['Real-time tracking', 'Payment integration', 'Driver management'],
    category: 'On-Demand',
  },
  {
    id: 'FD7H2J4K6M8N1P3Q5R7S9T2V',
    name: 'Food Delivery App',
    tagline: 'Complete food ordering system',
    price: 1899,
    image: '/food-delivery.jpg',
    features: ['Multi-restaurant', 'Live order tracking', 'Rating system'],
    category: 'Delivery',
  },
  {
    id: 'EC3W5X7Y9Z1A3B5C7D9F2H4J',
    name: 'E-Commerce Platform',
    tagline: 'Full-featured online store',
    price: 2499,
    image: '/ecommerce.jpg',
    features: ['Product catalog', 'Secure checkout', 'Inventory management'],
    category: 'Commerce',
  },
  {
    id: 'VR6K8L1M3N5P7Q9R2S4T6V8W',
    name: 'Vacation Rental System',
    tagline: 'Airbnb-style booking platform',
    price: 2299,
    image: '/vacation-rental.jpg',
    features: ['Property listings', 'Booking calendar', 'Review system'],
    category: 'Hospitality',
  },
];

export default function ProductShowcase() {
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const y = useTransform(scrollYProgress, [0, 1], [150, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      id="products"
      className="relative py-24 bg-gradient-to-b from-slate-900 via-purple-950/50 to-slate-950 overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div
        style={{ y }}
        className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-cyan-600/20 to-transparent rounded-full blur-3xl"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
        className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-purple-600/20 to-transparent rounded-full blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div style={{ opacity }} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white font-semibold text-sm mb-4">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              Ready-Made Solutions
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6"
          >
            Our{' '}
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Product Suite
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Launch your business in days, not months. Choose from our battle-tested solutions.
          </motion.p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/store/${product.id}`}>
                <div className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-500 h-full">
                  {/* Category Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-purple-500/90 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                      {product.category}
                    </span>
                  </div>

                  {/* Image Placeholder with Gradient */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-600/30 to-pink-600/30 flex items-center justify-center overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    <ShoppingBag className="w-20 h-20 text-white/30 relative z-10" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-400 mb-4">{product.tagline}</p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="w-4 h-4 text-green-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold text-white">${product.price}</span>
                        <span className="text-gray-400 text-sm ml-2">one-time</span>
                      </div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-1 text-purple-400 font-semibold"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <motion.div
                    className="absolute inset-0 border-2 border-transparent group-hover:border-purple-500/50 rounded-2xl pointer-events-none"
                    initial={false}
                  />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <Link href="/store">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                View All Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
