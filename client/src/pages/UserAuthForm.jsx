import { Link } from 'react-router-dom'
import InputBox from '../components/InputBox'
import PageAnimation from '../common/PageAnimation'

const UserAuthForm = ({ type }) => {
  return (
    <PageAnimation keyValue={type}>
      <section className='h-cover flex items-center justify-center'>
        <form className='w-[80%] max-w-[400px]'>
          <h1 className='text-4xl font-gelasio capitalize text-center mb-16'>
            {type === 'sign-in' ? 'Welcome Back' : 'Join Us Today'}
          </h1>
          {/* Form fields */}
          {type !== 'sign-in' ? (
            <InputBox
              name='fullname'
              type='text'
              placeholder='Full Name'
              icon='user'
            />
          ) : (
            ''
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
          <button className='btn-dark center mt-14' type='submit'>
            {type.replace('-', ' ')}
          </button>
          <div className='relative w-full flex items-center gap-2 my-4 opacity-30 uppercase text-black font-bold'>
            <hr className='w-1/2 border-black' />
            <p>or</p>
            <hr className='w-1/2 border-black' />
          </div>

          {/* Google button */}
          <button className='btn-dark flex items-center justify-center gap-4 w-[90%] center'>
            <img src='/imgs/google.png' className='w-5' />
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

export default UserAuthForm
