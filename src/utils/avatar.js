// Deterministically picks an avatar variant (0-2) from a seed string
// so the same user always gets the same look, without letting them change it.
export function seedToVariant(seed = '', variantCount = 3) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % variantCount
}

export const MALE_PALETTES = [
  { skin: '#e5b48a', hair: '#2b2118', shirt: '#3b82f6' },
  { skin: '#c98a5c', hair: '#171310', shirt: '#10b981' },
  { skin: '#f2c9a1', hair: '#4a3524', shirt: '#f59e0b' },
]

export const FEMALE_PALETTES = [
  { skin: '#f2c9a1', hair: '#3d1f12', shirt: '#ec4899' },
  { skin: '#e5b48a', hair: '#1c130d', shirt: '#a855f7' },
  { skin: '#c98a5c', hair: '#241a12', shirt: '#14b8a6' },
]

export function getAvatarPalette(gender, seed) {
  const variant = seedToVariant(seed)
  return gender === 'female' ? FEMALE_PALETTES[variant] : MALE_PALETTES[variant]
}
