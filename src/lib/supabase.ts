import { createClient } from '@supabase/supabase-js'

// Usar proyecto externo de Supabase
const supabaseUrl = 'https://efwoenffjhjauhaykiew.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmd29lbmZmamhqYXVoYXlraWV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxODk2OTgsImV4cCI6MjA3OTc2NTY5OH0.auIqdT3Hc3t6yZiTa8wAF6l6driqh0v4ev-BWdlKF4M'

// Debug logs para verificar configuración
console.log('=== SUPABASE CONFIG ===')
console.log('URL:', supabaseUrl)
console.log('URL configured:', !!supabaseUrl && supabaseUrl.length > 0)
console.log('Key configured:', !!supabaseAnonKey && supabaseAnonKey.length > 0)
console.log('Using EXTERNAL Supabase project (not Lovable Cloud)')
console.log('=======================')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ CRITICAL: External Supabase environment variables not found!')
  console.error('Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Secrets')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    }
  }
)

export const isSupabaseConfigured = (): boolean => {
  return !!supabaseUrl && 
         !!supabaseAnonKey && 
         supabaseUrl.length > 10 && 
         !supabaseUrl.includes('placeholder')
}
