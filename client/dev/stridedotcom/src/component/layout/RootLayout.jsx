import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from "@/component/layout/NavBar.jsx";
import Footer from "@/component/layout/Footer.jsx";

const RootLayout = () => {
  return (
      <main>
          <NavBar />
          <div>
              <Outlet/>
          </div>
          <Footer/>
      </main>
  )
}

export default RootLayout