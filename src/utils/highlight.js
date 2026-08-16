/** Sorts and merges overlapping/adjacent [start, end] ranges into a clean, non-overlapping list. */
export function mergeHighlights(ranges) {
  if (ranges.length === 0) return []
  const sorted = [...ranges].sort((a, b) => a.start - b.start)
  const merged = [sorted[0]]

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1]
    const current = sorted[i]
    if (current.start <= last.end) {
      last.end = Math.max(last.end, current.end)
    } else {
      merged.push({ ...current })
    }
  }
  return merged
}

/**
 * Splits `text` into an ordered list of { text, highlighted } segments
 * based on a set of non-overlapping [start, end] character ranges.
 */
export function splitTextWithHighlights(text, ranges) {
  if (!ranges || ranges.length === 0) return [{ text, highlighted: false }]

  const segments = []
  let cursor = 0

  for (const { start, end } of ranges) {
    const s = Math.max(0, Math.min(start, text.length))
    const e = Math.max(0, Math.min(end, text.length))
    if (s > cursor) segments.push({ text: text.slice(cursor, s), highlighted: false })
    if (e > s) segments.push({ text: text.slice(s, e), highlighted: true })
    cursor = Math.max(cursor, e)
  }

  if (cursor < text.length) segments.push({ text: text.slice(cursor), highlighted: false })

  return segments
}
