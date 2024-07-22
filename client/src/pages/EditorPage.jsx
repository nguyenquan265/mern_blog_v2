import { createContext, useContext, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider'
import { Navigate } from 'react-router-dom'
import BlogEditor from '../components/BlogEditor'
import PublishForm from '../components/PublishForm'
import ComponentLoader from '../common/ComponentLoader'
import customAxios from '../utils/customAxios'

const blogStructure = {
  title: '',
  banner: '',
  content: [],
  tags: [],
  des: '',
  author: { personal_info: {} }
}

export const EditorContext = createContext()

const EditorPage = () => {
  const { slug } = useParams()
  const { user, accessToken } = useContext(AuthContext)
  const [blog, setBlog] = useState(blogStructure) // Blog object
  const [editorState, setEditorState] = useState('editor') // editor or publish
  const [textEditor, setTextEditor] = useState({ isReady: false }) // EditorJS instance
  const [loading, setLoading] = useState(true)

  // if there is no slug, then it is a new blog else fetch the blog and pass it to the editor
  const fetchBlog = async () => {
    try {
      const blogRes = await customAxios(`/blogs/getBlogBySlug/${slug}`, {
        params: { draft: true, mode: 'edit' }
      })

      setBlog(blogRes.data.blog)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!slug) {
      return setLoading(false)
    }

    fetchBlog()
  }, [])

  if (!user || !accessToken) {
    return <Navigate to='/signin' />
  }

  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorState,
        setEditorState,
        textEditor,
        setTextEditor
      }}
    >
      {loading ? (
        <ComponentLoader />
      ) : editorState === 'editor' ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  )
}

export default EditorPage
