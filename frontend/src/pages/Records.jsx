import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api.js'
import { getUser } from '../App.jsx'
import { IconSearch, IconPrint, IconPlus, IconSort } from '../components/Graphics.jsx'
import { SITE } from '../config.js'

export default function Records() {
  const [records, setRecords] = useState([])
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('asc')
  const [error, setError] = useState('')
  const isAdmin = getUser()?.role === 'ADMIN'

  const load = useCallback(() => {
    api.get('/records', { params: { q, sort } })
      .then((r) => { setRecords(r.data); setError('') })
      .catch(() => setError('Could not load records. Check that the backend is running.'))
  }, [q, sort])

  // wait a moment while typing before searching
  useEffect(() => {
    const t = setTimeout(load, 250)
    return () => clearTimeout(t)
  }, [load])

  const remove = async (r) => {
    if (!window.confirm(`Delete the record of ${r.firstName} ${r.surname}? This cannot be undone.`)) return
    try {
      await api.delete(`/records/${r.id}`)
      load()
    } catch {
      setError('Could not delete. Only Fishery Personnel can delete records.')
    }
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <>
      <div className="page-head no-print">
        <div>
          <h1>Fishery records</h1>
          <p>{records.length} {records.length === 1 ? 'record' : 'records'}{q ? ` matching "${q}"` : ''}</p>
        </div>
        <Link className="btn btn-primary" to="/records/new"><IconPlus size={18} /> Add record</Link>
      </div>

      <div className="toolbar no-print">
        <div className="searchbox">
          <IconSearch size={18} />
          <input className="form-control" placeholder="Search name, permit, boat or gear" aria-label="Search records"
                 value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <button className="btn btn-outline-secondary" onClick={() => setSort(sort === 'asc' ? 'desc' : 'asc')}>
          <IconSort size={18} /> Surname {sort === 'asc' ? 'A to Z' : 'Z to A'}
        </button>
        <span className="spacer" />
        <button className="btn btn-outline-primary" onClick={() => window.print()}>
          <IconPrint size={18} /> Print report
        </button>
      </div>

      <div className="print-only mb-3">
        <h4 className="mb-0">{SITE.name}</h4>
        <div>Fishery records report, {SITE.place}. Printed {new Date().toLocaleDateString()}. {records.length} record(s).</div>
      </div>

      {error && <div className="alert alert-danger no-print">{error}</div>}

      <div className="table-wrap">
        <div className="table-responsive">
          <table className="table table-hover records align-middle">
            <thead>
              <tr>
                <th>Name</th><th>Address</th><th>Permit</th><th>Boat</th><th>Gear</th><th>Activity</th>
                <th className="no-print" />
              </tr>
            </thead>
            <tbody>
              {records.length === 0 && (
                <tr><td colSpan="7" className="text-center py-5" style={{ color: 'var(--muted)' }}>
                  {q ? 'No records match your search. Try a different name or permit number.' : 'No records yet. Use Add record to register the first fisherfolk.'}
                </td></tr>
              )}
              {records.map((r) => {
                const expired = r.permitExpiry && r.permitExpiry < today
                return (
                  <tr key={r.id}>
                    <td>
                      <div className="name">{r.surname}, {r.firstName}</div>
                      <div className="sub">Registered {r.registrationDate}</div>
                    </td>
                    <td>{r.address}</td>
                    <td>
                      <div>{r.permitNumber || <span className="sub">None</span>}</div>
                      {r.permitExpiry && (
                        <span className={`pill ${expired ? 'bad' : 'ok'}`}>
                          {expired ? 'Expired' : 'Valid'} {r.permitExpiry}
                        </span>
                      )}
                    </td>
                    <td>
                      <div>{r.boatName}</div>
                      <div className="sub">{r.boatType}</div>
                    </td>
                    <td>{r.fishingGear}</td>
                    <td>{r.fishingActivity}</td>
                    <td className="row-actions no-print">
                      <Link className="btn btn-sm btn-outline-info me-1" to={`/records/${r.id}`}>View</Link>
                      <Link className="btn btn-sm btn-outline-primary me-1" to={`/records/${r.id}/edit`}>Edit</Link>
                      {isAdmin && <button className="btn btn-sm btn-outline-danger" onClick={() => remove(r)}>Delete</button>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
