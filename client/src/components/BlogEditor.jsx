import { Link } from 'react-router-dom'
import PageAnimation from '../common/PageAnimation'

const BlogEditor = () => {
  const handleUploadBanner = (e) => {
    const file = e.target.files[0]
    console.log(file)
  }

  return (
    <>
      <nav className='navbar'>
        <Link to='/' className='flex-none w-10'>
          <img src='/imgs/logo.png' />
        </Link>
        <p className='max-md:hidden text-black line-clamp-1 w-full'>New Blog</p>
        <div className='flex gap-4 ml-auto'>
          <button className='btn-dark py-2'>Publish</button>
          <button className='btn-light py-2'>Save Draft</button>
        </div>
      </nav>

      <PageAnimation>
        <section>
          <div className='mx-auto max-w-[900px] w-full'>
            <div className='relative aspect-video hover:opacity-80 bg-white border-4 border-grey'>
              <label htmlFor='uploadBanner'>
                <img src='/imgs/blog-banner.png' className='z-20' />
                <input
                  id='uploadBanner'
                  type='file'
                  accept='image/*'
                  hidden
                  onChange={handleUploadBanner}
                />
              </label>
            </div>
          </div>
        </section>
      </PageAnimation>
    </>
  )
}

export default BlogEditor
