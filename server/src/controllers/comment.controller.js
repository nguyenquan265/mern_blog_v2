import { Blog, Comment, Notification } from '~/model'
import ApiError from '~/utils/ApiError'
import catchAsync from '~/utils/catchAsync'

export const getBlogComments = catchAsync(async (req, res, next) => {
  const { blog_id, skip } = req.query

  const comments = await Comment.find({ blog_id, isReply: false })
    .populate(
      'commented_by',
      'personal_info.username personal_info.fullname personal_info.profile_img'
    )
    .skip(skip)
    .limit(5)
    .sort({ commentedAt: -1 })

  res.status(200).json({ status: 'success', comments })
})

export const deleteComment = catchAsync(async (req, res, next) => {
  const { commentId } = req.params
  const userId = req.user._id

  const comment = await Comment.findById(commentId)

  if (!comment) {
    throw new ApiError(404, 'Comment not found')
  }

  if (
    comment.commented_by.toString() !== userId.toString() &&
    comment.blog_author.toString() !== userId.toString()
  ) {
    throw new ApiError(403, 'Permission denied')
  }

  await Promise.all([
    Comment.findByIdAndDelete(commentId),
    Blog.findByIdAndUpdate(comment.blog_id, {
      $pull: { comments: commentId },
      $inc: {
        'activity.total_comments': -1,
        'activity.total_parent_comments': -1
      }
    }),
    Notification.findOneAndDelete({
      comment: commentId
    })
  ])

  res.status(200).json({ status: 'success' })
})
