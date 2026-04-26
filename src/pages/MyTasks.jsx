import { useMemo } from 'react'
import useTaskStore from '../store/useTaskStore'
import PriorityIcon from '../components/ui/PriorityIcon'
import StatusBadge from '../components/ui/StatusBadge'
import AssigneeAvatar from '../components/ui/AssigneeAvatar'
import LabelPill from '../components/ui/LabelPill'

export default function MyTasks() {
  const tasks = useTaskStore(state => state.tasks)
  const openTask = useTaskStore(state => state.openTask)
  const members = useTaskStore(state => state.members)
  
  // mock user is members[0]
  const currentUser = members[0]

  const myTasks = useMemo(() => {
    return tasks.filter(t => t.assignee?.id === currentUser.id)
  }, [tasks, currentUser.id])

  const groupedTasks = useMemo(() => {
    const groups = { todo: [], in_progress: [], in_review: [], done: [] }
    myTasks.forEach(t => {
      if (groups[t.status]) groups[t.status].push(t)
    })
    return groups
  }, [myTasks])

  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-[20px] font-semibold text-text-primary mb-1">My Tasks</h1>
        <p className="text-[13px] text-text-muted">{myTasks.length} tasks assigned to you</p>
      </div>

      <div className="space-y-8">
        {Object.entries(groupedTasks).map(([status, groupTasks]) => {
          if (groupTasks.length === 0) return null
          
          return (
            <div key={status}>
              <div className="flex items-center gap-2 mb-3">
                <StatusBadge status={status} />
                <span className="text-[13px] text-text-muted">{groupTasks.length}</span>
              </div>
              
              <div className="border border-border rounded-xl bg-bg-surface overflow-hidden">
                {groupTasks.map((task, i) => (
                  <div 
                    key={task.id}
                    onClick={() => openTask(task)}
                    className={`flex items-center gap-3 px-4 py-2 hover:bg-bg-hover cursor-pointer group ${i !== groupTasks.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <input type="checkbox" className="mt-0.5 cursor-pointer rounded border-border-active accent-accent" onClick={e => e.stopPropagation()} />
                    <PriorityIcon priority={task.priority} className="shrink-0" />
                    <div className="flex-1 min-w-0 text-[13px] font-medium text-text-primary truncate">
                      <span className="text-text-dim font-normal mr-2">{task.id}</span>
                      {task.title}
                    </div>
                    <div className="hidden md:flex items-center gap-2 w-[150px] shrink-0">
                      {task.labels?.slice(0, 2).map(l => <LabelPill key={l.id} label={l} />)}
                    </div>
                    <div className="w-[100px] shrink-0 text-[12px] text-text-muted hidden sm:flex items-center gap-1.5">
                      <span>{task.project?.emoji}</span>
                      <span className="truncate">{task.project?.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
