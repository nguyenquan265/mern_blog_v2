import { Link } from 'react-router-dom'
import getDate from '../utils/date'
import { useState } from 'react'

const BlogStats = ({ stats }) => {
  const statsArr = Object.keys(stats)

  return (
    <div className='flex gap-2 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b'>
      {statsArr.map((key, i) => {
        return (
          !key.includes('parent') && (
            <div
              key={i}
              className={`flex flex-col items-center w-full h-full justify-center p-4 px-6 ${
                i !== 0 && 'border-grey border-l'
              }`}
            >
              <h1 className='text-xl lg:text-2xl mb-2'>
                {stats[key].toLocaleString()}
              </h1>
              <p>{key.split('_')[1]}</p>
            </div>
          )
        )
      })}
    </div>
  )
}

const ManagePublishedBlogCard = ({ blog, deleteBlogFunc }) => {
  const { banner, slug, title, publishedAt, activity } = blog
  const [showStat, setShowStat] = useState(false)

  return (
    <>
      <div className='flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center'>
        <img
          src={banner}
          className='max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover'
        />

        <div className='flex flex-col justify-between py-2 w-full min-w-[300px]'>
          <div>
            <Link
              to={`/blog/${slug}`}
              className='blog-title mb-4 hover:underline'
            >
              {title}
            </Link>
            <p className='line-clamp-1'>Published on {getDate(publishedAt)}</p>
          </div>

          <div className='flex gap-6 m-3'>
            {/* Edit button */}
            <Link to={`/editor/${slug}`} className='pr-4 py-2 underline'>
              Edit
            </Link>

            {/* Show stats button */}
            <button
              className='lg:hidden pr-4 py-2 underline'
              onClick={() => setShowStat((preVal) => !preVal)}
            >
              Stats
            </button>

            {/* Delete blog */}
            <button
              className='pr-4 py-2 underline text-red'
              onClick={(e) => deleteBlogFunc(blog, e.target, 'published')}
            >
              Delete
            </button>
          </div>
        </div>

        <div className='max-lg:hidden'>
          <BlogStats stats={activity} />
        </div>
      </div>

      {showStat && (
        <div className='lg:hidden'>
          <BlogStats stats={activity} />
        </div>
      )}
    </>
  )
}

export default ManagePublishedBlogCard
