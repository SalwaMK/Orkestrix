/** App — root component with BrowserRouter, Navbar, routes, and toast provider */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/layout/Navbar'
import { Dashboard } from '@/pages/Dashboard'
import { AddTool } from '@/pages/AddTool'

export default function App() {
  return (
    <BrowserRouter>
      <div className="page-shell">
        <div className="page-backdrop" />
        <Navbar />
        <main>
          <Routes>
            <Route path="/"    element={<Dashboard />} />
            <Route path="/add" element={<AddTool />} />
          </Routes>
        </main>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background:   'rgba(16, 24, 25, 0.95)',
            border:       '1px solid rgba(34, 211, 238, 0.20)',
            color:        '#f3fbfb',
            borderRadius: 12,
            backdropFilter: 'blur(16px)',
          },
        }}
      />
    </BrowserRouter>
  )
}
