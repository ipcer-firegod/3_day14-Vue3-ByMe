import { dayjs } from 'element-plus'

export const formatDate = (date, format = 'YYYY-MM-DD') => {
  return dayjs(date).format(format)
}
