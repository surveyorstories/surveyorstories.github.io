import React from 'react'
import IntroContent from '../components/Homepage/intro-content'
import FlashAnnouncement from '../components/FlashAnnouncement'
import Head from '@docusaurus/Head'
function HomePage() {
  return (
    <>
      <Head></Head>
      <FlashAnnouncement />
      <IntroContent
        buttonLink='resurvey/groundtruthingnotice'
        nineTwoLink='resurvey/ninetwonotice'
        gruhanakshaLink='gruhanaksha'
      />
    </>
  )
}

export default HomePage
