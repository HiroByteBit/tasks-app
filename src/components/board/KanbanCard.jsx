import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PriorityIcon from '../ui/PriorityIcon'
import AssigneeAvatar from '../ui/AssigneeAvatar'
import LabelPill from '../ui/LabelPill'
import { MessageSquare, GitMerge } from 'lucide-react'
import useTaskStore from '../../store/useTaskStore'
import clsx from 'clsx'

export default function KanbanCard({ task, isOverlay }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })
  
  const openTask = useTaskStore(state => state.openTask)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragging && !isOverlay) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="bg-bg-card border border-border/50 rounded-lg p-3 opacity-30 min-h-[100px]" 
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => openTask(task)}
      className={clsx(
        "bg-bg-card border border-border rounded-lg p-3 cursor-grab hover:border-border-active active:cursor-grabbing group relative",
        isOverlay ? "scale-[1.02] shadow-xl rotate-2" : "shadow-sm hover:shadow-md"
      )}
    >
      <div className="flex items-start gap-2 mb-2">
        <PriorityIcon priority={task.priority} className="mt-0.5 shrink-0" />
        <span className="text-[13px] font-medium text-text-primary leading-[1.4] line-clamp-2">
          {task.title}
        </span>
      </div>

      {task.labels?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {task.labels.map(l => (
            <LabelPill key={l.id} label={l} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-text-muted mt-auto pt-2 border-t border-transparent group-hover:border-border/50">
        <div className="flex items-center gap-2">
          <AssigneeAvatar user={task.assignee} />
          {task.dueDate && <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
        </div>
        <div className="flex items-center gap-2">
          {task.subTasks?.length > 0 && (
            <div className="flex items-center gap-1">
              <GitMerge className="w-3 h-3" />
              <span>{task.subTasks.length}</span>
            </div>
          )}
          {task.comments?.length > 0 && (
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{task.comments.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
