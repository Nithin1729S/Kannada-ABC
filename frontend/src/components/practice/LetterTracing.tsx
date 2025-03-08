import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface LetterTracingProps {
  letter: string;
}

const LetterTracing: React.FC<LetterTracingProps> = ({ letter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backgroundCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isOutOfBounds, setIsOutOfBounds] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [bgCtx, setBgCtx] = useState<CanvasRenderingContext2D | null>(null);

  const canvasWidth = 400;
  const canvasHeight = 400;

  useEffect(() => {
    if (!canvasRef.current || !backgroundCanvasRef.current) return;

    const canvas = canvasRef.current;
    const bgCanvas = backgroundCanvasRef.current;
    const context = canvas.getContext('2d');
    const bgContext = bgCanvas.getContext('2d');

    if (!context || !bgContext) return;

    setCtx(context);
    setBgCtx(bgContext);

    // Draw the background letter
    bgContext.font = '300px Arial';
    bgContext.fillStyle = 'rgba(0, 0, 0, 0.1)';
    bgContext.textAlign = 'center';
    bgContext.textBaseline = 'middle';
    bgContext.fillText(letter, canvasWidth / 2, canvasHeight / 2);

    // Get the pixel data of the letter
    const imageData = bgContext.getImageData(0, 0, canvasWidth, canvasHeight);
    const pixels = imageData.data;

    // Create a map of letter pixels
    const letterPixels = new Set();
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] > 0) {
        const x = (i / 4) % canvasWidth;
        const y = Math.floor((i / 4) / canvasWidth);
        letterPixels.add(`${x},${y}`);
      }
    }

    // Clear the drawing canvas
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
    
    const userDrawing = ctx.getImageData(0, 0, canvasWidth, canvasHeight).data;
    const letterTemplate = bgCtx.getImageData(0, 0, canvasWidth, canvasHeight).data;
    
    let overlap = 0;
    let totalDrawnPixels = 0;
    
    for (let i = 0; i < userDrawing.length; i += 4) {
      if (userDrawing[i + 3] > 0) {
        totalDrawnPixels++;
        if (letterTemplate[i + 3] > 0) {
          overlap++;
        }
      }
    }
    
    const calculatedScore = Math.round((overlap / totalDrawnPixels) * 100);
    setScore(calculatedScore);
    setIsCompleted(true);
  };

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <div className="relative">
        <canvas
          ref={backgroundCanvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="absolute"
        />
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="relative border border-gray-300 rounded-lg cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
      </div>
      
      {isOutOfBounds && !isCompleted && (
        <div className="flex items-center gap-2 text-red-500">
          <AlertCircle className="w-5 h-5" />
          <span>Stay within the letter outline!</span>
        </div>
      )}
      
      {isCompleted && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-green-500">
            <CheckCircle2 className="w-5 h-5" />
            <span>Completed!</span>
          </div>
          <div className="text-lg font-semibold">
            Accuracy Score: {score}%
          </div>
        </div>
      )}
    </div>
  );
};

export default LetterTracing;