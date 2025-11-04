// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import { themes as prismThemes } from 'prism-react-renderer'
require('dotenv').config()
// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */

const config = {
  title: 'Surveyor Stories - Empowering Land Surveyors',
  tagline: 'Empowering Land Surveyors with Modern Tools and Resources',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://surveyorstories.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'surveyorstories', // Usually your GitHub org/user name.
  projectName: 'surveyorstories.github.io', // Usually your repo name.

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn'
    }
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },
  customFields: {
    adsenseClientId: process.env.DOCUSAURUS_ADSENSE_CLIENT_ID,
    adsenseSlotId: process.env.DOCUSAURUS_ADSENSE_SLOT_ID
  },
  // Enable Docusaurs Faster: https://github.com/facebook/docusaurus/issues/10556

  future: {
    experimental_faster: {
      swcJsLoader: true,
      swcJsMinimizer: true,
      swcHtmlMinimizer: true,
      lightningCssMinimizer: true,
      rspackBundler: true,
      mdxCrossCompilerCache: true
    },
    experimental_storage: {
      type: 'localStorage',
      namespace: true
    }
    // experimental_router: 'hash',
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/surveyorstories/surveyorstories.github.io/edit/main'
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css'
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
          createSitemapItems: async (params) => {
            const { defaultCreateSitemapItems, ...rest } = params
            const items = await defaultCreateSitemapItems(rest)
            return items.filter((item) => !item.url.includes('/page/'))
          }
        },

        gtag: {
          trackingID: 'G-JXGYS5GKJV',
          anonymizeIP: true
        }
      })
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/social-card.jpg',
      navbar: {
        title: 'Surveyor Stories',
        logo: {
          alt: 'Surveyor Stories Logo',
          src: 'img/logo.svg'
        },
        items: [
          {
            type: 'search',
            position: 'right'
          },
          // {
          //   type: 'docSidebar',
          //   sidebarId: 'tutorialSidebar',
          //   position: 'left',
          //   label: 'Tutorial'
          // },
          // { to: '/blog', label: 'Blog', position: 'left' },
          // {
          //   'href': 'https://github.com/surveyorstories/surveyorstories.github.io',
          //   'position': 'right',
          //   'className': 'header-github-link',
          //   'aria-label': 'GitHub repository'
          // }
        ]
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro'
              }
            ]
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Youtube',
                href: 'https://youtube.com/@surveyorstories'
              },
              {
                label: 'Telegram',
                href: 'https://t.me/surveyorstories'
              }
              // {
              //   label: 'X',
              //   href: 'https://x.com/docusaurus'
              // }
            ]
          },
          {
            title: 'More',
            items: [
              // {
              //   label: 'Blog',
              //   to: '/blog'
              // },
              {
                label: 'GitHub',
                href: 'https://github.com/surveyorstories'
              },
              {
                label: 'Gruhanaksha',
                href: '/gruhanaksha'
              }
            ]
          }
        ],
        copyright: `Copyright © ${new Date().getFullYear()}  <a href="https://github.com/surveyorstories" style="font-weight: bold;" target="_blank">Surveyor Stories</a> Designed with Template <a href="https://github.com/surveyorstories" style="font-weight: bold;" target="_blank">Docusaurus Tailwind Shadcn</a>`
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula
      },


    }),
  // scripts: [
  //   {
  //     src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5740737782081297',
  //     async: true,
  //     crossorigin: 'anonymous'
  //   }
  // ],
  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        indexPages: true,
        docsRouteBasePath: '/docs/intro',
        hashed: true,
        language: ['en'],
        highlightSearchTermsOnTargetPage: true,
        searchResultContextMaxLength: 50,
        searchResultLimits: 8,
        indexPages: true,



      }
    ]
  ],
  plugins: [
    // Add the Chatwoot plugin here

    ['./src/plugins/tailwind-config.js', {}],

    [
      'ideal-image',
      /** @type {import('@docusaurus/plugin-ideal-image').PluginOptions} */
      ({
        quality: 70,
        max: 1030,
        min: 640,
        steps: 2,
        // Use false  to debug, but it incurs huge perf costs
        disableInDev: true
      })
    ],
    [
      '@gracefullight/docusaurus-plugin-google-adsense',
      {
        adClient: 'ca-pub-5740737782081297' // Replace with your AdSense client ID
      }
    ],
    [
      './src/plugins/blog-plugin',
      {
        path: 'blog',
        editLocalizedFiles: false,
        blogTitle: 'Blog',
        blogDescription: 'Blog description is here ...',
        blogSidebarCount: 'ALL',
        blogSidebarTitle: 'List blog',
        routeBasePath: 'blog',
        include: ['**/*.md', '**/*.mdx'],
        exclude: [
          '**/_*.{js,jsx,ts,tsx,md,mdx}',
          '**/_*/**',
          '**/*.test.{js,jsx,ts,tsx}',
          '**/__tests__/**'
        ],
        postsPerPage: 6,
        truncateMarker: /<!--\s*(truncate)\s*-->/,
        showReadingTime: true,
        onUntruncatedBlogPosts: 'ignore',
        // Remove this to remove the "edit this page" links.
        editUrl: 'https://surveyorstories.github.io/tree/main/',
        remarkPlugins: [[require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }]]
      }
    ],
    [
      'posthog-docusaurus',
      {
        apiKey: 'phc_tGkbGrEgfIUH1Cz0NtJbFEVfizpQcUoGCJzAyuepR1a', // required
        // appUrl: 'https://us.i.posthog.com', // optional, defaults to "https://us.i.posthog.com"
        enableInDevelopment: false // optional
      }
    ]
  ]
}

export default config
