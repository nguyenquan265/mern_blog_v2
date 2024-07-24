import { useEffect, useRef, useState } from 'react'

// export activeTabRef to be used in HomePage.jsx to set the active tab line to the active tab
let activeTabLineRef
export let activeTabRef

const InPageNavigation = ({
  routes,
  defaultHidden,
  defaultActiveIndex = 0,
  children
}) => {
  activeTabLineRef = useRef()
  activeTabRef = useRef()
  const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex)
  const [isResizeEventAdd, setIsResizeEventAdd] = useState(false)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  const updateActiveTabLine = (btn, i) => {
    const { offsetLeft, offsetWidth } = btn

    activeTabLineRef.current.style.left = `${offsetLeft}px` // Set the left position of the active tab line
    activeTabLineRef.current.style.width = `${offsetWidth}px` // Set the width of the active tab line
    setInPageNavIndex(i) // Set the active tab index
  }

  // Set the active tab line to the default active tab
  useEffect(() => {
    // Set the active tab line to the default active tab if the screen width is greater than 766px and the active tab is not the default active tab
    if (windowWidth > 766 && inPageNavIndex !== defaultActiveIndex) {
      updateActiveTabLine(activeTabRef.current, defaultActiveIndex)
    }

    //  Add resize event listener to update the active tab line position
    if (!isResizeEventAdd) {
      window.addEventListener('resize', () => {
        if (!isResizeEventAdd) {
          setIsResizeEventAdd(true)
        }

        setWindowWidth(window.innerWidth)
      })
    }

    // Remove resize event listener
    return () => {
      window.removeEventListener('resize', () => {
        setWindowWidth(window.innerWidth)
      })
    }
  }, [windowWidth])

  return (
    <>
      <div className='relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-hidden'>
        {routes.map((route, i) => {
          return (
            <button
              ref={defaultActiveIndex === i ? activeTabRef : null}
              key={i}
              className={
                'p-4 px-5 capitalize ' +
                `${inPageNavIndex === i ? 'text-black' : 'text-dark-grey'}` +
                `${defaultHidden?.includes(route) && ' md:hidden'}` // Hide the tab in md screen if it is in defaultHidden
              }
              onClick={(e) => updateActiveTabLine(e.target, i)}
            >
              {route}
            </button>
          )
        })}

        <hr ref={activeTabLineRef} className='absolute bottom-0 duration-300' />
      </div>

      {/* If chidren is an array then render the specific element by inPageNavIndex, otherwise render children  */}
      {Array.isArray(children) ? children[inPageNavIndex] : children}
    </>
  )
}

export default InPageNavigation
