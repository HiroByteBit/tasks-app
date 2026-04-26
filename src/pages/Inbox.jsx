import useTaskStore from '../store/useTaskStore'
import { CheckCircle2, MessageSquare, Plus, Bell, RefreshCw } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import clsx from 'clsx'
import AssigneeAvatar from '../components/ui/AssigneeAvatar'

const IconMap = {
  mention: MessageSquare,
  assignment: Plus,
  update: RefreshCw
}

export default function Inbox() {
  const notifications = useTaskStore(state => state.notifications)
  const markNotificationRead = useTaskStore(state => state.markNotificationRead)
  const markAllRead = useTaskStore(state => state.markAllRead)
  const openTask = useTaskStore(state => state.openTask)

  const unreadCount = notifications.filter(n => !n.read).length

  if (notifications.length === 0 || unreadCount === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-text-muted">
        <CheckCircle2 className="w-12 h-12 mb-4 text-green-500 opacity-50" />
        <h2 className="text-[15px] font-semibold text-text-primary">All caught up!</h2>
        <p className="text-[13px]">You have no unread notifications.</p>
        {notifications.length > 0 && (
          <button 
            className="mt-6 text-[13px] text-accent hover:underline"
            onClick={() => useTaskStore.setState({ notifications: notifications.map(n => ({...n, read: false}))})}
          >
            Show read notifications
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="h-full max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-[20px] font-semibold text-text-primary flex items-center gap-2">
          Inbox
          <span className="bg-accent text-white text-[11px] px-2 py-0.5 rounded-full">{unreadCount}</span>
        </h1>
        <button 
          onClick={markAllRead}
          className="text-[13px] text-text-muted hover:text-text-primary border border-border px-3 py-1.5 rounded-md hover:bg-bg-hover"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-2">
        {notifications.filter(n => !n.read).map(n => {
          const Icon = IconMap[n.type] || Bell
          return (
            <div 
              key={n.id}
              onClick={() => {
                markNotificationRead(n.id)
                openTask(n.task)
              }}
              className="flex items-start gap-4 p-4 rounded-xl border border-transparent bg-bg-card shadow-sm hover:border-border-active cursor-pointer group transition-all"
            >
              <div className="relative mt-1">
                <AssigneeAvatar user={n.actor} className="w-8 h-8" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-bg-surface flex items-center justify-center border border-border">
                  <Icon className="w-2.5 h-2.5 text-text-dim" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[13px] text-text-primary">
                    <span className="font-semibold">{n.actor.name}</span>
                    {n.type === 'mention' && ' mentioned you in '}
                    {n.type === 'assignment' && ' assigned you to '}
                    {n.type === 'update' && ' updated '}
                    <span className="font-medium">{n.task.id}</span>
                  </div>
                  <span className="text-[11px] text-text-muted whitespace-nowrap ml-4">
                    {formatDistanceToNow(new Date(n.createdAt))} ago
                  </span>
                </div>
                <div className="text-[13px] text-text-muted truncate">
                  {n.task.title}
                </div>
              </div>
              
              <div className="w-2 h-2 rounded-full bg-accent mt-2 shrink-0 opacity-100 group-hover:opacity-0 transition-opacity" />
            </div>
          )
        })}
      </div>
    </div>
  )
}
