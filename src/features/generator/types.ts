export interface InvoiceFormItem {
  name: string
  description: string
  qty: number
  price: number
  subtotal: number
  amount: number
}

export interface InvoiceFormState {
  invoice_number: string
  process_date: string
  due_date: string
  customer_name: string
  customer_id: string
  customer_address: string
  previous_balance: number
  contact_person: string
  contact_phone: string
  payment_account: string
  contact_email: string
  notes: string
  signature_image_path: string
  logo_image_path: string
  logo_image_file: File | null
  logo_preview: string
  items: InvoiceFormItem[]
}

export type FormFieldName = Exclude<keyof InvoiceFormState, 'items' | 'logo_image_file' | 'logo_preview'>

export interface StatusMessage {
  type: 'success' | 'error' | 'info'
  title: string
  message: string
}

export interface ValidationErrors {
  [key: string]: string | undefined
}

export interface LogoSelection {
  file: File | null
  previewUrl: string
}

export interface BrandAssetsSectionExposed {
  captureSignature: () => string
  clearSignaturePad: () => void
  focusSignaturePad: () => void
}
