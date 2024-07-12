import { useContext } from 'react'
import { BlogContext } from '../pages/BlogPage'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider'

const BlogInteraction = () => {
  const {
    blog: {
      slug,
      title,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { fullname, username, profile_img }
      }
    },
    setBlog
  } = useContext(BlogContext)
  const { user } = useContext(AuthContext)

  return (
    <>
      <hr className='border-grey my-2' />

      <div className='flex gap-6 justify-between'>
        <div className='flex gap-3 items-center'>
          {/* Likes */}
          <button className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
            <i className='fi fi-rr-heart'></i>
          </button>
          <p className='text-xl text-dark-grey'>{total_likes}</p>

          {/* Comments */}
          <button className='w-10 h-10 rounded-full flex items-center justify-center bg-grey/80'>
            <i className='fi fi-rr-comment-dots'></i>
          </button>
          <p className='text-xl text-dark-grey'>{total_comments}</p>
        </div>

        <div className='flex gap-6 items-center'>
          {username === user?.username && (
            <Link
              to={`/editor/${slug}`}
              className='underline hover:text-purple'
            >
              Edit
            </Link>
          )}
          <Link
            to={`https://twitter.com/intent/tweet?text=Read ${title}&url=${location.href}`}
          >
            <i className='fi fi-brands-twitter text-xl hover:text-twitter'></i>
          </Link>
        </div>
      </div>

      <hr className='border-grey my-2' />
    </>
  )
}

export default BlogInteraction
