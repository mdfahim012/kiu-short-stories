import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  setDoc,
  runTransaction,
  serverTimestamp,
  increment,
  query,
  orderBy,
  limit as fsLimit,
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { createNotification } from './notifications'

const POSTS_COL = 'posts'

/** Creates a new post (Photo + Caption, or Short Story Card) and bumps the author's post count. */
export async function createPost({
  authorUid,
  authorName,
  authorGender,
  authorPhotoURL = null,
  caption,
  imageUrl,
  type = 'photo',
  storyNumber = null,
}) {
  const data = {
    authorUid,
    authorName,
    authorGender,
    authorPhotoURL,
    type,
    caption: caption || '',
    imageUrl,
    likeCount: 0,
    loveCount: 0,
    hahaCount: 0,
    commentCount: 0,
    shareCount: 0,
    createdAt: serverTimestamp(),
  }
  if (storyNumber) data.storyNumber = storyNumber

  const postRef = await addDoc(collection(db, POSTS_COL), data)

  await updateDoc(doc(db, 'users', authorUid), { postCount: increment(1) })

  return postRef.id
}

export async function updatePostCaption(postId, caption) {
  await updateDoc(doc(db, POSTS_COL, postId), { caption })
}

export async function deletePost(postId, authorUid) {
  await deleteDoc(doc(db, POSTS_COL, postId))
  await updateDoc(doc(db, 'users', authorUid), { postCount: increment(-1) })
}

/**
 * Fetches the most recent posts (used as the base pool for the ranked feed).
 * The Facebook-style ranking itself is computed client-side in feedRanking.js.
 */
export async function fetchRecentPosts(count = 60) {
  const q = query(collection(db, POSTS_COL), orderBy('createdAt', 'desc'), fsLimit(count))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function fetchPostsByAuthor(authorUid) {
  const q = query(collection(db, POSTS_COL), orderBy('createdAt', 'desc'), fsLimit(200))
  const snap = await getDocs(q)
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((p) => p.authorUid === authorUid)
}

/** Returns the current user's reaction type ('like' | 'love' | 'haha') for a post, or null. */
export async function getUserReaction(postId, uid) {
  const snap = await getDoc(doc(db, POSTS_COL, postId, 'reactions', uid))
  return snap.exists() ? snap.data().type : null
}

const REACTION_FIELD = {
  like: 'likeCount',
  love: 'loveCount',
  haha: 'hahaCount',
}

/**
 * Adds, switches, or removes a reaction, keeping the denormalized
 * counters on the post document in sync via a transaction. Notifies
 * the post owner when a brand-new reaction is added (not on removal).
 */
export async function toggleReaction(postId, uid, type, postAuthorUid, fromName, fromGender, fromPhotoURL) {
  const postRef = doc(db, POSTS_COL, postId)
  const reactionRef = doc(db, POSTS_COL, postId, 'reactions', uid)
  let isNewReaction = false

  await runTransaction(db, async (transaction) => {
    const reactionSnap = await transaction.get(reactionRef)
    const previousType = reactionSnap.exists() ? reactionSnap.data().type : null

    if (previousType === type) {
      // Same reaction tapped again -> remove it
      transaction.delete(reactionRef)
      transaction.update(postRef, { [REACTION_FIELD[type]]: increment(-1) })
      return
    }

    if (previousType) {
      transaction.update(postRef, { [REACTION_FIELD[previousType]]: increment(-1) })
    } else {
      isNewReaction = true
    }

    transaction.set(reactionRef, { type, uid })
    transaction.update(postRef, { [REACTION_FIELD[type]]: increment(1) })
  })

  if (isNewReaction && postAuthorUid) {
    await createNotification(postAuthorUid, {
      type: 'reaction',
      reactionType: type,
      postId,
      fromUid: uid,
      fromName,
      fromGender: fromGender || 'male',
      fromPhotoURL: fromPhotoURL || null,
    })
  }
}

export async function addComment(postId, { authorUid, authorName, authorGender, authorPhotoURL, text }, postAuthorUid) {
  await addDoc(collection(db, POSTS_COL, postId, 'comments'), {
    authorUid,
    authorName,
    authorGender,
    authorPhotoURL: authorPhotoURL || null,
    text,
    createdAt: serverTimestamp(),
  })
  await updateDoc(doc(db, POSTS_COL, postId), { commentCount: increment(1) })

  if (postAuthorUid) {
    await createNotification(postAuthorUid, {
      type: 'comment',
      postId,
      fromUid: authorUid,
      fromName: authorName,
      fromGender: authorGender || 'male',
      fromPhotoURL: authorPhotoURL || null,
      text: text.slice(0, 80),
    })
  }
}

export async function fetchComments(postId) {
  const q = query(collection(db, POSTS_COL, postId, 'comments'), orderBy('createdAt', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function registerShare(postId) {
  await updateDoc(doc(db, POSTS_COL, postId), { shareCount: increment(1) })
}
