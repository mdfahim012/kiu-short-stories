import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { useAuth } from '../context/AuthContext'
import { STORY_BACKGROUNDS } from '../utils/storyBackgrounds'
import { computeStoryFontSize, STORY_MAX_WORDS, countWords } from '../utils/storyTypography'
import { mergeHighlights, splitTextWithHighlights } from '../utils/highlight'
import { generateStoryNumber } from '../utils/storyNumber'
import { uploadImageToImgbb } from '../services/upload'
import { createPost } from '../services/posts'

export default function StoryCardEditor({ onPosted, onBack }) {
  const { profile } = useAuth()
  const [bg, setBg] = useState(STORY_BACKGROUNDS[0])
  const [text, setText] = useState('')
  const [highlights, setHighlights] = useState([])
  const [selection, setSelection] = useState(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const textareaRef = useRef(null)
  const previewRef = useRef(null)

  const wordCount = countWords(text)
  const fontSize = computeStoryFontSize(text.length)
  const segments = splitTextWithHighlights(text, highlights)

  function handleTextChange(e) {
    const val = e.target.value
    const words = val.trim().split(/\s+/).filter(Boolean)
    if (words.length > STORY_MAX_WORDS) {
      setText(words.slice(0, STORY_MAX_WORDS).join(' '))
    } else {
      setText(val)
    }
    // Editing invalidates old character positions, so drop stale highlights.
    setHighlights([])
    setSelection(null)
  }

  // Mobile browsers don't always fire the "select" event reliably, so we
  // check the current selection on every interaction that could change it.
  function captureSelection() {
    const el = textareaRef.current
    if (!el) return
    const { selectionStart, selectionEnd } = el
    if (selectionEnd > selectionStart) {
      setSelection({ start: selectionStart, end: selectionEnd })
    }
  }

  function applyHighlight() {
    // Re-read the live selection right before applying, in case a stale
    // state value from an earlier render slipped through.
    const el = textareaRef.current
    const live =
      el && el.selectionEnd > el.selectionStart
        ? { start: el.selectionStart, end: el.selectionEnd }
        : selection
    if (!live) return
    setHighlights((prev) => mergeHighlights([...prev, live]))
    setSelection(null)
  }

  function clearHighlights() {
    setHighlights([])
  }

  async function handlePost() {
    if (!text.trim()) {
      setError('গল্পের লেখাটা লিখো')
      return
    }
    setBusy(true)
    setError('')
    try {
      const storyNumber = await generateStoryNumber()

      const dataUrl = await toPng(previewRef.current, {
        cacheBust: true,
        pixelRatio: 2,
      })
      const blob = await (await fetch(dataUrl)).blob()
      const file = new File([blob], `story-${storyNumber}.png`, { type: 'image/png' })
      const imageUrl = await uploadImageToImgbb(file)

      await createPost({
        authorUid: profile.uid,
        authorName: profile.anonymousName,
        authorGender: profile.gender,
        authorPhotoURL: profile.photoURL || null,
        caption: '',
        imageUrl,
        type: 'story',
        storyNumber,
      })

      onPosted?.()
    } catch (e) {
      console.error(e)
      setError('পোস্ট করতে সমস্যা হয়েছে, আবার চেষ্টা করো')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Background picker */}
      <div className="flex gap-3">
        {STORY_BACKGROUNDS.map((b) => (
          <button
            key={b.id}
            onClick={() => setBg(b)}
            className={`flex-1 rounded-xl overflow-hidden border-2 transition-all ${
              bg.id === b.id ? 'border-blue-500' : 'border-transparent opacity-70'
            }`}
          >
            <img src={b.url} alt={b.label} className="w-full h-16 object-cover" crossOrigin="anonymous" />
          </button>
        ))}
      </div>

      {/* Live preview — just your background image, full size, with only the
          story text (and highlights) centered on top. No added branding. */}
      <div ref={previewRef} className="relative w-full mx-auto">
        <img
          src={bg.url}
          alt="background"
          crossOrigin="anonymous"
          className="w-full h-auto block select-none"
          draggable={false}
        />

        <div className="absolute inset-0 flex items-center justify-center px-8 py-10">
          <p
            className="bangla-text text-white font-bold leading-snug break-words text-center"
            style={{ fontSize: `${fontSize}px` }}
          >
            {segments.map((seg, i) =>
              seg.highlighted ? (
                <mark key={i} className="bg-red-600 text-white px-1 rounded-sm box-decoration-clone">
                  {seg.text}
                </mark>
              ) : (
                <span key={i}>{seg.text}</span>
              )
            )}
            {!text && <span className="opacity-50">তোমার ছোট গল্পটা এখানে লিখতে শুরু করো...</span>}
          </p>
        </div>
      </div>

      {/* Text input + tools */}
      <div>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onSelect={captureSelection}
          onMouseUp={captureSelection}
          onTouchEnd={captureSelection}
          onKeyUp={captureSelection}
          placeholder="গল্প লিখো (সর্বোচ্চ ১০০ শব্দ)..."
          rows={4}
          className="neo-inset w-full p-3 bg-transparent outline-none text-sm rounded-2xl"
        />
        <p className="text-xs text-slate-400 mt-1 text-right">{wordCount} / {STORY_MAX_WORDS} শব্দ</p>
      </div>

      <div className="flex gap-2">
        <button onClick={applyHighlight} className="flex-1 neo-btn text-sm py-2">
          🖍️ Highlight
        </button>
        <button onClick={clearHighlights} disabled={highlights.length === 0} className="flex-1 neo-btn text-sm py-2 disabled:opacity-40">
          Clear Highlights
        </button>
      </div>
      <p className="text-[11px] text-slate-400 -mt-2">
        উপরের টেক্সট বক্সে আঙুল দিয়ে চেপে ধরে শব্দ/লাইন সিলেক্ট করো, তারপর Highlight চাপো। টেক্সট এডিট করলে হাইলাইট রিসেট হয়ে যাবে — লেখা শেষ করে হাইলাইট করো।
      </p>

      {error && <p className="text-red-500 text-xs text-center">{error}</p>}

      <div className="flex gap-2">
        <button onClick={onBack} className="neo-btn text-sm py-2.5">
          ← Back
        </button>
        <button
          onClick={handlePost}
          disabled={busy}
          className="flex-1 neo-btn primary-gradient text-white text-sm py-2.5 disabled:opacity-60"
        >
          {busy ? 'পোস্ট হচ্ছে...' : 'Post Story'}
        </button>
      </div>
    </div>
  )
}
