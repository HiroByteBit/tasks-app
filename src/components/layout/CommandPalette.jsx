import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useTaskStore from '../../store/useTaskStore'
import { Search, Plus, LayoutList, Settings, Hash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CommandPalette() {
  const open = useTaskStore(state => state.commandOpen)
  const setOpen = useTaskStore(state => state.setCommandOpen)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [setOpen])

  if (!open) return null

  const items = [
    { icon: Plus, label: 'Create new task', action: () => { setOpen(false); /* open task creation */ } },
    { icon: LayoutList, label: 'Go to Board', action: () => { navigate('/board'); setOpen(false); } },
    { icon: Hash, label: 'Go to Backlog', action: () => { navigate('/backlog'); setOpen(false); } },
    { icon: Settings, label: 'Change Theme', action: () => { useTaskStore.getState().toggleTheme(); setOpen(false); } },
  ]

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="w-full max-w-[560px] bg-bg-surface rounded-xl shadow-2xl border border-border overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center px-4 py-3 border-b border-border">
                <Search className="w-5 h-5 text-text-muted mr-3" />
                <input
                  ref={inputRef}
                  className="flex-1 bg-transparent border-none outline-none text-[15px] text-text-primary placeholder:text-text-muted"
                  placeholder="Type a command or search..."
                />
                <kbd className="text-[10px] bg-bg-base px-1.5 py-0.5 rounded border border-border font-sans text-text-muted">ESC</kbd>
              </div>
              <div className="p-2 max-h-[300px] overflow-y-auto">
                <div className="px-2 py-1 text-[11px] font-medium uppercase tracking-[0.07em] text-text-dim mb-1">Actions</div>
                {items.map((item, i) => (
                  <div
                    key={i}
                    onClick={item.action}
                    className="flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer hover:bg-bg-hover hover:text-accent group"
                  >
                    <item.icon className="w-4 h-4 text-text-muted group-hover:text-accent" />
                    <span className="text-[13px] text-text-primary group-hover:text-accent font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
