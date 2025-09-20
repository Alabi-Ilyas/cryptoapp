import React, { useState } from "react";
import { Play, Eye, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const VideoSection: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { t } = useTranslation();

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  return (
    <section className="py-20 bg-gray-800/50">
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
            {t("video.heading")}
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t("video.subheading")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="relative bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden group">
              {!isPlaying ? (
                <>
                  <div className="relative aspect-video bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                    <img
                      src="/WhatsApp Image 2025-08-09 at 20.26.20.jpeg"
                      alt={t("video.thumbnailAlt")}
                      className="absolute inset-0 w-full h-full object-cover opacity-20"
                    />
                    <button
                      onClick={handlePlayVideo}
                      className="relative z-10 w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all duration-300 group-hover:scale-110"
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </button>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">
                      {t("video.mainTitle")}
                    </h3>
                    <p className="text-gray-400 mb-4">
                      {t("video.mainDescription")}
                    </p>

                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        <span>{t("video.views", { count: 125847 })}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 text-yellow-400" />
                        <span>{t("video.rating", { rating: "4.9/5" })}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{t("video.duration", { time: "12:34" })}</span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="aspect-video bg-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-medium mb-2">
                      {t("video.videoPlayer")}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {t("video.videoPlaceholder")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Sidebar Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Related Videos */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                {t("video.relatedHeading")}
              </h3>
              <div className="space-y-4">
                {[
                  {
                    title: t("video.related.0"),
                    duration: "8:45",
                    views: "89K",
                  },
                  {
                    title: t("video.related.1"),
                    duration: "15:22",
                    views: "156K",
                  },
                  {
                    title: t("video.related.2"),
                    duration: "11:18",
                    views: "203K",
                  },
                ].map((video, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
                  >
                    <div className="w-16 h-12 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded flex items-center justify-center flex-shrink-0">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">
                        {video.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                        <span>
                          {video.views} {t("video.viewsText")}
                        </span>
                        <span>•</span>
                        <span>{video.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Choose Us Highlights */}
            <div className="bg-gray-800 rounded-2xl border border-gray-700 p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                {t("video.whyChooseHeading")}
              </h3>
              <div className="space-y-3">
                {[
                  t("video.whyChoose.0"),
                  t("video.whyChoose.1"),
                  t("video.whyChoose.2"),
                  t("video.whyChoose.3"),
                  t("video.whyChoose.4"),
                ].map((point, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm">{point}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl border border-emerald-500/20 p-6">
              <h3 className="text-lg font-bold text-white mb-2">
                {t("video.ctaHeading")}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {t("video.ctaDescription")}
              </p>
              <div className="space-y-3">
                <button className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200">
                  {t("video.startButton")}
                </button>
                <button className="w-full border border-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 hover:border-gray-500 transition-all duration-200">
                  {t("video.demoButton")}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
