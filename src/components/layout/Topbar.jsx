import { useLocation } from 'react-router-dom'
import { Layout, List, Hash, Filter, ArrowDownUp, MoreHorizontal } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

export default function Topbar() {
  const location = useLocation()
  const path = location.pathname.substring(1) || 'board'

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

  const viewClass = ({ isActive }) => clsx(
    "flex items-center gap-1.5 px-3 py-1 rounded text-[13px] font-medium",
    isActive ? "bg-bg-hover text-text-primary shadow-sm" : "text-text-muted hover:text-text-primary"
  )

  return (
    <div className="h-14 border-b border-border bg-bg-surface flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2 text-[13px]">
        <span className="text-text-muted">Acme Corp</span>
        <span className="text-text-dim">/</span>
        <span className="text-text-primary font-medium">{capitalize(path)}</span>
      </div>

      <div className="flex items-center gap-1 p-1 bg-bg-base rounded-lg border border-border">
        <NavLink to="/board" className={viewClass}>
          <Layout className="w-4 h-4" />
          <span>Board</span>
        </NavLink>
        <NavLink to="/list" className={viewClass}>
          <List className="w-4 h-4" />
          <span>List</span>
        </NavLink>
        <NavLink to="/backlog" className={viewClass}>
          <Hash className="w-4 h-4" />
          <span>Backlog</span>
        </NavLink>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center -space-x-2 mr-4">
          <div className="w-6 h-6 rounded-full border-2 border-bg-surface overflow-hidden z-30 shadow-sm">
            <img src="https://i.pravatar.cc/100?u=u1" alt="Member" className="w-full h-full object-cover" />
          </div>
          <div className="w-6 h-6 rounded-full border-2 border-bg-surface overflow-hidden z-20 shadow-sm">
            <img src="https://i.pravatar.cc/100?u=u2" alt="Member" className="w-full h-full object-cover" />
          </div>
          <div className="w-6 h-6 rounded-full border-2 border-bg-surface overflow-hidden z-10 shadow-sm">
            <img src="https://i.pravatar.cc/100?u=u3" alt="Member" className="w-full h-full object-cover" />
          </div>
          <div className="w-6 h-6 rounded-full border-2 border-bg-surface bg-bg-hover text-text-muted flex items-center justify-center text-[9px] font-bold z-0 shadow-sm">
            +3
          </div>
        </div>
        <button className="bg-accent text-white px-3 py-1.5 rounded-md text-[13px] font-medium hover:opacity-90 transition-opacity shadow-sm">
          Share
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
        <button className="flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-primary transition-colors">
          <ArrowDownUp className="w-4 h-4" />
          <span>Sort</span>
        </button>
      </div>
    </div>
  )
}
