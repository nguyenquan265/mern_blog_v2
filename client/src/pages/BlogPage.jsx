import { createContext, useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import customAxios from '../utils/customAxios'
import PageAnimation from '../common/PageAnimation'
import ComponentLoader from '../common/ComponentLoader'
import getDate from '../utils/date'
import BlogInteraction from '../components/BlogInteraction'
import BlogPostCard from '../components/BlogPostCard'
import BlogContent from '../components/BlogContent'
import CommentsContainer, {
  fetchComments
} from '../components/CommentsContainer'
import { AuthContext } from '../context/AuthProvider'

const blogStructure = {
  title: '',
  des: '',
  content: [],
  banner: '',
  activity: {
    total_likes: 0,
    total_comments: 0,
    total_reads: 0,
    total_parent_comments: 0
  },
  author: {
    personal_info: {}
  },
  publishedAt: ''
}

export const BlogContext = createContext()

const BlogPage = () => {
  const { slug } = useParams()
  const [blog, setBlog] = useState(blogStructure)
  const [similarBlogs, setSimilarBlogs] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [commentsWrapper, setCommentsWrapper] = useState(false) // Show comments wrapper
  const [totalParentCommentsLoad, setTotalParentCommentsLoad] = useState(0) // Total parent comments loaded

  const {
    title,
    content,
    banner,
    author: {
      personal_info: { fullname, username, profile_img }
    },
    publishedAt
  } = blog
  const { user } = useContext(AuthContext)

  const fetchBlog = async () => {
    try {
      // Fetch blog data
      const blogRes = await customAxios(`/blogs/getBlogBySlug/${slug}`)
      const likesArr = blogRes.data.blog.likes.map(
        (like) => like.personal_info.username
      )

      // Fetch parent comments
      blogRes.data.blog.comments = await fetchComments({
        blog_id: blogRes.data.blog._id,
        setParentCommentCountFunc: setTotalParentCommentsLoad
      })

      // Fetch similar blogs
      const similarBlogsRes = await customAxios(
        `/blogs/search?tag=${blogRes.data.blog.tags[0]}&limit=6&eliminateSlug=${slug}`
      )

      setBlog(blogRes.data.blog)
      setIsLiked(likesArr.includes(user?.username))
      setSimilarBlogs(similarBlogsRes.data.blogs)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const resetState = () => {
    setBlog(blogStructure)
    setSimilarBlogs(null)
    setLoading(true)
    setIsLiked(false)
    setCommentsWrapper(false)
    setTotalParentCommentsLoad(0)
  }

  useEffect(() => {
    resetState()
    fetchBlog()
  }, [slug])

  return (
    <PageAnimation>
      {loading ? (
        <ComponentLoader />
      ) : (
        <BlogContext.Provider
          value={{
            blog,
            setBlog,
            isLiked,
            setIsLiked,
            commentsWrapper,
            setCommentsWrapper,
            totalParentCommentsLoad,
            setTotalParentCommentsLoad
          }}
        >
          <CommentsContainer />

          <div className='max-w-[900px] center py-10 max-lg:px-[5vw]'>
            {/* Banner */}
            <img src={banner} className='aspect-video' loading='lazy' />

            {/* User profile */}
            <div className='mt-12'>
              <h2>{title}</h2>
              <div className='flex max-sm:flex-col justify-between my-8'>
                <div className='flex gap-5 items-start'>
                  <img src={profile_img} className='w-12 h-12 rounded-full' />
                  <p className='capitalize'>
                    {fullname} <br /> @
                    <Link to={`/user/${username}`} className='underline'>
                      {username}
                    </Link>
                  </p>
                </div>
                <p className='text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5'>
                  Published on {getDate(publishedAt)}
                </p>
              </div>
            </div>

            {/* Interaction */}
            <BlogInteraction />

            {/* Blog content */}
            <div className='my-12 font-gelasio blog-page-content'>
              {content[0].blocks.map((block, i) => {
                return (
                  <div key={i} className='my-4 md:my-8'>
                    <BlogContent block={block} />
                  </div>
                )
              })}
            </div>

            {/* Interaction */}
            <BlogInteraction />

            {/* Similar blogs */}
            {similarBlogs !== null && similarBlogs.length && (
              <>
                <h1 className='text-2xl mt-14 mb-10 font-medium'>
                  Similar Blogs
                </h1>

                {similarBlogs.map((blog, i) => {
                  const {
                    author: { personal_info }
                  } = blog

                  return (
                    <PageAnimation
                      key={i}
                      transition={{ duration: 1, delay: i * 0.08 }}
                    >
                      <BlogPostCard content={blog} author={personal_info} />
                    </PageAnimation>
                  )
                })}
              </>
            )}
          </div>
        </BlogContext.Provider>
      )}
    </PageAnimation>
  )
}

export default BlogPage
