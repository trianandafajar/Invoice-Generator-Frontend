import api from './axios'
import type { AxiosResponse } from 'axios'

const API_BASE = '/invoices'

export interface Invoice {
  id: number
  [key: string]: any
}

export interface InvoiceItem {
  id: number
  invoiceId: number
  [key: string]: any
}

export interface StatisticsOverview {
  [key: string]: any
}

const invoiceService = {
  // Invoices
  getAll(): Promise<AxiosResponse<Invoice[]>> {
    return api.get(API_BASE)
  },

  get(id: number | string): Promise<AxiosResponse<Invoice>> {
    return api.get(`${API_BASE}/${id}`)
  },

  create(data: Partial<Invoice>): Promise<AxiosResponse<Invoice>> {
    return api.post(API_BASE, data)
  },

  update(id: number | string, data: Partial<Invoice>): Promise<AxiosResponse<Invoice>> {
    return api.put(`${API_BASE}/${id}`, data)
  },

  delete(id: number | string): Promise<AxiosResponse<void>> {
    return api.delete(`${API_BASE}/${id}`)
  },

  getPdf(id: number | string): Promise<AxiosResponse<Blob>> {
    return api.get(`${API_BASE}/${id}/pdf`, {
      responseType: 'blob',
    })
  },

  downloadPdf(id: number | string): Promise<AxiosResponse<any>> {
    return api.get(`${API_BASE}/${id}/pdf`, {
      headers: {
        Accept: 'application/json',
      },
    })
  },

  getStatistics(): Promise<AxiosResponse<StatisticsOverview>> {
    return api.get(`${API_BASE}/statistics/overview`)
  },

  getItems(invoiceId: number | string): Promise<AxiosResponse<InvoiceItem[]>> {
    return api.get(`${API_BASE}/${invoiceId}/items`)
  },

  getItem(invoiceId: number | string, itemId: number | string): Promise<AxiosResponse<InvoiceItem>> {
    return api.get(`${API_BASE}/${invoiceId}/items/${itemId}`)
  },

  addItem(invoiceId: number | string, data: Partial<InvoiceItem>): Promise<AxiosResponse<InvoiceItem>> {
    return api.post(`${API_BASE}/${invoiceId}/items`, data)
  },

  updateItem(
    invoiceId: number | string,
    itemId: number | string,
    data: Partial<InvoiceItem>
  ): Promise<AxiosResponse<InvoiceItem>> {
    return api.put(`${API_BASE}/${invoiceId}/items/${itemId}`, data)
  },

  deleteItem(invoiceId: number | string, itemId: number | string): Promise<AxiosResponse<void>> {
    return api.delete(`${API_BASE}/${invoiceId}/items/${itemId}`)
  },
}

export default invoiceService