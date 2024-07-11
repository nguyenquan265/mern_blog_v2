import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import customAxios from '../utils/customAxios'
import PageAnimation from '../common/PageAnimation'
import ComponentLoader from '../common/ComponentLoader'
import { AuthContext } from '../context/AuthProvider'
import { toast } from 'react-hot-toast'
import AboutUser from '../components/AboutUser'
import InPageNavigation from '../components/InPageNavigation'
import BlogPostCard from '../components/BlogPostCard'
import NoDataMessage from '../components/NoDataMessage'
import LoadMoreButton from '../components/LoadMoreButton'
import NotFoundPage from './NotFoundPage'

const profileStructure = {
  personal_info: {
    fullname: '',
    username: '',
    profile_img: '',
    bio: ''
  },
  account_info: {
    total_posts: 0,
    total_reads: 0
  },
  social_links: {},
  joinedAt: ''
}

const ProfilePage = () => {
  const { id: profileId } = useParams()

  const [profile, setProfile] = useState(profileStructure)
  const [loading, setLoading] = useState(true)
  const [blogs, setBlogs] = useState(null)

  const {
    personal_info: { fullname, username, profile_img, bio },
    account_info: { total_posts, total_reads },
    social_links,
    joinedAt
  } = profile

  const { user } = useContext(AuthContext)

  const fetchUserProfile = async () => {
    try {
      const res = await customAxios.get(`/users/profile/${profileId}`)

      setProfile(res.data.user)
      getBlogs(1, res.data.user._id)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const getBlogs = async (page = 1, authorId, createNewArr = false) => {
    try {
      const res = await customAxios.get(
        `/blogs/search?page=${page}&authorId=${
          authorId ? authorId : profile._id
        }`
      )

      if (!blogs || createNewArr) {
        setBlogs({
          results: res.data.blogs,
          page: res.data.page,
          totalDocs: res.data.totalDocs
        })
      } else {
        setBlogs({
          results: [...blogs.results, ...res.data.blogs],
          page: res.data.page,
          totalDocs: res.data.totalDocs
        })
      }
    } catch (error) {
      console.log(error)
    }
  }

  const resetState = () => {
    setProfile(profileStructure)
    setLoading(true)
  }

  useEffect(() => {
    resetState()
    fetchUserProfile()
  }, [profileId])

  return (
    <PageAnimation>
      {loading ? (
        <ComponentLoader />
      ) : username.length ? (
        <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
          {/* Profile */}
          <div className='flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l md:border-grey md:sticky md:top-[100px] md:py-10'>
            {/* Img */}
            <img
              src={profile_img}
              className='w-48 h-48 bg-grey rounded-full md:w-32 md:h-32'
            />
            {/* Username */}
            <h1 className='text-2xl font-medium'>@{username}</h1>
            {/* Fullname */}
            <p className='text-xl capitalize h-6'>{fullname}</p>
            {/* account_info */}
            <p>
              {total_posts.toLocaleString()} Blogs -{' '}
              {total_reads.toLocaleString()} Reads
            </p>
            {/* Btn */}
            <div className='flex gap-4 mt-2'>
              {profileId === user?.username && (
                <Link
                  to='/settings/edit-profile'
                  className='btn-light rounded-md'
                >
                  Edit Profile
                </Link>
              )}
            </div>

            {/*About User*/}
            <AboutUser
              className='max-md:hidden'
              bio={bio}
              social_links={social_links}
              joinedAt={joinedAt}
            />
          </div>

          {/* User's blogs */}
          <div className='max-md:mt-12 w-full'>
            <InPageNavigation
              routes={['blogs published', 'about']}
              defaultHidden={['about']}
            >
              {/* Latest blog */}
              <>
                {!blogs ? (
                  <ComponentLoader />
                ) : blogs.results.length ? (
                  blogs.results.map((blog, i) => {
                    return (
                      <PageAnimation
                        transition={{ duration: 1, delay: i * 0.1 }}
                        key={i}
                      >
                        <BlogPostCard
                          content={blog}
                          author={blog.author.personal_info}
                        />
                      </PageAnimation>
                    )
                  })
                ) : (
                  <NoDataMessage message='No blogs published' />
                )}

                {/* Load more button */}
                <LoadMoreButton state={blogs} fetchFunction={getBlogs} />
              </>

              {/*About User*/}
              <AboutUser
                bio={bio}
                social_links={social_links}
                joinedAt={joinedAt}
              />
            </InPageNavigation>
          </div>
        </section>
      ) : (
        <NotFoundPage />
      )}
    </PageAnimation>
  )
}

export default ProfilePage
