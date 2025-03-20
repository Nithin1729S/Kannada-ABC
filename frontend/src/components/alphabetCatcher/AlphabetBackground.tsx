"use client";

import React, { useEffect, useState } from 'react';
import { Box, Heading, Fade } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import AlphabetCatcher from './alphabetCatcher';

export function AlphabetBackground() {
  const allLetters: string[] = [
    'ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ', 'ಐ', 'ಒ', 'ಓ', 'ಔ', 'ಅಂ', 'ಅಃ',
    'ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ',
    'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ',
    'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ',
    'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ',
    'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ',
    'ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ', 'ಷ', 'ಸ', 'ಹ', 'ಳ',
  ];

  // Helper function to pick random letters excluding the provided one
  function getRandomOtherLetters(letters: string[], count: number, exclude: string): string[] {
    const filtered: string[] = letters.filter(letter => letter !== exclude);
    const shuffled: string[] = filtered.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  // State to store the target letter and letters array.
  const [targetLetter, setTargetLetter] = useState<string>('');
  const [lettersToPass, setLettersToPass] = useState<string[]>([]);

  // Generate the random letters only on the client after the component mounts.
  useEffect(() => {
    const randomTarget = allLetters[Math.floor(Math.random() * allLetters.length)];
    const randomOtherLetters = getRandomOtherLetters(allLetters, 5, randomTarget);
    setTargetLetter(randomTarget);
    setLettersToPass([...Array(5).fill(randomTarget), ...randomOtherLetters]);
  }, []);

  // Don't render BubbleGame until targetLetter is set.
  if (!targetLetter) return null;

  return (
    <AnimatePresence initial={false}>
      <Box
        layerStyle="page"
        pos="relative"
        zIndex={1}
        w="full"
        pt={[720, 100]}
        opacity={1}
      >
        <AlphabetCatcher targetLetter={targetLetter} otherLetters={lettersToPass}  />
      </Box>
    </AnimatePresence>
  );
}
