import { test, expect } from '@playwright/test'

test('shows the landing page and navigates to generator', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { level: 1 })).toContainText('A polished invoice generator')
  await expect(page.getByRole('link', { name: 'Open Generator' }).first()).toBeVisible()

  await page.getByRole('link', { name: 'Open Generator' }).first().click()
  await expect(page).toHaveURL(/\/generator$/)
  await expect(page.getByRole('heading', { name: 'Create and deliver a polished invoice.' })).toBeVisible()
  await expect(page.getByLabel('Invoice Number')).toBeVisible()
})
