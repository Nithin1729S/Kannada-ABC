'use client';

import React from 'react';

interface LetterTracingProps {
  letter: string;
}

const StandaloneLetterTracing: React.FC<LetterTracingProps> = ({ letter }) => {
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [isOutOfBounds, setIsOutOfBounds] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [ctx, setCtx] = React.useState<CanvasRenderingContext2D | null>(null);
  const [bgCtx, setBgCtx] = React.useState<CanvasRenderingContext2D | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = React.useRef<HTMLCanvasElement>(null);

  const canvasWidth = 1600;
  const canvasHeight = 600;

  React.useEffect(() => {
    if (!canvasRef.current || !backgroundCanvasRef.current) return;

    const canvas = canvasRef.current;
    const bgCanvas = backgroundCanvasRef.current;
    const context = canvas.getContext('2d');
    const bgContext = bgCanvas.getContext('2d');

    if (!context || !bgContext) return;

    setCtx(context);
    setBgCtx(bgContext);

    bgContext.font = '500px Arial';
    bgContext.fillStyle = 'rgba(0, 0, 0, 0.1)';
    bgContext.textAlign = 'center';
    bgContext.textBaseline = 'middle';
    bgContext.fillText(letter, canvasWidth / 2, canvasHeight / 2);

    const imageData = bgContext.getImageData(0, 0, canvasWidth, canvasHeight);
    const pixels = imageData.data;

    const letterPixels = new Set();
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] > 0) {
        const x = (i / 4) % canvasWidth;
        const y = Math.floor((i / 4) / canvasWidth);
        letterPixels.add(`${x},${y}`);
      }
    }

    context.clearRect(0, 0, canvasWidth, canvasHeight);
  }, [letter]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    checkBounds(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !ctx || !bgCtx) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.strokeStyle = isOutOfBounds ? '#ff0000' : '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    checkBounds(x, y);
  };

  const checkBounds = (x: number, y: number) => {
    if (!bgCtx) return;
    const pixel = bgCtx.getImageData(x, y, 1, 1).data;
    const isInBounds = pixel[3] > 0;
    setIsOutOfBounds(!isInBounds);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    calculateScore();
  };

  const calculateScore = () => {
    if (!ctx || !bgCtx) return;
  
    const userDrawingData = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;
    const letterTemplateData = bgCtx.getImageData(0, 0, canvasWidth, canvasHeight).data;
  
    let overlap = 0;
    let totalDrawnPixels = 0;
    let totalLetterPixels = 0;
  
    // Count all pixels that form the letter.
    for (let i = 0; i < letterTemplateData.length; i += 4) {
      if (letterTemplateData[i + 3] > 0) {
        totalLetterPixels++;
      }
    }
  
    // Helper function to check neighboring pixels for a match within the letter.
    const isNearLetter = (x: number, y: number, tolerance = 1) => {
      for (let dx = -tolerance; dx <= tolerance; dx++) {
        for (let dy = -tolerance; dy <= tolerance; dy++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || nx >= canvasWidth || ny < 0 || ny >= canvasHeight) continue;
          const neighborIndex = (ny * canvasWidth + nx) * 4;
          if (letterTemplateData[neighborIndex + 3] > 0) {
            return true;
          }
        }
      }
      return false;
    };
  
    // Iterate over drawn pixels.
    for (let i = 0; i < userDrawingData.length; i += 4) {
      if (userDrawingData[i + 3] > 0) {
        totalDrawnPixels++;
        const pixelIndex = i / 4;
        const x = pixelIndex % canvasWidth;
        const y = Math.floor(pixelIndex / canvasWidth);
  
        // Check if the pixel or any of its neighbors fall within the letter area.
        if (letterTemplateData[i + 3] > 0 || isNearLetter(x, y)) {
          overlap++;
        }
      }
    }
  
    // If nothing was drawn, score is 0.
    if (totalDrawnPixels === 0) {
      setScore(0);
    } else {
      const accuracy = overlap / totalDrawnPixels; // Fraction of drawn pixels within or near the letter.
      const coverage = overlap / totalLetterPixels;  // Fraction of the letter's pixels covered by the drawing.
      const calculatedScore = Math.round(accuracy * coverage * 100);
      setScore(calculatedScore);
    }
    setIsCompleted(true);
  };
  

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '1rem',
      padding: '2rem',
    },
    canvasContainer: {
      position: 'relative' as const,
    },
    canvas: {
      position: 'relative' as const,
      borderRadius: '0.5rem',
      cursor: 'crosshair',
    },
    backgroundCanvas: {
      position: 'absolute' as const,
    },
    warningMessage: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#ef4444',
    },
    completionContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '0.5rem',
    },
    successMessage: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#22c55e',
    },
    score: {
      fontSize: '1.125rem',
      fontWeight: '600',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.canvasContainer}>
        <canvas
          ref={backgroundCanvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={styles.backgroundCanvas}
        />
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          style={styles.canvas}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
      
      {isOutOfBounds && !isCompleted && (
        <div style={styles.warningMessage}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>Stay within the letter outline!</span>
        </div>
      )}
      
      {isCompleted && (
        <div style={styles.completionContainer}>
          <div style={styles.successMessage}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span>Completed!</span>
          </div>
          <div style={styles.score}>
            Accuracy Score: {score}%
          </div>
        </div>
      )}
    </div>
  );
};

export default StandaloneLetterTracing;