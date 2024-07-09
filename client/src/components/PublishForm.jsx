import { useContext } from 'react'
import PageAnimation from '../common/PageAnimation'
import toast from 'react-hot-toast'
import { EditorContext } from '../pages/EditorPage'
import Tag from './Tag'
import customAxios from '../utils/customAxios'
import { useNavigate } from 'react-router-dom'

const PublishForm = () => {
  const { blog, setBlog, setEditorState } = useContext(EditorContext)
  const tagLimit = 10
  const navigate = useNavigate()

  const handleTitleKeyEvent = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault()
      e.target.blur()
    }
  }

  const handleTagKeyEvent = (e) => {
    if (
      e.key === 'Enter' ||
      e.keyCode === 13 ||
      e.key === ',' ||
      e.keyCode === 188
    ) {
      e.preventDefault()
      const newTag = e.target.value.trim()

      if (blog.tags.length < tagLimit) {
        if (newTag && !blog.tags.includes(newTag)) {
          setBlog({ ...blog, tags: [...blog.tags, newTag] })
        } else {
          toast.error('Tag already exists')
        }
      } else {
        toast.error(`You can only add ${tagLimit} tags`)
      }

      e.target.value = ''
    }
  }

  const publishBlog = async (e) => {
    if (e.target.classList.contains('disable')) {
      return
    }

    if (!blog.banner) {
      return toast.error('Please upload a banner')
    }

    if (!blog.title) {
      return toast.error('Please enter a title')
    }

    if (!blog.des || blog.des.length > 200) {
      return toast.error('Description should be less than 200 characters')
    }

    if (blog.tags.length === 0) {
      return toast.error('Please add some tags')
    }

    const loadingToast = toast.loading('Publishing blog...')
    e.target.classList.add('disable')

    try {
      const res = await customAxios.post('/blogs/createBlog', {
        ...blog,
        draft: false
      })

      toast.dismiss(loadingToast)
      e.target.classList.remove('disable')

      setTimeout(() => {
        navigate('/')
      }, 500)
    } catch (error) {
      console.log(error)
      toast.dismiss(loadingToast)
      e.target.classList.remove('disable')
      toast.error('Failed to publish blog')
    }
  }

  return (
    <PageAnimation>
      <section className='w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4'>
        {/* Close button */}
        <button
          className='w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]'
          onClick={() => setEditorState('editor')}
        >
          <i className='fi fi-br-cross'></i>
        </button>

        {/* Preview */}
        <div className='max-w-[550px] lg:max-w-[420px] xl:max-w-[550px] center'>
          <p className='text-dark-grey mb-1'>Preview</p>
          <div className='w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4'>
            <img src={blog.banner} />
          </div>
          <h1 className='text-4xl font-medium mt-2 leading-tight line-clamp-1'>
            {blog.title}
          </h1>
          <p className='font-gelasio line-clamp-2 text-xl leading-7 mt-4'>
            {blog.des}
          </p>
        </div>

        {/* Form */}
        <div className='border-grey lg:border-2 lg:pl-8'>
          {/* Title */}
          <p className='text-dark-grey mb-2 mt-9'>Blog Title</p>
          <input
            type='text'
            placeholder='Blog Title'
            defaultValue={blog.title}
            className='input-box pl-4'
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          />

          {/* Description */}
          <p className='text-dark-grey mb-2 mt-9'>
            Short description about your blog
          </p>
          <textarea
            maxLength={200}
            defaultValue={blog.des}
            className='h-40 resize-none leading-7 input-box pl-4'
            onChange={(e) => setBlog({ ...blog, des: e.target.value })}
            onKeyDown={handleTitleKeyEvent}
          ></textarea>
          <p className='mt-1 text-dark-grey text-sm text-right'>
            {200 - blog.des.length} characters left
          </p>

          {/* Tags */}
          <p className='text-dark-grey mb-2 mt-9'>
            Topics - (Helps is searching and ranking your blog post)
          </p>
          <div className='relative input-box pl-2 py-2 pb-4'>
            <input
              type='text'
              placeholder='Topic'
              className='sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white'
              onKeyDown={handleTagKeyEvent}
            />
            {blog.tags.map((tag, index) => (
              <Tag key={index} tagIndex={index} tag={tag} />
            ))}
          </div>

          <p className='mt-1 mb-4 text-dark-grey text-right'>
            {tagLimit - blog.tags.length} tags left
          </p>

          {/* Publish button */}
          <button className='btn-dark px-8' onClick={publishBlog}>
            Publish
          </button>
        </div>
      </section>
    </PageAnimation>
  )
}

export default PublishForm
