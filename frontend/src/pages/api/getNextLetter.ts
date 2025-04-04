// /pages/api/getNextLetter.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/@props/mongodb';
const DATABASE_NAME=process.env.DATABASE_NAME
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, ignore } = req.query;
  
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db(DATABASE_NAME);
    const user = await db.collection('users').findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let minScore = Infinity;
    let minLetterNumber = Infinity;

    for (let i = 1; i <= 49; i++) {
      if (ignore && Number(ignore) === i) continue;
      const fieldName = `letter_score_${i}`;
      const scoreData = user[fieldName] || { correct: 0, attempted: 0 };
      const { correct, attempted } = scoreData;
      const calculatedScore = attempted > 0 ? ((correct * 3) / attempted) : 0;
      if (calculatedScore < minScore || (calculatedScore === minScore && i < minLetterNumber)) {
        minScore = calculatedScore;
        minLetterNumber = i;
      }
    }
    if (minScore === Infinity || minLetterNumber === Infinity) {
      return res.status(200).json({ letter: 1 });
    }
    return res.status(200).json({ letter: minLetterNumber });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching next letter' });
  }
}
