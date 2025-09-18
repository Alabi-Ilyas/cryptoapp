import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface Stat {
  icon: React.ElementType;
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  color: string;
}

const LiveStats: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([
    { icon: Users, value: 0, label: 'Active Investors', suffix: '+', color: 'text-blue-400' },
    { icon: DollarSign, value: 0, label: 'Total Invested', prefix: '$', suffix: 'M+', color: 'text-emerald-400' },
    { icon: TrendingUp, value: 0, label: 'Success Rate', suffix: '%', color: 'text-green-400' },
    { icon: Award, value: 0, label: 'Years Experience', suffix: '+', color: 'text-purple-400' }
  ]);

  const finalValues = [50000, 2.5, 98, 5];

  useEffect(() => {
    const animateStats = () => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        setStats(prevStats =>
          prevStats.map((stat, index) => ({
            ...stat,
            value: Math.floor(finalValues[index] * easeOutQuart)
          }))
        );

        if (currentStep >= steps) {
          clearInterval(interval);
          // Set final values
          setStats(prevStats =>
            prevStats.map((stat, index) => ({
              ...stat,
              value: finalValues[index]
            }))
          );
        }
      }, stepDuration);

      return () => clearInterval(interval);
    };

    const timer = setTimeout(animateStats, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Thousands Worldwide
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join our growing community of successful investors and start building your wealth today
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center group"
            >
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-gray-900/50">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}>
                  {stat.prefix}{stat.value.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex items-center justify-center mt-12"
        >
          <div className="flex items-center bg-gray-800 rounded-full px-6 py-3 border border-gray-700">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3"></div>
            <span className="text-gray-300 font-medium">Live Statistics - Updated in Real Time</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveStats;