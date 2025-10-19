import React, { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import NavBar from "@/components/layout/NavBar.jsx";
import Footer from "@/components/layout/Footer.jsx";
// import Hero from "@/components/hero/Hero.jsx";
// import HeroSlider from "@/components/hero/HeroSlider.jsx";

const RootLayout = () => {
  // Add theme state
  const [isDark, setIsDark] = useState(false);

  // Load saved theme or system preference on mount
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const darkMode = stored === 'dark' || (!stored && prefersDark);

    if (darkMode) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const html = document.documentElement;
    const newMode = !isDark;
    html.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    setIsDark(newMode);
  };

  return (
    <main>
      <NavBar isDark={isDark} toggleTheme={toggleTheme} />
      {/* <Hero /> */}
      <div>
        <Outlet/>
      </div>
      <ToastContainer />
      <Footer isDark={isDark}/>
    </main>
  )
}

export default RootLayout