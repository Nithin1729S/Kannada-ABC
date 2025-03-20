"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useConfetti } from "~components/ui/confetti-trigger";

interface TicTacToeProps {
  playerSymbol: string;
  computerSymbol: string;
  onPlayAgain?: () => void;
  difficulty?: "easy" | "medium" | "hard";  // Added difficulty prop
}

type Board = (string | null)[];

const TicTacToe: React.FC<TicTacToeProps> = ({ 
  playerSymbol, 
  computerSymbol, 
  onPlayAgain,
  difficulty = "easy" // Default difficulty
}) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [isComputerTurn, setIsComputerTurn] = useState(false);
   const confetti = useConfetti();
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  const checkWinner = (currentBoard: Board): string | null => {
    for (const combo of winningCombinations) {
      const [a, b, c] = combo;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a];
      }
    }
    return null;
  };

  const isBoardFull = (currentBoard: Board): boolean => {
    return currentBoard.every((cell) => cell !== null);
  };

  // Get all available moves
  const getAvailableMoves = (currentBoard: Board): number[] => {
    return currentBoard
      .map((cell, index) => (cell === null ? index : -1))
      .filter(index => index !== -1);
  };

  const getComputerMove = (currentBoard: Board): number => {
    const availableMoves = getAvailableMoves(currentBoard);
    if (availableMoves.length === 0) return -1;
    
    // Chance to make a random move based on difficulty
    const makeRandomMove = Math.random() < getMistakeProbability();
    
    if (makeRandomMove) {
      // Just pick a random available square
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
    
    // Otherwise use the optimal strategy
    
    // Try to win
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const boardCopy = [...currentBoard];
        boardCopy[i] = computerSymbol;
        if (checkWinner(boardCopy) === computerSymbol) {
          return i;
        }
      }
    }

    // Block player from winning
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const boardCopy = [...currentBoard];
        boardCopy[i] = playerSymbol;
        if (checkWinner(boardCopy) === playerSymbol) {
          return i;
        }
      }
    }

    // Take center if available
    if (!currentBoard[4]) return 4;

    // Take any available corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => !currentBoard[i]);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available side
    const sides = [1, 3, 5, 7];
    const availableSides = sides.filter(i => !currentBoard[i]);
    if (availableSides.length > 0) {
      return availableSides[Math.floor(Math.random() * availableSides.length)];
    }

    return -1;
  };

  // Return probability of making a mistake based on difficulty
  const getMistakeProbability = (): number => {
    switch(difficulty) {
      case "easy":
        return 0.5;  // 50% chance to make a random move
      case "medium":
        return 0.3;  // 30% chance to make a random move
      case "hard":
        return 0.1;  // 10% chance to make a random move
      default:
        return 0.3;
    }
  };

  useEffect(() => {
    if (isComputerTurn && !isGameOver) {
      const computerMove = getComputerMove(board);
      if (computerMove !== -1) {
        setTimeout(() => {
          const newBoard = [...board];
          newBoard[computerMove] = computerSymbol;
          setBoard(newBoard);

          const computerWon = checkWinner(newBoard);
          if (computerWon) {
            setWinner(computerSymbol);
            setIsGameOver(true);
          } else if (isBoardFull(newBoard)) {
            setIsGameOver(true);
          }
          setIsComputerTurn(false);
        }, 500);
      }
    }
    if(winner==playerSymbol){
        confetti.trigger('default');
    }
  }, [isComputerTurn, board, isGameOver,winner,playerSymbol]);

  

  const handleClick = (index: number) => {
    if (board[index] || isGameOver || isComputerTurn) return;

    const newBoard = [...board];
    newBoard[index] = playerSymbol;
    setBoard(newBoard);

    const playerWon = checkWinner(newBoard);
    if (playerWon) {
      setWinner(playerSymbol);
      setIsGameOver(true);
      return;
    }

    if (isBoardFull(newBoard)) {
      setIsGameOver(true);
      return;
    }

    setIsComputerTurn(true);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsGameOver(false);
    setWinner(null);
    setIsComputerTurn(false);
    if (onPlayAgain) onPlayAgain();  // Call parent callback to choose new letters
  };

  // Inline style objects
  const containerStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    borderRadius: "1rem",
    boxShadow: "0px 10px 15px rgba(0,0,0,0.1)",
    padding: "2rem",
    maxWidth: "28rem",
    width: "100%",
    margin: "auto",
    marginBottom: "15rem"
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#2d3748"
  };

  const statusStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: "1rem",
    fontSize: "1.125rem",
    fontWeight: 500
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "0.75rem",
    marginBottom: "1.5rem"
  };

  const cellBaseStyle: React.CSSProperties = {
    height: "6rem",
    borderRadius: "0.5rem",
    fontSize: "2.25rem",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s"
  };

  const gameOverTextStyle: React.CSSProperties = {
    fontSize: "1.25rem",
    marginBottom: "1rem"
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: "#5a67d8",
    color: "#fff",
    padding: "0.5rem 1.5rem",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer"
  };

  const infoStyle: React.CSSProperties = {
    marginTop: "1.5rem",
    textAlign: "center",
    color: "#718096"
  };

  const difficultyStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    color: "#718096",
    marginTop: "0.5rem"
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Tic Tac Toe</h1>
      
      {!isGameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={statusStyle}
        >
          {isComputerTurn ? (
            <p style={{ color: "#f56565" }}>Computer is thinking...</p>
          ) : (
            <p style={{ color: "#4299e1" }}>Your turn!</p>
          )}
        </motion.div>
      )}

      <div style={gridStyle}>
        {board.map((cell, index) => {
          // Determine background and cursor style based on state
          const cellStyle: React.CSSProperties = {
            ...cellBaseStyle,
            backgroundColor: cell ? "#f7fafc" : "#edf2f7",
            cursor: (!cell && !isGameOver && !isComputerTurn) ? "pointer" : "default"
          };
          return (
            <motion.button
              key={index}
              style={cellStyle}
              onClick={() => handleClick(index)}
              disabled={isComputerTurn}
            >
              {cell && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ color: cell === playerSymbol ? "#4299e1" : "#f56565" }}
                >
                  {cell}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      {isGameOver && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: "center" }}
        >
          <p style={gameOverTextStyle}>
            {winner
              ? `${winner === playerSymbol ? "You won!" : "Computer won!"}`
              : "It's a draw!"}
          </p>
          <button onClick={resetGame} style={buttonStyle}>
            Play Again
          </button>
        </motion.div>
      )}

      <div style={infoStyle}>
        <p>You: {playerSymbol} | Computer: {computerSymbol}</p>
      </div>
    </div>
  );
};

export default TicTacToe;