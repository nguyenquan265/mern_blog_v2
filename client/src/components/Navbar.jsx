import { useContext, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider'
import UserNavigationPanel from './UserNavigationPanel'

const Navbar = () => {
  const [searchBoxVisible, setSearchBoxVisible] = useState(false)
  const [userNavigationPanelVisible, setUserNavigationPanelVisible] =
    useState(false)
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSearch = (e) => {
    const query = e.target.value

    if ((e.key === 'Enter' || e.keyCode === 13) && query) {
      navigate(`/search/${query}`)
    }
  }

  return (
    <>
      <nav className='navbar'>
        {/* Logo */}
        <Link to='/' className='flex-none w-10'>
          <img src='/imgs/logo.png' className='w-full' loading='lazy' />
        </Link>

        {/* Search input */}
        <div
          className={`absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ${
            searchBoxVisible ? 'show' : 'hide'
          }`}
        >
          <input
            type='text'
            placeholder='Search'
            className='w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12'
            onKeyDown={handleSearch}
          />
          <i className='fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey'></i>
        </div>

        <div className='flex items-center gap-3 md:gap-6 ml-auto'>
          {/* Open search input under md screen */}
          <button
            className='md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center'
            onClick={() => setSearchBoxVisible(!searchBoxVisible)}
          >
            <i className='fi fi-rr-search text-xl'></i>
          </button>

          {/* Editor button */}
          <Link to='/editor' className='hidden md:flex gap-2 link'>
            <i className='fi fi-rr-file-edit'></i>
            <p>Write</p>
          </Link>

          {/* User button */}
          {user ? (
            <>
              <Link to='/dashboard/notification'>
                <button className='w-12 h-12 rounded-full bg-grey relative hover:bg-black/10'>
                  <i className='fi fi-rr-bell text-2xl block mt-1'></i>
                </button>
              </Link>
              <div
                className='relative'
                onClick={() =>
                  setUserNavigationPanelVisible(!userNavigationPanelVisible)
                }
              >
                <button className='w-12 h-12 mt-1'>
                  <img
                    src={user.profile_img}
                    className='w-full h-full object-cover rounded-full'
                    loading='lazy'
                  />
                </button>
                {userNavigationPanelVisible && <UserNavigationPanel />}
              </div>
            </>
          ) : (
            <>
              <Link to='/signin' className='btn-dark py-2'>
                Sign In
              </Link>
              <Link to='/signup' className='btn-light py-2 hidden md:block'>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  )
}

export default Navbar
