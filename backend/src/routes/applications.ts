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
  try {
    console.log('[POST /api/applications] Request from user:', req.userId)
    const {
      full_name, email, phone, linkedin_url, github_url,
      short_answer_1, short_answer_2, short_answer_3, short_answer_4,
      mcq_responses, referral_other, resume_url, resume_filename,
    } = req.body

    if (!full_name || !email || !linkedin_url || !github_url ||
        !short_answer_1 || !short_answer_2 || !short_answer_3 || !short_answer_4) {
      console.log('[POST /api/applications] Missing required fields')
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // First check if application exists
    console.log('[POST /api/applications] Checking for existing application')
    const { data: existing, error: checkError } = await supabase
      .from('applications')
      .select('id')
      .eq('user_id', req.userId)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('[POST /api/applications] Error checking existing:', checkError)
      return res.status(500).json({ error: checkError.message })
    }

    console.log('[POST /api/applications] Existing application:', existing ? 'Yes' : 'No')

    const applicationData = {
      user_id: req.userId,
      full_name, email, phone, linkedin_url, github_url,
      short_answer_1, short_answer_2, short_answer_3, short_answer_4,
      mcq_responses, referral_other, resume_url, resume_filename,
    }

    let error
    if (existing) {
      // Update existing application
      console.log('[POST /api/applications] Updating existing application')
      const result = await supabase
        .from('applications')
        .update(applicationData)
        .eq('user_id', req.userId)
      error = result.error
    } else {
      // Insert new application
      console.log('[POST /api/applications] Inserting new application')
      const result = await supabase
        .from('applications')
        .insert(applicationData)
      error = result.error
    }

    if (error) {
      console.error('[POST /api/applications] Database error:', error)
      return res.status(500).json({ error: error.message })
    }

    console.log('[POST /api/applications] Success!')
    return res.json({ success: true })
  } catch (err) {
    console.error('[POST /api/applications] Unexpected error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
