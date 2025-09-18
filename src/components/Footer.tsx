import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/images/logo.jpg"
                alt="Sovereign Assets Capital"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold text-white">
                  Sovereign Assets
                </h3>
                <p className="text-sm text-gray-400">Capital</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Professional cryptocurrency investment platform delivering
              consistent returns through advanced trading strategies and risk
              management.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Linkedin, href: "#" },
                { icon: Instagram, href: "#" },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Investment Plans", href: "#plans" },
                { label: "About Us", href: "#about" },
                { label: "Live Rates", href: "#rates" },
                { label: "FAQ", href: "#faq" },
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {[
                "Cryptocurrency Investment",
                "Portfolio Management",
                "Risk Assessment",
                "Market Analysis",
                "Investment Consulting",
              ].map((service, index) => (
                <li key={index}>
                  <span className="text-gray-400">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Us
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-400">
                  support@sovereignassets.com
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-400">
                  AB Trav Och Gallop, Stockholm, Stockholm, Stockholm 161 89
                  Sweden
                </span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="text-white font-medium mb-2">Stay Updated</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button className="bg-emerald-500 text-white px-4 py-2 rounded-r-lg hover:bg-emerald-600 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Sovereign Assets Capital. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {[
                "Privacy Policy",
                "Terms of Service",
                "Cookie Policy",
                "Disclaimer",
              ].map((link, index) => (
                <a
                  key={index}
                  href="#"
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-xs leading-relaxed">
            <strong>Risk Disclaimer:</strong> Cryptocurrency investments carry
            inherent risks. Past performance does not guarantee future results.
            Please invest responsibly and only invest what you can afford to
            lose. Sovereign Assets Capital is committed to transparency and
            regulatory compliance in all jurisdictions where we operate.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
