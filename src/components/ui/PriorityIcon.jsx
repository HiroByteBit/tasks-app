import { Flame, ArrowUp, Minus, ArrowDown, Dot } from 'lucide-react'
import clsx from 'clsx'

const priorityConfig = {
  urgent: { icon: Flame, color: 'text-red-500' },
  high: { icon: ArrowUp, color: 'text-amber-500' },
  medium: { icon: Minus, color: 'text-blue-500' },
  low: { icon: ArrowDown, color: 'text-gray-500' },
  none: { icon: Dot, color: 'text-text-dim' },
}

export default function PriorityIcon({ priority, className }) {
  const config = priorityConfig[priority] || priorityConfig.none
  const Icon = config.icon
  return <Icon className={clsx("w-4 h-4", config.color, className)} />
}
