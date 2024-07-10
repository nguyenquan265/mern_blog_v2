import { Link } from 'react-router-dom'
import getDate from '../utils/date'

const MinimalBlogPost = ({ blog, index }) => {
  const {
    publishedAt,
    title,
    slug,
    activity: { total_likes },
    author: {
      personal_info: { fullname, username, profile_img }
    }
  } = blog

  return (
    <Link to={`/blogs/${slug}`} className='flex gap-5 mb-8'>
      <h1 className='blog-index'>{index < 10 ? '0' + (index + 1) : index}</h1>
      <div>
        {/* User detail */}
        <div className='flex gap-2 items-center mb-7'>
          <img
            src={profile_img}
            className='w-6 h-6 rounded-full'
            loading='lazy'
          />
          <p className='line-clamp-1'>
            {fullname} @{username}
          </p>
          <p className='min-w-fit'>{getDate(publishedAt)}</p>
        </div>

        {/* Blog detail */}
        <h1 className='blog-title'>{title}</h1>
      </div>
    </Link>
  )
}

export default MinimalBlogPost
