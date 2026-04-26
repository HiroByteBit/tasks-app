import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Shell from './components/layout/Shell'
import Board from './pages/Board'
import Backlog from './pages/Backlog'
import MyTasks from './pages/MyTasks'
import Inbox from './pages/Inbox'
import Settings from './pages/Settings'
import useTaskStore from './store/useTaskStore'
import { useKeyboard } from './hooks/useKeyboard'
import CommandPalette from './components/layout/CommandPalette'

export default function App() {
  const theme = useTaskStore((state) => state.theme)
  
  useKeyboard()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <>
      <CommandPalette />
      <Routes>
        <Route path="/" element={<Shell />}>
          <Route index element={<Navigate to="/board" replace />} />
          <Route path="board" element={<Board />} />
          <Route path="list" element={<MyTasks />} />
          <Route path="backlog" element={<Backlog />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="settings" element={<Settings />} />
          <Route path="task/:id" element={<Board />} /> {/* Render board with open task panel */}
        </Route>
      </Routes>
    </>
  )
}
