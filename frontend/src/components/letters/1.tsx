import React from 'react'
import ConnectDots from './ConnectDots'
import styles from './Star.module.css' // ✅ Import CSS Module

interface Dot {
  id: number
  x: number
  y: number
}

const A: React.FC = () => {
  const dots: Dot[] = [
    { id: 1, x: 150, y: 150 },  // Top of the left vertical stroke
    { id: 2, x: 190, y: 180 },   // Start curving to the right at the top
    { id: 3, x: 220, y: 120 },  // Upper right curve
    { id: 4, x: 370, y: 200 },  // Far right of the curve
    { id: 5, x: 350, y: 280 },  // Lower right curve
    { id: 6, x: 250, y: 320 },  // Bottom center of the curved part
    { id: 7, x: 150, y: 280 },  // Bottom left curve
    { id: 8, x: 150, y: 200 },  // Back up along the left vertical stroke
  ];
  

  return (
    <div className={styles.container}> 
      <h2 className={styles.title}>Connect the ಅ</h2>
      <p className={styles.description}>
        Connect the dots in numerical order to form the letter ಅ. Start with dot 1 and continue connecting
        until you reach dot 10.
      </p>
      <ConnectDots dots={dots} />
    </div>
  )
}

export default A;
