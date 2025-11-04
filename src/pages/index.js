import React from 'react'
import IntroContent from '../components/Homepage/intro-content'
import Head from '@docusaurus/Head'
function HomePage() {
  return (
    <>
      <Head></Head>
      <IntroContent
        buttonLink='resurvey/groundtruthingnotice'
        nineTwoLink='resurvey/ninetwonotice'
        gruhanakshaLink='/gruhanaksha'
        svamitvagtLink='svamitva/groundtruthingnotice_svamitva'
        svamitvanineTwoLink='svamitva/ninetwonotice_svamitva'
      />
    </>
  )
}

export default HomePage
