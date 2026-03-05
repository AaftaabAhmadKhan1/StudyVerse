'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Rocket, Shield, Users, Award, Sparkles } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const values = [
  {
    icon: Rocket,
    title: 'Our Mission',
    description:
      'To empower businesses worldwide with innovative software solutions that drive growth and transform industries.',
  },
  {
    icon: Shield,
    title: 'Quality Commitment',
    description:
      'We deliver 100% commitment to our clients, ensuring top-notch products within estimated timelines.',
  },
  {
    icon: Users,
    title: 'Expert Team',
    description:
      'A group of energetic, experienced and enthusiastic team ready for challenging opportunities.',
  },
  {
    icon: Award,
    title: 'Proven Excellence',
    description:
      'Recognized by top agencies worldwide and trusted by 600+ clients across 50+ countries.',
  },
];

export default function AboutNew() {
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
  const scale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.9, 1, 1, 0.94]);

  return (
    <section
      ref={ref}
      className="relative py-24 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 overflow-hidden scroll-section"
    >
      {/* Animated Background */}
      <motion.div
        style={{ y }}
        className="absolute top-20 left-10 w-[500px] h-[500px] bg-gradient-to-br from-purple-600/20 to-transparent rounded-full blur-3xl parallax-layer"
      />
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-100, 100]) }}
        className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-gradient-to-tl from-pink-600/20 to-transparent rounded-full blur-3xl parallax-layer"
      />

      {/* Floating Stars - Only render on client */}
      {mounted &&
        [...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            <Sparkles className="w-4 h-4 text-yellow-400/50" />
          </motion.div>
        ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div style={{ opacity, scale }} className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-white font-semibold text-sm mb-4">
              <Award className="w-4 h-4 text-cyan-400 animate-pulse" />
              About Us
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl sm:text-5xl font-bold text-white mb-4"
          >
            Building the Future with{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Technology Excellence
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Hipparchus Technologies combines futuristic technologies with transparent working
            processes to deliver world-class products. Since 2016, we've gained the trust of 600+
            clients worldwide.
          </motion.p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -80 : 80 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: index * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                scale: 1.05,
                y: -15,
                transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              }}
              className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.6 }}
                  className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg"
                >
                  <value.icon className="w-8 h-8 text-white" />
                </motion.div>

                <div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {value.description}
                  </p>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-purple-600/10 blur-xl -z-10" />
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/20 rounded-3xl p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div whileHover={{ scale: 1.1, y: -10 }} transition={{ duration: 0.3 }}>
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                600+
              </div>
              <div className="text-gray-300 text-lg">Happy Clients</div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1, y: -10 }} transition={{ duration: 0.3 }}>
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                50+
              </div>
              <div className="text-gray-300 text-lg">Countries Served</div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1, y: -10 }} transition={{ duration: 0.3 }}>
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-gray-300 text-lg">Commitment</div>
            </motion.div>
          </div>

          {/* Animated Border */}
          <motion.div
            className="absolute inset-0 rounded-3xl"
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
      </div>
    </section>
  );
}
