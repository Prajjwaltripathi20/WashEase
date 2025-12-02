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
    <section className="relative overflow-hidden bg-white dark:bg-[#0B0F17] pt-20 pb-24 transition-colors duration-300">
      {/* Background Decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] dark:bg-blue-600/10"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] dark:bg-indigo-600/10"></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-teal-500/10 rounded-full blur-[100px] dark:bg-teal-400/5"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Content */}
          <motion.div className="space-y-8" variants={itemVariants}>
            {/* Pill Tag */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-white/5 border border-blue-100 dark:border-white/10 rounded-full w-fit backdrop-blur-sm"
              variants={itemVariants}
            >
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-accent-teal" />
              <span className="text-sm font-medium text-blue-700 dark:text-white/90 relative">
                Smart Laundry Management
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-teal to-transparent opacity-50"></span>
              </span>
            </motion.div>

            {/* Heading */}
            <motion.div className="relative" variants={itemVariants}>
              <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full opacity-0 dark:opacity-20"></div>
              <h1 className="relative text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-[1.1] tracking-tight">
                Laundry Made{' '}
                <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-white/80 dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  Simple & Smart
                </span>
              </h1>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg"
              variants={itemVariants}
            >
              Experience hassle-free laundry service with real-time tracking, premium quality care, and lightning-fast delivery. Perfect for busy professionals.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-4 pt-4" variants={itemVariants}>
              <button
                onClick={onGetStarted}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white rounded-xl font-semibold hover:shadow-glow-blue hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/25"
              >
                Get Started Free
              </button>
              <a
                href="#features"
                className="px-8 py-4 border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-300 dark:hover:border-white/20 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm shadow-soft-dark"
              >
                Learn More <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>

            {/* Stats Row */}
            <motion.div
              className="flex gap-12 pt-8 border-t border-gray-100 dark:border-white/5"
              variants={itemVariants}
            >
              <div className="relative">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">10k+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Happy Customers</p>
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-gray-200 dark:bg-white/10"></div>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">50k+</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Orders Completed</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Card */}
          <motion.div
            className="relative lg:pl-10"
            variants={itemVariants}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-[2rem] blur-3xl dark:opacity-40"></div>

            {/* Glass Card */}
            <div className="relative bg-white/80 dark:bg-[#1A1F2E]/60 backdrop-blur-xl rounded-[24px] p-8 border border-white/20 dark:border-white/10 shadow-2xl dark:shadow-premium-card ring-1 ring-white/20 dark:ring-white/5">
              {/* Icon Container */}
              <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-white/5 dark:to-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/50 dark:border-white/5">
                <div className="relative w-32 h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 group">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <svg className="w-16 h-16 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {/* Sparkles */}
                  <Sparkles className="absolute -top-4 -right-4 w-8 h-8 text-yellow-400 drop-shadow-lg animate-pulse" />
                </div>
              </div>

              <div className="space-y-4 text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Professional Service
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  Join thousands of satisfied customers enjoying premium laundry care with our state-of-the-art facilities.
                </p>
              </div>

              {/* Card Border Glow */}
              <div className="absolute inset-0 rounded-[24px] border border-white/10 pointer-events-none"></div>
              <div className="absolute inset-0 rounded-[24px] ring-1 ring-white/5 pointer-events-none"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
