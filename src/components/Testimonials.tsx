import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Business Owner',
    location: 'New York, USA',
    rating: 5,
    text: 'Sovereign Assets has transformed my financial future. In just 6 months, I\'ve seen consistent returns that exceed my expectations. Their professional team and transparent approach give me complete confidence.',
    profit: '$12,450',
    duration: '6 months'
  },
  {
    name: 'Michael Chen',
    role: 'Software Engineer',
    location: 'San Francisco, USA',
    rating: 5,
    text: 'As a tech professional, I appreciate their sophisticated algorithms and data-driven approach. The platform is intuitive, and the returns speak for themselves. Highly recommended!',
    profit: '$8,750',
    duration: '4 months'
  },
  {
    name: 'Emma Rodriguez',
    role: 'Marketing Director',
    location: 'London, UK',
    rating: 5,
    text: 'I was skeptical about crypto investments until I found Sovereign Assets. Their educational resources and expert guidance helped me make informed decisions. The results have been outstanding.',
    profit: '$15,200',
    duration: '8 months'
  },
  {
    name: 'David Thompson',
    role: 'Retired Teacher',
    location: 'Toronto, Canada',
    rating: 5,
    text: 'At 62, I thought it was too late to start investing in crypto. Sovereign Assets proved me wrong. Their conservative plans have provided steady income for my retirement.',
    profit: '$6,890',
    duration: '10 months'
  },
  {
    name: 'Lisa Park',
    role: 'Healthcare Professional',
    location: 'Sydney, Australia',
    rating: 5,
    text: 'The customer support is exceptional. They\'re always available to answer questions and provide guidance. My investment has grown steadily, and I couldn\'t be happier.',
    profit: '$9,340',
    duration: '5 months'
  },
  {
    name: 'James Wilson',
    role: 'Financial Advisor',
    location: 'Dubai, UAE',
    rating: 5,
    text: 'Even as a financial professional, I\'m impressed by their strategy and execution. Sovereign Assets has become a key part of my diversified portfolio.',
    profit: '$22,100',
    duration: '12 months'
  }
];

const Testimonials: React.FC = () => {
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
            What Our Investors Say
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our satisfied investors 
            have to say about their experience with Sovereign Assets Capital.
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
                    <p className="text-gray-400 text-sm">Total Profit</p>
                    <p className="text-emerald-400 font-bold text-lg">{testimonial.profit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm">Duration</p>
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
              Join Our Community of Successful Investors
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {[
                { value: '4.9/5', label: 'Average Rating' },
                { value: '50K+', label: 'Happy Investors' },
                { value: '98%', label: 'Success Rate' },
                { value: '$2.5M+', label: 'Total Profits Paid' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200">
                Start Your Success Story
              </button>
              <button className="border border-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 hover:border-gray-500 transition-all duration-200">
                Read More Reviews
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;