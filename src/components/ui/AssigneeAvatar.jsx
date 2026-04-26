import clsx from 'clsx'

export default function AssigneeAvatar({ user, className }) {
  if (!user) {
    return (
      <div className={clsx("w-6 h-6 rounded-full border border-dashed border-border flex items-center justify-center text-[10px] text-text-dim", className)}>
        +
      </div>
    )
  }

  const avatarUrl = `https://i.pravatar.cc/100?u=${encodeURIComponent(user.id || user.name)}`

  return (
    <div 
      className={clsx("w-6 h-6 rounded-full overflow-hidden border border-border/50 shadow-sm", className)}
      title={user.name}
    >
      <img 
        src={avatarUrl} 
        alt={user.name} 
        className="w-full h-full object-cover"
      />
    </div>
  )
}
