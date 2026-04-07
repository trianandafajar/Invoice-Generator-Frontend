import type { InvoiceFormItem, InvoiceFormState } from './types'

export function createEmptyItem(): InvoiceFormItem {
  return {
    name: '',
    description: '',
    qty: 1,
    price: 0,
    subtotal: 0,
    amount: 0,
  }
}

export function createInitialForm(): InvoiceFormState {
  return {
    invoice_number: '',
    process_date: '',
    due_date: '',
    customer_name: '',
    customer_id: '',
    customer_address: '',
    previous_balance: 0,
    contact_person: '',
    contact_phone: '',
    payment_account: '',
    contact_email: '',
    notes: '',
    signature_image_path: '',
    logo_image_path: '',
    logo_image_file: null,
    logo_preview: '',
    items: [createEmptyItem()],
  }
}
