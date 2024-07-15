import { Comment } from '~/model'
import catchAsync from '~/utils/catchAsync'

// get blog comments which are not replies
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
