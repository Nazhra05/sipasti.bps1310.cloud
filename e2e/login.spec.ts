import { test, expect } from '@playwright/test';

test.describe('Login Flow E2E Test (App B Client Portal)', () => {
  test('should display login page elements properly', async ({ page }) => {
    // 1. Visit login page
    await page.goto('/login');

    // 2. Verify page heading and branding
    await expect(page.getByRole('heading', { name: /Login Portal Internal/i })).toBeVisible();
    await expect(page.getByPlaceholder(/Masukkan Username atau Email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/Masukkan kata sandi.../i)).toBeVisible();
  });

  test('should submit credentials and handle login flow', async ({ page }) => {
    // 1. Setup route interception BEFORE navigating
    await page.route('**/api/login', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'set-cookie': 'bps_solsel_auth_verified=true; Path=/; HttpOnly; SameSite=Lax',
        },
        body: JSON.stringify({
          status: true,
          message: 'Verifikasi berhasil!',
          data: {
            id_admin: 99,
            username: 'test.user',
            email: 'test.user@bps.go.id',
            role: 'pegawai',
          },
        }),
      });
    });

    // 2. Navigate to login page
    await page.goto('/login');

    // 3. Fill input credentials
    await page.getByPlaceholder(/Masukkan Username atau Email/i).fill('test.user@bps.go.id');
    await page.getByPlaceholder(/Masukkan kata sandi.../i).fill('password123');

    // 4. Click submit button
    await page.getByRole('button', { name: /Masuk & Verifikasi Akses/i }).click();

    // 5. Verify user session becomes authenticated and displays verified status badge
    await expect(page.getByText('Status: Terverifikasi')).toBeVisible();
  });
});
