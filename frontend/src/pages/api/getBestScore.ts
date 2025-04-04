import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from "../../lib/@props/mongodb";
const DATABASE_NAME=process.env.DATABASE_NAME
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  try {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    const user = await db.collection('users').findOne({ email });

    if (user) {
      // Extract all letter scores from the user object
      const scores: { [key: string]: { correct: number; attempted: number } } = {};
      for (let i = 1; i <= 49; i++) {
        const field = `letter_score_${i}`;
        const scoreData = user[field] || { correct: 0, attempted: 0 };
        scores[field] = {
          correct: scoreData.correct || 0,
          attempted: scoreData.attempted || 0,
        };
      }
      res.status(200).json({ 
        scores,
        snakeGameBestScore: user.snakeGameBestScore || 0 ,
        bubblePopBestScore: user.bubblePopBestScore || 0 ,
        bucketCatchBestScore: user.bucketCatchBestScore || 0 
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching scores' });
  }
}
