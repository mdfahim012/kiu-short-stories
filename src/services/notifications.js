import {
  collection,
  addDoc,
  doc,
  getDocs,
  query,
  orderBy,
  limit as fsLimit,
  writeBatch,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'

/** Notifies a post's owner about a reaction or comment (never notifies yourself). */
export async function createNotification(toUid, data) {
  if (!toUid || !data.fromUid || toUid === data.fromUid) return
  await addDoc(collection(db, 'users', toUid, 'notifications'), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  })
}

export async function fetchNotifications(uid, count = 30) {
  const q = query(
    collection(db, 'users', uid, 'notifications'),
    orderBy('createdAt', 'desc'),
    fsLimit(count)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function markAllNotificationsRead(uid, notifications) {
  const unread = notifications.filter((n) => !n.read)
  if (unread.length === 0) return
  const batch = writeBatch(db)
  unread.forEach((n) => {
    batch.update(doc(db, 'users', uid, 'notifications', n.id), { read: true })
  })
  await batch.commit()
}
