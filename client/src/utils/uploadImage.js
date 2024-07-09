import customAxios from './customAxios'
import toast from 'react-hot-toast'

const uploadImage = async (img) => {
  let imageURL = '/imgs/blog-banner.png' // Default image
  const formData = new FormData() // Create a new FormData instance
  formData.append('image', img) // Append the file to the FormData instance

  try {
    const res = await customAxios.post('/blogs/uploadImage', formData, {
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
