import { useCallback, useEffect, useRef, useState } from 'react'

export type NotificationTone = 'info' | 'success' | 'error'

export interface NotificationItem {
  id: string
  message: string
  tone: NotificationTone
}

const makeId = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10))

export const useNotifications = (autoHideMs = 4200) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const timers = useRef<Record<string, number>>({})

  const dismiss = useCallback((id: string) => {
    if (timers.current[id]) {
      window.clearTimeout(timers.current[id])
      delete timers.current[id]
    }
    setNotifications((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const push = useCallback(
    (message: string, tone: NotificationTone = 'info') => {
      const id = makeId()
      setNotifications((prev) => [...prev, { id, message, tone }])
      timers.current[id] = window.setTimeout(() => dismiss(id), autoHideMs)
      return id
    },
    [autoHideMs, dismiss],
  )

  useEffect(
    () => () => {
      Object.values(timers.current).forEach((timerId) => window.clearTimeout(timerId))
    },
    [],
  )

  return { notifications, push, dismiss }
}
