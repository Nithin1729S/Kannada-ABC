"use client";

import React, { useEffect, useState } from 'react';
import { Box, Heading, Fade } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import Tictactoe from './Tictactoe';
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

  // Helper function to pick random letters
  function pickRandomLetter(letters: string[]): string {
    return letters[Math.floor(Math.random() * letters.length)];
  }

  const [playerSymbol, setPlayerSymbol] = useState<string>('');
  const [computerSymbol, setComputerSymbol] = useState<string>('');

  // Function to choose new letters
  const chooseNewLetters = () => {
    setPlayerSymbol(pickRandomLetter(allLetters));
    setComputerSymbol(pickRandomLetter(allLetters));
  };

  // Initially choose letters once when component mounts.
  useEffect(() => {
    chooseNewLetters();
  }, []);

  // Don’t render TicTacToe until the symbols are chosen.
  if (!playerSymbol) return null;

  return (
    <AnimatePresence initial={false}>
      <Box
        pos="relative"
        zIndex={1}
        w="full"
        pt={[720, 40]}
        opacity={1}
      >
        <Tictactoe
          playerSymbol={playerSymbol}
          computerSymbol={computerSymbol}
          onPlayAgain={chooseNewLetters} // Pass callback here
        />
      </Box>
    </AnimatePresence>
  );
}