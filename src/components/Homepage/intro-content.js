
import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import styles from './homepage.module.css';
import FeatureCard from './FeatureCard';
import FlashAnnouncement from '../FlashAnnouncement';

// --- Types ---

// --- Constants ---
const APP_TITLE = "Surveyor Stories";
const APP_TAGLINE = "Modern solutions for land surveying and governance. Streamline your workflow with our powerful notice generation and utility tools.";

const FEATURES = [
  {
    title: 'GT & GV Notice Generation',
    description: 'Effortlessly generate GT & GV notices for resurveys by uploading CSV data, mapping columns.',
    link: 'resurvey/groundtruthingnotice',
    fromColor: '#3b82f6', // from-blue-500
    toColor: '#22d3ee',   // to-cyan-400
  },
  {
    title: '9(2) Notice Generation',
    description: 'Streamline Resurvey 9(2) notices: upload data, map fields, and produce detailed, printable notices including officer details.',
    link: 'resurvey/ninetwonotice',
    fromColor: '#a855f7', // from-purple-500
    toColor: '#6366f1',   // to-indigo-500
  },

  {
    title: 'Svamitva GT & GV Notices',
    description: 'Accelerate Svamitva property assessments with GT & GV notices—upload CSV, map columns, and preview village-specific documents.',
    link: 'svamitva/svamitva_gtgvnotice',
    fromColor: '#ec4899', // from-pink-500
    toColor: '#f43f5e',   // to-rose-500
  },
  {
    title: 'Svamitva 9(2) Notices',
    description: 'Ensure compliance in Svamitva with 9(2) notices: upload data, map parcel numbers, and generate precise, printable legal documents.',
    link: 'svamitva/svamitva_ninetwonotice',
    fromColor: '#f97316', // from-orange-500
    toColor: '#f59e0b',   // to-amber-500
  },
  {
    title: 'Gruhanaksha',
    description: 'Access the Gruhanaksha QGIS plugin that assists in Svamitva by providing various tools for property mapping and land planning.',
    link: '/gruhanaksha',
    fromColor: '#22c55e', // from-green-500
    toColor: '#2dd4bf',   // to-teal-400
  },
];

const SOCIALS = [
  {
    name: 'Telegram',
    url: 'https://t.me/surveyor_stories',
    icon: <i className={`fab fa-telegram-plane ${styles.socialIcon}`} style={{ fontSize: '2rem' }}></i>,
    hoverColor: '#38bdf8', // hover:text-sky-400
  },
  {
    name: 'YouTube',
    url: 'https://youtube.com/@surveyorstories',
    icon: (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.socialIcon}
      >
        <title>YouTube</title>
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    hoverColor: '#ef4444', // hover:text-red-500
  },
  {
    name: 'GitHub',
    url: 'https://github.com/surveyorstories',
    icon: (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.socialIcon}
      >
        <title>GitHub</title>
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
    hoverColor: '#9ca3af', // hover:text-gray-400
  },
];

// --- Components ---



const Socials = () => (
  <footer className={styles.socialsFooter}>
    <div className={styles.container}>
      <h2 className={styles.socialsTitle}>Connect With Us</h2>
      <div className={styles.socialsContainer}>
        {SOCIALS.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            style={{ '--hover-color': social.hoverColor }}
            aria-label={social.name}
          >
            {social.icon}
          </a>
        ))}
      </div>
      <p className={styles.copyright}>© {new Date().getFullYear()} Surveyor Stories. All rights reserved.</p>
    </div>
  </footer>
);

const Features = () => (
  <section id="pages" className={styles.featuresSection}>
    <div className={styles.container}>
      <div className={styles.featuresGrid}>
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </div>
  </section>
);

const Hero = () => (
  <header className={styles.hero}>
    <div className={styles.container}>
      <h1 className={styles.heroTitle}>{APP_TITLE}</h1>
      <p className={styles.heroTagline}>{APP_TAGLINE}</p>
      <Link to="#pages" className={styles.heroButton}>
        Explore Pages
      </Link>
    </div>
  </header>
);

// --- Main Page Component ---
export default function Homepage() {
  return (
    <Layout
      title={`Homepage | ${APP_TITLE}`}
      description={APP_TAGLINE}
    >
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Nabla:wght@400&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <style>{`
          :root {
            --ifm-font-family-base: 'Poppins', sans-serif;
          }
        `}</style>
      </Head>
      <div className={styles.homepageWrapper}>
        <FlashAnnouncement />
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div className={styles.backgroundBlobs}>
          <div className={styles.blob} style={{ top: '5%', left: '10%', backgroundColor: '#75f755ff', animationName: styles.blobAnimation, animationDelay: '0s' }}></div>
          <div className={styles.blob} style={{ top: '20%', right: '15%', left: 'auto', backgroundColor: '#f59e0b', animationName: styles.blobFastAnimation, animationDelay: '2s' }}></div>
          <div className={styles.blob} style={{ bottom: '25%', left: '15%', top: 'auto', backgroundColor: '#ec4899', animationName: styles.blobSlowAnimation, animationDelay: '4s' }}></div>
          <div className={styles.blob} style={{ bottom: '10%', right: '10%', top: 'auto', left: 'auto', backgroundColor: '#3b82f6', animationName: styles.blobAnimation, animationDelay: '6s' }}></div>
        </div>
        <main className={styles.mainContent}>
          <Hero />
          <Features />
          <Socials />
        </main>
      </div>
    </Layout>
  );
}
