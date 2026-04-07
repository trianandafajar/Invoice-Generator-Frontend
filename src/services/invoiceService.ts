import api from './axios'
import type { AxiosResponse } from 'axios'

const API_BASE = '/invoices'

export interface InvoiceItem {
  id?: number
  invoiceId?: number
  name?: string
  description: string
  qty?: number | string
  price?: number | string
  subtotal?: number | string
  amount: number | string
}

export interface Invoice {
  id: number
  invoice_number: string
  customer_name: string
  customer_id: string
  customer_address: string
  process_date: string
  due_date: string
  previous_balance: number | string
  contact_phone: string
  payment_account: string
  items: InvoiceItem[]
  logo_base64?: string | null
  signature?: string | null
  [key: string]: unknown
}

export interface InvoiceApiEnvelope {
  data?: {
    id?: number
    invoice?: Invoice
  }
  errors?: Record<string, string[]>
}

export interface StatisticsOverview {
  [key: string]: unknown
}

const invoiceService = {
  getAll(): Promise<AxiosResponse<Invoice[]>> {
    return api.get(API_BASE)
  },

  get(id: number | string): Promise<AxiosResponse<Invoice>> {
    return api.get(`${API_BASE}/${id}`)
  },

  create(data: FormData | Partial<Invoice>): Promise<AxiosResponse<InvoiceApiEnvelope>> {
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

  downloadPdf(id: number | string): Promise<AxiosResponse<InvoiceApiEnvelope>> {
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
    data: Partial<InvoiceItem>,
  ): Promise<AxiosResponse<InvoiceItem>> {
    return api.put(`${API_BASE}/${invoiceId}/items/${itemId}`, data)
  },

  deleteItem(invoiceId: number | string, itemId: number | string): Promise<AxiosResponse<void>> {
    return api.delete(`${API_BASE}/${invoiceId}/items/${itemId}`)
  },
}

export default invoiceService
