import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Database } from '@/lib/supabase/types'

type Profile = Database['public']['Tables']['profiles']['Row']

export async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return user
}

export async function getCurrentUser(): Promise<{ user: any, profile: Profile | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { user: null, profile: null }
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, profile }
}

export async function requireRole(role: 'admin' | 'trainer' | 'learner') {
  const { user, profile } = await getCurrentUser()

  if (!user || !profile) {
    redirect('/login')
  }

  if (profile.user_role !== role && profile.user_role !== 'admin') {
    redirect('/dashboard')
  }

  return { user, profile }
}

export function isAdmin(profile: Profile | null): boolean {
  return profile?.user_role === 'admin'
}

export function isTrainer(profile: Profile | null): boolean {
  return profile?.user_role === 'trainer' || profile?.user_role === 'admin'
}
