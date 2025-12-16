import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

export function mockInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const { url, method, body } = req;

  const USERS: Record<string, string> = {
    'Mariyokesh': 'Admin',
    'Jhon': 'Editor',
    'Kumar': 'Viewer'
  };

  const COMMON_PASSWORD = 'Login@123';

  
  if (url.endsWith('/api/dashboard') && method === 'GET') {
    const mockData = {
      kpis: {
        totalUsers: 1250,
        revenue: 45000,
        tasksPending: 23,
        activeSessions: 87
      },
      charts: {
        monthlyStats: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          data: [65, 59, 80, 81, 56, 55]
        },
        userDistribution: {
          labels: ['Admin', 'Editor', 'Viewer'],
          data: [10, 30, 60]
        },
        trendGraph: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          data: [20, 45, 30, 60]
        }
      }
    };
    return ok(mockData);
  }

  
  if (url.endsWith('/api/auth/login') && method === 'POST') {
    const { username, password } = body as any;
    
    if (username && password) {
      if (password !== COMMON_PASSWORD) {
         return error(401, 'Invalid password');
      }

      const role = USERS[username];
      if (!role) {
         return error(401, 'User not found');
      }

      return ok({
        id: 1,
        username: username,
        email: `${username.toLowerCase()}@example.com`,
        firstName: username,
        lastName: 'Doe',
        gender: 'male',
        image: 'https://dummyjson.com/icon/' + username.toLowerCase(),
        token: generateMockToken(username, role),
        refreshToken: 'mock-refresh-token-' + Math.random(),
        role: role
      });
    } else {
      return error(400, 'Username and password are required');
    }
  }

  
  
if (url.endsWith('/api/auth/forgot-password') && method === 'POST') {
 
 const email =
  (body as any)?.email ||
  (body as any)?.username ||
  (body as any)?.value?.email;

  const validEmails = [
    'mariyokesh@example.com',
    'jhon@example.com',
    'kumar@example.com'
  ];

  if (!email) {
    return error(400, 'Email is required');
  }

  if (!validEmails.includes(email)) {
    return error(404, 'Email not registered');
  }

  return ok({ message: 'Password reset link sent' });
}

  
  if (url.endsWith('/api/user/role') && method === 'GET') {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (token) {
        try {
            const role = getRoleFromToken(token);
            if (role) {
                return ok({ role });
            }
        } catch (e) {
            return error(401, 'Invalid token');
        }
    }
    return error(401, 'Unauthorized');
  }

  
  if (url.endsWith('/api/roles') && method === 'GET') {
    return ok({ 
      dashboard: ['Admin', 'Editor', 'Viewer']
    });
  }

  
  return next(req);

  
  function ok(body: any) {
    return of(new HttpResponse({ status: 200, body })).pipe(delay(500));
  }

  function error(status: number, message: string) {
    return throwError(() => ({ status, error: { message } })).pipe(delay(500));
  }

  function generateMockToken(username: string, role: string) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      sub: '1234567890',
      name: username,
      role: role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) 
    };
    
    const encode = (obj: any) => btoa(JSON.stringify(obj))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return `${encode(header)}.${encode(payload)}.mock-signature`;
  }

  function getRoleFromToken(token: string): string | null {
      try {
        const parts = token.split('.');
        if (parts.length < 2) return null;
        const payloadBase64 = parts[1];
        let normalized = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        while (normalized.length % 4) normalized += '=';
        const payloadJson = atob(normalized);
        const payload = JSON.parse(payloadJson);
        return payload.role || null;
      } catch (e) {
          return null;
      }
  }
}
