import React from 'react'
import Navbar from '../../Components/HomePage/Navbar'
import HeroHeader from '../../Components/HomePage/HeroHeader'
import Process from '../../Components/HomePage/Process'
import ExploreCities from '../../Components/HomePage/ExploreCities'
import PlacesList from '../../Components/HomePage/PlacesList'
import Testimonial from '../../Components/HomePage/Testimonial'
import BlogSection from '../../Components/HomePage/BlogSection'
import Footer from '../../Components/HomePage/Footer'

function MainPage() {
  return (
    <div>
      <Navbar />
      <HeroHeader />
      <Process />
      <ExploreCities />
      <PlacesList />
      <Testimonial />
      <BlogSection />
      <Footer />
    </div>
  )
}

export default MainPage