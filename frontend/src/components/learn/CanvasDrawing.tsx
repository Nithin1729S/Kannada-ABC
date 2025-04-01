"use client";
import { useRef, useState, useEffect } from "react";
import { Send } from "lucide-react";
import { showModal } from '../../components/ui/Modal';
import { useConfetti } from "~components/ui/confetti-trigger";
import { useSession } from 'next-auth/react';


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '1rem',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1rem',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    borderRadius: '999px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  primaryButton: {
    backgroundColor: '#6eec99',
    color: 'black',
    border: 'none',
    '&:hover': {
      backgroundColor: '#2563eb',
    },
  },
  secondaryButton: {
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: '#f3f4f6',
    },
  },
  icon: {
    width: '1.5rem',
    height: '1.5rem',
    marginRight: '0.5rem',
  },
  canvasContainer: {
    marginTop: '80px',
    padding: '10px',
    background: 'linear-gradient(45deg, #D0FFD0, #E0FFE0)', // Slightly stronger green
    borderRadius: '16px',
    position: 'relative' as const,
    boxShadow: `
      0 0 0 2px #32CD32,  // Solid Green
      0 0 0 4px #228B22,  // Darker green shade after solid border
    `,
    border: '1px solid #228B22', // Darker green for a stronger contrast
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-1px',
      left: '-1px',
      right: '-1px',
      bottom: '-1px',
      background: `
        repeating-linear-gradient(45deg,
          #32CD32 0px,
          #228B22 2px,  // Darker green in the pattern
          transparent 2px,
          transparent 4px
        )
      `,
      borderRadius: '20px',
      zIndex: '-1',
      opacity: '0.2', // Slightly stronger opacity
    }
  },

  canvas: {
    cursor: 'crosshair',
    borderRadius: '12px',
    boxShadow: 'inset 0 0 4px rgba(144, 238, 144, 0.2)',
    background: 'black',
  },



  resultText: {
    marginTop: '1rem',
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
};



const MAX_ATTEMPTS = 5; // Maximum attempts after which score becomes 0

// Compute the score based on the number of attempts
function computeLetterScore(attempts: number, maxAttempts: number = MAX_ATTEMPTS): number {
  // If attempts is 1, score is 3; if attempts >= maxAttempts, score is 0; otherwise, linearly interpolate.
  if (attempts <= 1) return 3;
  if (attempts >= maxAttempts) return 0;
  return 3 * ((maxAttempts - attempts) / (maxAttempts - 1));
}

export default function CanvasDrawing({
  letterData
}: {
  letterData: number
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [recognitionResult, setRecognitionResult] = useState<number | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const { data: session } = useSession();
  const confetti = useConfetti();
  // When recognitionResult changes, check correctness
  useEffect(() => {
    if (recognitionResult !== null) {
      if (Number(recognitionResult) === Number(letterData)) {
        confetti.trigger("default");

        // Compute the score based on number of attempts (attemptCount + 1, counting current attempt)
        const computedScore = computeLetterScore(attemptCount + 1);
        
        // Construct field name using letterData (e.g., "letterScore_45")
        const fieldName = `letter_score_${letterData}`;

        // Call updateScore API (POST) with the field name and computed score.
        // Replace '/api/updateBestScore' with your API route.
        fetch(`/api/updateBestScore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: session?.user?.email,
            field: fieldName,
            score: computedScore,
          }),
        }).catch((error) => {
          console.error("Error updating score:", error);
        });
        // Reset attempt count for the next letter
        setAttemptCount(0);
      } else {
        // Wrong guess: Increase attempt count and prompt user to try again.
        setAttemptCount((prev) => prev + 1);
        showModal("Try Again!");
      }
    }
  }, [recognitionResult, letterData, confetti, attemptCount]);

  
  const letters = [
    'ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಋ', 'ಎ', 'ಏ', 'ಐ',
    'ಒ', 'ಓ', 'ಔ', 'ಅಂ', 'ಅಃ', 'ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ',
    'ಚ', 'ಛ', 'ಜ', 'ಝ', 'ಞ', 'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ',
    'ತ', 'ಥ', 'ದ', 'ಧ', 'ನ', 'ಪ', 'ಫ', 'ಬ', 'ಭ', 'ಮ',
    'ಯ', 'ರ', 'ಲ', 'ವ', 'ಶ', 'ಷ', 'ಸ', 'ಹ', 'ಳ'
  ];
  

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
  
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    // Set the display canvas to white with black strokes
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 8;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);
  

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.strokeStyle = tool === "pen" ? "black" : "white";
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
  
    // Clear the canvas with a white background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setRecognitionResult(null);
  };
  

  const processImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const tempCanvas = document.createElement("canvas");
    const scaleFactor = 4;
    tempCanvas.width = 28 * scaleFactor;
    tempCanvas.height = 28 * scaleFactor;
    const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
    if (!tempCtx) return;
  
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';
    tempCtx.fillStyle = "white"; // white background for display
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, tempCanvas.width, tempCanvas.height);
  
    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = 28;
    finalCanvas.height = 28;
    const finalCtx = finalCanvas.getContext("2d", { willReadFrequently: true });
    if (!finalCtx) return;
  
    finalCtx.imageSmoothingEnabled = true;
    finalCtx.imageSmoothingQuality = 'high';
    finalCtx.fillStyle = "white"; // maintain display's white background before inversion
    finalCtx.fillRect(0, 0, 28, 28);
    finalCtx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, 28, 28);
  
    // Invert the image for backend processing
    const imageData = finalCtx.getImageData(0, 0, 28, 28);
    const pixels = imageData.data;
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = 255 - pixels[i];         // Red
      pixels[i + 1] = 255 - pixels[i + 1];   // Green
      pixels[i + 2] = 255 - pixels[i + 2];   // Blue
      // Alpha channel remains unchanged
    }
    finalCtx.putImageData(imageData, 0, 0);
  
    const processedImage = finalCanvas.toDataURL("image/jpeg", 1.0);
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const response = await fetch(`${backendURL}/api/recognize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: processedImage }),
      });
      if (!response.ok) throw new Error("Failed to send image to server");
  
      const data = await response.json();
      setRecognitionResult(data.prediction);
      console.log(letters[data.prediction - 1]);
    } catch (error) {
      console.error("Error sending image:", error);
      setRecognitionResult(null);
    }
  };
  

  return (
    <div style={styles.container}>
      <div style={styles.buttonGroup}>
        
      </div>

      <div style={{...styles.canvasContainer}}>
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          style={styles.canvas}
          
        />
      </div>
      <div style={styles.buttonGroup}>
        <button
          onClick={processImage}
          style={{...styles.button, ...styles.primaryButton}}
        >
          <Send style={styles.icon} />
          Submit
        </button>
        <button
          style={{...styles.button, ...styles.secondaryButton}}
          onClick={clearCanvas}
        >
          Clear
        </button>
      </div>
    </div>
  );
}