import { useContext, useEffect, useRef, useState } from 'react'
import customAxios from '../utils/customAxios'
import PageAnimation from '../common/PageAnimation'
import ComponentLoader from '../common/ComponentLoader'
import { toast } from 'react-hot-toast'
import InputBox from '../components/InputBox'
import uploadImage from '../utils/uploadImage'
import { storeInSession } from '../utils/session'
import { AuthContext } from '../context/AuthProvider'

const profileStructure = {
  personal_info: {
    fullname: '',
    username: '',
    email: '',
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

const EditProfilePage = () => {
  const { user, setUser } = useContext(AuthContext)
  const [profile, setProfile] = useState(profileStructure)
  const [loading, setLoading] = useState(true)
  const [updatedProfileImg, setUpdatedProfileImg] = useState(null)
  const {
    personal_info: { fullname, username, email, profile_img, bio },
    social_links
  } = profile
  const profileImgElement = useRef()

  const handleImagePreview = (e) => {
    const img = e.target.files[0]

    if (img) {
      profileImgElement.current.src = URL.createObjectURL(img)

      setUpdatedProfileImg(img)
    }
  }

  const handleUploadImage = async (e) => {
    e.preventDefault()

    if (!updatedProfileImg) {
      return toast.error('Please select an image to upload')
    }

    const loadingToast = toast.loading('Uploading image...')
    e.target.setAttribute('disabled', true)

    try {
      const imgURL = await uploadImage(updatedProfileImg)
      const res = await customAxios.patch('/users/updateUserProfileImage', {
        profile_img: imgURL
      })

      setUser({
        ...user,
        profile_img: imgURL
      })
      storeInSession('user', res.data.user)
      setUpdatedProfileImg(null)
      e.target.removeAttribute('disabled')
      toast.dismiss(loadingToast)
      toast.success('Profile image updated successfully')
    } catch (error) {
      console.log(error)
      e.target.removeAttribute('disabled')
      toast.dismiss(loadingToast)
      toast.error(error?.response?.data?.message || 'An error occurred')
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()

    const formElement = document.getElementById('updateProfileForm')
    const formData = new FormData(formElement)
    let data = {}

    formData.forEach((value, key) => {
      data[key] = value
    })

    const {
      username,
      bio,
      youtube,
      facebook,
      twitter,
      github,
      instagram,
      website
    } = data

    if (username.length < 3) {
      return toast.error('Username must be at least 3 characters long')
    }

    if (bio.length > 150) {
      return toast.error('Bio must be less than 150 characters')
    }

    const loadingToast = toast.loading('Updating profile...')
    e.target.setAttribute('disabled', true)

    try {
      const res = await customAxios.patch('/users/updateProfile', {
        username,
        bio,
        social_links: {
          youtube,
          facebook,
          twitter,
          github,
          instagram,
          website
        }
      })

      setUser({
        ...user,
        username
      })
      storeInSession('user', res.data.userPersonalInfo)
      setProfile(res.data.user)
      e.target.removeAttribute('disabled')
      toast.dismiss(loadingToast)
      toast.success('Profile updated successfully')
    } catch (error) {
      console.log(error)
      e.target.removeAttribute('disabled')
      toast.dismiss(loadingToast)
      toast.error(error?.response?.data?.message || 'An error occurred')
    }
  }

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await customAxios('/auth/me')

        setProfile(res.data.user)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    fetchMyProfile()
  }, [])

  return (
    <PageAnimation>
      {loading ? (
        <ComponentLoader />
      ) : (
        <form id='updateProfileForm'>
          <h1 className='max-md:hidden'>Edit Profile</h1>

          <div className='flex flex-col py-10 gap-8 lg:gap-10'>
            {/* Profile image */}
            <div className='center mb-5'>
              <label
                htmlFor='uploadImg'
                id='profileImgLable'
                className='relative block w-48 h-48 bg-grey rounded-full overflow-hidden'
              >
                <div className='w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/80 opacity-0 hover:opacity-100 cursor-pointer'>
                  Upload Image
                </div>
                <img ref={profileImgElement} src={profile_img} loading='lazy' />
              </label>

              <input
                type='file'
                id='uploadImg'
                accept='image/*'
                hidden
                onChange={handleImagePreview}
              />

              <button
                className='btn-light mt-5 max-lg:center w-full px-10'
                onClick={handleUploadImage}
              >
                Upload
              </button>
            </div>

            {/* Fullname and Email */}
            <div className='w-full'>
              <div className='grid grid-cols-1 md:grid-cols-2 md:gap-5'>
                <div>
                  <InputBox
                    name='fullname'
                    type='text'
                    value={fullname}
                    placeholder='Full Name'
                    disable={true}
                    icon='user'
                  />
                </div>
                <div>
                  <InputBox
                    name='email'
                    type='email'
                    value={email}
                    placeholder='Email'
                    disable={true}
                    icon='envelope'
                  />
                </div>
              </div>
            </div>

            {/* Username */}
            <InputBox
              type='text'
              name='username'
              value={username}
              placeholder='Username'
              icon='at'
            />

            <p className='text-dark-grey -mt-3'>
              Username will be used to search user and will be visible to all
              users
            </p>

            {/* Bio */}
            <textarea
              name='bio'
              maxLength={150}
              defaultValue={bio}
              className='input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5'
              placeholder='Bio'
              onChange={(e) => {
                document.getElementById('bioDescription').innerText = `${
                  150 - e.target.value.length
                } characters left`
              }}
            ></textarea>

            <p id='bioDescription' className='mt-1 text-dark-grey'>
              150 characters left
            </p>

            {/* Social */}
            <p className='my-6 text-dark-grey'>Add your social handles below</p>

            <div className='md:grid md:grid-cols-2 gap-x-6'>
              {Object.keys(social_links).map((key, i) => {
                const link = social_links[key]

                return (
                  <InputBox
                    key={i}
                    name={key}
                    type='text'
                    value={link}
                    placeholder='https://'
                    website={
                      key !== 'website' ? `fi-brands-${key}` : 'fi-rr-globe'
                    }
                  />
                )
              })}
            </div>

            {/* Submit button */}
            <button
              className='btn-dark w-auto px-10'
              type='submit'
              onClick={handleUpdateProfile}
            >
              Update
            </button>
          </div>
        </form>
      )}
    </PageAnimation>
  )
}

export default EditProfilePage
