"use client";

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';

interface BubbleGameProps {
  targetLetter: string;
  letters: string[];
}

interface Bubble {
  id: number;
  letter: string;
  x: number;
  y: number;
  speed: number;
  rotation: number;
}

export default function BubbleGame({ targetLetter, letters }: BubbleGameProps) {
  const { data: session } = useSession();
  const userId = session?.user?.email || '';
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [lastId, setLastId] = useState(0);
  const [previousBest, setPreviousBest] = useState(0);
  const scoreField = 'bubblePopBestScore';
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


  const createBubble = useCallback(() => {
    const x = Math.random() * (window.innerWidth - 100);
    const speed = 1 + Math.random();
    const letter = letters[Math.floor(Math.random() * letters.length)];
    const rotation = Math.random() * 360;

    setBubbles(prev => {
      if (prev.length < 6) {
        return [
          ...prev,
          {
            id: lastId,
            letter,
            x,
            y: window.innerHeight + 100,
            speed,
            rotation,
          },
        ];
      }
      return prev;
    });
    setLastId(prev => prev + 1);
  }, [lastId, letters]);

  useEffect(() => {
    const interval = setInterval(createBubble, 20);

    const animate = () => {
      setBubbles(prev =>
        prev
          .map(bubble => ({
            ...bubble,
            y: bubble.y - bubble.speed,
            rotation: bubble.rotation + bubble.speed * 0.5,
          }))
          .filter(bubble => bubble.y > -100)
      );
    };

    const animationInterval = setInterval(animate, 16);

    return () => {
      clearInterval(interval);
      clearInterval(animationInterval);
    };
  }, [createBubble]);

  const popBubble = useCallback(
    (bubbleId: number) => {
      setBubbles(prev => {
        const bubble = prev.find(b => b.id === bubbleId);
        if (bubble) {
          if (bubble.letter === targetLetter) {
            setScore(prev => prev + 1);
          } else {
            setScore(prev => Math.max(0, prev - 1));
          }
          return prev.filter(b => b.id !== bubbleId);
        }
        return prev;
      });
    },
    [targetLetter]
  );

  return (
    <div
      style={{
        position: 'relative',
        height: '50vh',
        width: '100%',
        background: 'transparent', // Transparent background
        marginTop:'-500px'
      }}
    >
      {/* Score and Target Display */}
      <div
        style={{
          position: 'absolute',
          top: 500,
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
          Previous Best: <span style={{ color: '#FFD700' }}>{previousBest}</span>
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}>
          Score: <span style={{ color: '#FFD700' }}>{score}</span>
        </div>
      </div>

      {/* Bubbles */}
      <AnimatePresence>
        {bubbles.map(bubble => (
          <motion.div
            key={bubble.id}
            style={{
              position: 'absolute',
              left: bubble.x,
              top: bubble.y,
              rotate: bubble.rotation,
              perspective: '1000px',
              cursor: 'pointer',
            }}
            initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
            animate={{
              opacity: 1,
              scale: 1,
              rotateY: 0,
              transition: { duration: 0.5 },
            }}
            exit={{
              scale: [1, 1.8, 0],           // Burst: quickly scale up then shrink to 0
              opacity: [1, 0.6, 0],         // Fade out over the burst
              rotateZ: [0, 90, 45],         // A quick spin for extra burst effect
              transition: {
                duration: 0.5,
                times: [0, 0.4, 1],
                ease: 'easeOut',
              },
            }}
            onClick={e => {
              e.stopPropagation();
              popBubble(bubble.id);
            }}
            whileHover={{ scale: 1.1, rotateY: 20 }}
          >
            <div
              style={{
                position: 'relative',
                width: '80px', // Fixed size for bubble
                height: '80px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  background:
                    'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%)',
                  boxShadow:
                    '0 0 20px rgba(255,255,255,0.3), inset 0 0 20px rgba(255,255,255,0.3)',
                  border: '2px solid rgba(255,255,255,0.5)',
                  backdropFilter: 'blur(4px)',
                }}
              >
                {/* Inner shine effect */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background:
                      'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
                  }}
                />
                {/* Letter */}
                <span
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    position: 'relative',
                    zIndex: 10,
                    color: bubble.letter === targetLetter ? '#FFD700' : 'black',
                    textShadow: '0 0 10px rgba(255,255,255,0.5)',
                  }}
                >
                  {bubble.letter}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
