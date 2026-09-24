import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import CustomCursor from './CustomCursor.jsx';
import FirstVisitLoader from './FirstVisitLoader.jsx';
import FlashCardModal from './FlashCardModal.jsx';
import ScrollToTop from './ScrollToTop.jsx';
import TradeMitraChatbot from './TradeMitraChatbot.jsx';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    // Auto-focus first editable field when navigating to any form page
    const isFormPage =
      pathname.includes('inquiry') ||
      pathname.includes('partner') ||
      pathname.includes('contact') ||
      pathname.includes('login') ||
      pathname.includes('register');

    if (isFormPage) {
      const timer = setTimeout(() => {
        const firstField = document.querySelector(
          'main form input:not([type=hidden]):not([disabled]), main form textarea:not([disabled]), main form select:not([disabled])'
        );
        if (firstField && document.activeElement !== firstField) {
          firstField.focus();
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <FirstVisitLoader />
      <FlashCardModal />
      <CustomCursor />
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <ScrollToTop />
      <TradeMitraChatbot />
    </div>
  );
}

