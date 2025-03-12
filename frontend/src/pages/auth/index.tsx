import type { ReactElement } from 'react'
import { Box, Heading, Fade } from '@chakra-ui/react'
import { FixedBackground } from '~components/FixedBackground'
import { BannerHeads } from '~components/play/BannerHeads'
import type { LayoutProps } from '~components/layout/DefaultLayout'
import { getPlayLayout } from '~components/layout/DefaultLayout'
import ImgPlay from '~public/img/bg-play.svg'
import AuthButton from '~/src/components/AuthButton'
import { useSession, signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
export default function Play() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);
  return (
    <Box layerStyle="page" pos="relative" zIndex={1} px={0} pb={0}>
      <Fade transition={{ enter: { duration: 0.6 } }} in>
        <Heading as="h1" color="text.inverse" textAlign="center">
          <Box as="span" color="text.highlight">Welcome</Box>{' '}
        </Heading>
      </Fade>
      
      {/* Adjust the container to have negative margin and reduced height */}
      <Box 
        transform="scale(0.4)" 
        transformOrigin="top center"
        height="60px" // Reduced height to minimize space
        mb="120px" // Negative margin to pull next content up
      >
        <BannerHeads />
      </Box>
      
      {/* Login section moved up with negative margin-top */}
      <Box color="text.inverse" textAlign="center">
        <Heading maxW={[44, null, 'none']} mx="auto" mb={2} lineHeight="none" variant="body">
          Login/Sign Up
        </Heading>
        {/* <Text opacity={0.75} mb={2}>Start Learning Kannada Alphabets</Text> */}
      </Box>
      
      <AuthButton />
    </Box>
  )
}

Play.getLayout = (page: ReactElement, props?: LayoutProps) => {
  return getPlayLayout(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    <FixedBackground src={ImgPlay} alt="">
      {page}
    </FixedBackground>,
    props
  )
}