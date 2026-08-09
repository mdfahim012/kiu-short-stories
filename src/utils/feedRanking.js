// Computes a Reddit/Hacker-News-style ranking score that favors both
// recency and engagement, matching the spec's requirements:
//   - Recent posts
//   - Reaction count
//   - Comment count
//   - Engagement score
//   - Trending score
//   - New posts get initial visibility
//   - More engaged posts rank higher over time

const GRAVITY = 1.6

function toMillis(createdAt) {
  if (!createdAt) return Date.now()
  if (typeof createdAt.toMillis === 'function') return createdAt.toMillis()
  return Date.now()
}

export function computeEngagementScore(post) {
  const reactions = (post.likeCount || 0) + (post.loveCount || 0) * 1.2 + (post.hahaCount || 0)
  const comments = (post.commentCount || 0) * 2.5
  const shares = (post.shareCount || 0) * 3
  return reactions + comments + shares
}

export function computeRankScore(post) {
  const ageHours = Math.max(0, (Date.now() - toMillis(post.createdAt)) / 3_600_000)
  // The "+1" base score guarantees brand-new posts (0 engagement) still
  // surface near the top of the feed instead of sinking to the bottom.
  const engagement = computeEngagementScore(post) + 1
  return engagement / Math.pow(ageHours + 2, GRAVITY)
}

export function rankPosts(posts) {
  return [...posts].sort((a, b) => computeRankScore(b) - computeRankScore(a))
}
