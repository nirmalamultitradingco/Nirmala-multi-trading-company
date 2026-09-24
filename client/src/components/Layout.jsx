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

