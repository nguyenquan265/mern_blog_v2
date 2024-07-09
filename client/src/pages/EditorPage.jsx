import { createContext, useContext, useState } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { Navigate } from 'react-router-dom'
import BlogEditor from '../components/BlogEditor'
import PublishForm from '../components/PublishForm'

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
  const { accessToken } = useContext(AuthContext)
  const [blog, setBlog] = useState(blogStructure) // Blog object
  const [editorState, setEditorState] = useState('editor') // editor or publish
  const [textEditor, setTextEditor] = useState({ isReady: false }) // EditorJS instance

  if (!accessToken) {
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
      {editorState === 'editor' ? <BlogEditor /> : <PublishForm />}
    </EditorContext.Provider>
  )
}

export default EditorPage
