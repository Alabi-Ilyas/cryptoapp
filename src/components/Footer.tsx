import React from "react";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { label: t('footer.links.home'), href: "/" },
    { label: t('footer.links.investmentPlans'), href: "#plans" },
    { label: t('footer.links.aboutUs'), href: "#about" },
    { label: t('footer.links.liveRates'), href: "#rates" },
    { label: t('footer.links.faq'), href: "#faq" },
  ];

  const services = [
    t('footer.services.cryptocurrencyInvestment'),
    t('footer.services.portfolioManagement'),
    t('footer.services.riskAssessment'),
    t('footer.services.marketAnalysis'),
    t('footer.services.investmentConsulting')
  ];

  const bottomLinks = [
    t('footer.bottom.privacyPolicy'),
    t('footer.bottom.termsOfService'),
    t('footer.bottom.cookiePolicy'),
    t('footer.bottom.disclaimer')
  ];

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img
                src="/images/logo.jpg"
                alt={t('footer.company.alt')}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="text-xl font-bold text-white">{t('footer.company.name')}</h3>
                <p className="text-sm text-gray-400">{t('footer.company.tagline')}</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed">{t('footer.company.description')}</p>
            <div className="flex space-x-4">
              {[{ icon: Facebook, href: "#" }, { icon: Twitter, href: "#" }, { icon: Linkedin, href: "#" }, { icon: Instagram, href: "#" }]
                .map((social, index) => (
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
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.servicesTitle')}</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="text-gray-400">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">{t('footer.contact.title')}</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-400">{t('footer.contact.email')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-400">{t('footer.contact.phone')}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span className="text-gray-400">{t('footer.contact.address')}</span>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="text-white font-medium mb-2">{t('footer.newsletter.title')}</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder={t('footer.newsletter.placeholder')}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <button className="bg-emerald-500 text-white px-4 py-2 rounded-r-lg hover:bg-emerald-600 transition-colors">
                  {t('footer.newsletter.button')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">{t('footer.bottom.copyRight')}</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {bottomLinks.map((link, index) => (
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
            <strong>{t('footer.disclaimer.title')}</strong> {t('footer.disclaimer.text')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
