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
import bubble from '~public/img/bubble.png'
import snake from '~public/img/snake.png'

export default function Play() {
  const { scrollReveal } = useScrollReveal({ offset: ['start end', 'end start'] })

  return (
    <Box layerStyle="page" pos="relative" zIndex={1} px={0} pb={0}>
      <Fade transition={{ enter: { duration: 0.6 } }} in>
        <Heading as="h1" color="text.inverse" textAlign="center">
          <Box as="span" color="text.highlight">
            Play
          </Box>{' '}
          Zone
        </Heading>
      </Fade>
      <Box mt={20} mb={24}>
        <BannerHeads />
      </Box>
      <SlideFade transition={{ enter: { duration: 0.6, delay: 0.25 + 0.65 + 2.25 } }} in>
        <MotionBox
          minH="sm"
          mx={[1, 3]}
          bg="blackAlpha.500"
          pb={16}
          roundedTop={['card', 'bigCard']}
          {...scrollReveal}
        >
          <Box px={4} py={12} color="text.inverse" textAlign="center">
            <Heading maxW={[44, null, 'none']} mx="auto" mb={4} lineHeight="none" variant="body">
              <Box as="span" color="text.highlight" fontSize="2xl">
                5
              </Box>{' '}
              Mini Games to Play for Fun.
            </Heading>
            <Text opacity={0.75}>Level Up in your Quest.</Text>
          </Box>
          <Underline mb={12} fill="brand.900" />
          <List display="grid"
  gridTemplateColumns="repeat(5, 1fr)" 
  gap={4} 
  px={[5, 12]} sx={{ '--size': 'sizes.60' }} layerStyle="gridy" >
            <MotionPop as="li" marge="0px" once>
              <Flex h="full" maxH={[64, null, 72, null, 'none']} rounded="card">
                <GameCard imgSrc={bubble} href="/bubble-pop" title="Bubble Pop" colorScheme="orange" />
              </Flex>
            </MotionPop>
            <MotionPop as="li" marge="0px" once>
              <Flex h="full" maxH={[64, null, 72, null, 'none']} rounded="card">
                <GameCard imgSrc={snake} title="Snake Game" href="/snake"  colorScheme="pink" />
              </Flex>
            </MotionPop>
            <MotionPop as="li" marge="0px" once>
              <Flex h="full" maxH={[64, null, 72, null, 'none']} rounded="card">
                <GameCard  title="D" colorScheme="blue" />
              </Flex>
            </MotionPop>
            <MotionPop as="li" marge="0px" once>
              <Flex h="full" maxH={[64, null, 72, null, 'none']} rounded="card">
                <GameCard  title="X" colorScheme="cyan" />
              </Flex>
            </MotionPop>
            <MotionPop as="li" marge="0px" once>
              <Flex h="full" maxH={[64, null, 72, null, 'none']} rounded="card">
                <GameCard title="O" />
              </Flex>
            </MotionPop>
            {/* <MotionPop as="li" marge="0px" once>
              <Flex h="full" maxH={[64, null, 72, null, 'none']} rounded="card">
                <GameCard colorScheme="yellow" />
              </Flex>
            </MotionPop> */}
            {/* <MotionPop as="li" marge="0px" once>
              <Flex h="full" maxH={[64, null, 72, null, 'none']} rounded="card">
                <GameCard
                  href="/play"
                  imgSrc={ImgGameSwap}
                  title="Memory Mix Match"
                  colorScheme="red"
                />
              </Flex>
            </MotionPop>
            <MotionPop as="li" marge="0px" once>
              <Flex h="full" maxH={[64, null, 72, null, 'none']} rounded="card">
                <GameCard title="Animal Hunt" colorScheme="purple" />
              </Flex>
            </MotionPop> */}
          </List>
        </MotionBox>
      </SlideFade>
    </Box>
  )
}

Play.getLayout = (page: ReactElement, props?: LayoutProps) => {
  return getPlayLayout(
    <FixedBackground src={ImgPlay} alt="">
      {page}
    </FixedBackground>,
    props
  )
}
