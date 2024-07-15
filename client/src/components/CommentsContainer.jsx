import { useContext } from 'react'
import { BlogContext } from '../pages/BlogPage'
import CommentField from './CommentField'
import customAxios from '../utils/customAxios'
import NoDataMessage from './NoDataMessage'
import PageAnimation from '../common/PageAnimation'
import CommentCard from './CommentCard'

export const fetchComments = async ({
  skip = 0,
  blog_id,
  setParentCommentCountFunc,
  comment_array = null
}) => {
  const res = await customAxios('/comments/getBlogComments', {
    params: { blog_id, skip }
  })

  res.data.comments.map((comment) => (comment.childrenLevel = 0)) // Set childrenLevel to 0 for parent comments

  setParentCommentCountFunc((preValue) => preValue + res.data.comments.length) // Increment total parent comments

  if (comment_array === null) {
    // If comment_array is null, return the fetched comments
    return { results: res.data.comments }
  } else {
    // If comment_array is not null, return the fetched comments and the previous comments
    return { results: [...comment_array, ...res.data.comments] }
  }
}

const CommentsContainer = () => {
  const {
    blog,
    blog: {
      _id,
      title,
      comments: { results: commentArr },
      activity: { total_parent_comments }
    },
    setBlog,
    commentsWrapper,
    setCommentsWrapper,
    totalParentCommentsLoad,
    setTotalParentCommentsLoad
  } = useContext(BlogContext)

  const loadMoreComment = async () => {
    const newComments = await fetchComments({
      skip: totalParentCommentsLoad,
      blog_id: _id,
      setParentCommentCountFunc: setTotalParentCommentsLoad,
      comment_array: commentArr
    })

    setBlog({
      ...blog,
      comments: newComments
    })
  }

  return (
    <div
      className={
        'max-sm:w-full fixed ' +
        (commentsWrapper ? 'top-0 sm:right-0' : 'top-[100%] sm:right-[-100%]') +
        ' duration-700 max-sm:right-0 sm:top-0 w-[30%] min-w-[450px] h-full z-50 bg-white shadow-2xl p-8 px-16 overflow-y-auto overflow-x-hidden'
      }
    >
      <div className='relative'>
        <h1 className='text-xl font-medium'>Comments</h1>
        <p className='text-lg mt-2 w-[70%] text-dark-grey line-clamp-1'>
          {title}
        </p>
        <button
          className='absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey'
          onClick={() => setCommentsWrapper((preValue) => !preValue)}
        >
          <i className='fi fi-br-cross text-2xl mt-1'></i>
        </button>
      </div>

      <hr className='border-grey my-8 w-[120%] -ml-10' />

      {/* CommentField */}
      <CommentField action='comment' />

      {/* Render comments */}
      {commentArr && commentArr.length ? (
        commentArr.map((comment, i) => {
          return (
            <PageAnimation key={i}>
              <CommentCard
                index={i}
                leftVal={comment.childrenLevel * 4}
                commentData={comment}
              />
            </PageAnimation>
          )
        })
      ) : (
        <NoDataMessage message='no comments' />
      )}

      {/* Load more comments button */}
      {total_parent_comments > totalParentCommentsLoad && (
        <button
          className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
          onClick={loadMoreComment}
        >
          Load more
        </button>
      )}
    </div>
  )
}

export default CommentsContainer
