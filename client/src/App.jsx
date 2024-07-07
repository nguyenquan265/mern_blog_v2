import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import UserAuthFormPage from './pages/UserAuthFormPage'
import AuthProvider from './context/AuthProvider'
import EditorPage from './pages/EditorPage'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/editor' element={<EditorPage />} />
          <Route path='/' element={<Navbar />}>
            <Route
              path='signin'
              element={<UserAuthFormPage type='sign-in' />}
            />
            <Route
              path='signup'
              element={<UserAuthFormPage type='sign-up' />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
