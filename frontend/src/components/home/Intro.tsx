import type { PropsWithChildren } from 'react'
import type { AnimalHeadType } from '~components/AnimalHead'
import { useRef, useCallback } from 'react'
import { useScroll, transform } from 'framer-motion'
import { Box, Flex, Text, VisuallyHidden, Link, useToken, chakra } from '@chakra-ui/react'
import { MotionPop, MagneticBox } from '~components/motion'
import { AnimalHead } from '~components/AnimalHead'
import { useAnimeBg } from '~src/hooks/useAnimeBg'
import { usePhonics } from '~src/hooks/usePhonics'
import { useGeneralSfx } from '~src/context/sfx'
import { HOMEPAGE_IDS, SITE_CONFIG } from '~src/constants'

import { ReactComponent as ScenerySvg } from '~public/img/scenery.svg'

const ChakraScenery = chakra(ScenerySvg)

interface MotionAnimalProps {
  animal: AnimalHeadType
  shift?: boolean
}

const MotionAnimal = ({ animal, shift, children }: PropsWithChildren<MotionAnimalProps>) => {
  const dir = shift ? 1 : -1

  const [playAnimalSound] = usePhonics(`/sounds/${animal}.mp3`)
  const { playHover } = useGeneralSfx()

  const handleClick = useCallback(() => {
    playAnimalSound()
  }, [playAnimalSound])

  return (
    <MotionPop
      pos="relative"
      w="full"
      maxW={['2xs', 'sm']}
      left={[null, null, `${dir * 15}%`, null, `${dir * 20}%`]}
    >
      <MagneticBox p={[2, 8]}>
        <AnimalHead
          animal={animal}
          onClick={handleClick}
          onMouseEnter={playHover}
          size="full"
          bg="blackAlpha.300"
          fill="blackAlpha.400"
          cursor="pointer"
        >
          <MagneticBox.Parallax as="span" display="inline-block">
            {children}
          </MagneticBox.Parallax>
        </AnimalHead>
      </MagneticBox>
    </MotionPop>
  )
}

export default function Intro() {
  const [currentBg, newBg] = useToken('colors', ['brand.700', 'brand.600'])

  const sceneRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['0.25 end', 'end start'],
  })

  const transformer = transform([0, 0.25], [currentBg, newBg])

  useAnimeBg(scrollYProgress, transformer)

  return (
    <Box as="section" mb={[null, 20]} pt={56} aria-labelledby={HOMEPAGE_IDS.intro}>
      <VisuallyHidden as="h2" id={HOMEPAGE_IDS.intro}>
        Introducing {SITE_CONFIG.appName}
      </VisuallyHidden>
      <Box px={[4, null, 8]}>
        <Text fontSize={['f2xl', null, null, null, 'f3xl']}>
          <Box as="strong" px="0.3em" color="brand.900" bg="secondary.300" rounded="0.3em">
            {SITE_CONFIG.appName}
          </Box>{' '}
          is an early learning app for kids to practice the Kannada Alphabets.
        </Text>
      </Box>
      <Box
        ref={sceneRef}
        pos="sticky"
        top={0}
        overflow="hidden"
        h={['120vmax', null, null, 'auto']}
        minH={['md', null, null, 0]}
        maxH={['3xl', null, '4xl', 'none']}
      >
        <ChakraScenery h="full" />
      </Box>
      <Flex
        align="center"
        direction="column"
        rowGap={[40, null, 32]}
        columnGap={8}
        pt={[24, 0]}
        pb={48}
      >
        <MotionAnimal animal="tiger">Grrr</MotionAnimal>
        <MotionAnimal animal="lion" shift>
          Roar
        </MotionAnimal>
        <MotionAnimal animal="bear">Growl</MotionAnimal>
      </Flex>
    </Box>
  )
}
