import React, { useEffect } from 'react'
import IntroContent from '../../components/Homepage/intro-content'
import Head from '@docusaurus/Head'
import { useHistory } from '@docusaurus/router'

function HomePage() {
  const history = useHistory()

  useEffect(() => {
    // Redirect to root path
    history.replace('/')
  }, [])

  // return (
  //   <>
  //     <Head>
  //       <meta charset='UTF-8' />
  //     </Head>
  //     <IntroContent buttonLink={'/resurvey/groundtruthingnotice'} />
  //   </>
  // )

  return null
}

export default HomePage
