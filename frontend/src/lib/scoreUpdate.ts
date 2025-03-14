// lib/updateLetterScore.ts
import clientPromise from "./@props/mongodb"; // adjust the path as needed

const alpha = 0.2; // Smoothing factor (adjust as needed)

/**
 * Updates the letter score for a user using an exponential weighted average.
 *
 * @param email - The user's email.
 * @param letterNumber - The number representing the letter (1 to 49).
 * @param field - The field to update, either "learn" or "practice".
 * @param newEntry - The new value to incorporate.
 */
export async function updateLetterScore(
  email: string,
  letterNumber: number,
  field: "learn",
  newEntry: number
): Promise<void> {
  const client = await clientPromise;
  const db = client.db();

  const fieldName = `letter${letterNumber}_${field}`;
  const user = await db.collection("users").findOne({ email });
  if (!user) {
    throw new Error("User not found");
  }

  const prevValue = user[fieldName] || 0;
  const newValue = alpha * newEntry + (1 - alpha) * prevValue;

  await db.collection("users").updateOne(
    { email },
    { $set: { [fieldName]: newValue } }
  );
}
