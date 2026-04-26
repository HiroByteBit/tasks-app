import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Inbox, LayoutList, CheckCircle2, Star, FolderPlus, Hash, ChevronDown, ChevronRight, Moon, Sun, HelpCircle, Plus, Search, Settings, User, Globe, Smartphone, Zap, BarChart2, Hexagon } from 'lucide-react'
import useTaskStore from '../../store/useTaskStore'
import { workspace, projects, teams } from '../../data/mockData'
import clsx from 'clsx'

const ProjectIconMap = {
  'p1': Globe,
  'p2': Smartphone,
  'p3': Zap,
  'p4': BarChart2
}

export default function Sidebar() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const activeProjectId = searchParams.get('project')

  const notifications = useTaskStore(state => state.notifications)
  const unreadCount = notifications.filter(n => !n.read).length
  const theme = useTaskStore(state => state.theme)
  const toggleTheme = useTaskStore(state => state.toggleTheme)
  const setCommandOpen = useTaskStore(state => state.setCommandOpen)
  
  const [projectsOpen, setProjectsOpen] = useState(true)

  const navClass = ({ isActive }) => clsx(
    "flex items-center gap-2 px-3 py-1.5 mx-2 rounded-md text-[13px] font-medium transition-none",
    isActive ? "bg-accent-light text-accent shadow-[inset_2px_0_0_var(--color-accent)]" : "text-text-muted hover:bg-bg-hover hover:text-text-primary"
  )

  const projectNavClass = (projectId) => clsx(
    "flex items-center gap-2 px-3 py-1.5 mx-2 rounded-md text-[13px] font-medium transition-none",
    activeProjectId === projectId ? "bg-accent-light text-accent shadow-[inset_2px_0_0_var(--color-accent)]" : "text-text-muted hover:bg-bg-hover hover:text-text-primary"
  )

  return (
    <div className="w-[240px] flex flex-col bg-bg-surface border-r border-border h-full shrink-0">
      <div className="p-4 flex items-center justify-between hover:bg-bg-hover cursor-pointer m-2 rounded-md">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-accent text-white flex items-center justify-center shadow-sm">
            <Hexagon className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="font-semibold text-[13px] text-text-primary">{workspace.name}</span>
        </div>
        <ChevronDown className="w-4 h-4 text-text-muted" />
      </div>

      <div className="px-4 pb-4">
        <button 
          onClick={() => {}} // would open new task modal
          className="w-full flex items-center justify-center gap-2 bg-accent text-white py-1.5 rounded-md text-[13px] font-medium hover:opacity-90 shadow-sm transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
        <button 
          onClick={() => setCommandOpen(true)}
          className="w-full mt-2 flex items-center justify-between px-3 py-1.5 border border-border rounded-md text-[13px] text-text-muted hover:bg-bg-hover transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </div>
          <kbd className="text-[10px] bg-bg-base px-1.5 py-0.5 rounded border border-border font-sans shadow-sm">⌘K</kbd>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mb-6">
          <div className="px-4 mb-1 text-[11px] font-medium uppercase tracking-[0.07em] text-text-dim">Workspace</div>
          <NavLink to="/inbox" className={navClass}>
            <Inbox className="w-4 h-4" />
            <span className="flex-1">Inbox</span>
            {unreadCount > 0 && <span className="bg-accent text-white text-[10px] px-1.5 rounded-full shadow-sm">{unreadCount}</span>}
          </NavLink>
          <NavLink to="/list" className={navClass}>
            <CheckCircle2 className="w-4 h-4" />
            <span>My Tasks</span>
          </NavLink>
          <NavLink 
            to="/board" 
            end 
            className={({ isActive }) => clsx(
              "flex items-center gap-2 px-3 py-1.5 mx-2 rounded-md text-[13px] font-medium transition-none",
              (isActive && !activeProjectId) ? "bg-accent-light text-accent shadow-[inset_2px_0_0_var(--color-accent)]" : "text-text-muted hover:bg-bg-hover hover:text-text-primary"
            )}
          >
            <LayoutList className="w-4 h-4" />
            <span>Board</span>
          </NavLink>
          <NavLink to="/backlog" className={navClass}>
            <Hash className="w-4 h-4" />
            <span>Backlog</span>
          </NavLink>
        </div>

        <div className="mb-6">
          <div 
            className="px-4 mb-1 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.07em] text-text-dim cursor-pointer hover:text-text-primary group transition-colors"
            onClick={() => setProjectsOpen(!projectsOpen)}
          >
            <span>Projects</span>
            {projectsOpen ? <ChevronDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> : <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
          </div>
          {projectsOpen && (
            <div className="space-y-0.5">
              {projects.map(p => {
                const Icon = ProjectIconMap[p.id] || Hash;
                return (
                  <NavLink key={p.id} to={`/board?project=${p.id}`} className={() => projectNavClass(p.id)}>
                    <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 shadow-sm" style={{ backgroundColor: p.color || 'var(--color-accent)' }}>
                      <Icon className="w-3 h-3 text-white stroke-[2.5px]" />
                    </div>
                    <span className="truncate">{p.name}</span>
                  </NavLink>
                );
              })}
              <div className="px-3 py-1.5 mx-2 rounded-md text-[13px] font-medium text-text-muted hover:bg-bg-hover hover:text-text-primary cursor-pointer flex items-center gap-2 transition-colors">
                <FolderPlus className="w-4 h-4" />
                <span>New Project</span>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <div className="px-4 mb-1 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.07em] text-text-dim">
            <span>Teams</span>
            <span className="text-[10px] font-bold bg-bg-hover px-1.5 rounded text-text-muted">#{teams.length}</span>
          </div>
          {teams.map(t => (
            <div key={t} className="px-3 py-1.5 mx-2 rounded-md text-[13px] font-medium text-text-muted hover:bg-bg-hover hover:text-text-primary cursor-pointer flex items-center gap-2">
              <Hash className="w-4 h-4" />
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto border-t border-border">
        <div className="p-3 mx-2 my-2 rounded-lg flex items-center gap-3 hover:bg-bg-hover cursor-pointer group transition-colors">
          <div className="relative">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-bg-surface group-hover:ring-bg-hover transition-all shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100" 
                alt="Hirob" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-bg-surface group-hover:border-bg-hover transition-all"></div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-text-primary truncate">Hirob</div>
            <div className="text-[11px] text-text-muted truncate">Free Plan</div>
          </div>
          <Settings className="w-4 h-4 text-text-dim group-hover:text-text-muted transition-colors" />
        </div>
        
        <div className="px-4 pb-4 flex items-center gap-2">
          <button onClick={toggleTheme} className="p-1.5 hover:bg-bg-hover rounded text-text-muted transition-colors" title="Toggle Theme">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button className="p-1.5 hover:bg-bg-hover rounded text-text-muted transition-colors" title="Help & Support">
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
