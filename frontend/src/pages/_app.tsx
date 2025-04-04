// pages/_app.tsx
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import type { ReactElement, ReactNode } from 'react'
import { useRouter } from 'next/router'
import { DefaultSeo } from 'next-seo'
import { AnimatePresence } from 'framer-motion'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'
import { getDefaultLayout } from '~components/layout/DefaultLayout'

import SEO from '~/next-seo.config'
import '~components/global.css'
import theme from '~src/theme'

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? getDefaultLayout
  const { asPath: key } = useRouter()

  return (
    <ChakraProvider theme={theme}>
      <DefaultSeo {...SEO} />
      <SessionProvider session={pageProps.session}>
        <AnimatePresence>
          {getLayout(<Component key={key} {...pageProps} />)}
        </AnimatePresence>
      </SessionProvider>
    </ChakraProvider>
  )
}

export default MyApp
