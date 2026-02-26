export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          avatar_url: string | null
          company: string | null
          role: string | null
          bio: string | null
          user_role: 'learner' | 'trainer' | 'admin'
          timezone: string | null
          theme_preference: 'light' | 'dark' | 'system' | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name: string
          avatar_url?: string | null
          company?: string | null
          role?: string | null
          bio?: string | null
          user_role?: 'learner' | 'trainer' | 'admin'
          timezone?: string | null
          theme_preference?: 'light' | 'dark' | 'system' | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string
          avatar_url?: string | null
          company?: string | null
          role?: string | null
          bio?: string | null
          user_role?: 'learner' | 'trainer' | 'admin'
          timezone?: string | null
          theme_preference?: 'light' | 'dark' | 'system' | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
