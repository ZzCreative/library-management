import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import LibrarianLogin from './LibrarianLogin'
import LibrarianRegister from './LibrarianRegister'
import LibrarianDashboard from './LibrarianDashboard'
import { isAuthenticated, logout } from './api'  // 改为新函数

function LibrarianApp() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [librarian, setLibrarian] = useState(null)
  const [showRegister, setShowRegister] = useState(() => new URLSearchParams(location.search).get('register') === 'true')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setShowRegister(new URLSearchParams(location.search).get('register') === 'true')
  }, [location.search])

  useEffect(() => {
    // 检查登录状态 - 使用新函数
    if (isAuthenticated()) {
      const savedUser = localStorage.getItem('user')  // 改为 'user'
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser)
          // 检查是否是馆员角色
          if (user.role === 'LIBRARIAN' || user.role === 'ADMIN') {
            setLibrarian(user)
            setIsLoggedIn(true)
          } else {
            logout()
          }
        } catch (e) {
          logout()
        }
      }
    }
    setLoading(false)
  }, [])

  const handleLogin = (user, token) => {
    localStorage.setItem('token', token)  // 改为 'token'
    localStorage.setItem('user', JSON.stringify(user))  // 改为 'user'
    setIsLoggedIn(true)
    setLibrarian(user)
    setShowRegister(false)
  }

  const handleLogout = () => {
    logout()  // 使用新函数
    setIsLoggedIn(false)
    setLibrarian(null)
    navigate('/login')
  }

  const handleRegisterSuccess = () => {
    setShowRegister(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-500">加载中...</div>
      </div>
    )
  }

  if (isLoggedIn && librarian) {
    return <LibrarianDashboard librarian={librarian} onLogout={handleLogout} />
  }

  if (showRegister) {
    return (
      <LibrarianRegister 
        onRegister={handleRegisterSuccess} 
        onSwitchToLogin={() => navigate('/login')} 
      />
    )
  }

  return (
    <LibrarianLogin 
      onLogin={handleLogin} 
      onSwitchToRegister={() => setShowRegister(true)} 
    />
  )
}

export default LibrarianApp