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

function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth)
  const [profielKlaar, setProfielKlaar] = useState(null)

  useEffect(() => {
    if (!user) return
    const check = async () => {
      const ref = doc(db, 'gebruikers', user.uid)
      const snap = await getDoc(ref)
      setProfielKlaar(snap.exists() && snap.data().naam)
    }
    check()
  }, [user])

  if (loading || profielKlaar === null) return <div style={{ padding: '2rem' }}>Laden...</div>
  if (!user) return <Navigate to="/login" />
  if (!profielKlaar) return <Navigate to="/profiel" />
  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/profiel" element={<Profiel />} />
      <Route path="/welkom" element={<Welkom />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/module/:nr" element={
        <ProtectedRoute>
          <Module />
        </ProtectedRoute>
      } />
      <Route path="/mijnprofiel" element={
        <ProtectedRoute>
          <MijnProfiel />
        </ProtectedRoute>
      } />
      <Route path="/bewijs" element={
        <ProtectedRoute>
          <Bewijs />
        </ProtectedRoute>
      } />
      <Route path="/contact" element={
        <ProtectedRoute>
          <Contact />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App