import getDate from '../utils/date'

const CommentCard = ({ index, leftVal, commentData }) => {
  const {
    commented_by: {
      personal_info: { fullname, username, profile_img }
    },
    commentedAt,
    comment
  } = commentData

  return (
    <div className='w-full' style={{ paddingLeft: `${leftVal * 10}px` }}>
      <div className='my-5 p-6 rounded-md border border-grey'>
        {/* User profile */}
        <div className='flex gap-3 items-center mb-8'>
          <img src={profile_img} className='w-6 h-6 rounded-full' />
          <p className='line-clamp-1'>
            {fullname} @{username}
          </p>
          <p className='min-w-fit'>{getDate(commentedAt)}</p>
        </div>

        {/* Comment detail */}
        <p className='font-gelasio text-xl ml-3'>{comment}</p>
      </div>
    </div>
  )
}

export default CommentCard
