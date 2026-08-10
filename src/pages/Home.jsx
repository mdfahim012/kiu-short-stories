import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchRecentPosts } from '../services/posts'
import { rankPosts } from '../utils/feedRanking'
import CreatePostBox from '../components/CreatePostBox'
import PostCard from '../components/PostCard'

const PAGE_SIZE = 10

export default function Home() {
  const { profile } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [loadingMore, setLoadingMore] = useState(false)

  const loadFeed = useCallback(async (count) => {
    const recent = await fetchRecentPosts(count)
    setPosts(rankPosts(recent))
  }, [])

  useEffect(() => {
    setLoading(true)
    loadFeed(visibleCount).finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleLoadMore() {
    setLoadingMore(true)
    const nextCount = visibleCount + PAGE_SIZE
    await loadFeed(nextCount)
    setVisibleCount(nextCount)
    setLoadingMore(false)
  }

  async function handleRefresh() {
    await loadFeed(visibleCount)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <CreatePostBox onPosted={handleRefresh} />

      {loading ? (
        <div className="neo-card p-10 text-center text-slate-400 text-sm">লোড হচ্ছে...</div>
      ) : posts.length === 0 ? (
        <div className="neo-card p-10 text-center text-slate-400 dark:text-slate-500 text-sm">
          📰 এখনো কোনো পোস্ট নেই — প্রথম পোস্টটা তুমিই করো!
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} currentUid={profile?.uid} currentName={profile?.anonymousName} onChanged={handleRefresh} />
          ))}

          <div className="text-center mt-2 mb-6">
            <button onClick={handleLoadMore} disabled={loadingMore} className="neo-btn text-sm px-8">
              {loadingMore ? 'লোড হচ্ছে...' : 'আরও দেখো'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
