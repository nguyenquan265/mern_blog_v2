import { useEffect, useState } from 'react'
import PageAnimation from '../common/PageAnimation'
import InPageNavigation, { activeTabRef } from '../components/InPageNavigation'
import ComponentLoader from '../common/ComponentLoader'
import customAxios from '../utils/customAxios'
import BlogPostCard from '../components/BlogPostCard'
import MinimalBlogPost from '../components/MinimalBlogPost'
import NoDataMessage from '../components/NoDataMessage'
import LoadMoreButton from '../components/LoadMoreButton'

const categories = [
  'technology',
  'science',
  'health',
  'business',
  'art',
  'food',
  'travel',
  'fashion',
  'sports',
  'music',
  'movies',
  'books',
  'animal',
  'education'
]

const HomePage = () => {
  const [blogs, setBlogs] = useState(null)
  const [trendingBlogs, setTrendingBlogs] = useState(null)
  const [pageState, setPageState] = useState('home')
  let formatData

  // Fetch latest blogs when pageState = 'home' or page is loaded
  const fetchLatestBlogs = async (page = 1) => {
    try {
      const res = await customAxios('/blogs/latestBlogs?page=' + page)

      if (!blogs) {
        formatData = {
          results: res.data.blogs,
          page: res.data.page,
          totalDocs: res.data.totalDocs
        }
      } else {
        formatData = {
          results: [...blogs.results, ...res.data.blogs],
          page: res.data.page,
          totalDocs: res.data.totalDocs
        }
      }

      setBlogs(formatData)
    } catch (err) {
      console.log(err)
    }
  }

  // Fetch blogs by tag when pageState is not 'home'
  const fetchBlogsByTag = async (page = 1) => {
    try {
      const res = await customAxios(
        `/blogs/search?tag=${pageState}&page=${page}`
      )

      if (!blogs) {
        formatData = {
          results: res.data.blogs,
          page: res.data.page,
          totalDocs: res.data.totalDocs
        }
      } else {
        formatData = {
          results: [...blogs.results, ...res.data.blogs],
          page: res.data.page,
          totalDocs: res.data.totalDocs
        }
      }

      setBlogs(formatData)
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch trending blogs when page is loaded
  const fetchTrendingBlogs = async () => {
    try {
      const res = await customAxios('/blogs/trendingBlogs')

      setTrendingBlogs(res.data.blogs)
    } catch (err) {
      console.log(err)
    }
  }

  // setPageState to the category of the clicked tag or to 'home' if the tag is already active
  const loadBlogByCategory = async (e) => {
    const category = e.target.innerText.toLowerCase()
    setBlogs(null)

    if (pageState === category) {
      setPageState('home')
      return
    }

    setPageState(category)
  }

  useEffect(() => {
    activeTabRef.current.click() // Set the active tab line to the active tab in InPageNavigation.jsx

    if (pageState === 'home') {
      fetchLatestBlogs()
    } else {
      fetchBlogsByTag()
    }

    if (!trendingBlogs) {
      fetchTrendingBlogs()
    }
  }, [pageState])

  return (
    <PageAnimation>
      <section className='h-cover flex justify-center gap-10'>
        {/* Latest and trending blogs */}
        <div className='w-full'>
          <InPageNavigation
            routes={[pageState, 'trending blogs']}
            defaultHidden={['trending blogs']}
          >
            {/* Latest blog */}
            <>
              {!blogs ? (
                <ComponentLoader />
              ) : blogs.results.length ? (
                blogs.results.map((blog, i) => {
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
              ) : (
                <NoDataMessage message='No blogs published' />
              )}

              {/* Load more button */}
              <LoadMoreButton
                state={blogs}
                fetchFunction={
                  pageState === 'home' ? fetchLatestBlogs : fetchBlogsByTag
                }
              />
            </>

            {/* Trending blogs (default hidden in md screen) */}
            {!trendingBlogs ? (
              <ComponentLoader />
            ) : trendingBlogs.length ? (
              trendingBlogs.map((blog, i) => {
                return (
                  <PageAnimation
                    transition={{ duration: 1, delay: i * 0.1 }}
                    key={i}
                  >
                    <MinimalBlogPost blog={blog} index={i} />
                  </PageAnimation>
                )
              })
            ) : (
              <NoDataMessage message='No trending blogs' />
            )}
          </InPageNavigation>
        </div>

        {/* Filters and trending blogs */}
        <div className='min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
          <div className='flex flex-col gap-10'>
            {/* Tags */}
            <div>
              <h1 className='font-medium text-xl mb-8'>
                Stories from all interests
              </h1>
              <div className='flex gap-3 flex-wrap'>
                {categories.map((category, i) => {
                  return (
                    <button
                      key={i}
                      className={`tag ${
                        category === pageState ? 'bg-black text-white' : ''
                      }`}
                      onClick={loadBlogByCategory}
                    >
                      {category}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Trending */}
            <div>
              <h1 className='font-medium text-xl mb-8'>
                Trending <i className='fi fi-rr-arrow-trend-up'></i>
              </h1>
              {/* Trending blogs */}
              {!trendingBlogs ? (
                <ComponentLoader />
              ) : trendingBlogs.length ? (
                trendingBlogs.map((blog, i) => {
                  return (
                    <PageAnimation
                      transition={{ duration: 1, delay: i * 0.1 }}
                      key={i}
                    >
                      <MinimalBlogPost blog={blog} index={i} />
                    </PageAnimation>
                  )
                })
              ) : (
                <NoDataMessage message='No trengding blogs' />
              )}
            </div>
          </div>
        </div>
      </section>
    </PageAnimation>
  )
}

export default HomePage
