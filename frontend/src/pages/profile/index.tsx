import type { ReactElement } from 'react'
import { Box, Flex, Heading, Text, List, Fade, SlideFade } from '@chakra-ui/react'
import { MotionPop, MotionBox } from '~components/motion'
import { FixedBackground } from '~components/FixedBackground'
import { Underline } from '~components/Underline'
import { GameCard } from '~components/play/GameCard'
import { BannerHeads } from '~components/play/BannerHeads'

import type { LayoutProps } from '~components/layout/DefaultLayout'
import { getPlayLayout } from '~components/layout/DefaultLayout'

import { useScrollReveal } from '~/src/hooks/useScrollReveal'

import ImgPlay from '~public/img/bg-play.svg'
import ImgGameSwap from '~public/img/bg-game-swap.svg'
import { useSession } from 'next-auth/react'
import { AlphabetGrid } from '~/src/components/profile/AlphabetGrid'

export default function Play() {
  const { scrollReveal } = useScrollReveal({ offset: ['start end', 'end start'] })
  const { data: session } = useSession()
  return (
    <Box layerStyle="page" pos="relative" zIndex={1} px={0} pb={0}>
      <Fade transition={{ enter: { duration: 0.6 } }} in>
        <Heading as="h1" color="text.inverse" textAlign="center">
          <Box as="span" color="text.highlight">
            Your
          </Box>{' '}
          Profile
        </Heading>
      </Fade>
      <Box
        transform="scale(0.4)"
        transformOrigin="top center"
        height="60px" // Reduced height to minimize space
        mb="120px" // Negative margin to pull next content up
      >
        <BannerHeads />
      </Box>

      <Box px={4} py={12} color="text.inverse" textAlign="center">
        <Heading maxW={[44, null, 'none']} mx="auto" mb={4} lineHeight="none" variant="body">
          <Box as="span" color="text.highlight" fontSize="2xl"></Box>{' '}
          {session && <Text>Signed in as {session.user?.email}</Text>}
        </Heading>
        <Text opacity={0.75}>Level Up in your Quest.</Text>
      </Box>
    </Box>
  )
}

Play.getLayout = (page: ReactElement, props?: LayoutProps) => {
  return getPlayLayout(
    <FixedBackground src={ImgPlay} alt="">
      {page}
      <AlphabetGrid show={true} />
      
    </FixedBackground>,
  )
}
