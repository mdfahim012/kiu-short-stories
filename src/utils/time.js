export function formatRelativeTime(createdAt) {
  if (!createdAt) return 'এইমাত্র'
  const millis = typeof createdAt.toMillis === 'function' ? createdAt.toMillis() : Date.now()
  const diffSec = Math.max(0, Math.floor((Date.now() - millis) / 1000))

  if (diffSec < 60) return 'এইমাত্র'
  const diffMin = Math.floor(diffSec / 60)
  if (diffMin < 60) return `${diffMin} মিনিট আগে`
  const diffHr = Math.floor(diffMin / 60)
  if (diffHr < 24) return `${diffHr} ঘণ্টা আগে`
  const diffDay = Math.floor(diffHr / 24)
  if (diffDay < 7) return `${diffDay} দিন আগে`
  const diffWeek = Math.floor(diffDay / 7)
  if (diffWeek < 5) return `${diffWeek} সপ্তাহ আগে`
  const diffMonth = Math.floor(diffDay / 30)
  return `${diffMonth} মাস আগে`
}
