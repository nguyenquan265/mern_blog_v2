import PageAnimation from '../common/PageAnimation'
import InPageNavigation from '../components/InPageNavigation'

const HomePage = () => {
  return (
    <PageAnimation>
      <section className='h-cover flex justify-center gap-10'>
        {/* Latest blogs */}
        <div>
          <InPageNavigation />
        </div>

        {/* Filters and trending blogs */}
        <div></div>
      </section>
    </PageAnimation>
  )
}

export default HomePage
