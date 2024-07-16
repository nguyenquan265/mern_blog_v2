import { useContext } from 'react'
import getDate from '../utils/date'
import { AuthContext } from '../context/AuthProvider'
import { BlogContext } from '../pages/BlogPage'
import customAxios from '../utils/customAxios'

const CommentCard = ({ index, leftVal, commentData }) => {
  const {
    _id,
    commented_by: {
      personal_info: { fullname, username: comment_by_username, profile_img }
    },
    commentedAt,
    comment
  } = commentData
  const {
    blog,
    blog: {
      author: {
        personal_info: { username: blog_author_username }
      },
      comments: { results: commentArr }
    },
    setBlog
  } = useContext(BlogContext)
  const { user } = useContext(AuthContext)

  const handleDeleteComment = async (e) => {
    e.target.setAttribute('disabled', true)

    try {
      await customAxios.delete(`/comments/deleteComment/${_id}`)

      commentArr.splice(index, 1)

      setBlog({
        ...blog,
        activity: {
          ...blog.activity,
          total_comments: blog.activity.total_comments - 1
        },
        comments: { ...blog.comments, results: commentArr }
      })

      e.target.removeAttribute('disabled')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-full' style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className='my-5 p-6 rounded-md border border-grey'>
        {/* User profile */}
        <div className='flex gap-3 items-center mb-8'>
          <img src={profile_img} className='w-6 h-6 rounded-full' />
          <p className='line-clamp-1'>
            {fullname} @{comment_by_username}
          </p>
          <p className='min-w-fit'>{getDate(commentedAt)}</p>
        </div>

        {/* Comment detail */}
        <p className='font-gelasio text-xl ml-3'>{comment}</p>

        {/* Delete button */}
        <div className='flex gap-5 items-center mt-1'>
          {(user?.username === comment_by_username ||
            user?.username === blog_author_username) && (
            <button
              className='p-2 px-3 rounded-md border border-grey ml-auto hover:bg-red/30 hover:text-red flex items-center'
              onClick={handleDeleteComment}
            >
              <i className='fi fi-rr-trash pointer-events-none'></i>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentCard
