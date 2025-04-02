import NextImage from 'next/image'
import type { PropsWithChildren } from 'react'
import { useRouter } from 'next/router'
import type { Variants } from 'framer-motion'
import type { ListProps, ListItemProps, AspectRatioProps } from '@chakra-ui/react'
import type { PlayFunction } from 'use-sound/dist/types'
import { useState, useCallback, useRef, useImperativeHandle, forwardRef } from 'react'
import {useEffect } from "react";
import { AnimatePresence, motion } from 'framer-motion'
import { Box, Heading, List, ListItem, AspectRatio, Fade } from '@chakra-ui/react'
import { MotionBox } from '~components/motion'
import { SfxLink } from '~components/sfx'
import { usePhonics } from '~src/hooks/usePhonics'
import { useSession } from 'next-auth/react';
import { Star } from 'lucide-react'
import { AlphabetModal } from '~components/learn/AlphabetModal'
import { alphabets } from '~src/data/alphabets'

type AlphabetType = (typeof alphabets)[number]
type GlyphType = string

const MotionList = motion<ListProps>(List)
const MotionListItem = motion<ListItemProps>(ListItem)
const MotionAspectRatio = motion<AspectRatioProps>(AspectRatio)

interface SoundRef {
  play: PlayFunction
}

interface SoundRegisterProps {
  glyph: GlyphType
}

// Helper function to map a glyph to its corresponding sound file based on its index
const getSoundFile = (glyph: GlyphType): string => {
  const index = alphabets.findIndex((alphabet) => alphabet.name === glyph) + 1
  return `/sounds/alphabets/${index}.mp3`
}

const SoundRegister = forwardRef<SoundRef, PropsWithChildren<SoundRegisterProps>>(
  ({ children, glyph }, ref) => {
    const soundFile = getSoundFile(glyph) // Dynamically determine the correct sound file
    const [play] = usePhonics(soundFile)

    useImperativeHandle(
      ref,
      () => ({
        play,
      }),
      [play]
    )

    return <>{children}</>
  }
)

SoundRegister.displayName = 'SoundRegister'

const list: Variants = {
  in: {
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
  out: {},
}

const item: Variants = {
  in: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35 },
  },
  out: {
    opacity: 0,
    scale: 0.4,
    transition: { duration: 0.3 },
  },
}

type AlphabetSounds = Record<GlyphType, SoundRef>
interface AlphabetGridProps {
  show: boolean
}


// Partial Star component
const PartialStar = ({ fillPercentage }: { fillPercentage: number }) => {
  return (
    <div style={{ position: 'relative', width: '40px', height: '40px' }}>
      {/* Background star (unfilled) */}
      <Star
        size={40}
        style={{
          position: 'absolute',
          stroke: '#D1D5DB',
          fill: 'none',
        }}
      />
      {/* Foreground star (filled) with clip path */}
      <div
        style={{
          position: 'absolute',
          width: `${fillPercentage * 100}%`,
          height: '100%',
          overflow: 'hidden',
        }}
      >
        <Star
          size={40}
          style={{
            stroke: '#FBBF24',
            fill: '#FBBF24',
          }}
        />
      </div>
    </div>
  )
}

// Stars component with partial fill support
const Stars = ({ fillLevel = 0 }: { fillLevel?: number }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        gap: '4px',
        pointerEvents: 'none',
        zIndex: 10,
      }}
    >
      {[1, 2, 3].map((starIndex) => {
        const remainingFill = fillLevel - (starIndex - 1)
        const fillPercentage = Math.min(Math.max(remainingFill, 0), 1)
        return <PartialStar key={starIndex} fillPercentage={fillPercentage} />
      })}
    </div>
  )
}

interface Alphabet {
  name: string
  numeral: number
  fillLevel?: number
  color: string
  bg: string
  modalBg: string
}

