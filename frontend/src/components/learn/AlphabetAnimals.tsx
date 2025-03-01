import { Box, Flex, Center, Heading, Tooltip } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
const letterComponents: Record<string, React.ComponentType> = {
  1: dynamic(() => import('~/src/components/letters/A')),
  2: dynamic(() => import('~/src/components/letters/B')),
  3: dynamic(() => import('~/src/components/letters/C')),
  4: dynamic(() => import('~/src/components/letters/S')),
  // Add other letters as needed...
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
      <Box pos="relative" textAlign="center" bg="white" rounded={{ base: '5em', xl: '5vw' }}>
        <LetterComponent />
      </Box>
    </Flex>
  )
}
