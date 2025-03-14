'use client';
import React, { JSX } from 'react';
import AccuracyScore from './AccuracyScore';

interface LetterTracingProps {
  letter: string;
}

const StandaloneLetterTracing: React.FC<LetterTracingProps> = ({ letter }) => {
  // Configurable tolerance value; change this value in the code as needed.
  const tolerance = 100;

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
    // If drawing out-of-bound, show red stroke
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
  
    // Get image data for the drawn stroke and the letter template.
    const userDrawing = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    const letterTemplate = bgCtx.getImageData(0, 0, canvasWidth, canvasHeight);
  
    // Create an empty buffer for the "expanded" (dilated) drawing.
    // We use this to determine how well the user covered the letter.
    const expandedDrawing = new Uint8ClampedArray(userDrawing.data.length);
  
    for (let y = 0; y < canvasHeight; y++) {
      for (let x = 0; x < canvasWidth; x++) {
        const index = (y * canvasWidth + x) * 4;
        if (userDrawing.data[index + 3] > 0) {
          // Mark the neighboring pixels (within the given tolerance) as drawn.
          for (let dx = -tolerance; dx <= tolerance; dx++) {
            for (let dy = -tolerance; dy <= tolerance; dy++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx < 0 || nx >= canvasWidth || ny < 0 || ny >= canvasHeight) continue;
              const nIndex = (ny * canvasWidth + nx) * 4;
              expandedDrawing[nIndex + 3] = 255;
            }
          }
        }
      }
    }
  
    // Calculate letter coverage using the dilated drawing.
    let dilatedOverlap = 0;
    let totalLetterPixels = 0;
    for (let y = 0; y < canvasHeight; y++) {
      for (let x = 0; x < canvasWidth; x++) {
        const index = (y * canvasWidth + x) * 4;
        if (letterTemplate.data[index + 3] > 0) {
          totalLetterPixels++;
          if (expandedDrawing[index + 3] > 0) {
            dilatedOverlap++;
          }
        }
      }
    }
  
    // Calculate raw drawing accuracy:
    // rawDrawnCount: total drawn pixels (without dilation)
    // rawInsideCount: drawn pixels that fall directly within the letter template.
    let rawDrawnCount = 0;
    let rawInsideCount = 0;
    for (let i = 0; i < userDrawing.data.length; i += 4) {
      if (userDrawing.data[i + 3] > 0) {
        rawDrawnCount++;
        if (letterTemplate.data[i + 3] > 0) {
          rawInsideCount++;
        }
      }
    }
  
    if (rawDrawnCount === 0 || totalLetterPixels === 0) {
      setScore(0);
    } else {
      const coverage = dilatedOverlap / totalLetterPixels;         // How much of the letter was covered.
      const drawingAccuracy = rawInsideCount / rawDrawnCount;          // How accurately the user stayed within the letter.
      const calculatedScore = Math.round(coverage * drawingAccuracy * 100);
      setScore(calculatedScore);
    }
    setIsCompleted(true);
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
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
          <AccuracyScore score={score} />
        </div>
      )}
    </div>
  );
};

export default StandaloneLetterTracing;
