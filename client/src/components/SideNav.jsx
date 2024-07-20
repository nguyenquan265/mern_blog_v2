import { useContext, useEffect, useRef, useState } from 'react'
import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../context/AuthProvider'

const SideNav = () => {
  const { user, accessToken } = useContext(AuthContext)
  const pathName = location.pathname.split('/')[2]
  const [pageState, setPageState] = useState(pathName?.replace('-', ' '))
  const [showSideNav, setShowSideNav] = useState(false)
  const activeTabline = useRef()
  const sidebarIconTab = useRef()
  const pageStateTab = useRef()

  const ChangePageState = (e) => {
    const { offsetLeft, offsetWidth } = e.target

    activeTabline.current.style.left = `${offsetLeft}px`
    activeTabline.current.style.width = `${offsetWidth}px`

    if (e.target === sidebarIconTab.current) {
      setShowSideNav(true)
    } else {
      setShowSideNav(false)
    }
  }

  useEffect(() => {
    if (pathName) {
      setShowSideNav(false)

      pageStateTab.current.click()
    } else {
      setShowSideNav(true)

      sidebarIconTab.current.click()
    }
  }, [pageState])

  if (!accessToken) {
    return <Navigate to='/signin' />
  }

  return (
    <>
      <section className='relative flex gap-10 py-0 m-0 max-md:flex-col'>
        <div className='sticky top-[80px] z-30'>
          <div className='md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto'>
            <button
              ref={sidebarIconTab}
              className='p-5 capitalize'
              onClick={ChangePageState}
            >
              <i className='fi fi-rr-bars-staggered pointer-events-none'></i>
            </button>
            <button
              ref={pageStateTab}
              className='p-5 capitalize'
              onClick={ChangePageState}
            >
              {pageState}
            </button>
            <hr
              ref={activeTabline}
              className='absolute bottom-0 duration-500'
            />
          </div>

          <div
            className={
              'min-w-[200px] h-[calc(100vh-80px)] md:h-cover md:sticky top-24 overflow-y-auto p-6 md:pr-0 md:border-grey md:border-r absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-ml-7 duration-500 ' +
              (!showSideNav
                ? 'max-md:opacity-0 max-md:pointer-events-none'
                : 'opacity-100 pointer-events-auto')
            }
          >
            <h1 className='text-xl text-dark-grey mb-3'>Dashboard</h1>
            <hr className='border-grey -ml-6 mb-8 mr-6' />

            <NavLink
              to='/dashboard/blogs'
              onClick={(e) => setPageState(e.target.innerText)}
              className='sidebar-link'
            >
              <i className='fi fi-rr-document'></i>
              Blogs
            </NavLink>

            <NavLink
              to='/dashboard/notification'
              onClick={(e) => setPageState(e.target.innerText)}
              className='sidebar-link'
            >
              <div className='relative'>
                <i className='fi fi-rr-bell'></i>
                {user.newNotificationsAvailable && (
                  <span className='bg-red w-2 h-2 rounded-full absolute z-10 top-0 right-0'></span>
                )}
              </div>
              Notification
            </NavLink>

            <NavLink
              to='/editor'
              onClick={(e) => setPageState(e.target.innerText)}
              className='sidebar-link'
            >
              <i className='fi fi-rr-file-edit'></i>
              Write
            </NavLink>

            <h1 className='text-xl text-dark-grey mt-20 mb-3'>Settings</h1>
            <hr className='border-grey -ml-6 mb-8 mr-6' />

            <NavLink
              to='/settings/edit-profile'
              onClick={(e) => setPageState(e.target.innerText)}
              className='sidebar-link'
            >
              <i className='fi fi-rr-user'></i>
              Edit Profile
            </NavLink>

            <NavLink
              to='/settings/change-password'
              onClick={(e) => setPageState(e.target.innerText)}
              className='sidebar-link'
            >
              <i className='fi fi-rr-lock'></i>
              Change Password
            </NavLink>
          </div>
        </div>

        <div className='max-md:-mt-8 mt-5 w-full'>
          <Outlet />
        </div>
      </section>
    </>
  )
}

export default SideNav
