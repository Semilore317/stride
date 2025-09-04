import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from "@/components/layout/NavBar.jsx";
import Footer from "@/components/layout/Footer.jsx";
import Hero from "@/components/hero/Hero.jsx";

const RootLayout = () => {
  return (
      <main>
          <NavBar />
          <Hero />
          <div>
              <Outlet/>
          </div>
          <Footer/>
      </main>
  )
}

export default RootLayout