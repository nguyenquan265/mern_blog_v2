import { Link } from 'react-router-dom'
import getDate from '../utils/date'
import customAxios from '../utils/customAxios'

const NotificationCard = ({ data, index, notificationState }) => {
  const {
    user: {
      personal_info: { profile_img, fullname, username }
    },
    blog: { slug, title },
    type,
    comment,
    createdAt,
    seen
  } = data
  const {
    notifications,
    notifications: { results, totalDocs, deletedDocCount },
    setNotifications
  } = notificationState

  const handleDeleteComment = async (e) => {
    e.preventDefault()
    e.target.setAttribute('disabled', true)

    try {
      await customAxios.delete(`/comments/deleteComment/${comment._id}`)

      results.splice(index, 1)
      setNotifications({
        ...notifications,
        results,
        totalDocs: totalDocs - 1,
        deletedDocCount: deletedDocCount + 1
      })
      e.target.removeAttribute('disabled')
    } catch (error) {
      console.log(error)
      e.target.removeAttribute('disabled')
    }
  }

  return (
    <div
      className={`p-6 border-b border-grey border-l-black ${
        !seen && 'border-l-2'
      }`}
    >
      <div className='flex gap-5 mb-3'>
        <img src={profile_img} className='w-14 h-14 rounded-full flex-none' />
        <div className='w-full'>
          <h1 className='font-medium text-xl text-dark-grey'>
            <span className='lg:inline-block hidden capitalize'>
              {fullname}
            </span>
            <Link
              to={`/user/${username}`}
              className='mx-1 text-black underline'
            >
              @{username}
            </Link>
            <span className='font-normal'>
              {type === 'like'
                ? ' liked your blog'
                : type === 'comment' && ' commented on your blog'}
            </span>
          </h1>

          {
            <Link
              to={`/blog/${slug}`}
              className='font-medium text-dark-grey hover:underline line-clamp-1'
            >{`"${title}"`}</Link>
          }
        </div>
      </div>

      {type === 'comment' && (
        <p className='ml-14 pl-5 font-gelasio text-xl my-5'>
          {comment.comment}
        </p>
      )}

      <div className='ml-14 pl-5 mt-3 text-dark-grey flex gap-8'>
        <p>{getDate(createdAt)}</p>

        {type === 'comment' && (
          <button
            className='underline hover:text-black'
            onClick={handleDeleteComment}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default NotificationCard
