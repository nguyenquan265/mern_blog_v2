import { Link } from 'react-router-dom'
import PageAnimation from '../common/PageAnimation'
import uploadImage from '../utils/uploadImage'
import { useContext } from 'react'
import toast from 'react-hot-toast'
import { EditorContext } from '../pages/EditorPage'

const BlogEditor = () => {
  const { blog, setBlog } = useContext(EditorContext)

  const handleUploadBanner = async (e) => {
    const img = e.target.files[0]

    if (img) {
      const loadingToast = toast.loading('Uploading banner...')

      const imgURL = await uploadImage(img)
      setBlog({ ...blog, banner: imgURL })

      toast.dismiss(loadingToast)
    } else {
      toast.error('No image selected')
    }
  }

  const handleTitleEnterKey = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault()
      e.target.blur()
    }
  }

  const handleTitleChange = (e) => {
    let input = e.target

    input.style.height = 'auto'
    input.style.height = input.scrollHeight + 'px'

    setBlog({ ...blog, title: input.value })
  }

  return (
    <>
      <nav className='navbar'>
        <Link to='/' className='flex-none w-10'>
          <img src='/imgs/logo.png' />
        </Link>
        <p className='max-md:hidden text-black line-clamp-1 w-full'>
          {blog.title || 'New Blog'}
        </p>
        <div className='flex gap-4 ml-auto'>
          <button className='btn-dark py-2'>Publish</button>
          <button className='btn-light py-2'>Save Draft</button>
        </div>
      </nav>

      <PageAnimation>
        <section>
          <div className='mx-auto max-w-[900px] w-full'>
            <div className='relative aspect-video hover:opacity-80 bg-white border-4 border-grey'>
              <label htmlFor='uploadBanner' className='cursor-pointer'>
                <img
                  src={blog.banner || '/imgs/blog-banner.png'}
                  className='z-20'
                  onError={(e) => {
                    e.target.src = '/imgs/blog-banner.png'
                  }}
                />
                <input
                  id='uploadBanner'
                  type='file'
                  accept='image/*'
                  hidden
                  onChange={handleUploadBanner}
                />
              </label>
            </div>

            <textarea
              placeholder='Blog Title'
              className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40'
              onKeyDown={handleTitleEnterKey}
              onChange={handleTitleChange}
            ></textarea>

            <hr className='w-full opacity-10 my-5' />
          </div>
        </section>
      </PageAnimation>
    </>
  )
}

export default BlogEditor