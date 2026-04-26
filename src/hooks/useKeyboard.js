import { useEffect } from 'react'
import useTaskStore from '../store/useTaskStore'

export const useKeyboard = () => {
  const setCommandOpen = useTaskStore(state => state.setCommandOpen)
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandOpen(true)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setCommandOpen])
}
