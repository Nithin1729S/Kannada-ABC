// lib/getNextLetter.ts

/**
 * Returns the next letter (number 1-49) that has the lowest score for a given activity.
 *
 * @param user - The user document containing letter score fields.
 * @param field - Either "learn" or "practice" to choose the corresponding score.
 * @returns The letter number (1 to 49) with the lowest score.
 */
export function getNextLetter(user: any, field: "learn" | "practice"): number {
    let nextLetter = 1;
    let lowestScore = Number.MAX_VALUE;
  
    for (let i = 1; i <= 49; i++) {
      const score = user[`letter${i}_${field}`] ?? 0;
      if (score < lowestScore) {
        lowestScore = score;
        nextLetter = i;
      }
    }
    
    return nextLetter;
  }
  