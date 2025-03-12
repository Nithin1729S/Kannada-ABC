import { useRouter } from 'next/router';
import CanvasDrawing from './CanvasDrawing';

type KannadaLetter = {
  numeral: number;
  name: string;
};

export const alphabets: KannadaLetter[] = [
  { numeral: 1, name: 'ಅ' }, { numeral: 2, name: 'ಆ' }, { numeral: 3, name: 'ಇ' },
  { numeral: 4, name: 'ಈ' }, { numeral: 5, name: 'ಉ' }, { numeral: 6, name: 'ಊ' },
  { numeral: 7, name: 'ಋ' }, { numeral: 8, name: 'ಎ' }, { numeral: 9, name: 'ಏ' },
  { numeral: 10, name: 'ಐ' }, { numeral: 11, name: 'ಒ' }, { numeral: 12, name: 'ಓ' },
  { numeral: 13, name: 'ಔ' }, { numeral: 14, name: 'ಅಂ' }, { numeral: 15, name: 'ಅಃ' },
  { numeral: 16, name: 'ಕ' }, { numeral: 17, name: 'ಖ' }, { numeral: 18, name: 'ಗ' },
  { numeral: 19, name: 'ಘ' }, { numeral: 20, name: 'ಙ' }, { numeral: 21, name: 'ಚ' },
  { numeral: 22, name: 'ಛ' }, { numeral: 23, name: 'ಜ' }, { numeral: 24, name: 'ಝ' },
  { numeral: 25, name: 'ಞ' }, { numeral: 26, name: 'ಟ' }, { numeral: 27, name: 'ಠ' },
  { numeral: 28, name: 'ಡ' }, { numeral: 29, name: 'ಢ' }, { numeral: 30, name: 'ಣ' },
  { numeral: 31, name: 'ತ' }, { numeral: 32, name: 'ಥ' }, { numeral: 33, name: 'ದ' },
  { numeral: 34, name: 'ಧ' }, { numeral: 35, name: 'ನ' }, { numeral: 36, name: 'ಪ' },
  { numeral: 37, name: 'ಫ' }, { numeral: 38, name: 'ಬ' }, { numeral: 39, name: 'ಭ' },
  { numeral: 40, name: 'ಮ' }, { numeral: 41, name: 'ಯ' }, { numeral: 42, name: 'ರ' },
  { numeral: 43, name: 'ಲ' }, { numeral: 44, name: 'ವ' }, { numeral: 45, name: 'ಶ' },
  { numeral: 46, name: 'ಷ' }, { numeral: 47, name: 'ಸ' }, { numeral: 48, name: 'ಹ' },
  { numeral: 49, name: 'ಳ' }
];

export const AlphabetAnimals = () => {
  const router = useRouter();
  const numeral = Number(router.query.id); // Convert query param to number
  const letterData = alphabets.find(item => item.numeral === numeral);
  return (
    <div style={{ textAlign: 'center', background: '', padding: '20px', borderRadius: '10px' }}>
        <CanvasDrawing letterData={letterData?.numeral ?? 0} />
    </div>
  );
};