import { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { Navigate } from 'react-router-dom'
import BlogEditor from '../components/BlogEditor'
import PublishForm from '../components/PublishForm'

const EditorPage = () => {
  const { accessToken } = useContext(AuthContext)
  const [editorState, setEditorState] = useState('editor')

  if (!accessToken) {
    return <Navigate to='/signin' />
  }

  return <>{editorState === 'editor' ? <BlogEditor /> : <PublishForm />}</>
}

export default EditorPage
