import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import customAxios from '../utils/customAxios'
import PageAnimation from '../common/PageAnimation'
import ComponentLoader from '../common/ComponentLoader'
import { AuthContext } from '../context/AuthProvider'
import { toast } from 'react-hot-toast'

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
      setLoading(false)
    } catch (error) {
      console.log(error)
      // toast.error('User not found')
      setLoading(false)
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
      ) : (
        <section className='h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12'>
          <div className='flex flex-col max-md:items-center gap-5 min-w-[250px]'>
            <img
              src={profile_img}
              className='w-48 h-48 bg-grey rounded-full md:w-32 md:h-32'
            />
            <h1 className='text-2xl font-medium'>@{username}</h1>
            <p className='text-xl capitalize h-6'>{fullname}</p>
            <p>
              {total_posts.toLocaleString()} Blogs -{' '}
              {total_reads.toLocaleString()} Reads
            </p>
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
          </div>
        </section>
      )}
    </PageAnimation>
  )
}

export default ProfilePage
