import { Link, useNavigate, useParams } from 'react-router-dom'
import PageAnimation from '../common/PageAnimation'
import uploadImage from '../utils/uploadImage'
import { useContext, useEffect } from 'react'
import toast from 'react-hot-toast'
import { EditorContext } from '../pages/EditorPage'
import EditorJS from '@editorjs/editorjs'
import Tools from '../common/Tools'
import customAxios from '../utils/customAxios'

const BlogEditor = () => {
  const { blog, setBlog, textEditor, setTextEditor, setEditorState } =
    useContext(EditorContext)
  const navigate = useNavigate()
  const { slug } = useParams()

  useEffect(() => {
    // Initialize the text editor
    if (!textEditor.isReady) {
      setTextEditor(
        new EditorJS({
          holder: 'textEditor',
          data: Array.isArray(blog.content) ? blog.content[0] : blog.content,
          tools: Tools,
          placeholder: 'Start writing your blog...'
        })
      )
    }
  }, [])

  // Upload banner image
  const handleUploadBanner = async (e) => {
    const img = e.target.files[0]

    if (img) {
      const loadingToast = toast.loading('Uploading banner...')

      const imgURL = await uploadImage(img)
      setBlog({ ...blog, banner: imgURL }) // Set banner image to blog object

      toast.dismiss(loadingToast)
    } else {
      toast.error('No image selected')
    }
  }

  // When user presses Enter key, blur the textarea
  const handleTitleKeyEvent = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      e.preventDefault()
      e.target.blur()
    }
  }

  // Handle title change
  const handleTitleChange = (e) => {
    let input = e.target

    input.style.height = 'auto' // Reset the height
    input.style.height = input.scrollHeight + 'px' // Set the height to the scroll height when user types

    setBlog({ ...blog, title: input.value }) // Set the title to blog object
  }

  // Prepare the blog object to publish and change the editor state to publish (navigate to PublishForm component)
  const handlePublish = async () => {
    if (!blog.banner) {
      return toast.error('Please upload a banner')
    }

    if (!blog.title) {
      return toast.error('Please enter a title')
    }

    if (textEditor.isReady) {
      try {
        const data = await textEditor.save()

        if (data.blocks.length === 0) {
          return toast.error('Please write some content')
        }

        setBlog({ ...blog, content: data }) // Set the content to blog object
        setEditorState('publish')
      } catch (error) {
        console.log(error)
        toast.error('Failed to save content')
      }
    }
  }

  // Save the blog as a draft
  const handleSaveDraft = async (e) => {
    if (e.target.classList.contains('disable')) {
      return
    }

    if (!blog.title) {
      return toast.error('Please enter a title before saving draft')
    }

    e.target.classList.add('disable')
    const loadingToast = toast.loading('Saving draft...')

    if (textEditor.isReady) {
      try {
        const data = await textEditor.save()

        setBlog({ ...blog, content: data }) // Set the content to blog object

        await customAxios.post('/blogs/createBlog', {
          ...blog,
          draft: true, // Save as draft
          slug // If slug is present, then it is an existing blog and we need to update it
        })

        e.target.classList.remove('disable')
        toast.dismiss(loadingToast)

        setTimeout(() => {
          navigate('/')
        }, 500)
      } catch (error) {
        console.log(error)
        e.target.classList.remove('disable')
        toast.dismiss(loadingToast)
        toast.error('Failed to save content')
      }
    }
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
          <button className='btn-dark py-2' onClick={handlePublish}>
            Publish
          </button>
          <button className='btn-light py-2' onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>

      <PageAnimation>
        <section>
          <div className='mx-auto max-w-[900px] w-full'>
            {/* Banner */}
            <div className='relative aspect-video hover:opacity-80 bg-white border-4 border-grey'>
              <label htmlFor='uploadBanner' className='cursor-pointer'>
                <img
                  src={blog.banner || '/imgs/blog-banner.png'}
                  className='z-20'
                  loading='lazy'
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

            {/* Title */}
            <textarea
              placeholder='Blog Title'
              className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40'
              onKeyDown={handleTitleKeyEvent}
              onChange={handleTitleChange}
              defaultValue={blog?.title}
            ></textarea>

            <hr className='w-full opacity-10 my-5' />

            {/* Text editor */}
            <div id='textEditor' className='font-gelasio'></div>
          </div>
        </section>
      </PageAnimation>
    </>
  )
}

export default BlogEditor
