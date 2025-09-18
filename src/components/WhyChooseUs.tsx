import React from "react";
import { useState } from "react";
import { Shield, TrendingUp, Clock, Users, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";
import CertificationModal from "./CertificationModal";

const features = [
  {
    icon: Shield,
    title: "Bank-Level Security",
    description:
      "Your investments are protected by military-grade encryption and multi-layer security protocols.",
    color: "text-blue-400",
  },
  {
    icon: TrendingUp,
    title: "Proven Track Record",
    description:
      "Over 5 years of consistent returns with a 98% success rate across all investment plans.",
    color: "text-emerald-400",
  },
  {
    icon: Clock,
    title: "Quick Withdrawals",
    description:
      "Access your profits anytime with our instant withdrawal system - funds available within 24 hours.",
    color: "text-purple-400",
  },
  {
    icon: Users,
    title: "Expert Team",
    description:
      "Our certified financial analysts and crypto experts manage your investments with precision.",
    color: "text-orange-400",
  },
  {
    icon: Award,
    title: "Industry Recognition",
    description:
      "Award-winning platform recognized by leading financial institutions and regulatory bodies.",
    color: "text-pink-400",
  },
  {
    icon: Zap,
    title: "24/7 Support",
    description:
      "Round-the-clock customer support to assist you with any questions or concerns.",
    color: "text-yellow-400",
  },
];

const WhyChooseUs: React.FC = () => {
  const [showCertification, setShowCertification] = useState(false);

  return (
    <section className="py-20 bg-gray-900" id="about">
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
            Why Choose Sovereign Assets Capital?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            We combine cutting-edge technology with proven investment strategies
            to deliver exceptional returns while maintaining the highest
            standards of security and transparency.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 hover:border-gray-600 transition-all duration-300 hover:shadow-lg hover:shadow-gray-900/50 h-full">
                {/* Icon */}
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-emerald-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl border border-emerald-500/20 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">
                Trusted by Investors Worldwide
              </h3>
              <p className="text-gray-400">
                Join thousands of satisfied investors who have chosen us as
                their investment partner
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "50,000+", label: "Active Investors" },
                { value: "$2.5M+", label: "Total Invested" },
                { value: "98%", label: "Success Rate" },
                { value: "5+", label: "Years Experience" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-xl font-bold text-white mb-8">
            Regulated & Certified - Verified Company
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
            {[
              "SEC Registered",
              "FINRA Member",
              "SIPC Protected",
              "ISO 27001 Certified",
              "SOC 2 Compliant",
            ].map((cert, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-lg px-6 py-3 border border-gray-700 opacity-80 hover:opacity-100 transition-opacity"
              >
                <span className="text-gray-300 font-medium">{cert}</span>
              </div>
            ))}
          </div>

          {/* Certification Proof Button */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl border border-emerald-500/20 p-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-emerald-400 mr-3" />
              <h4 className="text-xl font-bold text-white">
                Company Verification
              </h4>
            </div>
            <p className="text-gray-400 mb-6">
              View our official Certificate of Incorporation and regulatory
              compliance documentation
            </p>
            <button
              onClick={() => setShowCertification(true)}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
            >
              View Certification Proof
            </button>
          </div>
        </motion.div>
      </div>

      {/* Certification Modal */}
      <CertificationModal
        isOpen={showCertification}
        onClose={() => setShowCertification(false)}
      />
    </section>
  );
};

export default WhyChooseUs;
