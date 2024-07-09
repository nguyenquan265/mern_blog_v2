import { Link } from 'react-router-dom'
import PageAnimation from '../common/PageAnimation'
import uploadImage from '../utils/uploadImage'
import { useContext, useEffect } from 'react'
import toast from 'react-hot-toast'
import { EditorContext } from '../pages/EditorPage'
import EditorJS from '@editorjs/editorjs'
import Embed from '@editorjs/embed'
import Header from '@editorjs/header'
import Image from '@editorjs/image'
import InlineCode from '@editorjs/inline-code'
import List from '@editorjs/list'
import Marker from '@editorjs/marker'
import Quote from '@editorjs/quote'

const BlogEditor = () => {
  const { blog, setBlog, textEditor, setTextEditor, setEditorState } =
    useContext(EditorContext)

  useEffect(() => {
    setTextEditor(
      new EditorJS({
        holder: 'textEditor',
        data: blog.content || '',
        tools: {
          embed: Embed,
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a header',
              levels: [2, 3],
              defaultLevel: 2
            }
          },
          image: {
            class: Image,
            config: {
              uploader: {
                async uploadByFile(file) {
                  return uploadImage(file).then((res) => {
                    return { success: 1, file: { url: res } }
                  })
                }
              }
            }
          },
          inlineCode: InlineCode,
          list: {
            class: List,
            inlineToolbar: true
          },
          marker: Marker,
          quote: {
            class: Quote,
            inlineToolbar: true
          }
        },
        placeholder: 'Start writing your blog...'
      })
    )
  }, [])

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

  const handleTitleKeyEvent = (e) => {
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

        setBlog({ ...blog, content: data })
        setEditorState('publish')
      } catch (error) {
        console.log(error)
        toast.error('Failed to save content')
      }
    }
  }

  const handleSaveDraft = async (e) => {}

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
