import PageAnimation from '../common/PageAnimation'
import InputBox from '../components/InputBox'
import { toast } from 'react-hot-toast'
import customAxios from '../utils/customAxios'

const ChangePasswordPage = () => {
  const handleSubmit = async (e) => {
    e.preventDefault()

    const formElement = document.getElementById('changePasswordForm')
    const formData = new FormData(formElement)
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/
    let data = {}

    formData.forEach((value, key) => {
      data[key] = value
    })

    const { currentPassword, newPassword } = data

    if (!currentPassword || !newPassword) {
      return toast.error('All fields are required!')
    }

    if (!passwordRegex.test(newPassword)) {
      return toast.error(
        'Password must contain at least one number, one uppercase and lowercase letter, and at least 6 or more characters'
      )
    }

    e.target.setAttribute('disabled', true)
    const loadingToast = toast.loading('Changing password...')

    try {
      await customAxios.patch('/users/changePassword', data)

      formElement.reset()
      e.target.removeAttribute('disabled')
      toast.dismiss(loadingToast)
      toast.success('Password changed successfully!')
    } catch (error) {
      console.log(error)
      e.target.removeAttribute('disabled')
      toast.dismiss(loadingToast)
      toast.error(error?.response?.data?.message || 'An error occurred')
    }
  }

  return (
    <PageAnimation>
      <form id='changePasswordForm'>
        <h1 className='max-md:hidden'>Change Password</h1>

        <div className='py-10 w-full md:max-w-[400px]'>
          <InputBox
            name='currentPassword'
            type='password'
            className='profile-edit-input'
            placeholder='Current Password'
            icon='unlock'
          />
          <InputBox
            name='newPassword'
            type='password'
            className='profile-edit-input'
            placeholder='New Password'
            icon='unlock'
          />

          <button
            className='btn-dark px-10'
            type='submit'
            onClick={handleSubmit}
          >
            Change Password
          </button>
        </div>
      </form>
    </PageAnimation>
  )
}

export default ChangePasswordPage
