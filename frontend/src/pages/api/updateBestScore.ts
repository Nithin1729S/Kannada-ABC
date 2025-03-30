// /pages/api/updateBestScore.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from "../../lib/@props/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { email, score, field } = req.body;
  
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
    await db.collection('users').updateOne(
      { email },
      { $set: { [field]: score } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating score' });
  }
}
