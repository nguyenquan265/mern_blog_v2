import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <section className='h-cover relative p-10 flex flex-col items-center gap-20 text-center'>
      <img
        src='/imgs/404.png'
        className='select-none w-72 aspect-square object-cover rounded'
      />
      <h1 className='text-4xl font-gelasio leadig-7'>Page not found</h1>
      <p className='text-dark-grey text-xl leading-7 -mt-8'>
        The page you are looking for does not exist. Head back to the{' '}
        <Link to='/' className='text-black underline'>
          home page
        </Link>
      </p>
      <div className='mt-auto'>
        <img
          src='/imgs/full-logo.png'
          className='h-8 object-contain block mx-auto select-none'
        />
        <p className='mt-5 text-dark-grey'>
          Read millions of stories around the world
        </p>
      </div>
    </section>
  )
}

export default NotFoundPage
