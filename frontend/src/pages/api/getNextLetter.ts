// /pages/api/getNextLetter.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/@props/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, ignore } = req.query;
  
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('test'); // replace if needed
    const user = await db.collection('users').findOne({ email });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let minScore = Infinity;
    let minField = '';
    
    // Iterate through letter_score_1 to letter_score_49
    for (let i = 1; i <= 49; i++) {
      // If the ignore parameter is provided and equals the current index, skip it.
      if (ignore && Number(ignore) === i) continue;
      
      const fieldName = `letter_score_${i}`;
      const score = typeof user[fieldName] === 'number' ? user[fieldName] : Infinity;
      
      if (score < minScore) {
        minScore = score;
        minField = fieldName;
      }
    }
    
    // If no score was found, return a default value.
    if (minScore === Infinity || !minField) {
      return res.status(200).json({ letter: 1 });
    }
    
    // Extract the letter number from the field name.
    const letterNumber = parseInt(minField.replace('letter_score_', ''), 10);
    return res.status(200).json({ letter: letterNumber });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching next letter' });
  }
}
