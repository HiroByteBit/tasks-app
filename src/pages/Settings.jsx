import useTaskStore from '../store/useTaskStore'

export default function Settings() {
  const theme = useTaskStore(state => state.theme)
  const toggleTheme = useTaskStore(state => state.toggleTheme)

  return (
    <div className="h-full p-8 max-w-2xl mx-auto">
      <h1 className="text-[20px] font-semibold text-text-primary mb-8">Settings</h1>
      
      <div className="space-y-8">
        <section>
          <h2 className="text-[14px] font-semibold text-text-primary mb-4 border-b border-border pb-2">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[13px] font-medium text-text-primary">Theme</div>
              <div className="text-[11px] text-text-muted">Select your preferred color theme</div>
            </div>
            <button 
              onClick={toggleTheme}
              className="px-3 py-1.5 border border-border rounded-md text-[13px] font-medium hover:bg-bg-hover capitalize"
            >
              {theme}
            </button>
          </div>
        </section>

        <section>
          <h2 className="text-[14px] font-semibold text-text-primary mb-4 border-b border-border pb-2">Shortcuts</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-[13px] font-medium text-text-primary">Command Palette</div>
              <kbd className="text-[11px] bg-bg-base px-2 py-1 rounded border border-border font-sans text-text-muted">⌘ K</kbd>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
