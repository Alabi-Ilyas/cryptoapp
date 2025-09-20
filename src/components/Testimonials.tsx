import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Testimonials: React.FC = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: t('testimonials.roles.businessOwner'),
      location: 'New York, USA',
      rating: 5,
      text: t('testimonials.texts.sarah'),
      profit: '$12,450',
      duration: '6 months'
    },
    {
      name: 'Michael Chen',
      role: t('testimonials.roles.softwareEngineer'),
      location: 'San Francisco, USA',
      rating: 5,
      text: t('testimonials.texts.michael'),
      profit: '$8,750',
      duration: '4 months'
    },
    {
      name: 'Emma Rodriguez',
      role: t('testimonials.roles.marketingDirector'),
      location: 'London, UK',
      rating: 5,
      text: t('testimonials.texts.emma'),
      profit: '$15,200',
      duration: '8 months'
    },
    {
      name: 'David Thompson',
      role: t('testimonials.roles.retiredTeacher'),
      location: 'Toronto, Canada',
      rating: 5,
      text: t('testimonials.texts.david'),
      profit: '$6,890',
      duration: '10 months'
    },
    {
      name: 'Lisa Park',
      role: t('testimonials.roles.healthcareProfessional'),
      location: 'Sydney, Australia',
      rating: 5,
      text: t('testimonials.texts.lisa'),
      profit: '$9,340',
      duration: '5 months'
    },
    {
      name: 'James Wilson',
      role: t('testimonials.roles.financialAdvisor'),
      location: 'Dubai, UAE',
      rating: 5,
      text: t('testimonials.texts.james'),
      profit: '$22,100',
      duration: '12 months'
    }
  ];

  const stats = [
    { value: '4.9/5', label: t('testimonials.stats.averageRating') },
    { value: '50K+', label: t('testimonials.stats.happyInvestors') },
    { value: '98%', label: t('testimonials.stats.successRate') },
    { value: '$2.5M+', label: t('testimonials.stats.totalProfits') }
  ];

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('testimonials.header')}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('testimonials.subHeader')}
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/50"
            >
              {/* Quote Icon */}
              <div className="flex items-center justify-between mb-4">
                <Quote className="w-8 h-8 text-emerald-400" />
                <div className="flex items-center">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.text}"
              </p>

              {/* Profit Stats */}
              <div className="bg-gray-700/50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-400 text-sm">{t('testimonials.labels.totalProfit')}</p>
                    <p className="text-emerald-400 font-bold text-lg">{testimonial.profit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">{t('testimonials.labels.duration')}</p>
                    <p className="text-white font-medium">{testimonial.duration}</p>
                  </div>
                </div>
              </div>

              {/* User Info */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  <p className="text-gray-500 text-xs">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">
              {t('testimonials.trustHeader')}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200">
                {t('testimonials.cta.start')}
              </button>
              <button className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 hover:border-gray-500 transition-all duration-200">
                {t('testimonials.cta.readMore')}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
