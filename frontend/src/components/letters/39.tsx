import React from 'react'
import ConnectDots from './ConnectDots'
import styles from './Star.module.css' // ✅ Import CSS Module

interface Dot {
  id: number
  x: number
  y: number
}

const C: React.FC = () => {
  const dots: Dot[] = [
    { id: 1, x: 350, y: 100 },
    { id: 2, x: 300, y: 50 },
    { id: 3, x: 200, y: 50 },
    { id: 4, x: 150, y: 100 },
    { id: 5, x: 150, y: 170 },
    { id: 6, x: 200, y: 225 },
    { id: 7, x: 300, y: 225 },
    { id: 8, x: 350, y: 300 },
    { id: 9, x: 300, y: 400 },
    { id: 10, x: 200, y: 400 },
    { id: 11, x: 150, y: 350 },
  ]

  return (
    <div className={styles.container}> 
      <h2 className={styles.title}>Connect the ಭ </h2>
      <p className={styles.description}>
        Connect the dots in numerical order to form the letter ಭ . Start with dot 1 and continue connecting
        until you reach dot 10.
      </p>
      <ConnectDots dots={dots} />
    </div>
  )
}

export default C;
