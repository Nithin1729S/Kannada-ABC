// /pages/api/getBestScore.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from "../../lib/@props/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, field } = req.query;
  
  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Email is required' });
    return;
  }
  
  if (!field || typeof field !== 'string') {
    res.status(400).json({ error: 'Field is required' });
    return;
  }

  try {
    const client = await clientPromise;
    const db = client.db('test'); 
    const user = await db.collection('users').findOne({ email });
    
    if (user) {
      // Return the field value or 0 if it doesn't exist
      res.status(200).json({ score: user[field] || 0 });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching score' });
  }
}
