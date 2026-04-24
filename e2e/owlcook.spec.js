const { test, expect } = require('@playwright/test')

test('login page loads and shows the OwlCook heading', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'OwlCook' })).toBeVisible()
})

test('login page has email and password input fields', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByPlaceholder('your.email@college.edu')).toBeVisible()
  await expect(page.getByPlaceholder('••••••••')).toBeVisible()
})

test('submitting empty login form shows an error message', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Login' }).click()
  await expect(page.getByText('Please fill in all fields!')).toBeVisible()
})
