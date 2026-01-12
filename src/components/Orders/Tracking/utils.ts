import dayjs from 'dayjs'
import { OrderResponse } from '../../../../types/tracking'

export const getVisibleTimeline = (
  order: OrderResponse,
  trackingStatuses: any[]
) => {
  const tl = (order?.timeline || []).slice()
  if (!tl?.length) return tl || []
  let filtered = tl
  if (trackingStatuses) {
    const allowed = new Set(trackingStatuses.map((t: any) => t.statusCode))
    filtered = tl.filter((t: any) => allowed.has(t.statusCode))
  }
  return filtered
}

export const findDateFor = (codes: string[], visibleTimeline: any[]) => {
  const found = (visibleTimeline || []).find((t: any) =>
    codes.includes(t.statusCode)
  )
  if (!found) return undefined
  return dayjs(found.date ?? found.dateTime).format('DD MMM YY')
}

export const findEventFor = (codes: string[], visibleTimeline: any[]) => {
  return (visibleTimeline || []).find((t: any) => codes.includes(t.statusCode))
}
