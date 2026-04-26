import { useState } from 'react'
import useTaskStore from '../store/useTaskStore'
import PriorityIcon from '../components/ui/PriorityIcon'
import StatusBadge from '../components/ui/StatusBadge'
import AssigneeAvatar from '../components/ui/AssigneeAvatar'
import LabelPill from '../components/ui/LabelPill'
import { X, MoreHorizontal, Link as LinkIcon, GitMerge, MessageSquare, PlayCircle, Send } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function TaskDetail() {
  const task = useTaskStore(state => state.activeTask)
  const closeTask = useTaskStore(state => state.closeTask)
  const updateTask = useTaskStore(state => state.updateTask)
  
  const [commentText, setCommentText] = useState('')

  if (!task) return null

  const handleTitleChange = (e) => {
    updateTask(task.id, { title: e.target.innerText })
  }
  
  const handleDescChange = (e) => {
    updateTask(task.id, { description: e.target.innerHTML })
  }

  const handleComment = () => {
    if (!commentText.trim()) return
    const newComment = {
      id: `c${Date.now()}`,
      author: useTaskStore.getState().members[0], // current user mock
      text: commentText,
      createdAt: new Date().toISOString()
    }
    updateTask(task.id, { comments: [...(task.comments || []), newComment] })
    setCommentText('')
  }

  return (
    <div className="flex flex-col h-full bg-bg-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <StatusBadge status={task.status} className="cursor-pointer hover:opacity-80" />
          <PriorityIcon priority={task.priority} className="text-text-muted cursor-pointer hover:text-text-primary" />
        </div>
        <div className="flex items-center gap-1 text-text-muted">
          <button className="p-1.5 hover:bg-bg-hover rounded-md"><LinkIcon className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-bg-hover rounded-md"><MoreHorizontal className="w-4 h-4" /></button>
          <button onClick={closeTask} className="p-1.5 hover:bg-bg-hover rounded-md ml-2"><X className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <h1 
          className="text-[20px] font-semibold text-text-primary leading-tight mb-6 outline-none"
          contentEditable
          suppressContentEditableWarning
          onBlur={handleTitleChange}
        >
          {task.title}
        </h1>

        {/* Properties Grid */}
        <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-4 mb-8 text-[13px]">
          <div className="text-text-muted">Assignee</div>
          <div className="flex items-center gap-2 cursor-pointer">
            <AssigneeAvatar user={task.assignee} />
            <span className="text-text-primary">{task.assignee?.name || 'Unassigned'}</span>
          </div>

          <div className="text-text-muted">Due date</div>
          <div className="text-text-primary cursor-pointer">
            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
          </div>

          <div className="text-text-muted">Project</div>
          <div className="text-text-primary cursor-pointer flex items-center gap-1.5">
            <span>{task.project?.emoji}</span>
            <span>{task.project?.name || 'No project'}</span>
          </div>

          <div className="text-text-muted">Estimate</div>
          <div className="text-text-primary cursor-pointer">{task.estimate || 'None'}</div>

          <div className="text-text-muted">Labels</div>
          <div className="flex flex-wrap gap-1.5 cursor-pointer">
            {task.labels?.map(l => <LabelPill key={l.id} label={l} />)}
            <button className="text-[11px] text-text-muted border border-dashed border-border px-2 py-0.5 rounded hover:bg-bg-hover">
              Add label
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <div 
            className="text-[14px] text-text-primary outline-none min-h-[100px] empty:before:content-['Add_a_description...'] empty:before:text-text-muted"
            contentEditable
            suppressContentEditableWarning
            onBlur={handleDescChange}
            dangerouslySetInnerHTML={{ __html: task.description || '' }}
          />
        </div>

        {/* Subtasks */}
        <div className="mb-8 border-t border-border pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[13px] font-semibold text-text-primary flex items-center gap-2">
              <GitMerge className="w-4 h-4 text-text-muted" />
              Subtasks
            </h3>
          </div>
          <div className="space-y-2">
            {task.subTasks?.length > 0 ? (
              <div className="text-[13px] text-text-muted italic">Subtasks go here...</div>
            ) : (
              <div className="text-[13px] text-text-muted">No subtasks</div>
            )}
            <button className="text-[13px] text-text-muted hover:text-text-primary flex items-center gap-1 mt-2">
              <PlayCircle className="w-3 h-3" /> Add subtask
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="border-t border-border pt-6 mb-6">
          <h3 className="text-[13px] font-semibold text-text-primary flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-text-muted" />
            Comments
          </h3>
          <div className="space-y-5 mb-4">
            {task.comments?.map(c => (
              <div key={c.id} className="flex gap-3">
                <AssigneeAvatar user={c.author} className="mt-1 shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[13px] font-semibold text-text-primary">{c.author.name}</span>
                    <span className="text-[11px] text-text-muted">{formatDistanceToNow(new Date(c.createdAt))} ago</span>
                  </div>
                  <div className="text-[13px] text-text-primary">{c.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Comment Input */}
      <div className="p-4 border-t border-border bg-bg-surface shrink-0">
        <div className="flex gap-3">
          <AssigneeAvatar user={useTaskStore.getState().members[0]} className="shrink-0" />
          <div className="flex-1 bg-bg-base border border-border rounded-lg flex items-end p-1 focus-within:border-accent">
            <textarea
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full bg-transparent text-[13px] text-text-primary outline-none resize-none px-2 py-1 min-h-[32px] max-h-[150px]"
              rows={1}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleComment()
                }
              }}
            />
            <button 
              onClick={handleComment}
              className="p-1.5 text-text-muted hover:text-accent hover:bg-accent-light rounded-md transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
