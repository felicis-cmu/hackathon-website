import request from 'supertest';
import express from 'express';
import uploadRouter from '../routes/upload';
import { supabase } from '../supabase';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());
app.use('/api/upload', uploadRouter);

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

// Mock createClient for auth middleware
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(),
}));

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('Upload Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/upload/resume', () => {
    it('should return 401 if auth token is missing', async () => {
      const response = await request(app)
        .post('/api/upload/resume')
        .send({ filename: 'resume.pdf' });

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
        .post('/api/upload/resume')
        .set('Authorization', 'Bearer invalid-token')
        .send({ filename: 'resume.pdf' });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Invalid token' });
    });

    it('should return 400 if filename is missing', async () => {
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

      const response = await request(app)
        .post('/api/upload/resume')
        .set('Authorization', 'Bearer valid-token')
        .send({}); // Missing filename

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing filename' });
    });

    it('should return signed URL and public URL for resume uploads', async () => {
      const userId = 'test-user-123';
      const filename = 'john_doe_resume.pdf';
      const expectedPath = `${userId}/resume.pdf`;
      const expectedSignedUrl = 'https://supabase.co/storage/signed-url';
      const expectedPublicUrl = 'https://supabase.co/storage/public-url';

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

      // Mock storage operations
      const mockStorageBucket = {
        createSignedUploadUrl: jest.fn().mockResolvedValue({
          data: { signedUrl: expectedSignedUrl },
          error: null,
        }),
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: expectedPublicUrl },
        }),
      };

      mockSupabase.storage = {
        from: jest.fn().mockReturnValue(mockStorageBucket),
      } as any;

      const response = await request(app)
        .post('/api/upload/resume')
        .set('Authorization', 'Bearer valid-token')
        .send({ filename });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        signedUrl: expectedSignedUrl,
        path: expectedPath,
        publicUrl: expectedPublicUrl,
      });

      expect(mockSupabase.storage.from).toHaveBeenCalledWith('resumes');
      expect(mockStorageBucket.createSignedUploadUrl).toHaveBeenCalledWith(expectedPath, { upsert: true });
      expect(mockStorageBucket.getPublicUrl).toHaveBeenCalledWith(expectedPath);
    });

    it('should handle different file extensions correctly', async () => {
      const userId = 'test-user-123';
      const filename = 'resume.docx';
      const expectedPath = `${userId}/resume.docx`;

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

      // Mock storage operations
      const mockStorageBucket = {
        createSignedUploadUrl: jest.fn().mockResolvedValue({
          data: { signedUrl: 'https://example.com/signed' },
          error: null,
        }),
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/public' },
        }),
      };

      mockSupabase.storage = {
        from: jest.fn().mockReturnValue(mockStorageBucket),
      } as any;

      const response = await request(app)
        .post('/api/upload/resume')
        .set('Authorization', 'Bearer valid-token')
        .send({ filename });

      expect(response.status).toBe(200);
      expect(response.body.path).toBe(expectedPath);
      expect(mockStorageBucket.createSignedUploadUrl).toHaveBeenCalledWith(expectedPath, { upsert: true });
      expect(mockStorageBucket.getPublicUrl).toHaveBeenCalledWith(expectedPath);
    });

    it('should handle storage errors gracefully', async () => {
      const userId = 'test-user-123';
      const filename = 'resume.pdf';

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

      // Mock storage error
      const mockStorageBucket = {
        createSignedUploadUrl: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Storage quota exceeded' },
        }),
      };

      mockSupabase.storage = {
        from: jest.fn().mockReturnValue(mockStorageBucket),
      } as any;

      const response = await request(app)
        .post('/api/upload/resume')
        .set('Authorization', 'Bearer valid-token')
        .send({ filename });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Storage quota exceeded' });
    });

    it('should handle filenames without extensions', async () => {
      const userId = 'test-user-123';
      const filename = 'resume';
      const expectedPath = `${userId}/resume.resume`; // filename.split('.').pop() returns 'resume'

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

      // Mock storage operations
      const mockStorageBucket = {
        createSignedUploadUrl: jest.fn().mockResolvedValue({
          data: { signedUrl: 'https://example.com/signed' },
          error: null,
        }),
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/public' },
        }),
      };

      mockSupabase.storage = {
        from: jest.fn().mockReturnValue(mockStorageBucket),
      } as any;

      const response = await request(app)
        .post('/api/upload/resume')
        .set('Authorization', 'Bearer valid-token')
        .send({ filename });

      expect(response.status).toBe(200);
      expect(response.body.path).toBe(expectedPath);
    });

    it('should generate unique paths for different users', async () => {
      const userId1 = 'user-1';
      const userId2 = 'user-2';
      const filename = 'resume.pdf';

      // First user
      const mockAuthSupabase1 = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: userId1 } },
            error: null,
          }),
        },
      };
      mockCreateClient.mockReturnValue(mockAuthSupabase1 as any);

      const mockStorageBucket = {
        createSignedUploadUrl: jest.fn().mockResolvedValue({
          data: { signedUrl: 'https://example.com/signed' },
          error: null,
        }),
        getPublicUrl: jest.fn().mockReturnValue({
          data: { publicUrl: 'https://example.com/public' },
        }),
      };

      mockSupabase.storage = {
        from: jest.fn().mockReturnValue(mockStorageBucket),
      } as any;

      const response1 = await request(app)
        .post('/api/upload/resume')
        .set('Authorization', 'Bearer valid-token')
        .send({ filename });

      expect(response1.body.path).toBe(`${userId1}/resume.pdf`);

      // Second user
      const mockAuthSupabase2 = {
        auth: {
          getUser: jest.fn().mockResolvedValue({
            data: { user: { id: userId2 } },
            error: null,
          }),
        },
      };
      mockCreateClient.mockReturnValue(mockAuthSupabase2 as any);

      const response2 = await request(app)
        .post('/api/upload/resume')
        .set('Authorization', 'Bearer valid-token')
        .send({ filename });

      expect(response2.body.path).toBe(`${userId2}/resume.pdf`);
    });
  });
});
