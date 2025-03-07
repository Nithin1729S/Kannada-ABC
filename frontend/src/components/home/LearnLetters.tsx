import type { PropsWithChildren, KeyboardEvent } from 'react'
import { useState, useEffect, useCallback, useRef, useImperativeHandle, forwardRef } from 'react'
import { Box, Flex, Center, Text, useToken } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import type { Alphabet, GlyphType } from '~types/data'
import type { PlayFunction } from 'use-sound/dist/types'
import { useGeneralSfx } from '~src/context/sfx'
import { usePhonics } from '~src/hooks/usePhonics'
import { shuffle } from '~src/utils'

const colorList = [
  'purple.100',
  'red.100',
  'cyan.100',
  'orange.100',
  'yellow.100',
  'teal.100',
  'pink.100',
  'green.100',
  'blue.100',
]

interface LearnLettersProps<T extends GlyphType[]> {
  letters: T
}

interface LetterProps {
  glyph: Alphabet
  color: string
  soundFile: string
}

interface LetterRef {
  play: PlayFunction
}

type PlayLettersRef<T extends GlyphType[]> = {
  [K in T[number]['name']]?: LetterRef
}

// Function to get the corresponding sound file based on letter index
const getSoundFile = (glyph: Alphabet, letters: Alphabet[]) => {
  const index = letters.indexOf(glyph) + 1 // Convert to 1-based index
  return `/sounds/alphabets/${index}.mp3`
}

const Letter = forwardRef<LetterRef, PropsWithChildren<LetterProps>>(
  ({ children, glyph, color, soundFile }, ref) => {
    const { playHover } = useGeneralSfx()
    const [play] = usePhonics(soundFile)

    const handleClick = useCallback(() => {
      play()
    }, [play])

    useImperativeHandle(ref, () => ({ play }), [play])

    return (
      <Text
        as="button"
        sx={{
          WebkitTextStrokeWidth: '0.1rem',
          WebkitTextStrokeColor: color,
        }}
        align="center"
        display="flex"
        px="0.2em"
        py="0.1em"
        color="transparent"
        lineHeight="none"
        _hover={{
          color,
          transform: 'scale(1.5)',
        }}
        _active={{
          transform: 'scale(1)',
        }}
        appearance="none"
        transition="transform 0.2s, color 0.2s"
        onClick={handleClick}
        onMouseEnter={playHover}
        type="button"
      >
        {children}
      </Text>
    )
  }
)

Letter.displayName = 'Letter'

export function LearnLetters<T extends GlyphType[]>({ letters }: LearnLettersProps<T>) {
  const playLettersRef = useRef<PlayLettersRef<T>>({})
  const [colors, setColors] = useState(useToken('colors', colorList))
  // Precompute an array of alphabet names from letters
  const letterNames = letters.map(letter => letter.name as Alphabet)

  const getRef = useCallback(
    (glyph: Alphabet) => (elm: LetterRef) => {
      playLettersRef.current[glyph as keyof PlayLettersRef<T>] = elm
    },
    []
  )

  const handleKeyDown = useCallback(({ key }: KeyboardEvent<HTMLDivElement>) => {
    const letterRef = playLettersRef.current[key.toUpperCase() as keyof PlayLettersRef<T>]
    letterRef?.play()
  }, [])

  useEffect(() => {
    setColors((colors) => shuffle(colors))
  }, [])

  return (
    <Flex
      flex="0 0 100%"
      _focusVisible={{ outline: 'none' }}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Center
        as="ul"
        flexWrap="wrap"
        gap={0.5}
        maxW={36}
        m="auto"
        px={['10%', null, '15%']}
        fontFamily="glyph"
        fontSize="min(max(3.5rem, 10vmax), 280px)"
        whiteSpace="nowrap"
        listStyleType="none"
      >
        {letters.map(({ name, type, ...emojiColor }, i) => {
          const isEmoji = type === 'emoji'
          const len = colors.length
          const randomColor = colors[((i % len) + len) % len]
          return (
            <Box key={name} as="li" aria-hidden={isEmoji ? 'true' : undefined}>
              {isEmoji && (
                <motion.div
                  whileInView={{
                    y: [0, 10, -10, 0],
                    rotate: [0, 1 + 0.1 * i, -2, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 3.75 + 0.15 * i, delay: 0.05 * i }}
                >
                  <Text
                    as="span"
                    display="flex"
                    px={2}
                    py="0.125em"
                    fontSize="0.5em"
                    bg={'color' in emojiColor ? emojiColor.color : undefined}
                    rounded="full"
                  >
                    {name}
                  </Text>
                </motion.div>
              )}
              {!isEmoji && (
                <Letter
                  ref={getRef(name as Alphabet)}
                  color={randomColor}
                  glyph={name as Alphabet}
                  soundFile={getSoundFile(name as Alphabet, letterNames)}
                >
                  {name}
                </Letter>
              )}
            </Box>
          )
        })}
      </Center>
    </Flex>
  )
}