export function AlphabetGrid({ show }: AlphabetGridProps) {
  const [selected, setSelected] = useState<AlphabetType | null>(null)
  const { data: session } = useSession();
  const [allScores, setAllScores] = useState<number[]>([]);
  const alphabetSoundsRef = useRef<Partial<AlphabetSounds>>({})
  const router = useRouter()
  const currentPath = router.pathname // Get the current
  let title = currentPath.startsWith('/learn')
    ? 'Learn'
    : currentPath.startsWith('/practice')
    ? 'Practice'
    : '/learn' // Default to /learn if neither matches

  const getRef = useCallback(
    (alphabet: GlyphType) => (elm: SoundRef) => {
      alphabetSoundsRef.current[alphabet] = elm
    },
    []
  )

  const handlePlay = useCallback(() => {
    if (selected) {
      alphabetSoundsRef.current[selected.name]?.play()
    }
  }, [selected])

  const handleClose = useCallback(() => {
    setSelected(null)
  }, [])

  const select = useCallback(
    (alphabet: Alphabet) => () => {
      setSelected(alphabet as AlphabetType)
    },
    []
  )

  useEffect(() => {
    if (!session?.user?.email) return;
  
    async function fetchAllScores() {
      const email = session?.user?.email;
      
      try {
        const res = await fetch(`/api/getBestScore?email=${email}`);
        const data = await res.json();
  
        console.log("Data fetched from API:", data);  // Debugging line
  
        if (res.ok && data.scores) {
          const scores = Array.from({ length: 49 }, (_, i) => {
            const scoreData = data.scores[`letter_score_${i + 1}`] || { correct: 0, attempted: 0 };
            const { correct, attempted } = scoreData;
            const calculatedScore = attempted > 0 ? ((correct * 3) / attempted) : 0;
            return calculatedScore;
          });
  
          console.log("Calculated Scores:", scores);  // Print the calculated scores
  
          setAllScores(scores);
        } else {
          console.error("Error fetching scores:", data.error || "Unknown error");
          setAllScores(Array(49).fill(0));
        }
      } catch (error) {
        console.error('Error fetching all scores:', error);
        setAllScores(Array(49).fill(0));
      }
    }
  
    fetchAllScores();
  }, [session]);
  
  
  
  const firstHalfAlphabets = alphabets.length > 0 ? alphabets.slice(0, 15) : []
  const secondHalfAlphabets = alphabets.length > 15 ? alphabets.slice(15, 40) : []
  const thirdHalfAlphabets = alphabets.length > 40 ? alphabets.slice(40, 49) : []

  const firstHalfAlphabetsScores = allScores.slice(0, 15);
  const secondHalfAlphabetsScores = allScores.slice(15, 40);
  const thirdHalfAlphabetsScores = allScores.slice(40, 49);

  return (
    <>
      <AnimatePresence initial={false}>
        <Box
          layerStyle="page"
          pos="relative"
          zIndex={1}
          w="full"
          pt={[32, 24]}
          visibility={show ? 'visible' : 'hidden'}
        >
          <Fade transition={{ enter: { duration: 0.6 } }} in={show}>
            <Heading color="text.inverse" textAlign="center">
              <Box
                as="span"
                display={['block', 'inline']}
                p={[null, 1]}
                color="text.highlight"
                fontSize="3xl"
              >
                Progress
              </Box>{' '}
            </Heading>
          </Fade>

          <Fade transition={{ enter: { duration: 0.6 } }} in={show}>
            <Heading color="text.inverse" textAlign="center">
              <Box
                as="span"
                display={['block', 'inline']}
                p={[null, 1]}
                color="text.highlight"
                fontSize="3xl"
              ></Box>{' '}
              ಸ್ವರಗಳು
            </Heading>
          </Fade>
          <MotionList
            layerStyle="gridy"
            pt={16}
            variants={list}
            initial="out"
            animate={show ? 'in' : 'out'}
          >
            {firstHalfAlphabets.map((alphabet: Alphabet,index) => {
              const score=firstHalfAlphabetsScores[index]
              const { name, numeral, fillLevel = score} = alphabet
              return (
                <MotionListItem key={name} variants={item}>
                  <MotionBox
                    whileHover={{
                      scale: 1.1,
                      transition: { type: 'spring', stiffness: 200 },
                    }}
                    position="relative"
                  >
                    {/* Stars overlay */}
                    <Stars fillLevel={fillLevel} />

                    <SoundRegister ref={getRef(name)} glyph={name}>
                      <SfxLink
                        as="button"
                        type="button"
                        display="flex"
                        position="relative"
                        justifyContent="center"
                        bg="white"
                        boxSize="full"
                        rounded="10%"
                        p="10%"
                        boxShadow="sm"
                        layerStyle="pushy"
                        _hover={{ boxShadow: 'xl' }}
                        appearance="none"
                        onClick={select(alphabet)}
                      >
                        <MotionAspectRatio
                          layoutId={`learn-${name}`}
                          as="span"
                          display="block"
                          w="full"
                          ratio={1}
                        >
                          <NextImage
                            src={`/img/glyphs/${numeral}.svg`}
                            alt={`Animal letter ${numeral}`}
                            width={200}
                            height={200}
                            style={{ objectFit: 'contain' }}
                            priority
                          />
                        </MotionAspectRatio>
                      </SfxLink>
                    </SoundRegister>
                  </MotionBox>
                </MotionListItem>
              )
            })}
          </MotionList>

          <Fade transition={{ enter: { duration: 0.6 } }} in={show}>
            <Heading color="text.inverse" textAlign="center">
              <Box
                as="span"
                display={['block', 'inline']}
                p={[null, 1]}
                color="text.highlight"
                fontSize="3xl"
              ></Box>{' '}
              ವ್ಯಂಜನಗಳು
            </Heading>
          </Fade>

          <MotionList
            layerStyle="gridy"
            gridTemplateColumns="repeat(5, 1fr)"
            gap={4}
            pt={16}
            variants={list}
            initial="out"
            animate={show ? 'in' : 'out'}
          >
            {secondHalfAlphabets.map((alphabet:Alphabet,index) => {
              const score=secondHalfAlphabetsScores[index]
              const { name, numeral, fillLevel = score } = alphabet
              return (
                <MotionListItem key={name} variants={item}>
                  {/* Extra wrapper because of https://github.com/framer/motion/issues/1197 */}
                  <MotionBox
                    whileHover={{
                      scale: 1.1,
                      transition: { type: 'spring', stiffness: 200 },
                    }}
                    position="relative"
                  >
                    {/* Stars overlay */}
                    <Stars fillLevel={fillLevel} />
                    <SoundRegister ref={getRef(name)} glyph={name}>
                      <SfxLink
                        as="button"
                        type="button"
                        display="flex"
                        position="relative"
                        justifyContent="center"
                        bg="white"
                        boxSize="full"
                        rounded="10%"
                        p="10%"
                        boxShadow="sm"
                        layerStyle="pushy"
                        _hover={{ boxShadow: 'xl' }}
                        appearance="none"
                        onClick={select(alphabet)}
                      >
                        <MotionAspectRatio
                          layoutId={`learn-${name}`}
                          as="span"
                          display="block"
                          w="full"
                          ratio={1}
                        >
                          <NextImage
                            src={`/img/glyphs/${alphabet.numeral}.svg`}
                            alt={`Animal letter ${alphabet.numeral}`}
                            width={200} // Set desired width
                            height={200} // Set desired height
                            style={{ objectFit: 'contain' }} // Ensures no cropping
                            priority
                          />
                        </MotionAspectRatio>
                      </SfxLink>
                    </SoundRegister>
                  </MotionBox>
                </MotionListItem>
              )
            })}
          </MotionList>
          <Fade transition={{ enter: { duration: 0.6 } }} in={show}>
            <Heading color="text.inverse" textAlign="center">
              <Box
                as="span"
                display={['block', 'inline']}
                p={[null, 1]}
                color="text.highlight"
                fontSize="3xl"
              ></Box>{' '}
            </Heading>
          </Fade>

          <MotionList
            layerStyle="gridy"
            pt={16}
            variants={list}
            initial="out"
            animate={show ? 'in' : 'out'}
          >
            {thirdHalfAlphabets.map((alphabet:Alphabet,index) => {
              const score=thirdHalfAlphabetsScores[index]
              const { name, numeral, fillLevel = score } = alphabet
              return (
                <MotionListItem key={name} variants={item}>
                  {/* Extra wrapper because of https://github.com/framer/motion/issues/1197 */}
                  <MotionBox
                    whileHover={{
                      scale: 1.1,
                      transition: { type: 'spring', stiffness: 200 },
                    }}
                    position="relative"
                  >
                    <Stars fillLevel={fillLevel} />
                    <SoundRegister ref={getRef(name)} glyph={name}>
                      <SfxLink
                        as="button"
                        type="button"
                        display="flex"
                        position="relative"
                        justifyContent="center"
                        bg="white"
                        boxSize="full"
                        rounded="10%"
                        p="10%"
                        boxShadow="sm"
                        layerStyle="pushy"
                        _hover={{ boxShadow: 'xl' }}
                        appearance="none"
                        onClick={select(alphabet)}
                      >
                        <MotionAspectRatio
                          layoutId={`learn-${name}`}
                          as="span"
                          display="block"
                          w="full"
                          ratio={1}
                        >
                          <NextImage
                            src={`/img/glyphs/${alphabet.numeral}.svg`}
                            alt={`Animal letter ${alphabet.numeral}`}
                            width={200} // Set desired width
                            height={200} // Set desired height
                            style={{ objectFit: 'contain' }} // Ensures no cropping
                            priority
                          />
                        </MotionAspectRatio>
                      </SfxLink>
                    </SoundRegister>
                  </MotionBox>
                </MotionListItem>
              )
            })}
          </MotionList>
        </Box>
      </AnimatePresence>
      <AlphabetModal selected={selected} onClose={handleClose} playSound={handlePlay} />
    </>
  )
}
