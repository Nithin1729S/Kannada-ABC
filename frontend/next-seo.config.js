/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEOConfig = {
  titleTemplate: '%s | ಅಕ್ಷರ ಕಲಿ',
  defaultTitle: 'ಅಕ್ಷರ ಕಲಿ',
  description: 'The #1 educational app for kids to learn the Kannada Alphabets in a funtastic way.',
  canonical: 'https://kannada-abc.vercel.app',
  openGraph: {
    url: 'https://kannada-abc.vercel.app',
    title: 'ಅಕ್ಷರ ಕಲಿ',
    description: '#1 Animal ABCs app for kids to learn the Kannada Alphabets.',
    images: [
      {
        url: 'https://kannada-abc.vercel.app/opengraph.png',
        alt: 'ಅಕ್ಷರ ಕಲಿ',
      },
    ],
    site_name: 'ಅಕ್ಷರ ಕಲಿ',
  },
}

export default defaultSEOConfig
