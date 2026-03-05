'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { MessageSquare, FileCode, Rocket, HeadphonesIcon } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const steps = [
  {
    icon: MessageSquare,
    title: 'Requirement Analysis',
    description: 'We discuss your vision, understand requirements, and plan the perfect solution.',
    color: 'bg-blue-500',
  },
  {
    icon: FileCode,
    title: 'Development',
    description:
      'Our expert team builds your product using modern technologies and best practices.',
    color: 'bg-purple-500',
  },
  {
    icon: Rocket,
    title: 'Testing & Deploy',
    description: 'Rigorous testing ensures quality before launching your product to the world.',
    color: 'bg-pink-500',
  },
  {
    icon: HeadphonesIcon,
    title: 'Support & Maintenance',
    description: 'Continuous support and updates to keep your product running smoothly.',
    color: 'bg-green-500',
  },
];

export default function HowItWorksNew() {
  const [mounted, setMounted] = useState(false);
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.88, 1, 1, 0.92]);

  return (
    <section
      ref={ref}
      id="process"
      className="relative py-24 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 overflow-hidden scroll-section"
    >
      {/* Animated Background */}
      <motion.div
        style={{ y }}
        className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-purple-600/10 to-transparent parallax-layer"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-150, 150]) }}
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-pink-600/10 to-transparent rounded-full blur-3xl parallax-layer"
      />

      {/* Floating Particles - Only render on client */}
      {mounted &&
        [...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div style={{ opacity, scale }} className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white font-semibold text-sm mb-4">
              <FileCode className="w-4 h-4 text-cyan-400 animate-pulse" />
              Our Process
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Our{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Development Process
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Transparent working process from concept to deployment
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600/50 via-pink-600/50 to-purple-600/50 -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 80, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: index * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{
                  y: -15,
                  scale: 1.05,
                  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                }}
                className="relative group"
              >
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300">
                  {/* Step Number */}
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl"
                  >
                    {index + 1}
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                    className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mb-6 group-hover:shadow-lg transition-shadow`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </motion.div>

                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {step.description}
                  </p>

                  {/* Animated Border Glow */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-600/20 blur-xl -z-10" />
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 + 0.3, duration: 0.6 }}
                    className="hidden lg:block absolute top-1/2 -right-12 text-purple-400 text-4xl -translate-y-1/2"
                  >
                    →
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <motion.a
            href="#solutions"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-2xl"
          >
            Start Your Project
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
