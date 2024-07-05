import { Link } from 'react-router-dom'
import PageAnimation from '../common/PageAnimation'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { removeFromSession } from '../utils/session'

const UserNavigationPanel = () => {
  const { user, setUser } = useContext(AuthContext)

  const signOut = () => {
    removeFromSession('user')
    removeFromSession('accessToken')
    setUser(null)
  }

  return (
    <PageAnimation
      className='absolute right-0 z-50'
      transition={{ duration: 0.2 }}
    >
      <div className='bg-white absolute right-0 border border-grey w-60 duration-200'>
        <Link to='/editor' className='flex gap-2 link md:hidden pl-8 py-4'>
          <i className='fi fi-rr-file-edit'></i>
          <p>Write</p>
        </Link>
        <Link to={`/user/${user.username}`} className='link pl-8 py-4'>
          Profile
        </Link>
        <Link to='/dashboard/blogs' className='link pl-8 py-4'>
          Dashboard
        </Link>
        <Link to='/settings/edit-profile' className='link pl-8 py-4'>
          Settings
        </Link>

        <span className='absolute border-t border-grey w-[100%]'></span>

        <button
          className='text-left p-4 hover:bg-grey w-full pl-8 py-4'
          onClick={signOut}
        >
          <h1 className='font-bold text-xl'>Sign Out</h1>
          <p className='text-dark-grey'>@{user.username}</p>
        </button>
      </div>
    </PageAnimation>
  )
}

export default UserNavigationPanel
