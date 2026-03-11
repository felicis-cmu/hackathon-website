import request from 'supertest'
import express from 'express'
import adminRouter from '../routes/admin'
import { supabase } from '../supabase'

const app = express()
app.use(express.json())
app.use('/api/admin', adminRouter)

const mockSupabase = supabase as jest.Mocked<typeof supabase>

describe('Admin Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/admin/applications', () => {
    it('should return 401 if admin key is missing', async () => {
      const response = await request(app).get('/api/admin/applications')

      expect(response.status).toBe(401)
      expect(response.body).toEqual({ error: 'Unauthorized' })
    })

    it('should return application summaries for the dashboard', async () => {
      const mockData = [
        {
          id: 'app-1',
          full_name: 'Jane Doe',
          email: 'jane@example.com',
          status: 'pending',
          created_at: '2026-03-10T00:00:00Z',
        },
      ]

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockReturnThis(),
        range: jest.fn().mockReturnThis(),
        eq: jest.fn().mockResolvedValue({
          data: mockData,
          error: null,
          count: 1,
        }),
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const response = await request(app)
        .get('/api/admin/applications?status=pending&limit=50&offset=0')
        .set('x-admin-key', 'test-admin-secret')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        data: mockData,
        total: 1,
      })

      expect(mockSupabase.from).toHaveBeenCalledWith('applications')
      expect(mockQuery.select).toHaveBeenCalledWith('id, created_at, status, full_name, email', { count: 'exact' })
      expect(mockQuery.order).toHaveBeenCalledWith('created_at', { ascending: false })
      expect(mockQuery.range).toHaveBeenCalledWith(0, 49)
      expect(mockQuery.eq).toHaveBeenCalledWith('status', 'pending')
    })
  })

  describe('GET /api/admin/applications/:id', () => {
    it('should return the full application record', async () => {
      const mockApplication = {
        id: 'app-1',
        full_name: 'Jane Doe',
        email: 'jane@example.com',
        status: 'pending',
        resume_url: 'https://example.com/resume.pdf',
      }

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockApplication,
          error: null,
        }),
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const response = await request(app)
        .get('/api/admin/applications/app-1')
        .set('x-admin-key', 'test-admin-secret')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockApplication)
      expect(mockQuery.select).toHaveBeenCalledWith('*')
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'app-1')
    })
  })

  describe('PATCH /api/admin/applications/:id', () => {
    it('should reject invalid statuses', async () => {
      const response = await request(app)
        .patch('/api/admin/applications/app-1')
        .set('x-admin-key', 'test-admin-secret')
        .send({ status: 'maybe' })

      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'Invalid status' })
    })

    it('should update application status', async () => {
      const updatedApplication = {
        id: 'app-1',
        status: 'accepted',
      }

      const mockQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: updatedApplication,
          error: null,
        }),
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const response = await request(app)
        .patch('/api/admin/applications/app-1')
        .set('x-admin-key', 'test-admin-secret')
        .send({ status: 'accepted' })

      expect(response.status).toBe(200)
      expect(response.body).toEqual(updatedApplication)
      expect(mockQuery.update).toHaveBeenCalledWith({ status: 'accepted' })
      expect(mockQuery.eq).toHaveBeenCalledWith('id', 'app-1')
      expect(mockQuery.select).toHaveBeenCalledWith('*')
    })
  })

  describe('GET /api/admin/applications/:id/resume', () => {
    it('should return the resume URL and filename', async () => {
      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            resume_url: 'https://example.com/resume.pdf',
            resume_filename: 'resume.pdf',
          },
          error: null,
        }),
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const response = await request(app)
        .get('/api/admin/applications/app-1/resume')
        .set('x-admin-key', 'test-admin-secret')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        url: 'https://example.com/resume.pdf',
        filename: 'resume.pdf',
      })
    })
  })

  describe('GET /api/admin/export', () => {
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
      ]

      const mockQuery = {
        select: jest.fn().mockReturnThis(),
        order: jest.fn().mockResolvedValue({
          data: mockApplications,
          error: null,
        }),
      }

      mockSupabase.from.mockReturnValue(mockQuery as any)

      const response = await request(app)
        .get('/api/admin/export')
        .set('x-admin-key', 'test-admin-secret')

      expect(response.status).toBe(200)
      expect(response.headers['content-type']).toBe('text/csv; charset=utf-8')
      expect(response.text).toContain('id,created_at,status,full_name,email')
      expect(response.text).toContain('John Doe')
      expect(mockSupabase.from).toHaveBeenCalledWith('applications')
      expect(mockQuery.select).toHaveBeenCalledWith('*')
      expect(mockQuery.order).toHaveBeenCalledWith('created_at', { ascending: false })
    })
  })
})
