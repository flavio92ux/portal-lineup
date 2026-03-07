export const formatDateTime = (timestamp: string): string => {
  const now = new Date()
  let date = now
  if (timestamp) date = new Date(timestamp)

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const parts = formatter.formatToParts(date)
  const getPart = (type: string) => parts.find((part) => part.type === type)?.value || '00'

  const DD = getPart('day')
  const MM = getPart('month')
  const YYYY = getPart('year')
  const HH = getPart('hour')
  const MinMin = getPart('minute')

  return `${DD}/${MM}/${YYYY} - ${HH}:${MinMin}`
}
