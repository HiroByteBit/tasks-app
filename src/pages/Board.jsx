import { useState, useMemo, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import useTaskStore from '../store/useTaskStore'
import KanbanColumn from '../components/board/KanbanColumn'
import KanbanCard from '../components/board/KanbanCard'

const COLUMNS = [
  { id: 'todo', title: 'Todo', icon: '○' },
  { id: 'in_progress', title: 'In Progress', icon: '◐' },
  { id: 'in_review', title: 'In Review', icon: '👀' },
  { id: 'done', title: 'Done', icon: '●' },
]

export default function Board() {
  const tasks = useTaskStore(state => state.tasks)
  const moveTask = useTaskStore(state => state.moveTask)
  const openTask = useTaskStore(state => state.openTask)
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const projectId = searchParams.get('project')
  const [activeId, setActiveId] = useState(null)
  
  useEffect(() => {
    if (id) {
      const task = tasks.find(t => t.id === id)
      if (task) openTask(task)
    }
  }, [id, tasks, openTask])
  
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  )

  const filteredTasks = useMemo(() => {
    return projectId ? tasks.filter(t => t.project?.id === projectId) : tasks
  }, [tasks, projectId])

  const tasksByColumn = useMemo(() => {
    const acc = { todo: [], in_progress: [], in_review: [], done: [] }
    filteredTasks.forEach(t => {
      if (acc[t.status]) acc[t.status].push(t)
    })
    return acc
  }, [filteredTasks])

  const handleDragStart = (event) => {
    setActiveId(event.active.id)
  }

  const handleDragOver = (event) => {
    // simplified drag over logic handled mostly by handleDragEnd for simplicity
  }

  const handleDragEnd = (event) => {
    setActiveId(null)
    const { active, over } = event
    if (!over) return

    const activeId = active.id
    const overId = over.id
    
    // find source and dest column
    let sourceCol = null
    let destCol = null
    
    // check if over is a column
    if (COLUMNS.find(c => c.id === overId)) {
      destCol = overId
    } else {
      // over is a task
      const overTask = tasks.find(t => t.id === overId)
      if (overTask) destCol = overTask.status
    }
    
    const activeTask = tasks.find(t => t.id === activeId)
    if (activeTask) sourceCol = activeTask.status

    if (!sourceCol || !destCol) return

    if (sourceCol === destCol) {
      // reorder in same col
      const colTasks = tasksByColumn[sourceCol]
      const oldIndex = colTasks.findIndex(t => t.id === activeId)
      const newIndex = colTasks.findIndex(t => t.id === overId)
      if (oldIndex !== newIndex && newIndex !== -1) {
        moveTask(activeId, destCol, newIndex)
      }
    } else {
      // move to diff col
      let newIndex = 0;
      if (!COLUMNS.find(c => c.id === overId)) {
        const destTasks = tasksByColumn[destCol]
        newIndex = destTasks.findIndex(t => t.id === overId)
      } else {
        newIndex = tasksByColumn[destCol].length
      }
      moveTask(activeId, destCol, newIndex === -1 ? 0 : newIndex)
    }
  }

  const activeTask = tasks.find(t => t.id === activeId)

  return (
    <div className="h-full p-6 overflow-x-auto flex items-start gap-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {COLUMNS.map(col => (
          <KanbanColumn
            key={col.id}
            column={col}
            tasks={tasksByColumn[col.id]}
          />
        ))}

        <DragOverlay>
          {activeId && activeTask ? <KanbanCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
