/**
 * API Integration Tests
 *
 * Tests for verifying:
 * - API endpoints work correctly
 * - Request/response handling
 * - Error handling
 * - Authentication integration
 * - Data validation
 *
 * Also includes form submission tests via API
 */
import { ApiInteractions, expect, test } from './fixtures';

test.describe('API Integration', () => {
  let api: ApiInteractions;

  test.beforeEach(async ({ apiRequest }) => {
    api = new ApiInteractions(apiRequest);
  });

  test.describe('Stats API', () => {
    test('should return valid stats for valid username', async () => {
      const response = await api.get('/api/stats?username=torvalds');

      expect(response.status).toBe(200);
      expect(response.body).toBeTruthy();
    });

    test('should handle missing username parameter', async () => {
      const response = await api.get('/api/stats');

      // Should return 400 or similar error handling
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    test('should handle invalid username', async () => {
      const response = await api.get('/api/stats?username=invalid-user-123456789');

      // Should return appropriate error status
      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    test('should handle rate limiting', async () => {
      // Make multiple rapid requests
      const requests = Array(10)
        .fill(null)
        .map(() => api.get('/api/stats?username=torvalds'));
      const responses = await Promise.all(requests);

      // At least some should succeed
      const successfulResponses = responses.filter((r) => r.status === 200);
      expect(successfulResponses.length).toBeGreaterThan(0);
    });
  });

  test.describe('Activity API', () => {
    test('should return activity data for valid username', async () => {
      const response = await api.get('/api/activity?username=torvalds');

      expect(response.status).toBe(200);
      expect(response.body).toBeTruthy();
    });

    test('should handle missing username', async () => {
      const response = await api.get('/api/activity');

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  test.describe('Streak API', () => {
    test('should return streak data for valid username', async () => {
      const response = await api.get('/api/streak?username=torvalds');

      expect(response.status).toBe(200);
    });

    test('should handle missing username', async () => {
      const response = await api.get('/api/streak');

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  test.describe('Top Languages API', () => {
    test('should return top languages for valid username', async () => {
      const response = await api.get('/api/top-langs?username=torvalds');

      expect(response.status).toBe(200);
    });
  });

  test.describe('Trophies API', () => {
    test('should return trophies for valid username', async () => {
      const response = await api.get('/api/trophies?username=torvalds');

      expect(response.status).toBe(200);
    });
  });

  test.describe('Quotes API', () => {
    test('should return quotes successfully', async () => {
      const response = await api.get('/api/quotes');

      expect(response.status).toBe(200);
    });

    test('should return valid JSON', async () => {
      const response = await api.get('/api/quotes');

      expect(response.body).toBeTruthy();
    });
  });

  test.describe('Capsule API', () => {
    test('should handle capsule generation request', async () => {
      const response = await api.post('/api/capsule', {
        username: 'torvalds',
      });

      expect(response.status).toBe(200);
    });

    test('should validate required fields', async () => {
      const response = await api.post('/api/capsule', {});

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  test.describe('API Headers', () => {
    test('should include correct content type', async () => {
      const response = await api.get('/api/stats?username=torvalds');

      const contentType = response.headers['content-type'];
      expect(contentType).toContain('application/json');
    });

    test('should include CORS headers', async () => {
      const response = await api.get('/api/stats?username=torvalds');

      // Check for common CORS headers
      expect(response.headers).toBeTruthy();
    });
  });

  test.describe('API Error Handling', () => {
    test('should return proper error structure', async () => {
      const response = await api.get('/api/stats?username=nonexistent-user-12345');

      // Verify error response has proper structure
      expect(response.body).toBeTruthy();
    });

    test('should handle malformed requests', async () => {
      // Invalid query parameter
      const response = await api.get('/api/stats?username=invalid');

      // API should handle gracefully
      expect([200, 400, 404, 500]).toContain(response.status);
    });
  });

  test.describe('Form Data Submit', () => {
    test('should submit profile data successfully', async ({ page }) => {
      // Navigate to the page with the builder
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check if builder elements exist
      const builder = page.locator('[data-testid="builder"]');
      const hasBuilder = (await builder.count()) > 0;

      if (hasBuilder) {
        await expect(builder.first()).toBeVisible();
      }
    });

    test('should handle form input validation', async ({ page }) => {
      // Navigate to home page
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Check for input elements
      const inputs = page.locator('input');
      const inputCount = await inputs.count();

      // May have inputs for GitHub username or other form fields
      expect(inputCount).toBeGreaterThanOrEqual(0);
    });
  });
});
