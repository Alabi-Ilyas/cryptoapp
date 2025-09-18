import React from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import LiveStats from '../components/LiveStats';
import CryptoRates from '../components/CryptoRates';
import InvestmentPlans from '../components/InvestmentPlans';
import WhyChooseUs from '../components/WhyChooseUs';
import VideoSection from '../components/VideoSection';
import Testimonials from '../components/Testimonials';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <Hero />
      <LiveStats />
      <CryptoRates />
      <InvestmentPlans />
      <WhyChooseUs />
      <VideoSection />
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  );
};

export default HomePage;