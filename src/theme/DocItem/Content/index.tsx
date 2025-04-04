import React from 'react'
import Content from '@theme-original/DocItem/Content'
import type ContentType from '@theme/DocItem/Content'
import type { WrapperProps } from '@docusaurus/types'
import AdSense from 'react-adsense'

type Props = WrapperProps<typeof ContentType>

export default function ContentWrapper(props: Props): React.ReactElement {
  return (
    <>
      <div>
        <AdSense.Google
          client='ca-pub-5740737782081297' // Replace with your AdSense client ID
          slot='yyyyyyyyyy' // Replace with your ad slot ID
          style={{ display: 'block' }}
          format='auto'
          responsive='true'
        />
      </div>
      <br />
      <Content {...props} />
      <br />
      <div>
        <AdSense.Google
          client='ca-pub-5740737782081297' // Replace with your AdSense client ID
          slot='yyyyyyyyyy' // Replace with your ad slot ID
          style={{ display: 'block' }}
          format='auto'
          responsive='true'
        />
      </div>
    </>
  )
}
