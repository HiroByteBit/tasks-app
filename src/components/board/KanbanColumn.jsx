import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import KanbanCard from './KanbanCard'
import { Plus } from 'lucide-react'
import useTaskStore from '../../store/useTaskStore'
import { useState } from 'react'

export default function KanbanColumn({ column, tasks }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
  })
  
  const createTask = useTaskStore(state => state.createTask)
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const handleAdd = (e) => {
    if (e.key === 'Enter' && newTitle.trim()) {
      createTask({ title: newTitle.trim(), status: column.id, priority: 'none' })
      setNewTitle('')
      setIsAdding(false)
    } else if (e.key === 'Escape') {
      setIsAdding(false)
      setNewTitle('')
    }
  }

  return (
    <div className="flex flex-col w-[280px] shrink-0 bg-bg-base/50 rounded-xl">
      <div className="flex items-center justify-between p-3 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-text-dim text-[14px]">{column.icon}</span>
          <span className="font-semibold text-[13px] text-text-primary">{column.title}</span>
          <span className="text-[11px] font-medium text-text-muted bg-bg-hover px-1.5 py-0.5 rounded">
            {tasks.length}
          </span>
        </div>
        <button onClick={() => setIsAdding(true)} className="text-text-muted hover:text-text-primary p-1 rounded hover:bg-bg-hover">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div 
        ref={setNodeRef}
        className="flex-1 flex flex-col gap-2 px-2 pb-4 overflow-y-auto min-h-[150px]"
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>
        
        {isAdding && (
          <div className="bg-bg-card p-3 rounded-lg border border-border shadow-sm">
            <input
              autoFocus
              className="w-full text-[13px] bg-transparent outline-none"
              placeholder="Task title..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              onKeyDown={handleAdd}
              onBlur={() => setIsAdding(false)}
            />
          </div>
        )}
      </div>
    </div>
  )
}
