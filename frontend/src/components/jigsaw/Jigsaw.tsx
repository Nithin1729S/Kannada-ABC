import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useConfetti } from '../ui/confetti-trigger';

let globalRandomNumber = Math.floor(Math.random() * 49) + 1;

interface PuzzlePieceProps {
  piece: number;
  position: number;
  onDrop: (fromPos: number, toPos: number) => void;
  size: number;
  boardSize: number;
  puzzleImage: string;
}

function PuzzlePiece({ piece, position, onDrop, size, boardSize, puzzleImage }: PuzzlePieceProps) {
  const ref = React.useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'piece',
    item: { fromPosition: position },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [position]);

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'piece',
    drop: (item: { fromPosition: number }) => {
      if (item.fromPosition !== position) {
        onDrop(item.fromPosition, position);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }), [position, onDrop]);

  drag(drop(ref));

  const pieceSize = boardSize / size;
  const pieceStyle = {
    backgroundImage: `url(${puzzleImage})`,
    backgroundSize: `${boardSize}px ${boardSize}px`,
    backgroundPosition: `-${(piece % size) * pieceSize}px -${Math.floor(piece / size) * pieceSize}px`,
    width: '100%',
    height: '100%',
  };

  const animatedDivStyle: React.CSSProperties = {
    ...pieceStyle,
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: isDragging ? 0.5 : 1,
    filter: isOver ? 'brightness(1.1)' : 'none',
  };

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: `${pieceSize}px`,
        height: `${pieceSize}px`,
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <motion.div
        style={animatedDivStyle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Optional piece label */}
        </div>
      </motion.div>
    </div>
  );
}

function shuffleArray(array: number[]) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function isSolvable(puzzle: number[], size: number): boolean {
  let inversions = 0;
  for (let i = 0; i < puzzle.length - 1; i++) {
    for (let j = i + 1; j < puzzle.length; j++) {
      if (puzzle[i] > puzzle[j]) {
        inversions++;
      }
    }
  }
  return inversions % 2 === 0;
}

interface PuzzleGameProps {
  onSuccess?: () => void;
}

export default function PuzzleGame({ onSuccess }: PuzzleGameProps) {
  const [pieces, setPieces] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [boardSize, setBoardSize] = useState(600);
  const [buttonHover, setButtonHover] = useState(false);
  const [puzzleImage, setPuzzleImage] = useState<string>('');
  const size = 2;
  const boardRef = React.useRef<HTMLDivElement>(null);
  const confetti = useConfetti();

  // Update board size based on container width
  useEffect(() => {
    const updateBoardSize = () => {
      if (boardRef.current) {
        setBoardSize(boardRef.current.clientWidth);
      }
    };
    updateBoardSize();
    window.addEventListener('resize', updateBoardSize);
    return () => window.removeEventListener('resize', updateBoardSize);
  }, []);

  useEffect(() => {
    if (isComplete) {
      confetti.trigger('default');
    }
  }, [isComplete]);

  // Function to initialize the puzzle pieces and update the puzzle image
  const initPuzzle = () => {
    // Generate a new random number between 1 and 49
    const randomNumber = Math.floor(Math.random() * 49) + 1;
    globalRandomNumber=randomNumber;
    // Set the new puzzle image using the random number
    setPuzzleImage(`/img/glyphs/${randomNumber}.png`);

    let shuffledPieces;
    do {
      shuffledPieces = shuffleArray(Array.from({ length: size * size }, (_, i) => i));
    } while (!isSolvable(shuffledPieces, size));
    setPieces(shuffledPieces);
    setIsComplete(false);
  };

  // Initialize puzzle on component mount
  useEffect(() => {
    initPuzzle();
  }, []);

  const handleDrop = (fromPos: number, toPos: number) => {
    setPieces((prev) => {
      const newPieces = [...prev];
      [newPieces[fromPos], newPieces[toPos]] = [newPieces[toPos], newPieces[fromPos]];

      const isSolved = newPieces.every((p, i) => p === i);
      if (isSolved) {
        setTimeout(() => {
          setIsComplete(true);
          onSuccess?.();
        }, 500);
      }

      return newPieces;
    });
  };

  const letters = [
    'ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ', 'ಐ',
    'ಒ', 'ಓ', 'ಔ', 'ಅಂ', 'ಅಃ', 'ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ',
    'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ', 'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ',
    'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ', 'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ',
    'ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ', 'ಷ', 'ಸ', 'ಹ', 'ಳ'
  ];
  

  return (
    <DndProvider backend={HTML5Backend}>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
            marginBottom:'5rem'
          }}
        >
          {!isComplete ? (
            <>
              <div
                ref={boardRef}
                style={{
                  width: '90vw',
                  maxWidth: '600px',
                  aspectRatio: '1 / 1',
                  display: 'grid',
                  gridTemplateColumns: `repeat(${size}, 1fr)`,
                  padding: '1px',
                  borderRadius: '4px',
                }}
              >
                {pieces.map((piece, index) => (
                  <PuzzlePiece
                    key={index}
                    piece={piece}
                    position={index}
                    onDrop={handleDrop}
                    size={size}
                    boardSize={boardSize}
                    puzzleImage={puzzleImage}
                  />
                ))}
              </div>
            </>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ textAlign: 'center' }}
            >
              <h2
                style={{
                  fontSize: '1.875rem',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: '1rem',
                }}
              >
                {`Puzzle Solved! It's ${letters[globalRandomNumber-1]}!`}
              </h2>
              <button
                onClick={initPuzzle}
                onMouseEnter={() => setButtonHover(true)}
                onMouseLeave={() => setButtonHover(false)}
                style={{
                  padding: '0.5rem 1.5rem',
                  backgroundColor: buttonHover ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                }}
              >
                Play Again
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </DndProvider>
  );
}
