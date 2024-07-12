import { Link } from 'react-router-dom'
import getDate from '../utils/date'

const BlogPostCard = ({ content, author }) => {
  const {
    publishedAt,
    tags,
    title,
    des,
    banner,
    slug,
    activity: { total_likes }
  } = content
  const { fullname, username, profile_img } = author

  return (
    <Link
      to={`/blog/${slug}`}
      className='flex gap-8 items-center border-b border-grey pb-5 mb-4'
    >
      <div className='w-full'>
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
        <p className='my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>
          {des}
        </p>
        <div className='flex gap-4 mt-7'>
          <span className='btn-light py-1 px-4'>{tags[0]}</span>
          <span className='ml-3 flex items-center gap-2 text-dark-grey'>
            <i className='fi fi-rr-heart text-xl'></i>
            {total_likes}
          </span>
        </div>
      </div>

      {/* Banner */}
      <div className='h-28 aspect-square bg-grey'>
        <img
          src={banner}
          className='w-full h-full aspect-square object-cover'
          loading='lazy'
        />
      </div>
    </Link>
  )
}

export default BlogPostCard
