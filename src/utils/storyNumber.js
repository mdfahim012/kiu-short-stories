import { doc, runTransaction } from 'firebase/firestore'
import { db } from '../firebase/config'

const COUNTER_DOC = doc(db, 'meta', 'storyCounter')

/** Returns the next globally-unique, zero-padded story number, e.g. "001". */
export async function generateStoryNumber() {
  const next = await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(COUNTER_DOC)
    const nextCount = snap.exists() ? (snap.data().count || 0) + 1 : 1
    transaction.set(COUNTER_DOC, { count: nextCount }, { merge: true })
    return nextCount
  })
  return String(next).padStart(3, '0')
}
