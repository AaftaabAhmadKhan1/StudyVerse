'use client';

import { motion } from 'framer-motion';
import { Globe, Cloud, Sparkles, TrendingUp, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Globe,
    title: 'Cultural Intelligence',
    description:
      'Discover authentic clothing styles rooted in local traditions and cultural heritage from around the world.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Cloud,
    title: 'Weather-Adaptive',
    description:
      'Real-time weather integration ensures your outfit recommendations are perfect for current conditions.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered',
    description:
      'Advanced AI analyzes thousands of fashion patterns to deliver personalized style recommendations.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: TrendingUp,
    title: 'Trend Insights',
    description:
      'Stay ahead with fashion trends that blend traditional aesthetics with contemporary styles.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description:
      'Your data is secure. We prioritize your privacy with industry-leading security practices.',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description:
      'Get personalized recommendations in seconds, powered by cutting-edge AI technology.',
    color: 'from-rose-500 to-red-500',
  },
];

export default function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Style Atlas?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the future of fashion with our intelligent platform that understands you,
            your culture, and your environment.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <div className="h-full p-8 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all">
                  {/* Icon */}
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>

                  {/* Hover effect */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
