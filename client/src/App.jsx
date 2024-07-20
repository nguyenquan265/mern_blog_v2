import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import UserAuthFormPage from './pages/UserAuthFormPage'
import AuthProvider from './context/AuthProvider'
import EditorPage from './pages/EditorPage'
import HomePage from './pages/HomePage'
import { Toaster } from 'react-hot-toast'
import NotFoundPage from './pages/NotFoundPage'
import SeachPage from './pages/SeachPage'
import ProfilePage from './pages/ProfilePage'
import BlogPage from './pages/BlogPage'
import SideNav from './components/SideNav'
import ChangePasswordPage from './pages/ChangePasswordPage'
import EditProfilePage from './pages/EditProfilePage'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/editor' element={<EditorPage />} />
          <Route path='/editor/:slug' element={<EditorPage />} />
          <Route path='/' element={<Navbar />}>
            <Route index element={<HomePage />} />
            <Route path='settings' element={<SideNav />}>
              <Route path='edit-profile' element={<EditProfilePage />} />
              <Route path='change-password' element={<ChangePasswordPage />} />
            </Route>
            <Route
              path='signin'
              element={<UserAuthFormPage type='sign-in' />}
            />
            <Route
              path='signup'
              element={<UserAuthFormPage type='sign-up' />}
            />
            <Route path='search/:query' element={<SeachPage />} />
            <Route path='user/:id' element={<ProfilePage />} />
            <Route path='blog/:slug' element={<BlogPage />} />
            <Route path='*' element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  )
}

export default App
