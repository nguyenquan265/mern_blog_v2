import { useContext } from 'react'
import { EditorContext } from '../pages/EditorPage'

const Tag = ({ tag, tagIndex }) => {
  const {
    blog,
    blog: { tags },
    setBlog
  } = useContext(EditorContext)

  const addContentEditable = (e) => {
    e.preventDefault()
    e.target.contentEditable = true
    e.target.focus()
  }

  const handleTagEdit = (e) => {
    if (
      e.key === 'Enter' ||
      e.keyCode === 13 ||
      e.key === ',' ||
      e.keyCode === 188
    ) {
      e.preventDefault()

      const newTag = e.target.innerText.trim()
      tags[tagIndex] = newTag
      setBlog({ ...blog, tags })
      e.target.contentEditable = false
    }
  }

  const handleRemoveTag = () => {
    const newTags = tags.filter((t) => t != tag)
    setBlog({ ...blog, tags: newTags })
  }

  return (
    <div className='relative py-2 mt-2 mr-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pr-10'>
      <p
        className='outline-none'
        onClick={addContentEditable}
        onKeyDown={handleTagEdit}
      >
        {tag}
      </p>
      <button
        className='mt-[2px] rounded-full absolute right-3 top-1/2 -translate-y-1/2'
        onClick={handleRemoveTag}
      >
        <i className='fi fi-br-cross text-sm pointer-events-none'></i>
      </button>
    </div>
  )
}

export default Tag
