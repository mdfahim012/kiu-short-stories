// Computes the story card's font size from the character count, so the
// text always fills the card nicely: short lines get big bold type,
// long paragraphs automatically shrink to keep fitting within the frame.
export function computeStoryFontSize(charCount) {
  if (charCount <= 40) return 42
  if (charCount <= 80) return 34
  if (charCount <= 150) return 27
  if (charCount <= 300) return 21
  if (charCount <= 450) return 17
  return 14
}

export const STORY_MAX_WORDS = 100

export function countWords(text) {
  const trimmed = text.trim()
  if (!trimmed) return 0
  return trimmed.split(/\s+/).filter(Boolean).length
}
