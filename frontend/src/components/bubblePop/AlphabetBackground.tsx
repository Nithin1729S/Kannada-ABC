import { Box, Heading, Fade } from '@chakra-ui/react'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import BubbleGame from './bubbleGame';

export function AlphabetBackground() {
  const router = useRouter();
  const currentPath = router.pathname;
  
  let title = currentPath.startsWith('/learn') ? "Learn" : 
              currentPath.startsWith('/practice') ? "Practice" : 
              "Learn"; // Default to "Learn"

  return (
    <AnimatePresence initial={false}>
      <Box
        layerStyle="page"
        pos="relative"
        zIndex={1}
        w="full"
        pt={[720, 580]}
        opacity={1} 
      >
        <BubbleGame 
      targetLetter="ಅ"
      letters={[
        'ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ', 'ಐ', 'ಒ', 'ಓ', 'ಔ', 'ಅಂ', 'ಅಃ',
        'ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ',
        'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ',
        'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ',
        'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ',
        'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ',
        'ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ', 'ಷ', 'ಸ', 'ಹ', 'ಳ',
      ]}
      
    />
        
      </Box>
    </AnimatePresence>
  );
}
