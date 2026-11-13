import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../api.js'
import { IconPrint } from '../components/Graphics.jsx'
import { SITE } from '../config.js'

const Row = ({ label, value }) => (
  <>
    <dt>{label}</dt>
    <dd>{value || <span style={{ color: 'var(--muted)' }}>Not recorded</span>}</dd>
  </>
)

const Group = ({ title, children }) => (
  <section className="fsec detail">
    <div><h2>{title}</h2></div>
    <dl>{children}</dl>
  </section>
)

export default function ViewRecord() {
  const { id } = useParams()
  const [r, setR] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/records/${id}`).then((res) => setR(res.data)).catch(() => setError('This record could not be found.'))
  }, [id])

  if (error) return <div className="alert alert-danger">{error}</div>
  if (!r) return <p>Loading...</p>

  return (
    <>
      <div className="page-head">
        <div>
          <h1>{r.firstName} {r.middleName} {r.surname}</h1>
          <p>Registered {r.registrationDate}</p>
        </div>
        <div className="d-flex gap-2 no-print">
          <Link className="btn btn-outline-secondary" to="/records">Back to records</Link>
          <button className="btn btn-outline-primary" onClick={() => window.print()}><IconPrint size={18} /> Print</button>
          <Link className="btn btn-primary" to={`/records/${r.id}/edit`}>Edit</Link>
        </div>
      </div>
      <div className="print-only mb-3"><h4>{SITE.name}, {SITE.place}</h4></div>

      <div className="form-panel">
        <Group title="Fisherfolk">
          <Row label="Address" value={r.address} />
          <Row label="Contact number" value={r.contactNumber} />
          <Row label="Registration date" value={r.registrationDate} />
        </Group>
        <Group title="Permit">
          <Row label="Permit number" value={r.permitNumber} />
          <Row label="Permit expiry" value={r.permitExpiry} />
        </Group>
        <Group title="Fishing boat">
          <Row label="Boat name" value={r.boatName} />
          <Row label="Boat registration no." value={r.boatRegistrationNo} />
          <Row label="Boat type" value={r.boatType} />
        </Group>
        <Group title="Gear and activity">
          <Row label="Fishing gear" value={r.fishingGear} />
          <Row label="Fishing activity" value={r.fishingActivity} />
          <Row label="Fishing area" value={r.fishingArea} />
        </Group>
      </div>
    </>
  )
}
