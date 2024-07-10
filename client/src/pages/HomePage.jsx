import { useEffect, useState } from 'react'
import PageAnimation from '../common/PageAnimation'
import InPageNavigation from '../components/InPageNavigation'
import ComponentLoader from '../common/ComponentLoader'
import customAxios from '../utils/customAxios'
import BlogPostCard from '../components/BlogPostCard'

const HomePage = () => {
  const [blogs, setBlogs] = useState(null)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await customAxios('blogs/latestBlogs')

        setBlogs(res.data.blogs)
      } catch (err) {
        console.log(err)
      }
    }

    fetchBlogs()
  }, [])

  return (
    <PageAnimation>
      <section className='h-cover flex justify-center gap-10'>
        {/* Latest blogs */}
        <div className='w-full'>
          <InPageNavigation
            routes={['home', 'trending blogs']}
            defaultHidden={['trending blogs']}
          >
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

            <h1>Trending Blogs Here</h1>
          </InPageNavigation>
        </div>

        {/* Filters and trending blogs */}
        <div></div>
      </section>
    </PageAnimation>
  )
}

export default HomePage
