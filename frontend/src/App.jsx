import { Navigate, Route, Routes, NavLink, useNavigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Records from './pages/Records.jsx'
import RecordForm from './pages/RecordForm.jsx'
import ViewRecord from './pages/ViewRecord.jsx'
import Account from './pages/Account.jsx'
import { Bangka } from './components/Graphics.jsx'
import { SITE, ROLE_LABEL } from './config.js'

export const getUser = () => {
  try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
}

function Protected({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" replace />
}

function Layout({ children, bare = false }) {
  const navigate = useNavigate()
  const user = getUser()
  const logout = () => { localStorage.clear(); navigate('/login') }

  return (
    <>
      <header className="topbar no-print">
        <div className="container topbar-in">
          <NavLink to="/" className="brand">
            <Bangka size={38} />
            <span>
              <span className="brand-name">{SITE.short}</span>
              <span className="brand-place">{SITE.place}</span>
            </span>
          </NavLink>
          <nav className="topnav" aria-label="Main">
            <NavLink to="/" end>Dashboard</NavLink>
            <NavLink to="/records" end>Records</NavLink>
            <NavLink to="/records/new">Add record</NavLink>
            <NavLink to="/account">My account</NavLink>
          </nav>
          <div className="topuser">
            <div className="who">
              <strong>{user?.username}</strong>
              <span>{ROLE_LABEL[user?.role] || user?.role}</span>
            </div>
            <button className="btn btn-sm btn-logout" onClick={logout}>Log out</button>
          </div>
        </div>
      </header>
      {bare ? children : <main className="container page">{children}</main>}
      <footer className="site-foot no-print">
        <div className="container">
          <span>{SITE.name}</span>
          <span>{SITE.place}</span>
        </div>
      </footer>
    </>
  )
}

export default function App() {
  const page = (el, bare = false) => <Protected><Layout bare={bare}>{el}</Layout></Protected>
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={page(<Dashboard />, true)} />
      <Route path="/records" element={page(<Records />)} />
      <Route path="/records/new" element={page(<RecordForm />)} />
      <Route path="/records/:id" element={page(<ViewRecord />)} />
      <Route path="/records/:id/edit" element={page(<RecordForm />)} />
      <Route path="/account" element={page(<Account />)} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
