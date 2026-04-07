import { test, expect } from '@playwright/test'

test('shows the landing page and navigates to generator', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('A polished invoice generator')
  await expect(page.getByRole('link', { name: 'Open Generator' }).first()).toBeVisible()

  await page.getByRole('link', { name: 'Open Generator' }).first().click()
  await expect(page).toHaveURL(/\/generator$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Create polished invoices with confidence.')
  await expect(page.getByLabel('Invoice Number')).toBeVisible()
})

test('shows inline validation feedback when the generator form is submitted empty', async ({ page }) => {
  await page.goto('/generator')

  await page.getByRole('button', { name: 'Submit Invoice' }).click()

  await expect(page.getByRole('alert')).toContainText('Please review the form')
  await expect(page.getByText('Invoice Number is required.')).toBeVisible()
  await expect(page.getByText('Customer Name is required.')).toBeVisible()
  await expect(page.getByText('Add at least one line item with a name, quantity, and price.')).toBeVisible()
})
