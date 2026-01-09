import { z } from 'zod';
import { insertUserSchema, users, roles } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  auth: {
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({ username: z.string().min(1) }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/me',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  roles: {
    list: {
      method: 'GET' as const,
      path: '/api/roles',
      responses: {
        200: z.custom<(typeof roles.$inferSelect & { assignedUser: typeof users.$inferSelect | null })[]>(),
      },
    },
    claim: {
      method: 'POST' as const,
      path: '/api/roles/:id/claim',
      responses: {
        200: z.custom<typeof roles.$inferSelect>(),
        400: z.object({ message: z.string() }), // Already taken
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
    release: {
      method: 'POST' as const,
      path: '/api/roles/:id/release',
      responses: {
        200: z.custom<typeof roles.$inferSelect>(),
        400: z.object({ message: z.string() }), // Not held by user
        401: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
};

// ============================================
// REQUIRED: buildUrl helper
// ============================================
export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

// ============================================
// TYPE HELPERS
// ============================================
export type LoginInput = z.infer<typeof api.auth.login.input>;
export type UserResponse = z.infer<typeof api.auth.me.responses[200]>;
