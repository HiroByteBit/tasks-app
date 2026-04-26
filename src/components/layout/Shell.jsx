import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import useTaskStore from '../../store/useTaskStore'
import TaskDetail from '../../pages/TaskDetail'
import { AnimatePresence, motion } from 'framer-motion'

export default function Shell() {
  const activeTask = useTaskStore(state => state.activeTask)
  const closeTask = useTaskStore(state => state.closeTask)

  return (
    <div className="flex h-screen w-full bg-base overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto bg-surface relative flex">
          <div className="flex-1 h-full overflow-auto">
            <Outlet />
          </div>
          
          <AnimatePresence>
            {activeTask && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/20 z-10 lg:hidden"
                  onClick={closeTask}
                />
                <motion.div
                  initial={{ x: 420 }}
                  animate={{ x: 0 }}
                  exit={{ x: 420 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  className="absolute top-0 right-0 bottom-0 w-[420px] bg-card border-l border-border shadow-2xl z-20 flex flex-col"
                >
                  <TaskDetail />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
