'use client';
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '~@props/utils';

interface Dot {
  id: number;
  x: number;
  y: number;
}

interface Line {
  from: number;
  to: number;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
}

interface ConnectDotsProps {
  dots: Dot[];
  className?: string;
}

const ConnectDots: React.FC<ConnectDotsProps> = ({ dots, className }) => {
  const [lines, setLines] = useState<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<{ fromId: number; fromX: number; fromY: number; toX: number; toY: number } | null>(null);
  const [nextDotId, setNextDotId] = useState<number>(1);
  const [completed, setCompleted] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setContainerSize({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (completed || isDrawing || nextDotId !== 1) return;
    
    // Find the first dot
    const firstDot = dots.find(d => d.id === 1);
    if (firstDot) {
      setCurrentLine({
        fromId: firstDot.id,
        fromX: firstDot.x,
        fromY: firstDot.y,
        toX: firstDot.x,
        toY: firstDot.y
      });
      setNextDotId(2);
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!currentLine || !svgRef.current || completed) return;
  
    const svg = svgRef.current;
    const point = svg.createSVGPoint();
    point.x = e.clientX;
    point.y = e.clientY;
  
    const transformedPoint = point.matrixTransform(svg.getScreenCTM()?.inverse());
  
    setCurrentLine({
      ...currentLine,
      toX: transformedPoint.x,
      toY: transformedPoint.y
    });
  
    // Check if mouse is near the next dot
    const nextDot = dots.find(d => d.id === nextDotId);
    if (nextDot) {
      const distance = Math.sqrt(
        Math.pow(transformedPoint.x - nextDot.x, 2) +
        Math.pow(transformedPoint.y - nextDot.y, 2)
      );
  
      if (distance < 30) {
        setLines([...lines, {
          from: currentLine.fromId,
          to: nextDot.id,
          fromX: currentLine.fromX,
          fromY: currentLine.fromY,
          toX: nextDot.x,
          toY: nextDot.y
        }]);
  
        if (nextDot.id === dots.length) {
          setCompleted(true);
          setCurrentLine(null);
        } else {
          setCurrentLine({
            fromId: nextDot.id,
            fromX: nextDot.x,
            fromY: nextDot.y,
            toX: nextDot.x,
            toY: nextDot.y
          });
          setNextDotId(nextDotId + 1);
        }
      }
    }
  };
  

  const handleReset = () => {
    setLines([]);
    setCurrentLine(null);
    setNextDotId(1);
    setCompleted(false);
    setIsDrawing(false);
  };

  return (
    <div 
      ref={containerRef}
      className={cn("relative w-full h-[500px] bg-background border border-border rounded-lg overflow-hidden", className)}
    >
      <svg 
        ref={svgRef}
        viewBox="0 0 500 500"
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
      >
        {/* Lines */}
        {lines.map((line, index) => (
          <line
            key={`line-${index}`}
            x1={line.fromX}
            y1={line.fromY}
            x2={line.toX}
            y2={line.toY}
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeLinecap="round"
            className="transition-all duration-300 ease-in-out"
          />
        ))}

        {/* Current line being drawn */}
        {currentLine && (
          <line
            x1={currentLine.fromX}
            y1={currentLine.fromY}
            x2={currentLine.toX}
            y2={currentLine.toY}
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            strokeDasharray="5,5"
            strokeLinecap="round"
          />
        )}

        {/* Dots */}
        {dots.map((dot) => (
          <g key={`dot-${dot.id}`}>
            <circle
              cx={dot.x}
              cy={dot.y}
              r="15"
              fill={
                nextDotId > dot.id || completed
                  ? "hsl(var(--primary))"
                  : nextDotId === dot.id
                  ? "hsl(var(--accent))"
                  : "hsl(var(--muted))"
              }
              className={cn(
                "transition-all duration-300",
                nextDotId === dot.id && !completed && "animate-pulse"
              )}
            />
            <text
              x={dot.x}
              y={dot.y + 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={
                nextDotId > dot.id || completed
                  ? "hsl(var(--primary-foreground))"
                  : nextDotId === dot.id
                  ? "hsl(var(--accent-foreground))"
                  : "hsl(var(--muted-foreground))"
              }
              fontSize="12"
              fontWeight="bold"
              pointerEvents="none"
            >
              {dot.id}
            </text>
          </g>
        ))}
      </svg>

      {completed && (
        <div className="absolute bottom-4 right-4">
          <button
            onClick={handleReset}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Reset
          </button>
        </div>
      )}

      {!completed && !isDrawing && (
        <div className="absolute top-4 left-4 bg-card p-2 rounded-md shadow-sm">
          <p className="text-sm font-medium">
            Move your mouse over the drawing area to start
          </p>
        </div>
      )}

      {!completed && isDrawing && (
        <div className="absolute top-4 left-4 bg-card p-2 rounded-md shadow-sm">
          <p className="text-sm font-medium">
            Move to dot {nextDotId} next
          </p>
        </div>
      )}

      {completed && (
        <div className="absolute top-4 left-4 bg-card p-2 rounded-md shadow-sm">
          <p className="text-sm font-medium text-primary">
            Shape completed!
          </p>
        </div>
      )}
    </div>
  );
};

export default ConnectDots;