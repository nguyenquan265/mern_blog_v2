import { useContext } from 'react'
import { BlogContext } from '../pages/BlogPage'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider'
import toast from 'react-hot-toast'
import customAxios from '../utils/customAxios'

const BlogInteraction = () => {
  let {
    blog,
    blog: {
      _id,
      slug,
      title,
      activity,
      activity: { total_likes, total_comments },
      author: {
        personal_info: { fullname, username, profile_img }
      }
    },
    setBlog,
    isLiked,
    setIsLiked
  } = useContext(BlogContext)
  const { user, accessToken } = useContext(AuthContext)

  const handleLike = async () => {
    if (!user || !accessToken) {
      toast.error('Please login to like the post')
    } else {
      setIsLiked((preValue) => !preValue)

      !isLiked ? total_likes++ : total_likes--

      setBlog({ ...blog, activity: { ...activity, total_likes } })

      try {
        await customAxios.patch('/blogs/likeBlog', {
          blogId: _id,
          isLiked
        })
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <>
      <hr className='border-grey my-2' />

      <div className='flex gap-6 justify-between'>
        <div className='flex gap-3 items-center'>
          {/* Likes */}
          <button
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isLiked ? 'bg-red/20 text-red' : 'bg-grey/80'
            }`}
            onClick={handleLike}
          >
            <i className={`fi ${isLiked ? 'fi-sr-heart' : 'fi-rr-heart'}`}></i>
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
