import { useState } from 'react'
import api from '../api.js'
import { getUser } from '../App.jsx'
import { ROLE_LABEL } from '../config.js'

export default function Account() {
  const user = getUser()
  const [form, setForm] = useState({ currentPassword: '', newUsername: '', newPassword: '', confirm: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (form.newPassword && form.newPassword !== form.confirm) {
      setError('The new password and its confirmation do not match.')
      return
    }
    try {
      const { data } = await api.put('/account', {
        currentPassword: form.currentPassword,
        newUsername: form.newUsername,
        newPassword: form.newPassword,
      })
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify({ username: data.username, fullName: data.fullName, role: data.role }))
      setSuccess('Account updated. Use the new details the next time you log in.')
      setForm({ currentPassword: '', newUsername: '', newPassword: '', confirm: '' })
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update the account.')
    }
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>My account</h1>
          <p>Logged in as {user?.username}, {ROLE_LABEL[user?.role] || user?.role}. Leave a field blank to keep it as it is.</p>
        </div>
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      {success && <div className="alert alert-success" role="status">{success}</div>}
      <form onSubmit={submit} className="form-panel" style={{ maxWidth: 760 }}>
        <section className="fsec">
          <div>
            <h2>Confirm it is you</h2>
            <p className="hint">Required for any change.</p>
          </div>
          <div className="fgrid">
            <div className="wide">
              <label className="form-label" htmlFor="cur">Current password</label>
              <input id="cur" type="password" className="form-control" required autoComplete="current-password"
                     value={form.currentPassword} onChange={set('currentPassword')} />
            </div>
          </div>
        </section>
        <section className="fsec">
          <div>
            <h2>New login details</h2>
            <p className="hint">The password needs at least 6 characters.</p>
          </div>
          <div className="fgrid">
            <div className="wide">
              <label className="form-label" htmlFor="nu">New username</label>
              <input id="nu" className="form-control" value={form.newUsername} onChange={set('newUsername')}
                     placeholder={user?.username} autoComplete="username" />
            </div>
            <div>
              <label className="form-label" htmlFor="np">New password</label>
              <input id="np" type="password" className="form-control" value={form.newPassword}
                     onChange={set('newPassword')} autoComplete="new-password" />
            </div>
            <div>
              <label className="form-label" htmlFor="cp">Confirm new password</label>
              <input id="cp" type="password" className="form-control" value={form.confirm}
                     onChange={set('confirm')} autoComplete="new-password" />
            </div>
          </div>
        </section>
        <div className="form-foot">
          <button className="btn btn-primary">Save changes</button>
        </div>
      </form>
    </>
  )
}
