import React, { useState } from 'react';
import Navbar from './SaaSNavbar';
import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import AuthModal from './AuthModal';
import SaaSDashboard from './SaaSDashboard';
import { useTheme } from './ThemeProvider';

const SaaSLanding = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isDashboard, setIsDashboard] = useState(false);
  const [user, setUser] = useState(null);
  const { isDark } = useTheme();

  const handleAuthSubmit = (formData) => {
    // Simulate user creation/login
    setUser({
      name: formData.fullName || 'John Doe',
      email: formData.email,
    });
    setAuthModalOpen(false);
    setIsDashboard(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsDashboard(false);
  };

  return (
    <div className={isDark ? 'dark' : ''}>
      {!isDashboard ? (
        <>
          <Navbar onAuthClick={() => setAuthModalOpen(true)} />
          <Hero onGetStarted={() => setAuthModalOpen(true)} />
          <Features />
          <HowItWorks />
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            onSubmit={handleAuthSubmit}
          />
        </>
      ) : (
        <>
          <Navbar onAuthClick={() => {
            handleLogout();
          }} />
          <SaaSDashboard user={user} />
        </>
      )}
    </div>
  );
};

export default SaaSLanding;
