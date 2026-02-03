import { z } from 'zod';
import { 
  insertUserSchema, 
  insertBirdSchema, 
  insertTrainingSchema, 
  insertTournamentSchema, 
  insertEnrollmentSchema,
  users, birds, trainings, tournaments, enrollments
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: 'POST' as const,
      path: '/api/register',
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: 'POST' as const,
      path: '/api/login',
      input: z.object({
        username: z.string(),
        password: z.string(),
      }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
    logout: {
      method: 'POST' as const,
      path: '/api/logout',
      responses: {
        200: z.void(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/user',
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  birds: {
    list: {
      method: 'GET' as const,
      path: '/api/birds',
      responses: {
        200: z.array(z.custom<typeof birds.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/birds',
      input: insertBirdSchema.omit({ ownerId: true }), // ownerId inferred from session
      responses: {
        201: z.custom<typeof birds.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/birds/:id',
      responses: {
        200: z.custom<typeof birds.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/birds/:id',
      input: insertBirdSchema.partial(),
      responses: {
        200: z.custom<typeof birds.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/birds/:id',
      responses: {
        204: z.void(),
      },
    },
  },
  trainings: {
    list: {
      method: 'GET' as const,
      path: '/api/birds/:birdId/trainings',
      responses: {
        200: z.array(z.custom<typeof trainings.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/trainings',
      input: insertTrainingSchema,
      responses: {
        201: z.custom<typeof trainings.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
  tournaments: {
    list: {
      method: 'GET' as const,
      path: '/api/tournaments',
      responses: {
        200: z.array(z.custom<typeof tournaments.$inferSelect & { organizer: { name: string } }>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/tournaments',
      input: insertTournamentSchema.omit({ organizerId: true }),
      responses: {
        201: z.custom<typeof tournaments.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/tournaments/:id',
      responses: {
        200: z.custom<typeof tournaments.$inferSelect & { enrollments: any[] }>(),
        404: errorSchemas.notFound,
      },
    },
    enroll: {
      method: 'POST' as const,
      path: '/api/tournaments/:id/enroll',
      input: z.object({ birdId: z.number() }),
      responses: {
        201: z.custom<typeof enrollments.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    updateResults: {
      method: 'POST' as const,
      path: '/api/tournaments/:id/results',
      input: z.array(z.object({ enrollmentId: z.number(), score: z.number(), rank: z.number() })),
      responses: {
        200: z.void(),
      },
    },
  },
  rankings: {
    list: {
      method: 'GET' as const,
      path: '/api/rankings',
      responses: {
        200: z.array(z.object({
          birdName: z.string(),
          ownerName: z.string(),
          totalScore: z.number(),
          species: z.string(),
        })),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  return url;
}
