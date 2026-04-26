import clsx from 'clsx'

export default function LabelPill({ label, className }) {
  // Use label's color to create a light background and solid text color
  // Since we have hex colors, we might just use a border or inline style
  // Alternatively, just a generic style
  return (
    <span 
      className={clsx("px-2 py-0.5 rounded border text-[11px] font-medium", className)}
      style={{ color: label.color, borderColor: label.color, backgroundColor: `${label.color}15` }}
    >
      {label.name}
    </span>
  )
}
