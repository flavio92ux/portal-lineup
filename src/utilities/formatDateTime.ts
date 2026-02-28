export const formatDateTime = (timestamp: string): string => {
  const now = new Date()
  let date = now
  if (timestamp) date = new Date(timestamp)

  const DD = date.getDate().toString().padStart(2, '0')
  const MM = (date.getMonth() + 1).toString().padStart(2, '0')
  const YYYY = date.getFullYear()
  const HH = date.getHours().toString().padStart(2, '0')
  const MinMin = date.getMinutes().toString().padStart(2, '0')

  return `${DD}/${MM}/${YYYY} - ${HH}:${MinMin}`
}
