import React, { useState, useEffect, useRef } from 'react';
import { Skull } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface AlphabetCatcherProps {
  targetLetter: string;
  otherLetters: string[];
  onScoreChange?: (score: number) => void;
}

const AlphabetCatcher: React.FC<AlphabetCatcherProps> = ({
  targetLetter,
  otherLetters,
  onScoreChange,
}) => {
  const [score, setScore] = useState(0);
  const { data: session } = useSession();
  const [position, setPosition] = useState(50); // Basket position (percentage)
  const [letters, setLetters] = useState<
    Array<{ id: number; letter: string; x: number; y: number; caught: boolean }>
  >([]);
  const [gameActive, setGameActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);
  const letterIdRef = useRef(0);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Game settings
  const fallSpeed = 0.6; // Reduced fall speed (pixels per frame)
  const spawnRate = 1800; // Milliseconds between letter spawns
  const basketWidth = 12; // Percentage of screen width

  const gameOverStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // Make sure it's above other elements
  };

  const gameOverCardStyle: React.CSSProperties = {
    backgroundColor: '#cbe4d1',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
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
    marginTop: '1rem',
  };

  // Start the game function resets the score, letters, and sets gameActive true.
  const startGame = () => {
    // Cancel any existing animation
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }
    
    // Clear any existing spawn interval
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
    }
    
    setGameActive(true);
    setScore(0);
    setLetters([]);
    setPosition(50); // Reset basket position
  };

  const [previousBest, setPreviousBest] = useState(0);
    const scoreField = 'bucketCatchBestScore';
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

  // Automatically start the game on component mount.
  useEffect(() => {
    startGame();
    
    // Cleanup function for component unmount
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
      }
    };
  }, []);

  // Handle key presses for basket movement.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameActive) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPosition((prev) => Math.max(prev - 3, 0));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPosition((prev) => Math.min(prev + 3, 100 - basketWidth));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameActive]);

  // Handle touch movement for mobile.
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const handleTouchMove = (e: TouchEvent) => {
      if (!gameActive) return;
      
      const touch = e.touches[0];
      const containerRect = container.getBoundingClientRect();
      const touchX = touch.clientX - containerRect.left;
      const containerWidth = containerRect.width;
      const newPosition = (touchX / containerWidth) * 100 - basketWidth / 2;
      setPosition(Math.max(0, Math.min(newPosition, 100 - basketWidth)));
    };

    container.addEventListener('touchmove', handleTouchMove);
    return () => container.removeEventListener('touchmove', handleTouchMove);
  }, [gameActive]);

  // Handle mouse movement.
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      if (!gameActive) return;
      
      const containerRect = container.getBoundingClientRect();
      const mouseX = e.clientX - containerRect.left;
      const containerWidth = containerRect.width;
      const newPosition = (mouseX / containerWidth) * 100 - basketWidth / 2;
      setPosition(Math.max(0, Math.min(newPosition, 100 - basketWidth)));
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, [gameActive]);

  // Spawn letters at regular intervals.
  useEffect(() => {
    // Clean up previous interval if it exists
    if (spawnIntervalRef.current) {
      clearInterval(spawnIntervalRef.current);
      spawnIntervalRef.current = null;
    }
    
    if (!gameActive) return;

    const spawnLetter = () => {
      const isTargetLetter = Math.random() < 0.4; // 40% chance for target letter
      const letter = isTargetLetter
        ? targetLetter
        : otherLetters[Math.floor(Math.random() * otherLetters.length)];
      const x = Math.random() * (100 - 8); // Random horizontal position (%)
      setLetters((prev) => [
        ...prev,
        {
          id: letterIdRef.current++,
          letter,
          x,
          y: -10, // Start above the container
          caught: false,
        },
      ]);
    };

    spawnIntervalRef.current = setInterval(spawnLetter, spawnRate);
    
    return () => {
      if (spawnIntervalRef.current) {
        clearInterval(spawnIntervalRef.current);
        spawnIntervalRef.current = null;
      }
    };
  }, [gameActive, targetLetter, otherLetters]);

  // Game loop: move letters, detect collisions, and update score.
  useEffect(() => {
    if (!gameActive) return;
  
    const gameLoop = () => {
      setLetters((prevLetters) => {
        const newLetters = prevLetters
          .map((letterObj) => {
            if (letterObj.caught) return letterObj; // Skip letters already caught
  
            const newY = letterObj.y + fallSpeed;
            const isCaught =
              newY >= 85 &&
              newY <= 95 &&
              letterObj.x + 4 >= position &&
              letterObj.x <= position + basketWidth;
  
            if (isCaught) {
              const scoreChange = letterObj.letter === targetLetter ? 10 : -5;
              setScore((prevScore) => {
                const newScore = prevScore + scoreChange;
                // Check if game over
                if (newScore <= -15) {
                  setGameActive(false);
                }
                if (onScoreChange) onScoreChange(newScore);
                return newScore;
              });
              return { ...letterObj, caught: true };
            }
            return { ...letterObj, y: newY };
          })
          .filter((letterObj) => letterObj.y < 100 || letterObj.caught);
        return newLetters;
      });
      
      // Only schedule next frame if game is still active
      if (gameActive) {
        frameRef.current = requestAnimationFrame(gameLoop);
      }
    };
  
    frameRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [gameActive, position, targetLetter, onScoreChange]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '800px',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        borderRadius: '24px',
        fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* Game Over Overlay */}
      {!gameActive && score <= -15 && (
        <div style={gameOverStyle}>
          <div style={gameOverCardStyle}>
            <Skull style={{ width: 64, height: 64, color: '#DC2626', margin: '0 auto' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1F2937' }}>Game Over!</h3>
            <button 
              onClick={startGame} 
              style={{ ...buttonStyle, padding: '0.5rem 1rem' }}
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'transparent',
          zIndex: 0,
        }}
      >
        {/* Info panel */}
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '15px',
              padding: '10px 20px',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
            }}
          >
            <div style={{ fontWeight: 600, fontSize: '16px', color: '#1d1d1f' }}>
              Target:
              <span
                style={{
                  display: 'inline-block',
                  marginLeft: '8px',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: '#0066cc',
                  textTransform: 'uppercase',
                }}
              >
                {targetLetter}
              </span>
            </div>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
            <div style={{ fontWeight: 600, fontSize: '16px', color: '#1d1d1f' }}>
              Score:
              <span
                style={{
                  display: 'inline-block',
                  marginLeft: '8px',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: score >= 0 ? '#34c759' : '#ff3b30',
                }}
              >
                {score}
              </span>
            </div>
            <div style={{ width: '1px', height: '24px', backgroundColor: 'rgba(0, 0, 0, 0.1)' }} />
            <div style={{ fontWeight: 600, fontSize: '16px', color: '#1d1d1f' }}>
              Best:
              <span
                style={{
                  display: 'inline-block',
                  marginLeft: '8px',
                  fontSize: '22px',
                  fontWeight: 700,
                  color: previousBest >= 0 ? '#34c759' : '#ff3b30',
                }}
              >
                {previousBest}
              </span>
            </div>
          </div>
        </div>

        {/* Letters */}
        {letters.map((letterObj) => (
          <div
            key={letterObj.id}
            style={{
              position: 'absolute',
              left: `${letterObj.x}%`,
              top: `${letterObj.y}%`,
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: letterObj.letter === targetLetter ? 'rgba(0, 102, 204, 0.9)' : 'rgba(250, 250, 250, 0.9)',
              color: letterObj.letter === targetLetter ? 'white' : '#1d1d1f',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '22px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              transform: letterObj.caught ? 'scale(1.3) rotate(10deg)' : 'scale(1)',
              opacity: letterObj.caught ? 0 : 1,
              transition: 'transform 0.2s ease, opacity 0.3s ease',
              zIndex: 2,
            }}
          >
            {letterObj.letter}
          </div>
        ))}

        {/* Basket */}
        <div
          style={{
            position: 'absolute',
            left: `${position}%`,
            bottom: '5%',
            width: `${basketWidth}%`,
            height: '60px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '16px',
            border: '3px solid #0066cc',
            boxShadow: '0 4px 30px rgba(0, 102, 204, 0.2), 0 -4px 0 rgba(0, 0, 0, 0.05) inset',
            transition: 'all 0.1s cubic-bezier(0.22, 1, 0.36, 1)',
            zIndex: 5,
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '70%',
              height: '5px',
              backgroundColor: 'rgba(0, 102, 204, 0.4)',
              borderRadius: '10px',
            }}
          />
        </div>

        {/* Background decoration */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '10%',
            width: '25px',
            height: '25px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 102, 204, 0.1)',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '25%',
            right: '15%',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 102, 204, 0.15)',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30%',
            left: '20%',
            width: '35px',
            height: '35px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 102, 204, 0.08)',
            zIndex: 1,
          }}
        />
      </div>
    </div>
  );
};

export default AlphabetCatcher;