import request from 'supertest';
import express from 'express';
import applicationsRouter from '../routes/applications';
import { supabase } from '../supabase';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());
app.use('/api/applications', applicationsRouter);

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

// Mock createClient for auth middleware
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('Applications Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/applications/status', () => {
    it('should return 401 if auth token is missing', async () => {
      const response = await request(app)
        .get('/api/applications/status');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Missing auth token' });
    });

    it('should return 401 if auth token is invalid', async () => {
      const mockAuthSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: { message: 'Invalid token' },
          }),
        },
      };

      mockCreateClient.mockReturnValue(mockAuthSupabase as any);

      const response = await request(app)
        .get('/api/applications/status')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Invalid token' });
    });

    it('should return application status for authenticated user', async () => {
      const userId = 'test-user-123';
      const mockApplicationData = {
        id: 'app-1',
        status: 'pending',
      };

      // Mock auth
      const mockAuthSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: userId } },
            error: null,
          }),
        },
      };
      mockCreateClient.mockReturnValue(mockAuthSupabase as any);

      // Mock database query
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockApplicationData,
          error: null,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery as any);

      const response = await request(app)
        .get('/api/applications/status')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: mockApplicationData });

      expect(mockSupabase.from).toHaveBeenCalledWith('applications');
      expect(mockQuery.select).toHaveBeenCalledWith('id, status');
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', userId);
      expect(mockQuery.single).toHaveBeenCalled();
    });

    it('should return null data if no application exists', async () => {
      const userId = 'test-user-123';

      // Mock auth
      const mockAuthSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: userId } },
            error: null,
          }),
        },
      };
      mockCreateClient.mockReturnValue(mockAuthSupabase as any);

      // Mock database query - no application found (PGRST116 is "not found")
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116', message: 'Not found' },
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery as any);

      const response = await request(app)
        .get('/api/applications/status')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ data: null });
    });

    it('should handle database errors gracefully', async () => {
      const userId = 'test-user-123';

      // Mock auth
      const mockAuthSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: userId } },
            error: null,
          }),
        },
      };
      mockCreateClient.mockReturnValue(mockAuthSupabase as any);

      // Mock database error
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'DATABASE_ERROR', message: 'Connection failed' },
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery as any);

      const response = await request(app)
        .get('/api/applications/status')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Connection failed' });
    });
  });

  describe('POST /api/applications', () => {
    const validApplicationData = {
      full_name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
      linkedin_url: 'https://linkedin.com/in/johndoe',
      github_url: 'https://github.com/johndoe',
      short_answer_1: 'Answer 1',
      short_answer_2: 'Answer 2',
      short_answer_3: 'Answer 3',
      short_answer_4: 'Answer 4',
      mcq_responses: { q1: 'a', q2: 'b' },
      resume_url: 'https://example.com/resume.pdf',
      resume_filename: 'resume.pdf',
    };

    it('should return 401 if auth token is missing', async () => {
      const response = await request(app)
        .post('/api/applications')
        .send(validApplicationData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Missing auth token' });
    });

    it('should return 401 if auth token is invalid', async () => {
      const mockAuthSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: null },
            error: { message: 'Invalid token' },
          }),
        },
      };
      mockCreateClient.mockReturnValue(mockAuthSupabase as any);

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', 'Bearer invalid-token')
        .send(validApplicationData);

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Invalid token' });
    });

    it('should return 400 if required fields are missing', async () => {
      const userId = 'test-user-123';

      // Mock auth
      const mockAuthSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: userId } },
            error: null,
          }),
        },
      };
      mockCreateClient.mockReturnValue(mockAuthSupabase as any);

      const incompleteData = {
        full_name: 'John Doe',
        email: 'john@example.com',
        // Missing required fields
      };

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', 'Bearer valid-token')
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing required fields' });
    });

    it('should allow authenticated user to submit application', async () => {
      const userId = 'test-user-123';

      // Mock auth
      const mockAuthSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: userId } },
            error: null,
          }),
        },
      };
      mockCreateClient.mockReturnValue(mockAuthSupabase as any);

      // Mock database upsert
      const mockQuery = {
        upsert: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery as any);

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', 'Bearer valid-token')
        .send(validApplicationData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });

      expect(mockSupabase.from).toHaveBeenCalledWith('applications');
      expect(mockQuery.upsert).toHaveBeenCalledWith(
        {
          user_id: userId,
          ...validApplicationData,
        },
        { onConflict: 'user_id' }
      );
    });

    it('should allow authenticated user to update existing application', async () => {
      const userId = 'test-user-123';
      const updatedData = {
        ...validApplicationData,
        full_name: 'John Updated Doe',
        email: 'john.updated@example.com',
      };

      // Mock auth
      const mockAuthSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: userId } },
            error: null,
          }),
        },
      };
      mockCreateClient.mockReturnValue(mockAuthSupabase as any);

      // Mock database upsert (update existing)
      const mockQuery = {
        upsert: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery as any);

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', 'Bearer valid-token')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });

      expect(mockSupabase.from).toHaveBeenCalledWith('applications');
      expect(mockQuery.upsert).toHaveBeenCalledWith(
        {
          user_id: userId,
          ...updatedData,
        },
        { onConflict: 'user_id' }
      );
    });

    it('should handle database errors gracefully', async () => {
      const userId = 'test-user-123';

      // Mock auth
      const mockAuthSupabase = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: userId } },
            error: null,
          }),
        },
      };
      mockCreateClient.mockReturnValue(mockAuthSupabase as any);

      // Mock database error
      const mockQuery = {
        upsert: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database constraint violation' },
        }),
      };
      mockSupabase.from.mockReturnValue(mockQuery as any);

      const response = await request(app)
        .post('/api/applications')
        .set('Authorization', 'Bearer valid-token')
        .send(validApplicationData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database constraint violation' });
    });
  });
});