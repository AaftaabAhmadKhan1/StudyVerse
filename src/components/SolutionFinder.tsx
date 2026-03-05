'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Code2,
  Smartphone,
  ShoppingCart,
  Calendar,
  Truck,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

interface Solution {
  id: number;
  name: string;
  description: string;
  icon: any;
  features: string[];
  technologies: string[];
  image: string;
  category: string;
}

const solutions: Solution[] = [
  {
    id: 1,
    name: 'Taxi Booking App',
    description: 'Complete Uber-like solution for ride-hailing services',
    icon: Truck,
    features: [
      'Real-time GPS tracking',
      'Payment gateway integration',
      'Driver & passenger apps',
      'Admin dashboard',
    ],
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Socket.io'],
    image: 'https://picsum.photos/id/111/400/300',
    category: 'Booking',
  },
  {
    id: 2,
    name: 'Food Delivery App',
    description: 'Full-featured food ordering and delivery platform',
    icon: ShoppingCart,
    features: [
      'Restaurant management',
      'Order tracking',
      'Multiple payment options',
      'Push notifications',
    ],
    technologies: ['Flutter', 'Firebase', 'GraphQL', 'Stripe'],
    image: 'https://picsum.photos/id/292/400/300',
    category: 'Delivery',
  },
  {
    id: 3,
    name: 'E-Commerce Platform',
    description: 'Scalable online marketplace solution',
    icon: ShoppingCart,
    features: ['Product catalog', 'Shopping cart', 'Order management', 'Payment processing'],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Redis'],
    image: 'https://picsum.photos/id/180/400/300',
    category: 'E-Commerce',
  },
  {
    id: 4,
    name: 'Booking System',
    description: 'Versatile booking platform for services and rentals',
    icon: Calendar,
    features: [
      'Calendar integration',
      'Booking management',
      'Automated reminders',
      'Analytics dashboard',
    ],
    technologies: ['Next.js', 'TypeScript', 'Prisma', 'MySQL'],
    image: 'https://picsum.photos/id/201/400/300',
    category: 'Booking',
  },
  {
    id: 5,
    name: 'Messaging App',
    description: 'Secure real-time chat application',
    icon: MessageSquare,
    features: ['End-to-end encryption', 'Group chats', 'File sharing', 'Voice/video calls'],
    technologies: ['React Native', 'WebRTC', 'Socket.io', 'MongoDB'],
    image: 'https://picsum.photos/id/250/400/300',
    category: 'Communication',
  },
  {
    id: 6,
    name: 'Mobile App Development',
    description: 'Custom iOS and Android application development',
    icon: Smartphone,
    features: [
      'Cross-platform',
      'Native performance',
      'App store deployment',
      'Maintenance & updates',
    ],
    technologies: ['Flutter', 'Swift', 'Kotlin', 'Firebase'],
    image: 'https://picsum.photos/id/160/400/300',
    category: 'Custom',
  },
];

const categories = ['All', 'Booking', 'Delivery', 'E-Commerce', 'Communication', 'Custom'];

export default function SolutionFinder() {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.94]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredSolutions = solutions.filter((solution) => {
    const matchesCategory = selectedCategory === 'All' || solution.category === selectedCategory;
    const matchesSearch =
      solution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      solution.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section
      ref={sectionRef}
      id="solutions"
      className="relative py-24 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 overflow-hidden scroll-section"
    >
      {/* Animated Background */}
      <motion.div
        style={{ y }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-full blur-3xl parallax-layer"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-150, 150]) }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tl from-blue-600/10 to-cyan-600/10 rounded-full blur-3xl parallax-layer"
      />

      {/* Floating Sparkles */}
      {mounted &&
        [...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Sparkles className="w-2 h-2 text-purple-400" />
          </motion.div>
        ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div style={{ opacity, scale }} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white font-semibold text-sm mb-4">
              <Code2 className="w-4 h-4 text-cyan-400 animate-pulse" />
              Ready-Made Solutions
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Find Your Perfect{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Solution
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
          >
            Choose from our battle-tested products or let us build a custom solution for you
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="relative">
              <Code2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="What kind of solution do you need?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-2xl border-2 border-white/10 rounded-2xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {categories.map((category) => (
              <motion.button
                key={category}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                {category}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {filteredSolutions.map((solution, index) => (
            <motion.div
              key={solution.id}
              initial={{ opacity: 0, y: 80, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: index * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                y: -15,
                scale: 1.05,
                transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              }}
              className="group relative"
            >
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/50 transition-all duration-300">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <motion.img
                    src={solution.image}
                    alt={solution.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <solution.icon className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {solution.name}
                  </h3>
                  <p className="text-sm text-slate-400 mb-4">{solution.description}</p>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {solution.features.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {solution.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all"
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredSolutions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-white mb-2">No solutions found</h3>
            <p className="text-slate-400">Try adjusting your search or filters</p>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-xl border border-white/10 rounded-3xl p-12">
            <h3 className="text-3xl font-bold text-white mb-4">Need Something Custom?</h3>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Our expert team can build a tailored solution specifically for your business needs
            </p>
            <motion.a
              href="#about"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="inline-block px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-2xl"
            >
              Get In Touch
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
