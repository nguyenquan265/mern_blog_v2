import { useContext, useEffect, useState } from 'react'
import customAxios from '../utils/customAxios'
import { AuthContext } from '../context/AuthProvider'
import PageLoader from '../common/PageLoader'
import PageAnimation from '../common/PageAnimation'
import NoDataMessage from '../components/NoDataMessage'
import NotificationCard from '../components/NotificationCard'
import LoadMoreButton from '../components/LoadMoreButton'

const filters = ['all', 'like', 'comment']

const NotificationPage = () => {
  const { accessToken, user, setUser } = useContext(AuthContext)
  const [filter, setFilter] = useState('all')
  const [notifications, setNotifications] = useState(null)

  const fetchNotifications = async (page = 1, deletedDocCount = 0) => {
    try {
      const res = await customAxios('/notifications', {
        params: {
          page,
          filter: filter.toLowerCase(),
          deletedDocCount
        }
      })

      if (user.newNotificationsAvailable) {
        setUser({ ...user, newNotificationsAvailable: false })
      }

      if (!notifications) {
        setNotifications({
          results: res.data.notifications,
          page: res.data.page,
          totalDocs: res.data.totalDocs,
          deletedDocCount
        })
      } else {
        setNotifications({
          results: [...notifications.results, ...res.data.notifications],
          page: res.data.page,
          totalDocs: res.data.totalDocs,
          deletedDocCount
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleFilter = (e) => {
    e.preventDefault()

    setFilter(e.target.innerText)
    setNotifications(null)
  }

  useEffect(() => {
    if (accessToken) {
      fetchNotifications()
    }
  }, [accessToken, filter])

  return (
    <div>
      <h1 className='max-md:hidden'>Recent Notifications</h1>

      <div className='my-8 flex gap-6'>
        {filters.map((f, i) => {
          return (
            <button
              key={i}
              className={`py-2 ${
                filter.toLowerCase() === f ? 'btn-dark' : 'btn-light'
              }`}
              onClick={handleFilter}
            >
              {f}
            </button>
          )
        })}
      </div>

      {notifications === null ? (
        <PageLoader />
      ) : (
        <>
          {notifications.results.length ? (
            notifications.results.map((n, i) => {
              return (
                <PageAnimation key={i} transition={{ delay: i * 0.08 }}>
                  <NotificationCard
                    data={n}
                    index={i}
                    notificationState={{ notifications, setNotifications }}
                  />
                </PageAnimation>
              )
            })
          ) : (
            <NoDataMessage message='Nothing available' />
          )}

          <LoadMoreButton
            state={notifications}
            fetchFunction={fetchNotifications}
            deletedDocCount={notifications.deletedDocCount}
          />
        </>
      )}
    </div>
  )
}

export default NotificationPage
