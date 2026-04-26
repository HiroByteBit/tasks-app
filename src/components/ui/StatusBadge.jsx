import clsx from 'clsx'

const statusConfig = {
  todo: { label: 'Todo', classes: 'text-text-dim bg-bg-hover' },
  in_progress: { label: 'In Progress', classes: 'text-accent bg-accent-light' },
  in_review: { label: 'In Review', classes: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
  done: { label: 'Done', classes: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
  cancelled: { label: 'Cancelled', classes: 'text-text-dim line-through bg-bg-hover' },
}

export default function StatusBadge({ status, className }) {
  const config = statusConfig[status] || statusConfig.todo
  return (
    <span className={clsx("px-2 py-0.5 rounded text-[11px] font-medium transition-colors duration-200 whitespace-nowrap", config.classes, className)}>
      {config.label}
    </span>
  )
}
