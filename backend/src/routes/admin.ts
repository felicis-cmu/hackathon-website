import { Router, Request, Response } from 'express'
import { supabase } from '../supabase'

const router = Router()

// GET /api/admin/export — export all applications as CSV
router.get('/export', async (req: Request, res: Response) => {
  const adminKey = req.headers['x-admin-key']
  const expectedKey = process.env.ADMIN_SECRET

  if (!expectedKey || adminKey !== expectedKey) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { data: applications, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return res.status(500).json({ error: error.message })

  const columns = [
    'created_at', 'status', 'full_name', 'email', 'phone',
    'linkedin_url', 'github_url', 'short_answer_1', 'short_answer_2',
    'short_answer_3', 'short_answer_4', 'mcq_responses', 'resume_url', 'resume_filename',
  ]

  const escapeCsv = (val: unknown): string => {
    if (val == null) return ''
    const str = typeof val === 'object' ? JSON.stringify(val) : String(val)
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`
    }
    return str
  }

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
