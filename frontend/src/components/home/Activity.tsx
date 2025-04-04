import type { Variants } from 'framer-motion'
import { useRef } from 'react'
import NextImage from 'next/image'
import { Heading, Box, Flex, List, ListItem } from '@chakra-ui/react'
import { MotionBox, MotionText, MotionSpan, MotionScroll } from '~components/motion'
import { HOMEPAGE_IDS } from '~src/constants'
import { ActivityCloud } from './ActivityCloud'
import { AlphabetBubble } from './AlphabetBubble'
import { ActivityMarquee } from './ActivityMarquee'
import { ActivityCard } from './ActivityCard'

import ImgPanda from '~public/img/happypanda.svg'

const slideList: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: (d: number) => ({
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.2,
      delayChildren: d || 0,
    },
  }),
}

const slideInItem: Variants = {
  hidden: { opacity: 0, x: '-10%' },
  visible: { opacity: 1, x: '0%', transition: { type: 'spring', duration: 0.8 } },
}

const slideUpItem: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', duration: 0.8 } },
}

export default function Activity() {
  const containerRef = useRef(null)
  return (
    <MotionBox ref={containerRef} as="section" mt={-8} aria-labelledby={HOMEPAGE_IDS.activity}>
      <MotionScroll position="relative" distance={300} zIndex={1}>
        <Flex direction="column" columnGap={8} px={4}>
          <Box pos="relative" maxW="md" mx={['auto', null, 0]} pb={[20, null, 60]}>
            <Heading
              overflow="hidden"
              color="secondary.500"
              fontSize={['f5xl', null, null, 'f4xl']}
              lineHeight={0.85}
              letterSpacing="tight"
              wordBreak="break-word"
              id={HOMEPAGE_IDS.activity}
            >
              <MotionSpan
                display="block"
                initial="hidden"
                whileInView="visible"
                variants={slideList}
                viewport={{ once: true }}
              >
                <MotionSpan
                  display="flex"
                  flexWrap="wrap"
                  alignItems="center"
                  variants={slideInItem}
                >
                  Pure{' '}
                  <Box as="span" ml={1} p={1} fontSize="xs" bg="red.400" rounded="circle">
                    😋
                  </Box>{' '}
                </MotionSpan>
                <MotionSpan
                  display="flex"
                  flexWrap="wrap"
                  alignItems="center"
                  variants={slideInItem}
                >
                  Animal{' '}
                  <Box as="span" ml={1} p={1} fontSize="xs" bg="orange.400" rounded="circle">
                    😸
                  </Box>{' '}
                </MotionSpan>
                <MotionSpan display="block" variants={slideInItem}>
                  Fun .
                </MotionSpan>
              </MotionSpan>
            </Heading>
            <MotionBox
              pos={{ md: 'absolute' }}
              top={{ md: '50%' }}
              left={{ md: '50%' }}
              zIndex={1}
              custom={0.5}
              initial="hidden"
              whileInView="visible"
              variants={slideList}
              viewport={{ once: true }}
            >
              <MotionText
                sx={{
                  ':before': {
                    content: '""',
                    pos: 'absolute',
                    bg: 'secondary.400',
                    bottom: 0,
                    width: '100%',
                    height: '110%',
                    rounded: 'xtiny',
                    transform: 'rotate(-2.5deg) translateX(-5%)',
                    zIndex: -1,
                  },
                }}
                pos="relative"
                zIndex={1}
                w={{ md: '3xs' }}
                mt={[8, null, 3]}
                fontSize="fxl"
                lineHeight={{ md: 1.1 }}
                variants={slideUpItem}
              >
                Go on a fun adventure and experience the alphabets like never before.
              </MotionText>
              <MotionText textAlign="right" fontSize="fxl" fontWeight={700} variants={slideUpItem}>
                <Box as="span" p={1} color="background" bg="brand.500" rounded="xtiny">
                  awesome really!
                </Box>
              </MotionText>
              <MotionText
                textAlign="center"
                fontSize="fxl"
                fontWeight={700}
                lineHeight={2.5}
                variants={slideUpItem}
              >
                <Box as="span" px={3} py={1} color="background" bg="accent.300" rounded="xtiny">
                  ಕ ಖ ಗ ಘ ಙ
                </Box>
              </MotionText>
            </MotionBox>
          </Box>
          <Box
            pos="sticky"
            top={20}
            order={{ lg: -1 }}
            w={['70%', null, '50%', '40%']}
            mr={['auto', null, null, 0]}
            ml="auto"
          >
            <NextImage src={ImgPanda} alt="Happy panda in front of a bamboo plant" />
          </Box>
          <ActivityCloud dragConstraints={containerRef} />
        </Flex>
      </MotionScroll>
      {/* make container or give bounding padding */}
      <List mb={8} fontFamily="glyph" pointerEvents="none" spacing={16}>
        <ListItem pos="sticky" top={4} overflow="hidden">
          <AlphabetBubble bg="orange.200">ಅ ಆ ಇ ಈ ಉ ಊ</AlphabetBubble>
        </ListItem>
        <ListItem pos="sticky" top={12} overflow="hidden">
          <AlphabetBubble bg="pink.200">ಋ ಋೂ ಎ ಏ ಐ ಓ</AlphabetBubble>
        </ListItem>
        <ListItem pos="sticky" top={20} overflow="hidden">
          <AlphabetBubble bg="green.200">ಔ ಅಂ ಅಃ ಕ ಖ ಗ</AlphabetBubble>
        </ListItem>
        <ListItem pos="sticky" top={28} overflow="hidden">
          <AlphabetBubble bg="purple.200">ಘ ಞ ಚ ಛ ಜ ಝ</AlphabetBubble>
        </ListItem>
        <ListItem h={32} aria-hidden="true" />
      </List>
      <ActivityMarquee>
        <ActivityCard />
      </ActivityMarquee>
    </MotionBox>
  )
}
