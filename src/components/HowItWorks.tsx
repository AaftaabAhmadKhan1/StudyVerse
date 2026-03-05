'use client';

import { motion } from 'framer-motion';
import { MapPin, ThermometerSun, Brain, Shirt } from 'lucide-react';

const steps = [
  {
    icon: MapPin,
    title: 'Select Your Location',
    description: 'Choose your country or let us detect your location automatically.',
    color: 'bg-blue-500',
  },
  {
    icon: ThermometerSun,
    title: 'Weather Analysis',
    description: 'Our system fetches real-time weather data for your location.',
    color: 'bg-purple-500',
  },
  {
    icon: Brain,
    title: 'AI Processing',
    description: 'Advanced AI analyzes culture, weather, and fashion trends.',
    color: 'bg-pink-500',
  },
  {
    icon: Shirt,
    title: 'Get Recommendations',
    description: 'Receive personalized clothing designs perfect for you.',
    color: 'bg-green-500',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Four simple steps to discover your perfect style
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-green-500 transform -translate-y-1/2" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative z-10">
                    {/* Step number */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>

                    {/* Icon */}
                    <div
                      className={`${step.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 text-center">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-center leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
