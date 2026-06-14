import React from 'react'
import LeftHome from '../components/LeftHome'
import Feed from '../components/Feed'
import RightHome from '../components/RightHome'
import Nav from '../components/Nav'

function Home() {
  return (
    <>
      <div id='main-page' className='w-full flex justify-center items-center bg-[#e0e5ec] min-h-[100vh] animate-explode origin-center'>
        <LeftHome/>
        <Feed/>
        <RightHome/>
      </div>
      <Nav />
    </>
  )
}

export default Home
