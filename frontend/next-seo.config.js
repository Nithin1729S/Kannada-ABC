/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  titleTemplate: '%s | HCI - ABC English App',
  defaultTitle: 'HCI - ABC English App',
  description: 'The #1 educational app for kids to learn the English Alphabets in a funtastic way.',
  canonical: 'https://HCI.vercel.app',
  openGraph: {
    url: 'https://HCI.vercel.app',
    title: 'HCI',
    description: '#1 Animal ABCs app for kids to learn the English Alphabets.',
    images: [
      {
        url: 'https://HCI.vercel.app/static/og-image.png',
        alt: 'HCI ABC App',
      },
    ],
    site_name: 'HCI',
  },
}

export default defaultSEOConfig
