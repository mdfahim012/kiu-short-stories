const IMGBB_API_KEY = '87a833839db5f0b19edd0fe38fc7852f'

/**
 * Uploads an image file to ImgBB and returns the permanent hosted URL.
 * ImgBB is used instead of Firebase Storage to keep hosting 100% free
 * (Firebase Storage now requires the Blaze billing plan for any usage).
 */
export async function uploadImageToImgbb(file) {
  const formData = new FormData()
  formData.append('image', file)

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()

  if (!data.success) {
    throw new Error(data.error?.message || 'Image upload failed')
  }

  return data.data.url
}
