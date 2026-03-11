import { Router, Response } from 'express'
import { supabase } from '../supabase'
import { AuthRequest, requireAuth } from '../middleware/auth'

const router = Router()

// POST /api/upload/resume — returns a signed upload URL for Supabase storage
router.post('/resume', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    console.log('[POST /api/upload/resume] Request from user:', req.userId)
    const { filename } = req.body || {}
    if (!filename || typeof filename !== 'string') {
      console.log('[POST /api/upload/resume] Missing or invalid filename')
      return res.status(400).json({ error: 'Missing filename' })
    }

    const ext = filename.split('.').pop() || 'pdf'
    const path = `${req.userId}/resume.${ext}`
    console.log('[POST /api/upload/resume] Creating signed URL for path:', path)

    const { data, error } = await supabase.storage
      .from('resumes')
      .createSignedUploadUrl(path, {
        upsert: true  // Allow overwriting existing files
      })

    if (error) {
      console.error('[POST /api/upload/resume] Supabase storage error:', error)
      return res.status(500).json({ error: error.message })
    }

    const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(path)

    console.log('[POST /api/upload/resume] Success!')
    return res.json({
      signedUrl: data.signedUrl,
      path,
      publicUrl: urlData.publicUrl,
    })
  } catch (e) {
    console.error('[POST /api/upload/resume] Unexpected error:', e)
    return res.status(500).json({ error: e instanceof Error ? e.message : 'Failed to create upload URL' })
  }
})

export default router
