import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState('dashboard')

  return (
    <div className="app-layout">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="main-content">
        <Navbar activePage={activePage} />
        <main className="page-container">
          <Dashboard />
        </main>
      </div>
    </div>
  )
}

export default App
