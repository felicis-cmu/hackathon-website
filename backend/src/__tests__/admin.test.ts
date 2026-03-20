import request from 'supertest'
import express from 'express'
import adminRouter from '../routes/admin'
import { supabase } from '../supabase'

const mockResendSend = jest.fn()

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: mockResendSend,
    },
  })),
}))

const app = express()
app.use(express.json())
app.use('/api/admin', adminRouter)

const mockSupabase = supabase as jest.Mocked<typeof supabase>

describe('Admin Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.restoreAllMocks()
    mockResendSend.mockReset()
    delete process.env.RESEND_API_KEY
    delete process.env.RESEND_FROM_EMAIL
    delete process.env.RESEND_FROM_NAME
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

    it('should fail accepted decisions when Resend is not configured', async () => {
      const currentApplication = {
        id: 'app-1',
        status: 'pending',
        full_name: 'Jane Doe',
        email: 'jane@example.com',
      }

      const fetchQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: currentApplication,
          error: null,
        }),
      }

      mockSupabase.from.mockReturnValue(fetchQuery as any)

      const response = await request(app)
        .patch('/api/admin/applications/app-1')
        .set('x-admin-key', 'test-admin-secret')
        .send({ status: 'accepted' })

      expect(response.status).toBe(503)
      expect(response.body).toEqual({
        emailDelivery: {
          sent: false,
          skipped: false,
          error: 'Resend is not configured yet.',
        },
        error: 'Resend is not configured yet.',
      })
      expect(mockResendSend).not.toHaveBeenCalled()
    })

    it('should send the acceptance email via Resend before updating status', async () => {
      process.env.RESEND_API_KEY = 'resend-api-key'
      process.env.RESEND_FROM_EMAIL = 'noreply@venturehacks.dev'
      process.env.RESEND_FROM_NAME = 'VentureHacks'

      const currentApplication = {
        id: 'app-1',
        status: 'pending',
        full_name: 'Jane Doe',
        email: 'jane@example.com',
      }

      const updatedApplication = {
        ...currentApplication,
        status: 'accepted',
      }

      const fetchQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: currentApplication,
          error: null,
        }),
      }

      const updateQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: updatedApplication,
          error: null,
        }),
      }

      mockResendSend.mockResolvedValue({
        data: { id: 'resend-accepted-id' },
        error: null,
      })

      mockSupabase.from
        .mockReturnValueOnce(fetchQuery as any)
        .mockReturnValueOnce(updateQuery as any)

      const response = await request(app)
        .patch('/api/admin/applications/app-1')
        .set('x-admin-key', 'test-admin-secret')
        .send({ status: 'accepted' })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        ...updatedApplication,
        emailDelivery: {
          sent: true,
          skipped: false,
          messageId: 'resend-accepted-id',
        },
      })
      expect(mockResendSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'VentureHacks <noreply@venturehacks.dev>',
          to: 'jane@example.com',
          subject: 'You\'re accepted to VentureHacks',
        })
      )
      expect(updateQuery.update).toHaveBeenCalledWith({ status: 'accepted' })
    })

    it('should send the rejection email via Resend before updating status', async () => {
      process.env.RESEND_API_KEY = 'resend-api-key'
      process.env.RESEND_FROM_EMAIL = 'noreply@venturehacks.dev'

      const currentApplication = {
        id: 'app-1',
        status: 'pending',
        full_name: 'Jane Doe',
        email: 'jane@example.com',
      }

      const updatedApplication = {
        ...currentApplication,
        status: 'rejected',
      }

      const fetchQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: currentApplication,
          error: null,
        }),
      }

      const updateQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: updatedApplication,
          error: null,
        }),
      }

      mockResendSend.mockResolvedValue({
        data: { id: 'resend-rejected-id' },
        error: null,
      })

      mockSupabase.from
        .mockReturnValueOnce(fetchQuery as any)
        .mockReturnValueOnce(updateQuery as any)

      const response = await request(app)
        .patch('/api/admin/applications/app-1')
        .set('x-admin-key', 'test-admin-secret')
        .send({ status: 'rejected' })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        ...updatedApplication,
        emailDelivery: {
          sent: true,
          skipped: false,
          messageId: 'resend-rejected-id',
        },
      })
      expect(mockResendSend).toHaveBeenCalledWith(
        expect.objectContaining({
          from: 'VentureHacks <noreply@venturehacks.dev>',
          to: 'jane@example.com',
          subject: 'Your VentureHacks application',
        })
      )
      expect(updateQuery.update).toHaveBeenCalledWith({ status: 'rejected' })
    })

    it('should fail without updating status when Resend send fails', async () => {
      process.env.RESEND_API_KEY = 'resend-api-key'
      process.env.RESEND_FROM_EMAIL = 'noreply@venturehacks.dev'

      const currentApplication = {
        id: 'app-1',
        status: 'pending',
        full_name: 'Jane Doe',
        email: 'jane@example.com',
      }

      const fetchQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: currentApplication,
          error: null,
        }),
      }

      mockResendSend.mockResolvedValue({
        data: null,
        error: { message: 'Resend outage' },
      })

      mockSupabase.from.mockReturnValue(fetchQuery as any)

      const response = await request(app)
        .patch('/api/admin/applications/app-1')
        .set('x-admin-key', 'test-admin-secret')
        .send({ status: 'accepted' })

      expect(response.status).toBe(502)
      expect(response.body).toEqual({
        emailDelivery: {
          sent: false,
          skipped: false,
          error: 'Resend outage',
        },
        error: 'Resend outage',
      })
    })

    it('should update pending status without calling Resend', async () => {
      const currentApplication = {
        id: 'app-1',
        status: 'accepted',
        full_name: 'Jane Doe',
        email: 'jane@example.com',
      }

      const updatedApplication = {
        ...currentApplication,
        status: 'pending',
      }

      const fetchQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: currentApplication,
          error: null,
        }),
      }

      const updateQuery = {
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: updatedApplication,
          error: null,
        }),
      }

      mockSupabase.from
        .mockReturnValueOnce(fetchQuery as any)
        .mockReturnValueOnce(updateQuery as any)

      const response = await request(app)
        .patch('/api/admin/applications/app-1')
        .set('x-admin-key', 'test-admin-secret')
        .send({ status: 'pending' })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        ...updatedApplication,
        emailDelivery: {
          sent: false,
          skipped: true,
          reason: 'Pending applications do not send a decision email.',
        },
      })
      expect(mockResendSend).not.toHaveBeenCalled()
      expect(updateQuery.update).toHaveBeenCalledWith({ status: 'pending' })
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
      expect(response.text).toContain('https://example.com/resume.pdf')
      expect(response.text).not.toContain('john_doe_resume.pdf')
      expect(mockSupabase.from).toHaveBeenCalledWith('applications')
      expect(mockQuery.select).toHaveBeenCalledWith('*')
      expect(mockQuery.order).toHaveBeenCalledWith('created_at', { ascending: false })
    })
  })
})
