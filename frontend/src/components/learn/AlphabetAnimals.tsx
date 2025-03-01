import { Box, Flex, Center, Heading, Tooltip } from '@chakra-ui/react'
import Star from '~/src/components/letters/S'

interface AlphabetAnimalsProps {
  bg?: string
}

export const AlphabetAnimals = ({ bg }: AlphabetAnimalsProps) => {
  return (
    <>
      <Flex direction="column" gap={{ base: 28, '2xl': '4vw' }} w="full" px={[4, '5%', '10%']}>
        <Box pos="relative" textAlign="center" bg="white" rounded={{ base: '5em', xl: '5vw' }}>
          <Star />
        </Box>
      </Flex>
    </>
  )
}
