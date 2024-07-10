const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

const getDate = (timestamp) => {
  const date = new Date(timestamp)

  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
}

export default getDate
