import React, { useEffect, useRef } from 'react';

interface AccuracyScoreProps {
  score: number;
  width?: number;
  height?: number;
  duration?: number;
}

const AccuracyScore: React.FC<AccuracyScoreProps> = ({
  score,
  width = 400,
  height = 80,
  duration = 1500,
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!progressRef.current || !numberRef.current) return;

    const progressElement = progressRef.current;
    const numberElement = numberRef.current;

    // Animate both the progress bar and number simultaneously
    const startTime = performance.now();
    let animationFrame: number;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      // Update progress bar width
      progressElement.style.width = `${score * easeOutQuart}%`;
      
      // Update number
      const currentNumber = Math.round(score * easeOutQuart);
      numberElement.textContent = `${currentNumber}%`;

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [score, duration]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#22c55e'; // Green
    if (score >= 70) return '#3b82f6'; // Blue
    if (score >= 50) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent!';
    if (score >= 70) return 'Good Job!';
    if (score >= 50) return 'Keep Practicing!';
    return 'Try Again!';
  };

  const scoreColor = getScoreColor(score);

  return (
    <div
      style={{
        width,
        // padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        // background: '#ffffff',
        borderRadius: '12px',
        // boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '4px',
        }}
      >
        <span
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: scoreColor,
            transition: 'color 0.3s ease',
          }}
          ref={numberRef}
        >
          0%
        </span>
        <span
          style={{
            fontSize: '18px',
            color: scoreColor,
            fontWeight: '500',
          }}
        >
          {getScoreLabel(score)}
        </span>
      </div>

      <div
        style={{
          width: '100%',
          height: `${height * 0.4}px`,
          backgroundColor: '#f3f4f6',
          borderRadius: '999px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          ref={progressRef}
          style={{
            width: '0%',
            height: '100%',
            backgroundColor: scoreColor,
            borderRadius: '999px',
            transition: 'background-color 0.3s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Animated shine effect */}
          <div
            style={{
              position: 'absolute',
              top: '0',
              left: '-100%',
              width: '50%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              animation: 'shine 2s infinite',
            }}
          />
        </div>
      </div>

      <style>
        {`
          @keyframes shine {
            0% {
              left: -100%;
            }
            100% {
              left: 200%;
            }
          }
        `}
      </style>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '14px',
          color: '#6b7280',
          marginTop: '4px',
        }}
      >
        {/* <span>0%</span>
        <span>50%</span>
        <span>100%</span> */}
      </div>
    </div>
  );
};

export default AccuracyScore;