import { useEffect, useState } from 'react'

const API = 'http://localhost:8001/carwash'

function App() {
  const emptyForm = {
    serviceName: '',
    washType: '',
    price: '',
    open: true,
  }

  const [services, setServices] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [searchId, setSearchId] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)

  
async function request(url, options = {}) {
  const response = await fetch(url, options)
  const text = await response.text()

  if (!response.ok) {
    throw new Error(text || 'Request failed')
  }

  try {
    return text ? JSON.parse(text) : null
  } catch {
    return text
  }
}


  async function loadServices() {
    try {
      const data = await request(`${API}/displayall`)
      setServices(data)
    } catch (err) {
      showMessage('Could not load services. Check that the backend is running on port 8001.', true)
    }
  }

  function showMessage(text, isError = false) {
    setMessage(text)
    setError(isError)
  }

  useEffect(() => {
    loadServices()
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      const data = {
        serviceName: form.serviceName,
        washType: form.washType,
        price: Number(form.price),
        open: form.open === true || form.open === 'true',
      }

      if (editId !== null) {
        await request(`${API}/update/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        showMessage('Service updated successfully!')
      } else {
        await request(`${API}/add`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        showMessage('Service added successfully!')
      }

      setForm(emptyForm)
      setEditId(null)
      await loadServices()
    } catch (err) {
      showMessage(err.message || 'Unable to save service.', true)
    }
  }

  function handleEdit(service) {
    setEditId(service.id)
    setForm({
      serviceName: service.serviceName,
      washType: service.washType,
      price: String(service.price),
      open: service.open,
    })
    showMessage(`Editing service ID ${service.id}`)
  }

  async function handleSearch(e) {
    e.preventDefault()

    if (!searchId.trim()) {
      showMessage('Enter a service ID.', true)
      return
    }

    try {
      const service = await request(`${API}/displaybyid/${searchId}`)
      setServices([service])
      showMessage(`Service ID ${service.id} found.`)
    } catch (err) {
      showMessage('Service not found. Check the ID.', true)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm(`Delete service ID ${id}?`)) return

    try {
      await request(`${API}/deletebyid/${id}`, { method: 'DELETE' })
      showMessage('Service deleted successfully!')
      await loadServices()
    } catch (err) {
      showMessage(err.message || 'Unable to delete service.', true)
    }
  }

  function resetForm() {
    setForm(emptyForm)
    setEditId(null)
    showMessage('')
  }

  return (
    <div className="app-bg min-vh-100">
      <nav className="navbar navbar-dark bg-dark shadow">
        <div className="container">
          <span className="navbar-brand fw-bold">
            🚗 CarWash Management
          </span>
          <span className="text-light small">Admin Dashboard</span>
        </div>
      </nav>

      <main className="container py-5">
        <div className="text-center mb-5">
          <h1 className="fw-bold">CarWash Services</h1>
          <p className="text-secondary">
            Manage your car wash services in one place.
          </p>
        </div>

        {message && (
          <div className={`alert ${error ? 'alert-danger' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-primary text-white py-3">
                <h5 className="mb-0">
                  {editId !== null ? 'Update Service' : 'Add New Service'}
                </h5>
              </div>

              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Service Name</label>
                    <input
                      className="form-control"
                      name="serviceName"
                      value={form.serviceName}
                      onChange={handleChange}
                      placeholder="e.g. Premium Wash"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Wash Type</label>
                    <input
                      className="form-control"
                      name="washType"
                      value={form.washType}
                      onChange={handleChange}
                      placeholder="e.g. Interior and Exterior"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Price (₹)</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      className="form-control"
                      name="price"
                      value={form.price}
                      onChange={handleChange}
                      placeholder="Enter price"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Availability</label>
                    <select
                      className="form-select"
                      name="open"
                      value={String(form.open)}
                      onChange={handleChange}
                    >
                      <option value="true">Open</option>
                      <option value="false">Closed</option>
                    </select>
                  </div>

                  <button className="btn btn-primary w-100" type="submit">
                    {editId !== null ? 'Save Changes' : 'Add Service'}
                  </button>

                  {editId !== null && (
                    <button
                      className="btn btn-outline-secondary w-100 mt-2"
                      type="button"
                      onClick={resetForm}
                    >
                      Cancel Update
                    </button>
                  )}
                </form>
              </div>
            </div>

            <div className="card border-0 shadow-sm mt-4">
              <div className="card-body p-4">
                <h5 className="mb-3">Find Service by ID</h5>
                <form onSubmit={handleSearch}>
                  <input
                    type="number"
                    min="1"
                    className="form-control mb-3"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder="Enter service ID"
                  />
                  <button className="btn btn-dark w-100" type="submit">
                    Search Service
                  </button>
                  <button
                    className="btn btn-outline-secondary w-100 mt-2"
                    type="button"
                    onClick={loadServices}
                  >
                    Show All Services
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Service List</h5>
                <span className="badge bg-primary">
                  {services.length} service(s)
                </span>
              </div>

              <div className="card-body p-0">
                {services.length === 0 ? (
                  <div className="text-center py-5 text-secondary">
                    No services found. Add your first service!
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Service</th>
                          <th>Wash Type</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {services.map((service) => (
                          <tr key={service.id}>
                            <td>{service.id}</td>
                            <td className="fw-semibold">{service.serviceName}</td>
                            <td>{service.washType}</td>
                            <td>₹{Number(service.price).toFixed(2)}</td>
                            <td>
                              <span className={`badge ${service.open ? 'bg-success' : 'bg-secondary'}`}>
                                {service.open ? 'Open' : 'Closed'}
                              </span>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => handleEdit(service)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(service.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="row g-3 mt-2">
              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <p className="text-secondary mb-1">Total Services</p>
                    <h3 className="fw-bold mb-0">{services.length}</h3>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <p className="text-secondary mb-1">Currently Open</p>
                    <h3 className="fw-bold text-success mb-0">
                      {services.filter((service) => service.open).length}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
