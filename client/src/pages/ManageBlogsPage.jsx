import { useContext, useEffect, useState } from 'react'
import customAxios from '../utils/customAxios'
import { AuthContext } from '../context/AuthProvider'
import InPageNavigation from '../components/InPageNavigation'
import ComponentLoader from '../common/ComponentLoader'
import NoDataMessage from '../components/NoDataMessage'
import PageAnimation from '../common/PageAnimation'
import ManagePublishedBlogCard from '../components/ManagePublishedBlogCard'
import ManageDraftBlogPost from '../components/ManageDraftBlogPost'
import LoadMoreButton from '../components/LoadMoreButton'

const ManageBlogsPage = () => {
  const [blogs, setBlogs] = useState(null)
  const [drafts, setDrafts] = useState(null)
  const [query, setQuery] = useState('')
  const { accessToken } = useContext(AuthContext)

  const fetchMyBlogs = async (page = 1, deletedDocCount = 0, draft) => {
    try {
      const res = await customAxios('/blogs/myBlogs', {
        params: {
          page,
          deletedDocCount,
          draft,
          query
        }
      })

      if (draft) {
        if (!drafts) {
          setDrafts({
            results: res.data.blogs,
            page: res.data.page,
            totalDocs: res.data.totalDocs,
            deletedDocCount
          })
        } else {
          setDrafts({
            results: [...drafts.results, ...res.data.blogs],
            page: res.data.page,
            totalDocs: res.data.totalDocs,
            deletedDocCount
          })
        }
      } else {
        if (!blogs) {
          setBlogs({
            results: res.data.blogs,
            page: res.data.page,
            totalDocs: res.data.totalDocs,
            deletedDocCount
          })
        } else {
          setBlogs({
            results: [...blogs.results, ...res.data.blogs],
            page: res.data.page,
            totalDocs: res.data.totalDocs,
            deletedDocCount
          })
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // if search input is empty, reset the blogs and drafts
  const handleChange = (e) => {
    if (!e.target.value.length) {
      setQuery('')
      setBlogs(null)
      setDrafts(null)
    }
  }

  // if enter key is pressed and search input is not empty, set the query
  const handleSearch = (e) => {
    const searchQuery = e.target.value

    if ((e.key === 'Enter' || e.keyCode === 13) && searchQuery.length) {
      setQuery(searchQuery)
      setBlogs(null)
      setDrafts(null)
    }
  }

  const deleteBlog = async (blog, target, type) => {
    const { index, slug } = blog
    target.setAttribute('disabled', true)

    try {
      await customAxios.delete(`/blogs/deleteBlogBySlug/${slug}`)

      if (type === 'published') {
        setBlogs((preVal) => {
          const { results, totalDocs, deletedDocCount } = preVal

          results.splice(index, 1)

          if (!results.length && totalDocs - 1 > 0) {
            return null
          }

          return {
            ...preVal,
            results: results,
            totalDocs: totalDocs - 1,
            deletedDocCount: deletedDocCount + 1
          }
        })
      } else {
        setDrafts((preVal) => {
          const { results, totalDocs, deletedDocCount } = preVal

          results.splice(index, 1)

          if (!results.length && totalDocs - 1 > 0) {
            return null
          }

          return {
            ...preVal,
            results: results,
            totalDocs: totalDocs - 1,
            deletedDocCount: deletedDocCount + 1
          }
        })
      }

      target.removeAttribute('disabled')
    } catch (error) {
      console.log(error)
      target.removeAttribute('disabled')
    }
  }

  useEffect(() => {
    if (accessToken) {
      if (blogs === null) {
        fetchMyBlogs(1, 0, false)
      }

      if (drafts === null) {
        fetchMyBlogs(1, 0, true)
      }
    }
  }, [accessToken, query])

  return (
    <>
      <h1 className='max-md:hidden'>Manage Blogs</h1>

      <div className='relative max-md:mt-5 md:mt-8 mb-10'>
        <input
          type='search'
          className='w-full p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey'
          placeholder='Search Blogs'
          onChange={handleChange}
          onKeyDown={handleSearch}
        />

        <i className='fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'></i>
      </div>

      <InPageNavigation routes={['published blogs', 'drafts']}>
        {/* Published blogs */}
        {blogs === null ? (
          <ComponentLoader />
        ) : blogs.results.length ? (
          <>
            {blogs.results.map((blog, i) => {
              return (
                <PageAnimation key={i} transition={{ delay: i * 0.04 }}>
                  <ManagePublishedBlogCard
                    blog={{ ...blog, index: i }}
                    deleteBlogFunc={deleteBlog}
                  />
                </PageAnimation>
              )
            })}

            <LoadMoreButton
              state={blogs}
              fetchFunction={fetchMyBlogs}
              deletedDocCount={blogs.deletedDocCount}
              manage='published'
            />
          </>
        ) : (
          <NoDataMessage message='No Published Blogs' />
        )}

        {/* Drafts */}
        {drafts === null ? (
          <ComponentLoader />
        ) : drafts.results.length ? (
          <>
            {drafts.results.map((blog, i) => {
              return (
                <PageAnimation key={i} transition={{ delay: i * 0.04 }}>
                  <ManageDraftBlogPost
                    blog={{ ...blog, index: i }}
                    deleteBlogFunc={deleteBlog}
                  />
                </PageAnimation>
              )
            })}

            <LoadMoreButton
              state={drafts}
              fetchFunction={fetchMyBlogs}
              deletedDocCount={drafts.deletedDocCount}
              manage='draft'
            />
          </>
        ) : (
          <NoDataMessage message='No Drafts' />
        )}
      </InPageNavigation>
    </>
  )
}

export default ManageBlogsPage
