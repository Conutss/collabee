import { createClient } from '@supabase/supabase-js'
<<<<<<< HEAD
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
=======

// 1. '비밀 금고(.env.local)'에서 암호를 꺼내옵니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 2. '전화번호'와 '암호'로 '전용 전화기(클라이언트)'를 만듭니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
>>>>>>> e015ee542e35cc8973d9c13800d9198d9a3a3695
