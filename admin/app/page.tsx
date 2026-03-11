import { redirect } from 'next/navigation'
import { getAdminSession } from '@/lib/auth'

export default async function HomePage() {
  const ok = await getAdminSession()
  if (ok) redirect('/dashboard')
  redirect('/login')
}
