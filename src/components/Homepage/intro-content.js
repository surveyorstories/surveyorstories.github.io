import React from 'react'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { FaTelegram, FaYoutube, FaGithub } from 'react-icons/fa'

const IntroContent = ({ buttonLink, nineTwoLink, gruhanakshaLink }) => {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout
      title={`${siteConfig.title}`}
      description='Surveyor Stories provides tools for GT & GV Notice Generation, 9(2) Notice Generation, and Gruhanaksha. Simplify your land surveying and property documentation needs.'
    >
      <header className='relative overflow-hidden py-20 md:py-32 text-white bg-gradient-to-br from-indigo-900 via-black to-pink-900'>
        <div className='absolute inset-0 opacity-30 bg-pattern-dots'>
          {/* Background pattern or image */}
        </div>
        <div className='relative container mx-auto px-4 text-center z-10'>
          <h1 className='text-5xl md:text-7xl font-extrabold mb-4 leading-tight tracking-tight'>
            {siteConfig.title}
          </h1>
          <p className='text-xl md:text-2xl mb-10 opacity-95 max-w-3xl mx-auto'>
            {siteConfig.tagline}
          </p>
          <div className='flex flex-wrap justify-center gap-4'>
            <Link
              className='button button--primary button--lg shadow-xl transform transition duration-300 hover:brightness-110 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-inset'
              to={buttonLink}
            >
              GT & GV Notice Generation
            </Link>
            <Link
              className='button button--primary button--lg shadow-xl transform transition duration-300 hover:brightness-110 hover:bg-purple-600 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-inset'
              to={nineTwoLink}
            >
              9(2) Notice Generation
            </Link>
            <Link
              className='button button--primary button--lg shadow-xl transform transition duration-300 hover:brightness-110 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-inset'
              to={gruhanakshaLink}
            >
              Gruhanaksha
            </Link>
          </div>
        </div>
      </header>

      <main>

        {/* Social Media Section */}
        <section className='py-8 bg-gray-50 dark:bg-gray-900'>
          <div className='container mx-auto px-4 text-center'>
            <h2 className='text-3xl font-bold mb-6 text-gray-800 dark:text-white'>
              Connect With Us
            </h2>
            <div className='flex justify-center space-x-6 py-2'>
              <a
                href='https://t.me/surveyor_stories'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-600 hover:text-blue-500 transition-colors duration-300 transform hover:scale-110'
              >
                <FaTelegram size={35} />
              </a>
              <a
                href='https://youtube.com/@surveyorstories'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-600 hover:text-red-500 transition-colors duration-300 transform hover:scale-110'
              >
                <FaYoutube size={35} />
              </a>
              {/* <a
                href='https://github.com/surveyorstories'
                target='_blank'
                rel='noopener noreferrer'
                className='text-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 transform hover:scale-110'
              >
                <FaGithub size={35} />
              </a> */}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  )
}

export default IntroContent
