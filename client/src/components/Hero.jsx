import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = ({ onGetStarted }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 pt-20 pb-24">
      {/* Background Decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl dark:bg-blue-900/20"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl dark:bg-indigo-900/20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div className="space-y-8" variants={itemVariants}>
            {/* Pill Tag */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-full w-fit"
              variants={itemVariants}
            >
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Smart Laundry Management
              </span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight"
              variants={itemVariants}
            >
              Laundry Made{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Simple & Smart
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg"
              variants={itemVariants}
            >
              Experience hassle-free laundry service with real-time tracking, premium quality care, and lightning-fast delivery. Perfect for busy professionals.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-4 pt-4" variants={itemVariants}>
              <button
                onClick={onGetStarted}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300"
              >
                Get Started Free
              </button>
              <button
                className="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-slate-800 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
              >
                Learn More <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Stats Row */}
            <motion.div className="flex gap-8 pt-8 border-t border-gray-200 dark:border-gray-700" variants={itemVariants}>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">10k+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">50k+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Orders Completed</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Card */}
          <motion.div
            className="relative"
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-3xl blur-2xl dark:from-blue-600/10 dark:to-indigo-600/10"></div>

            <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-2xl dark:shadow-2xl">
              <div className="aspect-square bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-20 h-20 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                  </svg>
                </div>
              </div>

              <div className="mt-8 space-y-4 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Start Your Journey
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Join thousands of satisfied customers enjoying premium laundry care
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
