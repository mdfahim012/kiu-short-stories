import { getAvatarPalette } from '../utils/avatar'

/**
 * Renders a permanent, auto-assigned SVG avatar based on gender.
 * Male and female avatars differ in hairstyle, clothing shape, and color.
 */
export default function Avatar({ gender = 'male', seed = '', size = 44, className = '' }) {
  const { skin, hair, shirt } = getAvatarPalette(gender, seed)
  const isFemale = gender === 'female'

  return (
    <div
      className={`rounded-full overflow-hidden shadow-neo-light-sm dark:shadow-neo-dark-sm shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="50" fill="#dfe4ea" />
        {/* shirt / shoulders */}
        <path d="M10 100 Q50 70 90 100 L90 100 L10 100 Z" fill={shirt} />
        {isFemale && (
          <path d="M6 100 Q50 62 94 100 L94 100 L6 100 Z" fill={shirt} opacity="0.85" />
        )}
        {/* neck */}
        <rect x="42" y="55" width="16" height="18" fill={skin} />
        {/* head */}
        <circle cx="50" cy="42" r="22" fill={skin} />
        {/* hair */}
        {isFemale ? (
          <path
            d="M28 40 Q26 15 50 14 Q74 15 72 40 Q74 55 68 66 Q70 46 62 40 Q56 48 50 40 Q44 48 38 40 Q30 46 32 66 Q26 55 28 40 Z"
            fill={hair}
          />
        ) : (
          <path
            d="M28 36 Q26 16 50 16 Q74 16 72 36 Q72 26 50 24 Q28 26 28 36 Z"
            fill={hair}
          />
        )}
        {/* eyes */}
        <circle cx="42" cy="44" r="2.2" fill="#2d2d2d" />
        <circle cx="58" cy="44" r="2.2" fill="#2d2d2d" />
        {/* smile */}
        <path d="M42 52 Q50 58 58 52" stroke="#7a4a2f" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}
