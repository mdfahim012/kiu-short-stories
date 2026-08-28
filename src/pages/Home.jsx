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
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="neo-card p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-slate-300/50 dark:bg-slate-600/50" />
                <div className="flex-1">
                  <div className="h-3 w-24 bg-slate-300/50 dark:bg-slate-600/50 rounded mb-2" />
                  <div className="h-2 w-16 bg-slate-300/40 dark:bg-slate-600/40 rounded" />
                </div>
              </div>
              <div className="h-48 w-full bg-slate-300/40 dark:bg-slate-600/40 rounded-2xl" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="neo-card p-10 text-center text-slate-400 dark:text-slate-500 text-sm">
          📰 এখনো কোনো পোস্ট নেই — প্রথম পোস্টটা তুমিই করো!
        </div>
      ) : (
        <>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUid={profile?.uid}
              currentName={profile?.anonymousName}
              currentGender={profile?.gender}
              currentPhotoUrl={profile?.photoURL}
              onChanged={handleRefresh}
            />
          ))}

          <div className="text-center mt-2 mb-6">
            <button onClick={handleLoadMore} disabled={loadingMore} className="neo-btn text-sm px-8">
              {loadingMore ? 'Loading...' : 'See more'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
