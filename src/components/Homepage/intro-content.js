import React, { useEffect, useState } from 'react'
import Button from './button'
import Layout from '@theme/Layout'
import Link from '@docusaurus/Link'
import { FaTelegram, FaYoutube, FaGithub } from 'react-icons/fa'

const IntroContent = ({ buttonLink, nineTwoLink }) => {
  return (
    <Layout title='Resurvey Notice Generator' description='Generate Resurvey Notices with ease.'>
      <header className='header'>
        <div className='container mx-auto px-4 py-6 text-center'>
          <h1 className='text-3xl font-bold text-blue-800'>Resurvey Notice Generator</h1>
          <p className='mb-4 text-gray-600'>
            Ground Truthing Notice Ground Validation and Nine Two Notice Generation for Resurvey.
          </p>
          <div className='space-x-4'>
            <Button to={buttonLink}>GT & GV Notice Generation</Button>
            <Button to={nineTwoLink}>9(2) Notice Generation</Button>
          </div>
        </div>
      </header>

      <main className='container mx-auto'>
        {/* Social Media Section */}
        <section className='text-center'>
          <h3 className='mb-4 text-lg font-medium text-gray-700'>Connect With Us</h3>
          <div className='flex justify-center space-x-9'>
            <a href='https://t.me/surveyor_stories' target='_blank' rel='noopener noreferrer'>
              <FaTelegram size={30} className='text-gray-600 hover:text-blue-500' />
            </a>
            <a
              href='https://youtube.com/@surveyorstories'
              target='_blank'
              rel='noopener noreferrer'
            >
              <FaYoutube size={30} className='text-gray-600 hover:text-red-500' />
            </a>
            <a href='https://github.com/surveyorstories' target='_blank' rel='noopener noreferrer'>
              <FaGithub size={30} className='text-gray-600 hover:text-gray-900' />
            </a>
          </div>
        </section>

        {/* YouTube Videos Section */}
      </main>
    </Layout>
  )
}

export default IntroContent
