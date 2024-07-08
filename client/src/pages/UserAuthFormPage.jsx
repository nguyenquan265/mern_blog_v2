import { Link, Navigate } from 'react-router-dom'
import InputBox from '../components/InputBox'
import PageAnimation from '../common/PageAnimation'
import toast from 'react-hot-toast'
import customAxios from '../utils/customAxios'
import { storeInSession } from '../utils/session'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { signInWithGoogle } from '../firebase/firebase'

const UserAuthFormPage = ({ type }) => {
  const { user, setUser, setAccessToken } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const serverRoute = type === 'sign-in' ? '/auth/signin' : '/auth/signup'
    const formElement = document.getElementById('formElement')
    const formData = new FormData(formElement)
    let data = {}

    formData.forEach((value, key) => {
      data[key] = value
    })

    try {
      const res = await customAxios.post(serverRoute, data)

      formElement.reset()
      setUser(res.data.user)
      setAccessToken(res.data.accessToken)
      storeInSession('user', res.data.user)
      storeInSession('accessToken', res.data.accessToken)
    } catch (error) {
      console.log(error)
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong'
      )
    }
  }

  const handleGoogleAuth = async (e) => {
    e.preventDefault()

    try {
      const user = await signInWithGoogle()
      const res = await customAxios.post('/auth/google', {
        access_token: user.accessToken
      })

      setUser(res.data.user)
      setAccessToken(res.data.accessToken)
      storeInSession('user', res.data.user)
      storeInSession('accessToken', res.data.accessToken)
    } catch (error) {
      console.log(error)
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          'Something went wrong'
      )
    }
  }

  return user ? (
    <Navigate to='/' />
  ) : (
    <PageAnimation keyValue={type}>
      <section className='h-cover flex items-center justify-center'>
        <form id='formElement' className='w-[80%] max-w-[400px]'>
          <h1 className='text-4xl font-gelasio capitalize text-center mb-16'>
            {type === 'sign-in' ? 'Welcome Back' : 'Join Us Today'}
          </h1>
          {/* Form fields */}
          {type !== 'sign-in' && (
            <InputBox
              name='fullname'
              type='text'
              placeholder='Full Name'
              icon='user'
            />
          )}
          <InputBox
            name='email'
            type='email'
            placeholder='Email'
            icon='envelope'
          />
          <InputBox
            name='password'
            type='password'
            placeholder='Password'
            icon='key'
          />

          {/* Submit button */}
          <button
            className='btn-dark center mt-14'
            type='submit'
            onClick={handleSubmit}
          >
            {type.replace('-', ' ')}
          </button>

          <div className='relative w-full flex items-center gap-2 my-4 opacity-30 uppercase text-black font-bold'>
            <hr className='w-1/2 border-black' />
            <p>or</p>
            <hr className='w-1/2 border-black' />
          </div>

          {/* Google button */}
          <button
            className='btn-dark flex items-center justify-center gap-4 w-[90%] center'
            onClick={handleGoogleAuth}
          >
            <img src='/imgs/google.png' className='w-5' loading='lazy' />
            countinue with google
          </button>

          {/* Navigate between auth page */}
          {type === 'sign-in' ? (
            <p className='mt-6 text-dark-grey text-xl text-center'>
              Don't have an account?{' '}
              <Link to='/signup' className='underline text-black text-xl ml-1'>
                Sign up
              </Link>
            </p>
          ) : (
            <p className='mt-6 text-dark-grey text-xl text-center'>
              Already have an account?{' '}
              <Link to='/signin' className='underline text-black text-xl ml-1'>
                Sign In
              </Link>
            </p>
          )}
        </form>
      </section>
    </PageAnimation>
  )
}

export default UserAuthFormPage
