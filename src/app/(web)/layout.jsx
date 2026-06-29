import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import React from 'react'

function layout({ children }) {
  return (
    <div>
      <Navbar/>
      {children}
      <Footer/>
    </div>
  )
}

export default layout
