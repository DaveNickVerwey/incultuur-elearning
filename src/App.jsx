import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from './firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Profiel from './pages/Profiel'
import Welkom from './pages/Welkom'
import Dashboard from './pages/Dashboard'
import Contact from './pages/Contact'
import MijnProfiel from './pages/MijnProfiel'
import Module from './pages/Module'
import Bewijs from './pages/Bewijs'
import TipsEnTools from './pages/TipsEnTools'

function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth)
  const [status, setStatus] = useState(null) // null = laden, 'ok', 'geen-profiel', 'geen-welkom'

  useEffect(() => {
    if (!user) return
    const check = async () => {
      const ref = doc(db, 'gebruikers', user.uid)
      const snap = await getDoc(ref)
      if (!snap.exists() || !snap.data().naam) {
        setStatus('geen-profiel')
      } else if (!snap.data().welkomGezien) {
        setStatus('geen-welkom')
      } else {
        setStatus('ok')
      }
    }
    check()
  }, [user])

  if (loading || status === null) return <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>Laden...</div>
  if (!user) return <Navigate to="/login" />
  if (status === 'geen-profiel') return <Navigate to="/profiel" />
  if (status === 'geen-welkom') return <Navigate to="/welkom" />
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/profiel" element={<Profiel />} />
      <Route path="/welkom" element={<Welkom />} />
      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />
      <Route path="/module/:nr" element={
        <ProtectedRoute><Module /></ProtectedRoute>
      } />
      <Route path="/mijnprofiel" element={
        <ProtectedRoute><MijnProfiel /></ProtectedRoute>
      } />
      <Route path="/bewijs" element={
        <ProtectedRoute><Bewijs /></ProtectedRoute>
      } />
      <Route path="/contact" element={
        <ProtectedRoute><Contact /></ProtectedRoute>
      } />
      <Route path="/tipstools" element={
        <ProtectedRoute><TipsEnTools /></ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App