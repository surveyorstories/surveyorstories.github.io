import React, { useEffect } from 'react'
import Layout from '@theme/Layout'
import styles from './feedback.module.css' // Optional: Custom CSS

const Feedback = () => {
  return (
    <Layout
      title='Feedback and Error Reporting'
      description='Help us improve our documentation by reporting errors or suggesting improvements.'
    >
      <main className={styles.feedbackContainer}>
        <div className={styles.headerSection}>
          <h1>Feedback and Error Reporting</h1>
          <p>
            We are committed to improving our self, but we need your help! If you encounter any
            errors or have suggestions, please let us know.
          </p>
        </div>

        <section className={styles.feedbackFormSection}>
          {/* Zoho Survey Form Embed */}
          <iframe
            aria-label='Notice generator feedback'
            frameBorder='0'
            allow='camera;'
            style={{ height: '500px', width: '99%', border: 'none' }}
            src='https://forms.zohopublic.in/surveyorstories1/form/noticegeneratorfeedback/formperma/p5azxBhPV2MLUMAccjnySWTI5tHkR46wJiy8OuHf7ZQ?zf_enablecamera=true'
          ></iframe>
        </section>
      </main>
    </Layout>
  )
}

export default Feedback
