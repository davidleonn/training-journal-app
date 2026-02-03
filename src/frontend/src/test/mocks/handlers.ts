import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('http://localhost:5254/auth/login', async ({ request }) => {
    const { email } = (await request.json()) as { email: string };

    if (email === 'valid@test.com') {
      return HttpResponse.json({ id: 'user-guid-123', email }, { status: 200 });
    }

    return HttpResponse.json({ detail: 'Invalid email address' }, { status: 401 });
  }),
];
