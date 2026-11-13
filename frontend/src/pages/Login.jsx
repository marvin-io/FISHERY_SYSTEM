import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api.js'
import PhotoCollage from '../components/PhotoCollage.jsx'
import { Bangka, Waves } from '../components/Graphics.jsx'
import { SITE } from '../config.js'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ username: data.username, fullName: data.fullName, role: data.role }))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Cannot reach the server. Start the backend, then try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <section className="login-art" aria-label={SITE.place}>
        <div className="sun" />
        <div className="reflect" />
        <div className="brandmark"><Bangka size={34} /> {SITE.short}</div>
        <h1>Every fisher, boat and permit in one place.</h1>
        <p className="place">{SITE.place}</p>
        <div className="collage-wrap">
          <PhotoCollage />
        </div>
        <Waves className="waves-a" fill="#0a5f73" />
        <Waves className="waves-b" fill="#f2f7f6" />
      </section>

      <div className="login-band">
        <div className="sun" />
        <div className="brandmark"><Bangka size={34} /> {SITE.short}</div>
        <p className="place">{SITE.place}</p>
        <Waves className="waves-m" fill="#f2f7f6" />
      </div>

      <section className="login-form-side">
        <div className="login-card">
          <h2>Log in</h2>
          <p className="lead">Use the account given to you by the fishery office.</p>
          {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label" htmlFor="username">Username</label>
              <input id="username" className="form-control" value={form.username} autoFocus required
                     autoComplete="username"
                     onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>
            <div className="mb-4">
              <label className="form-label" htmlFor="password">Password</label>
              <input id="password" type="password" className="form-control" value={form.password} required
                     autoComplete="current-password"
                     onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
          <div className="demo-note">
            First time here? Try <strong>admin</strong> / <strong>admin123</strong> and change it under My account.
          </div>
        </div>
      </section>
    </div>
  )
}
