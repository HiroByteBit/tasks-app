import { useMemo, useState } from 'react'
import useTaskStore from '../store/useTaskStore'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import PriorityIcon from '../components/ui/PriorityIcon'
import AssigneeAvatar from '../components/ui/AssigneeAvatar'
import LabelPill from '../components/ui/LabelPill'
import clsx from 'clsx'

function BacklogRow({ task, isOverlay }) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => openTask(task)}
      className={clsx(
        "flex items-center gap-3 px-4 py-2 border-b border-border bg-bg-surface hover:bg-bg-hover cursor-pointer group",
        isDragging && !isOverlay && "opacity-30",
        isOverlay && "scale-[1.01] shadow-lg border-border-active z-50 bg-bg-card"
      )}
    >
      <PriorityIcon priority={task.priority} className="shrink-0" />
      <div className="flex-1 min-w-0 text-[13px] font-medium text-text-primary truncate">
        <span className="text-text-dim font-normal mr-2">{task.id}</span>
        {task.title}
      </div>
      <div className="hidden md:flex items-center gap-2 w-[150px] shrink-0">
        {task.labels?.slice(0, 2).map(l => <LabelPill key={l.id} label={l} />)}
      </div>
      <div className="w-[80px] shrink-0 text-[11px] text-text-muted hidden sm:block">
        {task.estimate || '-'}
      </div>
      <div className="w-[32px] shrink-0 flex justify-end">
        <AssigneeAvatar user={task.assignee} />
      </div>
    </div>
  )
}

export default function Backlog() {
  const tasks = useTaskStore(state => state.tasks)
  const reorderBacklog = useTaskStore(state => state.reorderBacklog)
  
  const backlogTasks = useMemo(() => {
    return tasks.filter(t => t.status === 'todo') // simple logic for backlog
  }, [tasks])

  const [activeId, setActiveId] = useState(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event) => {
    setActiveId(null)
    const { active, over } = event
    if (active.id !== over?.id) {
      const oldIndex = backlogTasks.findIndex(t => t.id === active.id)
      const newIndex = backlogTasks.findIndex(t => t.id === over.id)
      reorderBacklog(oldIndex, newIndex)
    }
  }

  const activeTask = backlogTasks.find(t => t.id === activeId)

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h1 className="text-[20px] font-semibold text-text-primary">Backlog</h1>
        <div className="text-[13px] text-text-muted">{backlogTasks.length} tasks</div>
      </div>

      <div className="flex-1 overflow-y-auto bg-bg-surface border border-border rounded-xl shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border bg-bg-base text-[11px] font-medium uppercase tracking-[0.06em] text-text-dim sticky top-0 z-10">
          <div className="w-4" /> {/* spacer for prio */}
          <div className="flex-1">Task</div>
          <div className="hidden md:block w-[150px]">Labels</div>
          <div className="hidden sm:block w-[80px]">Estimate</div>
          <div className="w-[32px] text-right">Assignee</div>
        </div>

        {/* List */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={backlogTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {backlogTasks.map(task => (
              <BacklogRow key={task.id} task={task} />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeId && activeTask ? <BacklogRow task={activeTask} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
