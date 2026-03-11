import { Router, Response } from 'express'
import { supabase } from '../supabase'
import { AuthRequest, requireAuth } from '../middleware/auth'

const router = Router()

// GET /api/applications/status — get application status for authenticated user
router.get('/status', requireAuth, async (req: AuthRequest, res: Response) => {
  const { data, error } = await supabase
    .from('applications')
    .select('id, status')
    .eq('user_id', req.userId)
    .single()

  if (error && error.code !== 'PGRST116') {
    return res.status(500).json({ error: error.message })
  }

  return res.json({ data: data ?? null })
})

// POST /api/applications — submit or update application
router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const {
    full_name, email, phone, linkedin_url, github_url,
    short_answer_1, short_answer_2, short_answer_3, short_answer_4,
    mcq_responses, referral_other, resume_url, resume_filename,
  } = req.body

  if (!full_name || !email || !linkedin_url || !github_url ||
      !short_answer_1 || !short_answer_2 || !short_answer_3 || !short_answer_4) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const { error } = await supabase.from('applications').upsert(
    {
      user_id: req.userId,
      full_name, email, phone, linkedin_url, github_url,
      short_answer_1, short_answer_2, short_answer_3, short_answer_4,
      mcq_responses, referral_other, resume_url, resume_filename,
    },
    { onConflict: 'user_id' }
  )

  if (error) return res.status(500).json({ error: error.message })
  return res.json({ success: true })
})

export default router
