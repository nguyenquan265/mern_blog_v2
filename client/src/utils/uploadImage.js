import customAxios from './customAxios'
import toast from 'react-hot-toast'

const uploadImage = async (img) => {
  let imageURL = '/imgs/blog-banner.png'
  const formData = new FormData()
  formData.append('banner', img)

  try {
    const res = await customAxios.post('/blogs/uploadBanner', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    imageURL = res.data.imgURL
  } catch (error) {
    console.log(error)
    toast.error(
      error?.response?.data?.message || error?.message || 'Something went wrong'
    )
  }

  return imageURL
}

export default uploadImage
