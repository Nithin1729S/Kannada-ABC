import { Box, Flex, Center, Heading, Tooltip } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
const letterComponents: Record<string, React.ComponentType> = {
  1: dynamic(() => import('~/src/components/letters/1')),
  2: dynamic(() => import('~/src/components/letters/2')),
  3: dynamic(() => import('~/src/components/letters/3')),
  4: dynamic(() => import('~/src/components/letters/4')),
  5: dynamic(() => import('~/src/components/letters/5')),
  6: dynamic(() => import('~/src/components/letters/6')),
  7: dynamic(() => import('~/src/components/letters/7')),
  8: dynamic(() => import('~/src/components/letters/8')),
  9: dynamic(() => import('~/src/components/letters/9')),
  10: dynamic(() => import('~/src/components/letters/10')),
  11: dynamic(() => import('~/src/components/letters/11')),
  12: dynamic(() => import('~/src/components/letters/12')),
  13: dynamic(() => import('~/src/components/letters/13')),
  14: dynamic(() => import('~/src/components/letters/14')),
  15: dynamic(() => import('~/src/components/letters/15')),
  16: dynamic(() => import('~/src/components/letters/16')),
  17: dynamic(() => import('~/src/components/letters/17')),
  18: dynamic(() => import('~/src/components/letters/18')),
  19: dynamic(() => import('~/src/components/letters/19')),
  20: dynamic(() => import('~/src/components/letters/20')),
  21: dynamic(() => import('~/src/components/letters/21')),
  22: dynamic(() => import('~/src/components/letters/22')),
  23: dynamic(() => import('~/src/components/letters/23')),
  24: dynamic(() => import('~/src/components/letters/24')),
  25: dynamic(() => import('~/src/components/letters/25')),
  26: dynamic(() => import('~/src/components/letters/26')),
  27: dynamic(() => import('~/src/components/letters/27')),
  28: dynamic(() => import('~/src/components/letters/28')),
  29: dynamic(() => import('~/src/components/letters/29')),
  30: dynamic(() => import('~/src/components/letters/30')),
  31: dynamic(() => import('~/src/components/letters/31')),
  32: dynamic(() => import('~/src/components/letters/32')),
  33: dynamic(() => import('~/src/components/letters/33')),
  34: dynamic(() => import('~/src/components/letters/34')),
  35: dynamic(() => import('~/src/components/letters/35')),
  36: dynamic(() => import('~/src/components/letters/36')),
  37: dynamic(() => import('~/src/components/letters/37')),
  38: dynamic(() => import('~/src/components/letters/38')),
  39: dynamic(() => import('~/src/components/letters/39')),
  40: dynamic(() => import('~/src/components/letters/40')),
  41: dynamic(() => import('~/src/components/letters/41')),
  42: dynamic(() => import('~/src/components/letters/42')),
  43: dynamic(() => import('~/src/components/letters/43')),
  44: dynamic(() => import('~/src/components/letters/44')),
  45: dynamic(() => import('~/src/components/letters/45')),
  46: dynamic(() => import('~/src/components/letters/46')),
  47: dynamic(() => import('~/src/components/letters/47')),
  48: dynamic(() => import('~/src/components/letters/48')),
  49: dynamic(() => import('~/src/components/letters/49')),
}
interface AlphabetAnimalsProps {
  bg?: string
}

export const AlphabetAnimals = ({ bg }: AlphabetAnimalsProps) => {
  const router = useRouter()
  const letter = router.query.id as string // Get letter from URL (e.g., "a", "s")

  // Find the component, default to a placeholder if not found
  const LetterComponent = letterComponents[letter.toUpperCase()] || (() => <p>Letter Not Found</p>)

  return (
    <Flex direction="column" gap={{ base: 28, '2xl': '4vw' }} w="full" px={[4, '5%', '10%']}>
      <Box pos="relative" textAlign="center" bg="" rounded={{ base: '5em', xl: '5vw' }}>
        <LetterComponent />
      </Box>
    </Flex>
  )
}
