import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthProvider'
import toast from 'react-hot-toast'
import { BlogContext } from '../pages/BlogPage'
import customAxios from '../utils/customAxios'

const CommentField = ({ action }) => {
  const { user, accessToken } = useContext(AuthContext)
  const {
    blog,
    blog: {
      comments: { results: currentCommentArr }
    },
    setBlog,
    setTotalParentCommentsLoad
  } = useContext(BlogContext)
  const [comment, setComment] = useState('')

  const handleComment = async () => {
    if (!user || !accessToken) {
      return toast.error('Please login to comment')
    }

    if (!comment) {
      return toast.error('Comment cannot be empty')
    }

    try {
      const res = await customAxios.post('/blogs/addComment', {
        blogId: blog._id,
        comment,
        blogAuthor: blog.author._id
      })

      const data = res.data.commentStatus

      setComment('') // Clear comment field

      data.commented_by = {
        personal_info: {
          fullname: user.fullname,
          username: user.username,
          profile_img: user.profile_img
        }
      }

      data.childrenLevel = 0 // That means it is a parent comment

      const newCommentArr = [data, ...currentCommentArr] // Add new comment to the top of the comments array

      let parentCommentIncrementValue = 1

      setBlog({
        ...blog,
        comments: { ...blog.comments, results: newCommentArr }, // Update comments array
        activity: {
          ...blog.activity,
          total_comments: blog.activity.total_comments + 1, // Increment total comments
          total_parent_comments:
            blog.activity.total_parent_comments + parentCommentIncrementValue // Increment total parent comments
        }
      })

      setTotalParentCommentsLoad(
        (preValue) => preValue + parentCommentIncrementValue
      )
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder='Leave a comment....'
        className='input-box pl-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto'
      ></textarea>
      <button className='btn-dark mt-5 px-10' onClick={handleComment}>
        {action}
      </button>
    </>
  )
}

export default CommentField
