import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useCallback } from 'react'
import { Box, Flex, VisuallyHidden, Tooltip, useToken } from '@chakra-ui/react'
import { ArrowLeft1Linear, ArrowRight1Linear } from 'react-iconsax-icons'
import { SfxIconButton } from '~components/sfx'
import { AlphabetEnterAnimation } from '~components/practice/AlphabetEnterAnimation'
import { AlphabetAnimals } from '~components/practice/AlphabetAnimals'
import { useGestureNavigation } from '~src/hooks/useGestureNavigation'

import { getLayout } from '~components/layout/AlphabetLayout'

import { alphabets } from '~src/data/alphabets'

export default function LearnAlphabet({
  alphabet,
  prevId,
  nextId,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const letters = [
    'ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ', 'ಐ',
    'ಒ', 'ಓ', 'ಔ', 'ಅಂ', 'ಅಃ', 'ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ',
    'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ', 'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ',
    'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ', 'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ',
    'ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ', 'ಷ', 'ಸ', 'ಹ', 'ಳ'
  ];
  const shadowColor = useToken('colors', 'brand.300', 'white')
  const router = useRouter();
  const currentPath = router.pathname; // Get the current 
  let backRoute = currentPath.startsWith('/learn') ? "/learn": 
                    currentPath.startsWith('/practice') ? "/practice" : 
                    "/learn"; // Default to /learn if neither matches
  const { push } = useRouter()

  const prev = useCallback(() => {
    if (prevId) {
      void push(`${backRoute}/${prevId}`)
    }
  }, [prevId, push])
  
  const next = useCallback(() => {
    if (nextId) {
      void push(`${backRoute}/${nextId}`)
    }
  }, [nextId, push])
  

  const handlers = useGestureNavigation({
    prev,
    next,
    allowPrefetch: !!prevId || !!nextId,
    ...(prevId && { prevUrl: `${backRoute}/${prevId}` }),
    ...(nextId && { nextUrl: `${backRoute}/${nextId}` }),
  })

  const bgTheme = alphabet ? `${alphabet.bg}.100` : 'white'
  const prevLabel = `Alphabet ${letters[Number(prevId)-1]}`
  const nextLabel = `Alphabet ${letters[Number(nextId)-1]}`
  

  return (
    <Box bg={bgTheme} shadow={`0 0 0 1.5em ${shadowColor}`} roundedBottom="10vw">
      <VisuallyHidden as="h1">{`Alphabet ${alphabet?.numeral ?? ''}`}</VisuallyHidden>
      <AlphabetEnterAnimation alphabet={alphabet} {...handlers}>
        <AlphabetAnimals />
      </AlphabetEnterAnimation>

      <Flex
        pos="fixed"
        zIndex="docked"
        bottom={4}
        left={0}
        justify="center"
        w="full"
        pointerEvents="none"
      >
        <Flex
          columnGap={5}
          p={1}
          bg="blackAlpha.700"
          border="2px solid"
          pointerEvents="auto"
          backdropFilter="blur(10px)"
          rounded="full"
        >
          <Tooltip hasArrow isDisabled={!prevId} label={prevLabel}>
            <SfxIconButton
              layerStyle="pushy"
              bg={bgTheme}
              _hover={{ bg: 'white' }}
              aria-label={prevLabel}
              colorScheme="gray"
              icon={<ArrowLeft1Linear color="currentColor" size="35%" />}
              isDisabled={!prevId}
              onClick={prev}
            />
          </Tooltip>
          <Tooltip hasArrow isDisabled={!nextId} label={nextLabel}>
            <SfxIconButton
              layerStyle="pushy"
              bg={bgTheme}
              _hover={{ bg: 'white' }}
              aria-label={nextLabel}
              colorScheme="gray"
              icon={<ArrowRight1Linear color="currentColor" size="35%" />}
              isDisabled={!nextId}
              onClick={next}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  )
}

LearnAlphabet.getLayout = (page: ReactElement) => {
  const currentPath = page.props.router?.pathname || '';
  const backRoute = currentPath.startsWith('/learn') ? "learn": 
                    currentPath.startsWith('/practice') ? "practice" : 
                    "learn";
  return getLayout(page, { back: `/${backRoute}`, bg: 'brand.400' })
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = alphabets.map((alphabet) => ({
    params: {
      id: alphabet.numeral.toString(), // Use numeral instead of name
    },
  }))

  return { paths, fallback: false }
}

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticProps = async ({ params }: GetStaticPropsContext<{ id: string }>) => {
  let prevId = ''
  let nextId = ''

  const alphabet = alphabets.find((_alphabet, i, self) => {
    const match = _alphabet.numeral.toString() === params?.id // Use numeral for matching
    if (match) {
      self.forEach((a) => {
        if (a.numeral === _alphabet.numeral - 1) {
          prevId = a.numeral.toString() // Use numeral for prevId
        }
        if (a.numeral === _alphabet.numeral + 1) {
          nextId = a.numeral.toString() // Use numeral for nextId
        }
      })
    }
    return match
  })

  return { props: { alphabet, prevId, nextId } }
}
