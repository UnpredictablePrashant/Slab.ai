import type { NotificationItem } from '../hooks/useNotifications'

interface Props {
  notifications: NotificationItem[]
  onDismiss: (id: string) => void
}

export const NotificationStack = ({ notifications, onDismiss }: Props) => {
  if (!notifications.length) return null

  return (
    <div className="toast-stack">
      {notifications.map((note) => (
        <div key={note.id} className={`toast toast-${note.tone}`}>
          <span>{note.message}</span>
          <button type="button" aria-label="Dismiss notification" onClick={() => onDismiss(note.id)}>
            x
          </button>
        </div>
      ))}
    </div>
  )
}
