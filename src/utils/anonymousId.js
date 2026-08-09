import { doc, runTransaction } from 'firebase/firestore'
import { db } from '../firebase/config'

const PREFIX = 'Kiubian-2026'
const COUNTER_DOC = doc(db, 'meta', 'kiubianCounter')

/**
 * Atomically increments the global Kiubian counter and returns a new,
 * permanent, globally-unique anonymous identity string.
 * e.g. Kiubian-2026001, Kiubian-2026002, ...
 * The numeric suffix is zero-padded to at least 3 digits and grows
 * automatically beyond 999 without breaking the prefix.
 */
export async function generateAnonymousId() {
  const newId = await runTransaction(db, async (transaction) => {
    const counterSnap = await transaction.get(COUNTER_DOC)
    let nextCount = 1
    if (counterSnap.exists()) {
      nextCount = (counterSnap.data().count || 0) + 1
    }
    transaction.set(COUNTER_DOC, { count: nextCount }, { merge: true })
    return nextCount
  })

  const padded = String(newId).padStart(3, '0')
  return `${PREFIX}${padded}`
}
