import { useEffect, useRef, useState } from 'react'

const InPageNavigation = ({
  routes,
  defaultHidden,
  defaultActiveIndex = 0,
  children
}) => {
  const activeTabLineRef = useRef()
  const defaultActiveTabRef = useRef()
  const [inPageNavIndex, setInPageNavIndex] = useState(defaultActiveIndex)

  const updateActiveTab = (btn, i) => {
    const { offsetLeft, offsetWidth } = btn

    activeTabLineRef.current.style.left = `${offsetLeft}px` // Set the left position of the active tab line
    activeTabLineRef.current.style.width = `${offsetWidth}px` // Set the width of the active tab line
    setInPageNavIndex(i) // Set the active tab index
  }

  // Set the active tab line to the default active tab
  useEffect(() => {
    updateActiveTab(defaultActiveTabRef.current, defaultActiveIndex)
  }, [])

  return (
    <>
      <div className='relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-x-hidden'>
        {routes.map((route, i) => {
          return (
            <button
              ref={defaultActiveIndex === i ? defaultActiveTabRef : null}
              key={i}
              className={
                'p-4 px-5 capitalize ' +
                `${inPageNavIndex === i ? 'text-black' : 'text-dark-grey'}` +
                `${defaultHidden.includes(route) && ' md:hidden'}`
              }
              onClick={(e) => updateActiveTab(e.target, i)}
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
