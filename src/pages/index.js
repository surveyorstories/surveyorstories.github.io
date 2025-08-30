import React from 'react'
import IntroContent from '../components/Homepage/intro-content'
import Head from '@docusaurus/Head'
import FlashAnnouncement from '../components/FlashAnnouncement'

function HomePage() {
  return (
    <>
      <Head></Head>
      <FlashAnnouncement />
      <IntroContent
        buttonLink='resurvey/groundtruthingnotice'
        nineTwoLink='resurvey/ninetwonotice'
      />
    </>
  )
}

export default HomePage
