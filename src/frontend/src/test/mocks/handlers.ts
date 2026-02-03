import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('http://localhost:5254/auth/login', async ({ request }) => {
    // 1. Parse the request body
    const body = (await request.json()) as { email: string };

    // 2. Simulate Success
    if (body.email === 'valid@test.com') {
      return HttpResponse.json(
        {
          token: 'eyJ_MOCK_JWT_TOKEN_123',
          expires: '2026-02-04T10:00:00Z',
        },
        { status: 200 }
      );
    }

    // 3. Simulate Failure (401)
    return HttpResponse.json({ detail: 'Invalid email address' }, { status: 401 });
  }),
];
