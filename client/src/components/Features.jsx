import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Clock, Star } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Zap,
      title: 'Real-Time Tracking',
      description: 'Monitor your laundry status from pickup to delivery with live updates',
      color: 'from-blue-600 to-blue-400',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Your clothes are handled with care using advanced protection methods',
      color: 'from-indigo-600 to-indigo-400',
    },
    {
      icon: Clock,
      title: 'Quick Turnaround',
      description: 'Fast processing with express delivery options available',
      color: 'from-purple-600 to-purple-400',
    },
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Professional care using eco-friendly products and techniques',
      color: 'from-pink-600 to-pink-400',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section id="features" className="py-20 bg-white dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose WashEase?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Experience the perfect blend of convenience, quality, and reliability
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="group"
                variants={cardVariants}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <div className="h-full bg-gray-50 dark:bg-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-800 transition-all duration-300 hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800">
                  {/* Icon Container */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
