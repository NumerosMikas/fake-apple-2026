import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PersonasSection } from './components/PersonasSection';
import { BentoFeatures } from './components/BentoFeatures';
import { FaqSection } from './components/FaqSection';
import { CtaSection } from './components/CtaSection';
import { Footer } from './components/Footer';
import { ReservationModal } from './components/ReservationModal';
import { PricingComparisonModal } from './components/PricingComparisonModal';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isReservationOpen, setIsReservationOpen] = useState<boolean>(false);
  const [reservationProductId, setReservationProductId] = useState<string>("iphone-18-pro");
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);

  const handleOpenReservation = (productId: string = "iphone-18-pro") => {
    setReservationProductId(productId);
    setIsReservationOpen(true);
  };

  const handlePersonaSelect = (device: string) => {
    if (device.toLowerCase().includes("watch")) {
      handleOpenReservation("watch-series-12");
    } else if (device.toLowerCase().includes("mac")) {
      handleOpenReservation("macbook-pro-m5");
    } else {
      handleOpenReservation("iphone-18-pro");
    }
  };

  return (
    <div 
      id="app-root"
      className={`min-h-screen font-sans transition-colors duration-300 ${
        darkMode ? 'bg-[#0a0a0c] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Banner & Header Navigation */}
      <Navbar 
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenReservation={() => handleOpenReservation("iphone-18-pro")}
      />

      {/* Main Content Area */}
      <main id="main-landing-content">
        {/* Hero Section */}
        <HeroSection 
          darkMode={darkMode}
          onOpenReservation={() => handleOpenReservation("iphone-18-pro")}
          onOpenModelPricing={() => setIsPricingOpen(true)}
        />

        {/* Target Audience / Personas Section */}
        <PersonasSection 
          darkMode={darkMode}
          onSelectPersonaDevice={handlePersonaSelect}
        />

        {/* Bento Grid Solutions / Products & Education Promo */}
        <BentoFeatures 
          darkMode={darkMode}
          onOpenReservationWithProduct={(productId) => handleOpenReservation(productId)}
        />

        {/* Interactive FAQ Accordion */}
        <FaqSection 
          darkMode={darkMode}
        />

        {/* Final Call to Action (CTA) & Trust Grid */}
        <CtaSection 
          darkMode={darkMode}
          onOpenReservation={() => handleOpenReservation("iphone-18-pro")}
          onOpenModelPricing={() => setIsPricingOpen(true)}
        />
      </main>

      {/* Global Footer */}
      <Footer darkMode={darkMode} />

      {/* Interactive Reservation / Pre-order Configurator Modal */}
      <ReservationModal 
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        initialProductId={reservationProductId}
        darkMode={darkMode}
      />

      {/* Pricing & Models Overview Modal */}
      <PricingComparisonModal 
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onSelectProductToReserve={(productId) => {
          setIsPricingOpen(false);
          handleOpenReservation(productId);
        }}
        darkMode={darkMode}
      />
    </div>
  );
}
