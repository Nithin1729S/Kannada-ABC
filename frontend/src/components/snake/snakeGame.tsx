"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Skull } from 'lucide-react';
import { useSession } from 'next-auth/react';

type Position = {
  x: number;
  y: number;
};

const styles = `
  @keyframes glow {
    0% {
      text-shadow: 0 0 5px #faf089, 0 0 10px #faf089, 0 0 15px #faf089;
    }
    50% {
      text-shadow: 0 0 10px #faf089, 0 0 20px #faf089, 0 0 30px #faf089;
    }
    100% {
      text-shadow: 0 0 5px #faf089, 0 0 10px #faf089, 0 0 15px #faf089;
    }
  }
  .glowing {
    animation: glow 1.5s ease-in-out infinite;
  }
`;

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

type Letter = {
  char: string;
  position: Position;
};

interface SnakeGameProps {
  targetLetter: string;
  letters: string[];
}

// New parameters for rectangular grid dimensions
const GRID_WIDTH = 80;   // Number of cells horizontally
const GRID_HEIGHT = 20;  // Number of cells vertically
const CELL_SIZE = 25;
const INITIAL_SNAKE_LENGTH = 3;
const GAME_SPEED = 150;
const MIN_FOOD_COUNT = 5;

export default function SnakeGame({ targetLetter, letters }: SnakeGameProps) {
  const { data: session } = useSession();

  const [snake, setSnake] = useState<Position[]>([]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [food, setFood] = useState<Letter[]>([]);
  const [score, setScore] = useState(5);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [snakeSize, setSnakeSize] = useState(CELL_SIZE - 2);
  useEffect(() => {
    initializeGame(); // Automatically start the game when the component mounts
  }, []);

  const [previousBest, setPreviousBest] = useState(0);
  const scoreField = 'snakeGameBestScore';
  useEffect(() => {
    async function fetchBestScore() {
      if (session?.user?.email) {
        try {
          const res = await fetch(
            `/api/getBestScore?email=${session.user.email}&field=${scoreField}`
          );
          const data = await res.json();
          setPreviousBest(data.score || 0);
        } catch (error) {
          console.error('Error fetching best score', error);
        }
      }
    }
    fetchBestScore();
  }, [session, scoreField]);

  useEffect(() => {
    async function updateBestScore() {
      if (score > previousBest && session?.user?.email) {
        try {
          await fetch(`/api/updateBestScore`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: session.user.email,
              field: scoreField,
              score: score,
            }),
          });
          setPreviousBest(score);
        } catch (error) {
          console.error('Error updating best score', error);
        }
      }
    }
    updateBestScore();
  }, [score, previousBest, session, scoreField]);

  
  // Generate a single new food item on the rectangular grid
  const generateSingleFood = () => {
    const availableLetters = [...letters];
    const position = {
      x: Math.floor(Math.random() * GRID_WIDTH),
      y: Math.floor(Math.random() * GRID_HEIGHT)
    };

    // Ensure the new food doesn't overlap with the snake or existing food
    while (
      snake.some(segment => segment.x === position.x && segment.y === position.y) ||
      food.some(f => f.position.x === position.x && f.position.y === position.y)
    ) {
      position.x = Math.floor(Math.random() * GRID_WIDTH);
      position.y = Math.floor(Math.random() * GRID_HEIGHT);
    }

    const letterIndex = Math.floor(Math.random() * availableLetters.length);
    const char = availableLetters[letterIndex];

    return { char, position };
  };

  const generateSpecificFood = (char: string): Letter => {
    const position = {
      x: Math.floor(Math.random() * GRID_WIDTH),
      y: Math.floor(Math.random() * GRID_HEIGHT)
    };
  
    // Ensure the new food doesn't overlap with the snake or existing food
    while (
      snake.some(segment => segment.x === position.x && segment.y === position.y) ||
      food.some(f => f.position.x === position.x && f.position.y === position.y)
    ) {
      position.x = Math.floor(Math.random() * GRID_WIDTH);
      position.y = Math.floor(Math.random() * GRID_HEIGHT);
    }
  
    return { char, position };
  };
  

  // Initialize snake position and food
  const initializeGame = () => {
    const initialSnake: Position[] = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      initialSnake.push({
        x: Math.floor(GRID_WIDTH / 2) - i,
        y: Math.floor(GRID_HEIGHT / 2)
      });
    }
    setSnake(initialSnake);
    setDirection('RIGHT');
    setScore(5);
    setGameOver(false);
    setSnakeSize(CELL_SIZE - 2);
  
    const initialFood: Letter[] = [];
  
    // Ensure at least one target letter in the food
    initialFood.push(generateSpecificFood(targetLetter));
  
    // Generate remaining food items
    while (initialFood.length < MIN_FOOD_COUNT) {
      initialFood.push(generateSingleFood());
    }
  
    setFood(initialFood);
    setGameStarted(true);
  };
  

  // Handle keyboard controls
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (!gameStarted || gameOver) return;

    switch (e.key) {
      case 'ArrowUp':
        setDirection(prev => prev !== 'DOWN' ? 'UP' : prev);
        break;
      case 'ArrowDown':
        setDirection(prev => prev !== 'UP' ? 'DOWN' : prev);
        break;
      case 'ArrowLeft':
        setDirection(prev => prev !== 'RIGHT' ? 'LEFT' : prev);
        break;
      case 'ArrowRight':
        setDirection(prev => prev !== 'LEFT' ? 'RIGHT' : prev);
        break;
    }
  }, [gameStarted, gameOver]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        // Use GRID_WIDTH and GRID_HEIGHT for movement wrapping
        switch (direction) {
          case 'UP':
            head.y = (head.y - 1 + GRID_HEIGHT) % GRID_HEIGHT;
            break;
          case 'DOWN':
            head.y = (head.y + 1) % GRID_HEIGHT;
            break;
          case 'LEFT':
            head.x = (head.x - 1 + GRID_WIDTH) % GRID_WIDTH;
            break;
          case 'RIGHT':
            head.x = (head.x + 1) % GRID_WIDTH;
            break;
        }

        // Check for food collision
        const foodIndex = food.findIndex(f => f.position.x === head.x && f.position.y === head.y);
        if (foodIndex !== -1) {
          const eatenLetter = food[foodIndex];
          if (eatenLetter.char === targetLetter) {
            setScore(prev => prev + 1);
            setSnakeSize(prev => Math.min(prev + 2, CELL_SIZE + 4));
            
            // Generate new food immediately when target letter is eaten
            const newFood = [...food];
            newFood.splice(foodIndex, 1);
            // Check if there are any target letters left
            const hasTargetLetter = newFood.some(f => f.char === targetLetter);
            
            // If no target letters left, generate a specific target letter
            if (!hasTargetLetter) {
              newFood.push(generateSpecificFood(targetLetter));
            } else if (newFood.length < MIN_FOOD_COUNT) {
              // Otherwise generate any random letter if below minimum
              newFood.push(generateSingleFood());
            }
            
            setFood(newFood);
          } else {
            setScore(prev => {
              const newScore = prev - 1;
              if (newScore <= 0) {
                setGameOver(true);
              }
              return newScore;
            });
            
            // Remove non-target letter when eaten
            const newFood = [...food];
            newFood.splice(foodIndex, 1);
            if (newFood.length < MIN_FOOD_COUNT) {
              newFood.push(generateSingleFood());
            }
            setFood(newFood);
          }
          return [head, ...newSnake];
        } else {
          newSnake.pop();
        }

        // Check for self collision
        if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(head);
        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameInterval);
  }, [direction, food, gameStarted, gameOver, targetLetter, snake]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Calculate snake segment colors based on position
  const getSnakeSegmentStyle = (index: number, total: number) => {
    const progress = index / total;
    // Vary lightness from 10% for the head to 50% for the tail.
    const lightness = 10 + progress * 40;
  
    return {
      backgroundColor: `hsl(0, 0%, ${lightness}%)`, // Grayscale color
      width: snakeSize - (index * 0.5),
      height: snakeSize - (index * 0.5),
      borderRadius: '40%',
      boxShadow: index === 0 ? '0 0 10px rgba(0,0,0,0.3)' : 'none',
    };
  };
  

  // Inline styles for various elements
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'transparent',
    margin:0
  };

  const gameCardStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    borderRadius: '8px',
    padding: '2rem',
    width: 'fit-content',
    position: 'relative',
    margin:0
  };

  // Use GRID_WIDTH and GRID_HEIGHT to define a rectangular board
  const boardStyle: React.CSSProperties = {
    position: 'relative',
    borderRadius: '8px',
    width: GRID_WIDTH * CELL_SIZE,
    height: GRID_HEIGHT * CELL_SIZE,
    background: 'transparent',
    backgroundSize: `${CELL_SIZE * 2}px ${CELL_SIZE * 2}px`
  };

  const gameOverStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const gameOverCardStyle: React.CSSProperties = {
    backgroundColor: '#cbe4d1',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center'
  };

  const buttonStyle: React.CSSProperties = {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#4F46E5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1.125rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '1rem'
  };


  return (
    <div style={containerStyle}>
      <div style={gameCardStyle}>
        <div style={boardStyle}>
          {/* Snake */}
          {snake.map((segment, index) => (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              style={{
                ...getSnakeSegmentStyle(index, snake.length),
                position: 'absolute',
                left: segment.x * CELL_SIZE + (CELL_SIZE - snakeSize) / 2,
                top: segment.y * CELL_SIZE + (CELL_SIZE - snakeSize) / 2,
                transition: 'all 0.15s linear'
              }}
            />
          ))}

          {/* Food */}
          {food.map((item, index) => (
            <div
            
            key={`food-${index}`}
            // Apply the "glowing" class only if the letter is the targetLetter
            className={item.char === targetLetter ? 'glowing' : ''}
            style={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: `${CELL_SIZE }px`, // Increased font size
              backgroundColor: item.char === targetLetter ? 'rgba(0, 102, 204, 0.9)' : 'rgba(255, 0, 0, 0.9)', // Background color
              color: item.char === targetLetter ? '#faf089' : '#ffffff',
              width: `${CELL_SIZE*1.5}px`,
              height: `${CELL_SIZE*1.5}px`,
              left: `${item.position.x * CELL_SIZE}px`,
              top: `${item.position.y * CELL_SIZE}px`,
              borderRadius: '8px', // Rounded corners
              lineHeight: '1', // Ensures proper text scaling
              padding: '5px', // Prevents text from touching the edges
              textShadow: item.char === targetLetter
                ? '0 0 10px rgba(22,163,74,0.3)'
                : '0 0 10px rgba(220,38,38,0.3)',
            }}
            >
              {item.char}
            </div>
          ))}
        </div>

        {/* Game Over Screen */}
        {gameOver && (
          <div style={gameOverStyle}>
            <div style={gameOverCardStyle}>
              <Skull style={{ width: 64, height: 64, color: '#DC2626', margin: '0 auto' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937' }}>Game Over!</h3>
              <button onClick={initializeGame} style={{ ...buttonStyle, padding: '0.5rem 1rem' }}>
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          top: 570,
          left: 0,
          right: 0,
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(5px)',
          zIndex: 50,
        }}
      >
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
          Target Letter: <span style={{ color: '#FFD700' }}>{targetLetter}</span>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
          Previous Score: <span style={{ color: '#FFD700' }}>{previousBest}</span>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
          Score: <span style={{ color: '#FFD700' }}>{score}</span>
        </div>
      </div>

    </div>
  );
}
