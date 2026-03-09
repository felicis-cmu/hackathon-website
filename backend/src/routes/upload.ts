import { Router, Response } from 'express'
import { supabase } from '../supabase'
import { AuthRequest, requireAuth } from '../middleware/auth'

const router = Router()

// POST /api/upload/resume — returns a signed upload URL for Supabase storage
router.post('/resume', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { filename } = req.body || {}
    if (!filename || typeof filename !== 'string') return res.status(400).json({ error: 'Missing filename' })

    const ext = filename.split('.').pop() || 'pdf'
    const path = `${req.userId}/resume.${ext}`

    const { data, error } = await supabase.storage
      .from('resumes')
      .createSignedUploadUrl(path)

    if (error) return res.status(500).json({ error: error.message })

    const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(path)

    return res.json({
      signedUrl: data.signedUrl,
      path,
      publicUrl: urlData.publicUrl,
    })
  } catch (e) {
    console.error('Upload resume error:', e)
    return res.status(500).json({ error: e instanceof Error ? e.message : 'Failed to create upload URL' })
  }
})

export default router
