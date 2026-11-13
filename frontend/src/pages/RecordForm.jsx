import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import api from '../api.js'

const empty = {
  firstName: '', middleName: '', surname: '', address: '', contactNumber: '',
  registrationDate: new Date().toISOString().slice(0, 10),
  permitNumber: '', permitExpiry: '',
  boatName: '', boatRegistrationNo: '', boatType: '',
  fishingGear: '', fishingActivity: '', fishingArea: '',
}

const Field = ({ label, name, form, setForm, type = 'text', required = false, wide = false }) => (
  <div className={wide ? 'wide' : ''}>
    <label className="form-label" htmlFor={name}>{label}{required && <span style={{ color: 'var(--sun-deep)' }}> (required)</span>}</label>
    <input id={name} type={type} className="form-control" required={required} value={form[name] ?? ''}
           onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
  </div>
)

const Section = ({ title, hint, children }) => (
  <section className="fsec">
    <div>
      <h2>{title}</h2>
      {hint && <p className="hint">{hint}</p>}
    </div>
    <div className="fgrid">{children}</div>
  </section>
)

export default function RecordForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) api.get(`/records/${id}`).then((r) => setForm({ ...empty, ...r.data })).catch(() => setError('This record could not be found.'))
  }, [id])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    // send empty strings as null (important for dates and the unique permit number)
    const payload = Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v === '' ? null : v]))
    try {
      if (id) await api.put(`/records/${id}`, payload)
      else await api.post('/records', payload)
      navigate('/records')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save. Fill in the required fields and try again.')
    }
  }

  const f = { form, setForm }
  return (
    <>
      <div className="page-head">
        <div>
          <h1>{id ? 'Edit record' : 'Add record'}</h1>
          <p>{id ? 'Change the details below, then save.' : 'Register a fisher with their permit, boat and gear.'}</p>
        </div>
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <form onSubmit={submit} className="form-panel">
        <Section title="Fisherfolk" hint="Who is being registered.">
          <Field label="First name" name="firstName" required {...f} />
          <Field label="Middle name" name="middleName" {...f} />
          <Field label="Surname" name="surname" required {...f} />
          <Field label="Contact number" name="contactNumber" {...f} />
          <Field label="Address" name="address" wide {...f} />
          <Field label="Registration date" name="registrationDate" type="date" required {...f} />
        </Section>
        <Section title="Permit" hint="Leave blank if there is no permit yet.">
          <Field label="Permit number" name="permitNumber" {...f} />
          <Field label="Permit expiry" name="permitExpiry" type="date" {...f} />
        </Section>
        <Section title="Fishing boat">
          <Field label="Boat name" name="boatName" {...f} />
          <Field label="Boat registration no." name="boatRegistrationNo" {...f} />
          <Field label="Boat type" name="boatType" {...f} />
        </Section>
        <Section title="Gear and activity">
          <Field label="Fishing gear" name="fishingGear" {...f} />
          <Field label="Fishing activity" name="fishingActivity" {...f} />
          <Field label="Fishing area" name="fishingArea" {...f} />
        </Section>
        <div className="form-foot">
          <Link className="btn btn-outline-secondary" to="/records">Cancel</Link>
          <button className="btn btn-primary">{id ? 'Save changes' : 'Save record'}</button>
        </div>
      </form>
    </>
  )
}
