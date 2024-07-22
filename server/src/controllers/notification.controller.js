import { Notification } from '~/model'
import catchAsync from '~/utils/catchAsync'

export const newNotifications = catchAsync(async (req, res, next) => {
  const userId = req.user._id

  const notifications = await Notification.exists({
    notification_for: userId,
    seen: false,
    user: { $ne: userId }
  })

  res.status(200).json({
    status: 'success',
    newNotificationsAvailable: notifications ? true : false
  })
})

export const getNotifications = catchAsync(async (req, res, next) => {
  const userId = req.user._id
  const { page, filter, deletedDocCount } = req.query

  // Filter notifications
  let queryObj = { notification_for: userId, user: { $ne: userId } }
  let skip = (page - 1) * 5

  if (filter !== 'all') {
    queryObj.type = filter
  }

  if (deletedDocCount) {
    skip -= deletedDocCount
  }

  // Get notifications
  const [notifications, totalDocs] = await Promise.all([
    Notification.find(queryObj)
      .skip(skip)
      .limit(5)
      .populate('blog', 'title slug ')
      .populate(
        'user',
        'personal_info.fullname personal_info.username personal_info.profile_img'
      )
      .populate('comment', 'comment')
      .sort({ createdAt: -1 })
      .select('createdAt type seen'),
    Notification.countDocuments(queryObj),
    Notification.updateMany(queryObj, { seen: true }).skip(skip).limit(5)
  ])

  res.status(200).json({
    status: 'success',
    notifications,
    page,
    totalDocs
  })
})
