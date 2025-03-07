import type { ChakraColorScheme } from '~types/theme'

export type Alphabet =
  | 'ಅ' | 'ಆ' | 'ಇ' | 'ಈ' | 'ಉ' | 'ಊ' | 'ಋ' | 'ಎ' | 'ಏ' | 'ಐ'
  | 'ಒ' | 'ಓ' | 'ಔ' | 'ಅಂ' | 'ಅಃ' | 'ಕ' | 'ಖ' | 'ಗ' | 'ಘ' | 'ಙ' | 'ಚ' | 'ಛ'
  | 'ಜ' | 'ಝ' | 'ಞ' | 'ಟ' | 'ಠ' | 'ಡ' | 'ಢ' | 'ಣ' | 'ತ' | 'ಥ'
  | 'ದ' | 'ಧ' | 'ನ' | 'ಪ' | 'ಫ' | 'ಬ' | 'ಭ' | 'ಮ' | 'ಯ' | 'ರ'
  | 'ಲ' | 'ವ' | 'ಶ' | 'ಷ' | 'ಸ' | 'ಹ' | 'ಳ' 


type LetterGlyph = {
  name: Alphabet
  type: 'letter'
}

type EmojiGlyph = {
  name: string
  type: 'emoji'
  color: string
}

export type GlyphType = EmojiGlyph | LetterGlyph

export type WikiType = {
  animal: string
  wiki: string
  img: string
  imgRatio: number
  colorScheme: ChakraColorScheme
  tintBg?: boolean
}

export type AlphabetType = {
  numeral: number
  name: Alphabet
  color: string
  bg: ChakraColorScheme
  modalBg: string
}
