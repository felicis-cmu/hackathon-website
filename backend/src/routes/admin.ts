import { Router, Request, Response } from 'express'
import { supabase } from '../supabase'

const router = Router()

type ApplicationRow = {
  id: string
  created_at: string
  status: string
  full_name: string
  email: string
  phone?: string | null
  linkedin_url?: string | null
  github_url?: string | null
  short_answer_1?: string | null
  short_answer_2?: string | null
  short_answer_3?: string | null
  short_answer_4?: string | null
  mcq_responses?: unknown
  resume_url?: string | null
  resume_filename?: string | null
}

function getAdminKey(req: Request): string {
  const value = req.headers['x-admin-key']
  return Array.isArray(value) ? value[0] ?? '' : value ?? ''
}

function isAuthorized(req: Request): boolean {
  const expectedKey = process.env.ADMIN_SECRET
  return Boolean(expectedKey) && getAdminKey(req) === expectedKey
}

function requireAdmin(req: Request, res: Response): boolean {
  if (!isAuthorized(req)) {
    res.status(401).json({ error: 'Unauthorized' })
    return false
  }
  return true
}

function parsePositiveInt(value: unknown, fallback: number): number {
  if (typeof value !== 'string') return fallback
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

function parseNonNegativeInt(value: unknown, fallback: number): number {
  if (typeof value !== 'string') return fallback
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback
}

function escapeCsv(val: unknown): string {
  if (val == null) return ''
  const str = typeof val === 'object' ? JSON.stringify(val) : String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

// GET /api/admin/applications — list all applications for the admin dashboard
router.get('/applications', async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return

  const status = typeof req.query.status === 'string' ? req.query.status.trim() : ''
  const limit = Math.min(parsePositiveInt(req.query.limit, 100), 500)
  const offset = parseNonNegativeInt(req.query.offset, 0)

  let query = supabase
    .from('applications')
    .select('id, created_at, status, full_name, email', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error, count } = await query

  if (error) return res.status(500).json({ error: error.message })

  return res.json({
    data: data ?? [],
    total: count ?? (data?.length ?? 0),
  })
})

// GET /api/admin/applications/:id — full application detail view
router.get('/applications/:id', async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return

  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', req.params.id)
    .single()

  if (error?.code === 'PGRST116') {
    return res.status(404).json({ error: 'Application not found' })
  }
  if (error) return res.status(500).json({ error: error.message })

  return res.json(data as ApplicationRow)
})

// PATCH /api/admin/applications/:id — update application status
router.patch('/applications/:id', async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return

  const status = typeof req.body?.status === 'string' ? req.body.status.trim() : ''
  if (!['pending', 'accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }

  const { data, error } = await supabase
    .from('applications')
    .update({ status })
    .eq('id', req.params.id)
    .select('*')
    .single()

  if (error?.code === 'PGRST116') {
    return res.status(404).json({ error: 'Application not found' })
  }
  if (error) return res.status(500).json({ error: error.message })

  return res.json(data as ApplicationRow)
})

// GET /api/admin/applications/:id/resume — fetch resume metadata for in-app viewing
router.get('/applications/:id/resume', async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return

  const { data, error } = await supabase
    .from('applications')
    .select('resume_url, resume_filename')
    .eq('id', req.params.id)
    .single()

  if (error?.code === 'PGRST116') {
    return res.status(404).json({ error: 'Application not found' })
  }
  if (error) return res.status(500).json({ error: error.message })
  if (!data?.resume_url) {
    return res.status(404).json({ error: 'Resume not found' })
  }

  return res.json({
    url: data.resume_url,
    filename: data.resume_filename ?? null,
  })
})

// GET /api/admin/export — export all applications as CSV
router.get('/export', async (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return

  const { data: applications, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  const columns = [
    'id', 'created_at', 'status', 'full_name', 'email', 'phone',
    'linkedin_url', 'github_url', 'short_answer_1', 'short_answer_2',
    'short_answer_3', 'short_answer_4', 'mcq_responses', 'resume_url', 'resume_filename',
  ]

  const header = columns.join(',')
  const rows = (applications ?? []).map((row) =>
    columns.map((col) => escapeCsv(row[col as keyof typeof row])).join(',')
  )
  const csv = [header, ...rows].join('\n')
  const date = new Date().toISOString().slice(0, 10)

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename="venturehacks-applications-${date}.csv"`)
  return res.send(csv)
})

export default router
