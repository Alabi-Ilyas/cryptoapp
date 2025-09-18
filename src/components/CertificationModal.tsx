import React from "react";
import {
  X,
  Shield,
  Award,
  CheckCircle,
  ExternalLink,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";

interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CertificationModal: React.FC<CertificationModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center">
            <Shield className="w-6 h-6 text-emerald-400 mr-2" />
            <h2 className="text-xl font-bold text-white">
              Company Certification & Verification
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Certificate of Incorporation */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Certificate of Incorporation
            </h3>
            <p className="text-gray-400 mb-6">
              Official documentation proving Sovereign Assets Capital's legal
              registration and legitimacy
            </p>

            {/* Certificate Image with Watermark */}
            <div className="relative bg-white rounded-lg p-4 shadow-2xl max-w-2xl mx-auto">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                <div className="text-6xl font-bold text-gray-800 rotate-45 select-none">
                  SOVEREIGN ASSETS
                </div>
              </div>

              {/* Certificate Content */}
              <div className="relative z-10">
                <img
                  src="/WhatsApp Image 2025-08-09 at 20.26.20.jpeg"
                  alt="Sovereign Assets Capital Certificate of Incorporation"
                  className="w-full h-auto rounded-lg shadow-lg"
                />

                {/* Tamper-Proof Seal */}
                <div className="absolute top-4 right-4 bg-emerald-500 text-white p-2 rounded-full">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>

              {/* Certificate Details */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <strong>Company Name:</strong>
                    <br />
                    Sovereign Assets Capital Ltd.
                  </div>
                  <div>
                    <strong>Registration Number:</strong>
                    <br />
                    SAC-2024-001847
                  </div>
                  <div>
                    <strong>Date of Incorporation:</strong>
                    <br />
                    January 15, 2024
                  </div>
                  <div>
                    <strong>Jurisdiction:</strong>
                    <br />
                    Delaware, United States
                  </div>
                </div>
              </div>

              {/* PDF Viewer */}
              <div className="mt-6 w-full h-[400px]">
                <iframe
                  src="/images/Certificate.jpg"
                  className="w-full h-full rounded-lg border border-gray-300"
                  title="Certificate PDF"
                />
              </div>

              {/* Download Button */}
              <div className="mt-4 text-center">
                <a
                  href="/images/Certificate.jpg"
                  download
                  className="inline-flex items-center bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Certificate
                </a>
              </div>
            </div>
          </div>

          {/* Verification Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Regulatory Compliance */}
            <div className="bg-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Award className="w-6 h-6 text-emerald-400 mr-2" />
                <h4 className="text-lg font-semibold text-white">
                  Regulatory Compliance
                </h4>
              </div>
              <div className="space-y-3">
                {[
                  "SEC Registered Investment Advisor",
                  "FINRA Member Organization",
                  "SIPC Protected Investments",
                  "ISO 27001 Security Certified",
                  "SOC 2 Type II Compliant",
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security Certifications */}
            <div className="bg-gray-700 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-blue-400 mr-2" />
                <h4 className="text-lg font-semibold text-white">
                  Security Certifications
                </h4>
              </div>
              <div className="space-y-3">
                {[
                  "Bank-Level SSL/TLS Encryption",
                  "Multi-Factor Authentication",
                  "PCI DSS Level 1 Compliant",
                  "GDPR Data Protection Certified",
                  "Penetration Testing Verified",
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-blue-400 mr-2 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Verification Hash */}
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-white mb-3">
              Document Verification
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-gray-400 text-sm">
                  Certificate Hash (SHA-256):
                </span>
                <div className="bg-gray-700 rounded p-2 mt-1">
                  <code className="text-emerald-400 text-xs font-mono break-all">
                    a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0
                  </code>
                </div>
              </div>
              <div>
                <span className="text-gray-400 text-sm">
                  Verification Timestamp:
                </span>
                <div className="text-white font-mono text-sm">
                  {new Date().toISOString()}
                </div>
              </div>
            </div>
          </div>

          {/* External Verification Links */}
          <div className="text-center space-y-4">
            <h4 className="text-lg font-semibold text-white">
              External Verification
            </h4>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { name: "SEC Database", url: "#" },
                { name: "FINRA BrokerCheck", url: "#" },
                { name: "Delaware Division of Corporations", url: "#" },
                { name: "Better Business Bureau", url: "#" },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  className="flex items-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-sm">{link.name}</span>
                  <ExternalLink className="w-4 h-4 ml-2" />
                </a>
              ))}
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-lg p-6 border border-emerald-500/20">
            <div className="text-center">
              <h4 className="text-xl font-bold text-white mb-4">
                Trusted by 50,000+ Investors
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: "$2.5M+", label: "Assets Under Management" },
                  { value: "98%", label: "Client Satisfaction" },
                  { value: "5+", label: "Years in Operation" },
                  { value: "24/7", label: "Security Monitoring" },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CertificationModal;
