import { create } from 'zustand'
import { tasks, projects, workspace, notifications } from '../data/mockData'

const useTaskStore = create((set) => ({
  tasks,
  projects,
  members: workspace.members,
  notifications,
  activeTask: null,
  activeProject: null,
  view: 'board',
  groupBy: 'status',
  filters: {},
  commandOpen: false,
  theme: localStorage.getItem('theme') || 'light',
  searchQuery: '',

  createTask: (partial) => set((state) => ({
    tasks: [...state.tasks, { id: `t${Date.now()}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), ...partial }]
  })),
  
  updateTask: (id, patch) => set((state) => ({
    tasks: state.tasks.map(t => t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t),
    activeTask: state.activeTask?.id === id ? { ...state.activeTask, ...patch, updatedAt: new Date().toISOString() } : state.activeTask
  })),

  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id),
    activeTask: state.activeTask?.id === id ? null : state.activeTask
  })),

  moveTask: (id, newStatus, newIndex) => set((state) => {
    const newTasks = [...state.tasks];
    const taskIndex = newTasks.findIndex(t => t.id === id);
    if (taskIndex === -1) return state;
    
    const [task] = newTasks.splice(taskIndex, 1);
    task.status = newStatus;
    
    const sameStatusTasks = newTasks.filter(t => t.status === newStatus);
    const targetTask = sameStatusTasks[newIndex];
    
    if (targetTask) {
      const absoluteIndex = newTasks.findIndex(t => t.id === targetTask.id);
      newTasks.splice(absoluteIndex, 0, task);
    } else {
      newTasks.push(task);
    }
    
    return { tasks: newTasks };
  }),

  reorderBacklog: (oldIdx, newIdx) => set((state) => {
    // simplified reorder logic
    const backlogTasks = state.tasks.filter(t => t.status === 'todo'); // simplified assumption for backlog
    const otherTasks = state.tasks.filter(t => t.status !== 'todo');
    const [moved] = backlogTasks.splice(oldIdx, 1);
    backlogTasks.splice(newIdx, 0, moved);
    return { tasks: [...otherTasks, ...backlogTasks] };
  }),

  openTask: (task) => set({ activeTask: task }),
  closeTask: () => set({ activeTask: null }),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),

  markAllRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true }))
  })),

  setView: (view) => set({ view }),
  setGroupBy: (groupBy) => set({ groupBy }),
  
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    return { theme: newTheme };
  }),

  setCommandOpen: (open) => set({ commandOpen: open }),
  setSearchQuery: (query) => set({ searchQuery: query })
}))

export default useTaskStore
