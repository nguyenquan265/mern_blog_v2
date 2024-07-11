import { useParams } from 'react-router-dom'
import NoDataMessage from '../components/NoDataMessage'
import ComponentLoader from '../common/ComponentLoader'
import PageAnimation from '../common/PageAnimation'
import InPageNavigation, { activeTabRef } from '../components/InPageNavigation'
import { useEffect, useState } from 'react'
import customAxios from '../utils/customAxios'
import BlogPostCard from '../components/BlogPostCard'
import LoadMoreButton from '../components/LoadMoreButton'
import UserCard from '../components/UserCard'

const SeachPage = () => {
  const { query } = useParams()
  const [blogs, setBlogs] = useState(null)
  const [users, setUsers] = useState(null)

  const searchBlogs = async (page = 1, createNewArr = false) => {
    try {
      const res = await customAxios(`/blogs/search?query=${query}&page=${page}`)

      if (!blogs || createNewArr) {
        setBlogs({
          results: res.data.blogs,
          page: res.data.page,
          totalDocs: res.data.totalDocs
        })
      } else {
        setBlogs({
          results: [...blogs.results, ...res.data.blogs],
          page: res.data.page,
          totalDocs: res.data.totalDocs
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const searchUsers = async () => {
    try {
      const res = await customAxios(`/users/search?query=${query}`)

      setUsers(res.data.users)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    activeTabRef.current.click() // Set the active tab line to the active tab in InPageNavigation.jsx

    setBlogs(null)
    setUsers(null)

    searchBlogs(1, true)
    searchUsers()
  }, [query])

  return (
    <section className='h-cover flex justify-center gap-10'>
      <div className='w-full'>
        <InPageNavigation
          routes={[`search results from "${query}"`, 'accounts matched']}
          defaultHidden={['accounts matched']}
        >
          {/* Searched blogs */}
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
            <LoadMoreButton state={blogs} fetchFunction={searchBlogs} />
          </>

          {/* Searched users (default hidden in md screen) */}
          {!users ? (
            <ComponentLoader />
          ) : users.length ? (
            users.map((user, i) => {
              return (
                <PageAnimation
                  transition={{ duration: 1, delay: i * 0.1 }}
                  key={i}
                >
                  <UserCard user={user.personal_info} />
                </PageAnimation>
              )
            })
          ) : (
            <NoDataMessage message='No users found' />
          )}
        </InPageNavigation>
      </div>

      {/* Searched users */}
      <div className='min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden'>
        <div>
          <h1 className='font-medium text-xl mb-8'>
            Accounts Matched <i className='fi fi-rr-user'></i>
          </h1>
          {!users ? (
            <ComponentLoader />
          ) : users.length ? (
            users.map((user, i) => {
              return (
                <PageAnimation
                  transition={{ duration: 1, delay: i * 0.1 }}
                  key={i}
                >
                  <UserCard user={user.personal_info} />
                </PageAnimation>
              )
            })
          ) : (
            <NoDataMessage message='No users found' />
          )}
        </div>
      </div>
    </section>
  )
}

export default SeachPage
