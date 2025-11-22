import './App.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLogin } from './pages/AdminLogin'
import { AdminProjects } from './pages/AdminProjects'
import { MarketingPage } from './pages/Marketing'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MarketingPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/projects" element={<AdminProjects />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
