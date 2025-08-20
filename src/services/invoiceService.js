import api from './axios'
const API_BASE = '/invoices'

export default {
  // Invoices
  getAll() {
    return api.get(API_BASE)
  },
  get(id) {
    return api.get(`${API_BASE}/${id}`)
  },
  create(data) {
    return api.post(API_BASE, data)
  },
  update(id, data) {
    return api.put(`${API_BASE}/${id}`, data)
  },
  delete(id) {
    return api.delete(`${API_BASE}/${id}`)
  },
  getPdf(id) {
    return api.get(`${API_BASE}/${id}/pdf`, { responseType: 'blob' })
  },
  downloadPdf(id) {
    return api.get(`${API_BASE}/${id}/pdf`, {
      headers: {
        'Accept': 'application/json',
      }
    })
  },
  getStatistics() {
    return api.get(`${API_BASE}/statistics/overview`)
  },

  // Invoice Items
  getItems(invoiceId) {
    return api.get(`${API_BASE}/${invoiceId}/items`)
  },
  getItem(invoiceId, itemId) {
    return api.get(`${API_BASE}/${invoiceId}/items/${itemId}`)
  },
  addItem(invoiceId, data) {
    return api.post(`${API_BASE}/${invoiceId}/items`, data)
  },
  updateItem(invoiceId, itemId, data) {
    return api.put(`${API_BASE}/${invoiceId}/items/${itemId}`, data)
  },
  deleteItem(invoiceId, itemId) {
    return api.delete(`${API_BASE}/${invoiceId}/items/${itemId}`)
  }
}
