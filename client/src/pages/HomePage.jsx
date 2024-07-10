import { useEffect, useState } from 'react'
import PageAnimation from '../common/PageAnimation'
import InPageNavigation from '../components/InPageNavigation'
import ComponentLoader from '../common/ComponentLoader'
import customAxios from '../utils/customAxios'
import BlogPostCard from '../components/BlogPostCard'
import MinimalBlogPost from '../components/MinimalBlogPost'

const HomePage = () => {
  const [blogs, setBlogs] = useState(null)
  const [trendingBlogs, setTrendingBlogs] = useState(null)

  const fetchLatestBlogs = async () => {
    try {
      const res = await customAxios('blogs/latestBlogs')

      setBlogs(res.data.blogs)
    } catch (err) {
      setBlogs([])
      console.log(err)
    }
  }

  const fetchTrendingBlogs = async () => {
    try {
      const res = await customAxios('blogs/trendingBlogs')

      setTrendingBlogs(res.data.blogs)
    } catch (err) {
      setTrendingBlogs([])
      console.log(err)
    }
  }

  useEffect(() => {
    fetchLatestBlogs()
    fetchTrendingBlogs()
  }, [])

  return (
    <PageAnimation>
      <section className='h-cover flex justify-center gap-10'>
        {/* Latest and trending blogs */}
        <div className='w-full'>
          <InPageNavigation
            routes={['home', 'trending blogs']}
            defaultHidden={['trending blogs']}
          >
            {/* Latest blog */}
            {!blogs ? (
              <ComponentLoader />
            ) : (
              blogs.map((blog, i) => {
                return (
                  <PageAnimation
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <BlogPostCard
                      content={blog}
                      author={blog.author.personal_info}
                    />
                  </PageAnimation>
                )
              })
            )}

            {/* Trending blogs (default hidden in md) */}
            {!trendingBlogs ? (
              <ComponentLoader />
            ) : (
              blogs.map((blog, i) => {
                return (
                  <PageAnimation
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </PageAnimation>
                )
              })
            )}
          </InPageNavigation>
        </div>

        {/* Filters and trending blogs */}
        <div></div>
      </section>
    </PageAnimation>
  )
}

export default HomePage
