import React from 'react'
import { motion } from 'framer-motion'

const Header = () => {
  return (
    <motion.header
      className='w-full py-2 sm:py-3 md:py-4 print:mt-0 print:hidden print:bg-transparent print:pt-0'
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className='container mx-auto px-0 sm:px-0 md:px-0'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <div className='print:hidden'>
          <h1 className='w-full whitespace-normal text-5xl font-medium leading-tight tracking-tight text-blue-800 dark:text-blue-400 sm:text-4xl md:text-4xl lg:text-5xl'>
            Svamitva 9(2) Notices Generation
          </h1>
          <p className='mt-2 w-full max-w-5xl whitespace-normal text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:mt-3 sm:text-lg'>
            Effortlessly Create 9(2)notices for Svamitva Survey.
          </p>
        </div>
      </motion.div>
    </motion.header>
  )
}

export default Header
