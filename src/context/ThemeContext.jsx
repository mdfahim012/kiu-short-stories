import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)

export const LOGO_URL = 'https://i.ibb.co.com/WptbFh8g/FB-IMG-1749563621075.jpg'

function rgbToHsl(r, g, b) {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h, s
  const l = (max + min) / 2
  if (max === min) {
    h = s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h /= 6
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

// Samples the logo image on a canvas and derives an average color,
// which is then applied as the site's primary color palette.
function extractPaletteFromLogo(url) {
  const img = new Image()
  img.crossOrigin = 'Anonymous'
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas')
      const size = 32
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, size, size)
      const data = ctx.getImageData(0, 0, size, size).data
      let r = 0,
        g = 0,
        b = 0,
        count = 0
      for (let i = 0; i < data.length; i += 4) {
        const alpha = data[i + 3]
        if (alpha < 100) continue
        r += data[i]
        g += data[i + 1]
        b += data[i + 2]
        count++
      }
      if (!count) return
      r = r / count
      g = g / count
      b = b / count
      let [h, s, l] = rgbToHsl(r, g, b)
      s = Math.max(s, 55)
      l = Math.min(Math.max(l, 35), 55)
      document.documentElement.style.setProperty('--primary-h', h)
      document.documentElement.style.setProperty('--primary-s', `${s}%`)
      document.documentElement.style.setProperty('--primary-l', `${l}%`)
    } catch (e) {
      // Canvas may be tainted by CORS; fall back to default palette silently.
      console.warn('Palette extraction skipped:', e)
    }
  }
  img.src = url
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('kiu-theme') || 'light')

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('kiu-theme', theme)
  }, [theme])

  useEffect(() => {
    extractPaletteFromLogo(LOGO_URL)
  }, [])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
