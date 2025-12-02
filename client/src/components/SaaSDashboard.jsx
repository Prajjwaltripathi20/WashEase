import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Truck, Clock, Settings, Zap, ArrowRight } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate data loading
    setIsLoading(false);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Card */}
          <motion.div
            className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl border border-blue-500/20"
            variants={itemVariants}
          >
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user?.name || 'Guest'}! 👋
            </h1>
            <p className="text-blue-100 text-lg">{user?.email || 'user@example.com'}</p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { icon: Clock, label: 'Total Orders', value: '12', color: 'from-blue-500 to-blue-600' },
              { icon: Truck, label: 'Pending', value: '3', color: 'from-orange-500 to-orange-600' },
              { icon: Zap, label: 'Completed', value: '9', color: 'from-green-500 to-green-600' },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                        {stat.label}
                      </p>
                      <p className="text-4xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { icon: Plus, label: 'New Order', color: 'from-blue-500 to-blue-600' },
                { icon: Truck, label: 'Track Order', color: 'from-indigo-500 to-indigo-600' },
                { icon: Clock, label: 'Order History', color: 'from-purple-500 to-purple-600' },
                { icon: Settings, label: 'Profile Settings', color: 'from-pink-500 to-pink-600' },
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={index}
                    className="relative group bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-lg transition-all text-left"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{action.label}</h3>
                    <ArrowRight className="w-4 h-4 text-gray-400 mt-2 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          {/* Coming Soon Card */}
          <motion.div
            className="bg-gradient-to-r from-gray-100 to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-gray-200 dark:border-slate-700 text-center"
            variants={itemVariants}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              More Features Coming Soon 🚀
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              We're continuously improving your experience. Stay tuned for exciting new features!
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
