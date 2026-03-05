'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Code2, Smartphone, Globe, Users, Shield, Zap } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const features = [
  {
    icon: Code2,
    title: 'Web Development',
    description:
      'Build modern, scalable web applications using React, Node.js, and cutting-edge technologies.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Smartphone,
    title: 'Mobile Apps',
    description:
      'Create cross-platform mobile applications with Flutter, Swift, and Kotlin for iOS and Android.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Globe,
    title: 'Custom Solutions',
    description:
      'Tailored software solutions including e-commerce, booking systems, and enterprise applications.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description:
      'Dedicated team of experienced developers, designers, and project managers committed to your success.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description:
      'Rigorous testing and QA processes ensure bug-free, high-performance applications.',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    description:
      'Streamlined development process delivers top-notch products within estimated timelines.',
    color: 'from-rose-500 to-red-500',
  },
];

export default function FeaturesNew() {
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const y = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.95]);

  return (
    <section
      ref={ref}
      id="services"
      className="relative py-24 bg-gradient-to-b from-slate-900 via-purple-900/50 to-slate-900 overflow-hidden scroll-section"
    >
      {/* Animated Background Elements */}
      <motion.div
        style={{ y }}
        className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-full blur-3xl parallax-layer"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-80, 80]) }}
        className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-tr from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl parallax-layer"
      />

      {/* Floating Particles - Only render on client */}
      {mounted &&
        [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 1, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div style={{ opacity, scale }} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white font-semibold text-sm mb-4">
              <Code2 className="w-4 h-4 text-cyan-400 animate-pulse" />
              Our Services
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Powered by{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Futuristic Technologies
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Transform your vision into reality with cutting-edge software solutions
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: index * 0.12, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                y: -15,
                scale: 1.05,
                transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              }}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </div>

              {/* Animated Border */}
              <motion.div
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
