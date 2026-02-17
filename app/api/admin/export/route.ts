import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const adminKey = request.headers.get('x-admin-key')
  const expectedKey = process.env.ADMIN_SECRET

  if (!expectedKey || adminKey !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    return NextResponse.json(
      { error: 'Server misconfigured: SUPABASE_SERVICE_ROLE_KEY missing' },
      { status: 500 }
    )
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey)
  const { data: applications, error } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const columns = [
    'created_at',
    'status',
    'full_name',
    'email',
    'phone',
    'linkedin_url',
    'github_url',
    'short_answer_1',
    'short_answer_2',
    'short_answer_3',
    'short_answer_4',
    'mcq_responses',
    'resume_url',
    'resume_filename',
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

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="venturehacks-applications-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  })
}
