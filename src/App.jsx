import { useEffect, useState } from 'react';
import { useLenis } from './hooks/useLenis';
import { initAnalytics } from './lib/analytics';

import LoadingScreen from './components/LoadingScreen';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedRamen from './components/FeaturedRamen';
import Story from './components/Story';
import MenuHighlights from './components/MenuHighlights';
import Experience from './components/Experience';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CursorTrail from './components/CursorTrail';
import DialogHost from './components/dialogs/DialogHost';

export default function App() {
  const [loaded, setLoaded] = useState(false);

  // Hold scroll while loading screen is up.
  useEffect(() => {
    document.body.style.overflow = loaded ? 'auto' : 'hidden';
  }, [loaded]);

  // Fire pixels once the page is interactive (skips the loading screen).
  useEffect(() => {
    if (loaded) initAnalytics();
  }, [loaded]);

  useLenis(loaded);

  return (
    <>
      <LoadingScreen onDone={() => setLoaded(true)} />

      <CursorTrail />
      <div className="grain" aria-hidden />

      <Navbar />
      <main className="relative">
        <Hero />
        <FeaturedRamen />
        <Story />
        <MenuHighlights />
        <Experience />
        <Gallery />
        <Contact />
      </main>
      <Footer />

      <DialogHost />
    </>
  );
}
