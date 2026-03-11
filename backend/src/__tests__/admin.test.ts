import request from 'supertest';
import express from 'express';
import adminRouter from '../routes/admin';
import { supabase } from '../supabase';

const app = express();
app.use(express.json());
app.use('/api/admin', adminRouter);

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('Admin Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/admin/export', () => {
    it('should return 401 if admin key is missing', async () => {
      const response = await request(app)
        .get('/api/admin/export');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Unauthorized' });
    });

    it('should return 401 if admin key is incorrect', async () => {
      const response = await request(app)
        .get('/api/admin/export')
        .set('x-admin-key', 'wrong-key');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Unauthorized' });
    });

    it('should return CSV of application data when authenticated with correct admin key', async () => {
      const mockApplications = [
        {
          id: '1',
          created_at: '2024-01-01T00:00:00Z',
          status: 'pending',
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
          resume_filename: 'john_doe_resume.pdf',
        },
        {
          id: '2',
          created_at: '2024-01-02T00:00:00Z',
          status: 'accepted',
          full_name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '987-654-3210',
          linkedin_url: 'https://linkedin.com/in/janesmith',
          github_url: 'https://github.com/janesmith',
          short_answer_1: 'Answer A',
          short_answer_2: 'Answer B',
          short_answer_3: 'Answer C',
          short_answer_4: 'Answer D',
          mcq_responses: { q1: 'c', q2: 'd' },
          resume_url: 'https://example.com/resume2.pdf',
          resume_filename: 'jane_smith_resume.pdf',
        },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: mockApplications,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery as any);

      const response = await request(app)
        .get('/api/admin/export')
        .set('x-admin-key', 'test-admin-secret');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('text/csv; charset=utf-8');
      expect(response.headers['content-disposition']).toMatch(/attachment; filename="venturehacks-applications-\d{4}-\d{2}-\d{2}\.csv"/);
      
      // Check CSV content
      const csvLines = response.text.split('\n');
      expect(csvLines[0]).toBe('created_at,status,full_name,email,phone,linkedin_url,github_url,short_answer_1,short_answer_2,short_answer_3,short_answer_4,mcq_responses,resume_url,resume_filename');
      expect(csvLines[1]).toContain('John Doe');
      expect(csvLines[1]).toContain('john@example.com');
      expect(csvLines[2]).toContain('Jane Smith');
      expect(csvLines[2]).toContain('jane@example.com');

      expect(mockSupabase.from).toHaveBeenCalledWith('applications');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.order).toHaveBeenCalledWith('created_at', { ascending: false });
    });

    it('should handle database errors gracefully', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database connection failed' },
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery as any);

      const response = await request(app)
        .get('/api/admin/export')
        .set('x-admin-key', 'test-admin-secret');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Database connection failed' });
    });

    it('should handle CSV escaping for special characters', async () => {
      const mockApplications = [
        {
          created_at: '2024-01-01T00:00:00Z',
          status: 'pending',
          full_name: 'John "Johnny" Doe',
          email: 'john@example.com',
          phone: '123-456-7890',
          linkedin_url: 'https://linkedin.com/in/johndoe',
          github_url: 'https://github.com/johndoe',
          short_answer_1: 'Answer with, comma',
          short_answer_2: 'Answer with\nnewline',
          short_answer_3: 'Answer 3',
          short_answer_4: 'Answer 4',
          mcq_responses: { q1: 'a', q2: 'b' },
          resume_url: 'https://example.com/resume.pdf',
          resume_filename: 'resume.pdf',
        },
      ];

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: mockApplications,
          error: null,
        }),
      };

      mockSupabase.from.mockReturnValue(mockQuery as any);

      const response = await request(app)
        .get('/api/admin/export')
        .set('x-admin-key', 'test-admin-secret');

      expect(response.status).toBe(200);
      
      // Check that special characters are properly escaped
      const csvContent = response.text;
      expect(csvContent).toContain('"John ""Johnny"" Doe"'); // Escaped quotes
      expect(csvContent).toContain('"Answer with, comma"'); // Escaped comma
      expect(csvContent).toContain('"Answer with\nnewline"'); // Escaped newline
    });
  });
});