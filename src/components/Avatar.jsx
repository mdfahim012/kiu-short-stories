import { useState } from 'react'
import { getAvatarPalette } from '../utils/avatar'

/**
 * Renders the user's own uploaded photo when set (photoUrl), otherwise
 * falls back to a permanent, auto-assigned 2D illustrated avatar based
 * on gender.
 */
export default function Avatar({ gender = 'male', seed = '', size = 44, className = '', photoUrl = null }) {
  const [loaded, setLoaded] = useState(false)

  if (photoUrl) {
    return (
      <div
        className={`rounded-full overflow-hidden shadow-neo-light-sm dark:shadow-neo-dark-sm shrink-0 bg-slate-200 dark:bg-slate-700 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={photoUrl}
          alt="avatar"
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
        />
      </div>
    )
  }

  return <GeneratedAvatar gender={gender} seed={seed} size={size} className={className} />
}

function GeneratedAvatar({ gender, seed, size, className }) {
  const { skin, hair, shirt } = getAvatarPalette(gender, seed)
  const isFemale = gender === 'female'
  const uid = `${gender}-${seed}`.replace(/[^a-zA-Z0-9]/g, '')

  return (
    <div
      className={`rounded-full overflow-hidden shadow-neo-light-sm dark:shadow-neo-dark-sm shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <defs>
          <radialGradient id={`skin-${uid}`} cx="42%" cy="35%" r="75%">
            <stop offset="0%" stopColor={skin} stopOpacity="1" />
            <stop offset="100%" stopColor={shade(skin, -14)} stopOpacity="1" />
          </radialGradient>
          <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eef1f5" />
            <stop offset="100%" stopColor="#dde2e8" />
          </linearGradient>
        </defs>

        <circle cx="50" cy="50" r="50" fill={`url(#bg-${uid})`} />

        {/* shoulders / shirt */}
        <path d="M4 100 Q50 66 96 100 Z" fill={shirt} />
        <path d="M4 100 Q50 72 96 100 Z" fill={shade(shirt, -10)} opacity="0.55" />
        {/* collar */}
        <path d="M40 70 L50 82 L60 70" fill="none" stroke={shade(shirt, -25)} strokeWidth="2.5" strokeLinejoin="round" />

        {/* neck */}
        <path d="M40 58 L40 74 Q50 80 60 74 L60 58 Z" fill={shade(skin, -8)} />

        {/* ears */}
        <ellipse cx="27" cy="48" rx="4" ry="6" fill={skin} />
        <ellipse cx="73" cy="48" rx="4" ry="6" fill={skin} />

        {/* head */}
        <ellipse cx="50" cy="42" rx="21" ry="23" fill={`url(#skin-${uid})`} />

        {/* hair */}
        {isFemale ? (
          <>
            <path
              d="M27 44 Q23 14 50 12 Q77 14 73 44 Q76 62 68 74 Q71 50 63 40 Q57 50 50 40 Q43 50 37 40 Q29 50 32 74 Q24 62 27 44 Z"
              fill={hair}
            />
            <path d="M27 44 Q26 30 30 22" stroke={shade(hair, 12)} strokeWidth="1.5" fill="none" opacity="0.5" />
          </>
        ) : (
          <>
            <path
              d="M27 40 Q25 15 50 14 Q75 15 73 40 Q73 28 66 24 Q60 30 50 26 Q40 30 34 24 Q27 28 27 40 Z"
              fill={hair}
            />
            <path d="M50 14 Q35 15 30 26" stroke={shade(hair, 12)} strokeWidth="1.2" fill="none" opacity="0.4" />
          </>
        )}

        {/* eyebrows */}
        <path d="M38 39 Q42 36.5 46 38.5" stroke={shade(hair, -6)} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M54 38.5 Q58 36.5 62 39" stroke={shade(hair, -6)} strokeWidth="1.8" fill="none" strokeLinecap="round" />

        {/* eyes */}
        <ellipse cx="42" cy="43" rx="2.3" ry="2.7" fill="#2d2118" />
        <ellipse cx="58" cy="43" rx="2.3" ry="2.7" fill="#2d2118" />
        <circle cx="41.3" cy="42.1" r="0.6" fill="#fff" />
        <circle cx="57.3" cy="42.1" r="0.6" fill="#fff" />

        {/* nose */}
        <path d="M49 44 Q47.5 50 50 51.5 Q52 51 51 49" stroke={shade(skin, -30)} strokeWidth="1.2" fill="none" strokeLinecap="round" />

        {/* lips */}
        <path d="M43 57 Q50 60.5 57 57" stroke={shade('#a8543a', 0)} strokeWidth="2.2" fill="none" strokeLinecap="round" />

        {/* cheeks (subtle) */}
        <ellipse cx="35" cy="50" rx="4" ry="2.5" fill={shade(skin, -20)} opacity="0.25" />
        <ellipse cx="65" cy="50" rx="4" ry="2.5" fill={shade(skin, -20)} opacity="0.25" />
      </svg>
    </div>
  )
}

// Lightens (positive amount) or darkens (negative amount) a hex color.
function shade(hex, amount) {
  const clean = hex.replace('#', '')
  const num = parseInt(clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean, 16)
  let r = (num >> 16) + amount
  let g = ((num >> 8) & 0x00ff) + amount
  let b = (num & 0x0000ff) + amount
  r = Math.max(0, Math.min(255, r))
  g = Math.max(0, Math.min(255, g))
  b = Math.max(0, Math.min(255, b))
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}
