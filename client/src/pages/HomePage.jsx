import PageAnimation from '../common/PageAnimation'
import InPageNavigation from '../components/InPageNavigation'

const HomePage = () => {
  return (
    <PageAnimation>
      <section className='h-cover flex justify-center gap-10'>
        {/* Latest blogs */}
        <div className='w-full'>
          <InPageNavigation
            routes={['home', 'trending blogs']}
            defaultHidden={['trending blogs']}
          >
            <h1>Latest Blogs Here</h1>
            <h1>Trending Blogs Here</h1>
          </InPageNavigation>
        </div>

        {/* Filters and trending blogs */}
        <div></div>
      </section>
    </PageAnimation>
  )
}

export default HomePage
