import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api.js'
import { getUser } from '../App.jsx'
import PhotoCollage from '../components/PhotoCollage.jsx'
import { Waves, IconPlus } from '../components/Graphics.jsx'
import { SITE } from '../config.js'

const Breakdown = ({ title, data, empty }) => {
  const entries = Object.entries(data || {}).sort((a, b) => b[1] - a[1])
  const max = Math.max(1, ...entries.map(([, v]) => v))
  return (
    <section className="panel h-100">
      <div className="panel-head"><h2>{title}</h2></div>
      <div className="panel-body">
        {entries.length === 0 && <p className="empty">{empty}</p>}
        {entries.map(([k, v]) => (
          <div key={k} className="bar-row">
            <div className="top"><span>{k}</span><b>{v}</b></div>
            <div className="bar"><i style={{ width: `${(v / max) * 100}%` }} /></div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const user = getUser()

  useEffect(() => {
    api.get('/records/stats').then((r) => setStats(r.data)).catch(() => setError('Could not load the dashboard. Check that the backend is running.'))
  }, [])

  return (
    <>
      <section className="hero">
        <div className="container hero-in">
          <div>
            <h1>Maayong adlaw, {user?.username}.</h1>
            <p>Here is where the fisherfolk, boats and permits of {SITE.place} stand today.</p>
            <div className="actions">
              <Link className="btn btn-sun" to="/records/new"><IconPlus size={18} /> Add record</Link>
              <Link className="btn btn-ghost" to="/records">View records</Link>
            </div>
          </div>
          <PhotoCollage />
        </div>
        <Waves className="waves" fill="#f2f7f6" />
      </section>

      <div className="container page" style={{ paddingTop: 0 }}>
        {error && <div className="alert alert-danger">{error}</div>}
        {!stats && !error && <p>Loading...</p>}
        {stats && (
          <>
            <section className="tide" aria-label="Summary">
              <div><div className="num">{stats.totalFisherfolk}</div><div className="lbl">Registered fisherfolk</div></div>
              <div><div className="num">{stats.activePermits}</div><div className="lbl">Active permits</div></div>
              <div className={stats.expiredPermits > 0 ? 'warn' : ''}><div className="num">{stats.expiredPermits}</div><div className="lbl">Expired permits</div></div>
              <div><div className="num">{stats.registeredBoats}</div><div className="lbl">Boats on record</div></div>
            </section>
            <div className="row g-3 mt-1">
              <div className="col-md-6"><Breakdown title="Fishing gear" data={stats.byGear} empty="No gear recorded yet. Add a record to see it here." /></div>
              <div className="col-md-6"><Breakdown title="Fishing activity" data={stats.byActivity} empty="No activity recorded yet. Add a record to see it here." /></div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
