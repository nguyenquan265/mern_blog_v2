import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import UserAuthForm from './pages/UserAuthForm'
import AuthProvider from './context/AuthProvider'

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navbar />}>
            <Route path='signin' element={<UserAuthForm type='sign-in' />} />
            <Route path='signup' element={<UserAuthForm type='sign-up' />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
