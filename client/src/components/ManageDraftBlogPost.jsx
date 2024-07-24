import { Link } from 'react-router-dom'

const ManageDraftBlogPost = ({ blog, deleteBlogFunc }) => {
  const { title, des, slug, index } = blog

  return (
    <div className='flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey'>
      <h1 className='blog-index text-center pl-4 md:pl-6 flex-none'>
        {index + 1 < 10 ? '0' + (index + 1) : index + 1}
      </h1>

      <div>
        <h1 className='blog-title mb-3'>{title}</h1>
        <p className='line-clamp-2 font-gelasio'>
          {des.length ? des : 'No description'}
        </p>
        <div className='flex gap-6 mt-3'>
          {/* Edit button */}
          <Link to={`/editor/${slug}`} className='pr-4 py-2 underline'>
            Edit
          </Link>

          {/* Delete button */}
          <button
            className='pr-4 py-2 underline text-red'
            onClick={(e) => deleteBlogFunc(blog, e.target, 'draft')}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default ManageDraftBlogPost
