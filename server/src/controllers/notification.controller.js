import { Notification } from '~/model'
import catchAsync from '~/utils/catchAsync'

export const newNotifications = catchAsync(async (req, res, next) => {
  const userId = req.user._id

  const notifications = await Notification.exists({
    notification_for: userId,
    seen: false,
    user: { $ne: userId }
  })

  res
    .status(200)
    .json({
      status: 'success',
      newNotificationsAvailable: notifications ? true : false
    })
})
