import type { GetStaticPaths, GetStaticPropsContext, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import type { ReactElement } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Box, Flex, VisuallyHidden, Tooltip, useToken } from '@chakra-ui/react'
import { ArrowLeft1Linear, ArrowRight1Linear } from 'react-iconsax-icons'
import { SfxIconButton } from '~components/sfx'
import { AlphabetEnterAnimation } from '~components/learn/AlphabetEnterAnimation'
import { AlphabetAnimals } from '~components/learn/AlphabetAnimals'
import { useGestureNavigation } from '~src/hooks/useGestureNavigation'
import { ROUTES } from '~src/constants'
import { getLayout } from '~components/layout/AlphabetLayout'
import { useConfetti } from "~components/ui/confetti-trigger";
import { alphabets } from '~src/data/alphabets'
import { useSession } from 'next-auth/react'

export default function LearnAlphabet({
  alphabet,
  prevId,
  nextId,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { push } = useRouter()
  const { data: session } = useSession()
  const [dynamicNextId, setDynamicNextId] = useState<string | null>(null)

  // Fetch the dynamic next letter, skipping the current letter (alphabet.numeral)
  useEffect(() => {
    if (session?.user?.email && alphabet) {
      fetch(`/api/getNextLetter?email=${session.user.email}&ignore=${alphabet.numeral}`)
        .then(res => res.json())
        .then(data => {
          if (data.letter !== undefined && data.letter !== null) {
            setDynamicNextId(data.letter.toString())
          }
        })
        .catch(error => console.error("Error fetching next letter:", error))
    }
  }, [session, alphabet])

  const letters = [
    'ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ', 'ಐ',
    'ಒ', 'ಓ', 'ಔ', 'ಅಂ', 'ಅಃ', 'ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ',
    'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ', 'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ',
    'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ', 'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ',
    'ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ', 'ಷ', 'ಸ', 'ಹ', 'ಳ'
  ]
  const shadowColor = useToken('colors', 'brand.300', 'white')
  
  const prev = useCallback(() => {
    if (prevId) {
      void push(`${ROUTES.learn}/${prevId}`)
    }
  }, [prevId, push])
  
  const next = useCallback(() => {
    // Use dynamicNextId if available; otherwise fallback to the static nextId.
    const id = dynamicNextId ?? nextId
    if (id) {
      void push(`${ROUTES.learn}/${id}`)
    }
  }, [dynamicNextId, nextId, push])
  
  const handlers = useGestureNavigation({
    prev,
    next,
    allowPrefetch: !!prevId || !!nextId,
    ...(prevId && { prevUrl: `${ROUTES.learn}/${prevId}` }),
    ...(nextId && { nextUrl: `${ROUTES.learn}/${nextId}` }),
  })
  
  const bgTheme = alphabet ? `${alphabet.bg}.100` : 'white'
  const prevLabel = `Alphabet ${letters[Number(prevId) - 1]}`
  // Use dynamicNextId if available for nextLabel
  const nextLabel = `Alphabet ${letters[Number(dynamicNextId ?? nextId) - 1]}`
  const confetti = useConfetti();
  
  return (
    <Box bg={bgTheme} shadow={`0 0 0 1.5em ${shadowColor}`} roundedBottom="10vw" >
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
          <Tooltip hasArrow isDisabled={!dynamicNextId && !nextId} label={nextLabel}>
            <SfxIconButton
              layerStyle="pushy"
              bg={bgTheme}
              _hover={{ bg: 'white' }}
              aria-label={nextLabel}
              colorScheme="gray"
              icon={<ArrowRight1Linear color="currentColor" size="35%" />}
              isDisabled={!dynamicNextId && !nextId}
              onClick={next}
            />
          </Tooltip>
        </Flex>
      </Flex>
    </Box>
  )
}

LearnAlphabet.getLayout = (page: ReactElement) =>
  getLayout(page, { back: ROUTES.learn, bg: 'brand.400' })

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = alphabets.map((alphabet) => ({
    params: {
      id: alphabet.numeral.toString(), // Use numeral instead of name
    },
  }))

  return { paths, fallback: false }
}

export const getStaticProps = async ({ params }: GetStaticPropsContext<{ id: string }>) => {
  let prevId = ''
  let nextId = ''

  const alphabet = alphabets.find((_alphabet, i, self) => {
    const match = _alphabet.numeral.toString() === params?.id
    if (match) {
      self.forEach((a) => {
        if (a.numeral === _alphabet.numeral - 1) {
          prevId = a.numeral.toString()
        }
        if (a.numeral === _alphabet.numeral + 1) {
          nextId = a.numeral.toString()
        }
      })
    }
    return match
  })

  return { props: { alphabet, prevId, nextId } }
}
