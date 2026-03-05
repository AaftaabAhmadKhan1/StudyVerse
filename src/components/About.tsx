'use client';

import { motion } from 'framer-motion';
import { Target, Heart, Users, Award } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'To bridge cultures through fashion and help people express their identity while respecting traditions.',
  },
  {
    icon: Heart,
    title: 'Our Passion',
    description:
      'We believe fashion is a universal language that connects people across borders and celebrates diversity.',
  },
  {
    icon: Users,
    title: 'Our Community',
    description:
      'Serving millions of fashion enthusiasts worldwide who value cultural authenticity and personal style.',
  },
  {
    icon: Award,
    title: 'Our Excellence',
    description:
      'Combining cutting-edge AI technology with deep cultural knowledge to deliver unmatched recommendations.',
  },
];

export default function About() {
  return (
    <section className="py-24 bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">About Style Atlas</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing fashion by combining artificial intelligence with cultural
            intelligence. Style Atlas helps you discover clothing that honors tradition while
            adapting to your environment.
          </p>
        </motion.div>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Company stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-12 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">2026</div>
              <div className="text-primary-100">Founded</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-primary-100">Daily Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">195</div>
              <div className="text-primary-100">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-primary-100">Satisfaction</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
