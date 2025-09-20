import React, { useState } from "react";
import { Shield, TrendingUp, Clock, Users, Award, Zap } from "lucide-react";
import { motion } from "framer-motion";
import CertificationModal from "./CertificationModal";
import { useTranslation } from "react-i18next"; // ✅ i18n

const WhyChooseUs: React.FC = () => {
  const { t } = useTranslation();
  const [showCertification, setShowCertification] = useState(false);

  const features = [
    {
      icon: Shield,
      title: t("why.features.security.title"),
      description: t("why.features.security.description"),
      color: "text-blue-400",
    },
    {
      icon: TrendingUp,
      title: t("why.features.track_record.title"),
      description: t("why.features.track_record.description"),
      color: "text-emerald-400",
    },
    {
      icon: Clock,
      title: t("why.features.quick_withdraw.title"),
      description: t("why.features.quick_withdraw.description"),
      color: "text-purple-400",
    },
    {
      icon: Users,
      title: t("why.features.expert_team.title"),
      description: t("why.features.expert_team.description"),
      color: "text-orange-400",
    },
    {
      icon: Award,
      title: t("why.features.recognition.title"),
      description: t("why.features.recognition.description"),
      color: "text-pink-400",
    },
    {
      icon: Zap,
      title: t("why.features.support.title"),
      description: t("why.features.support.description"),
      color: "text-yellow-400",
    },
  ];

  const stats = [
    { value: "50,000+", label: t("why.stats.active_investors") },
    { value: "$2.5M+", label: t("why.stats.total_invested") },
    { value: "98%", label: t("why.stats.success_rate") },
    { value: "5+", label: t("why.stats.years_experience") },
  ];

  const certifications = [
    t("why.certifications.sec_registered"),
    t("why.certifications.finra_member"),
    t("why.certifications.sipc_protected"),
    t("why.certifications.iso_certified"),
    t("why.certifications.soc_compliant"),
  ];

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
            {t("why.heading")}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t("why.subheading")}
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
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
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
                {t("why.stats_heading")}
              </h3>
              <p className="text-gray-400">{t("why.stats_subheading")}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
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
            {t("why.cert_heading")}
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
            {certifications.map((cert, index) => (
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
                {t("why.cert_proof_heading")}
              </h4>
            </div>
            <p className="text-gray-400 mb-6">{t("why.cert_proof_desc")}</p>
            <button
              onClick={() => setShowCertification(true)}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200"
            >
              {t("why.cert_proof_button")}
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
