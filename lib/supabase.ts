import { createClient } from '@supabase/supabase-js';

// 1. '비밀 금고(.env.local)'에서 주소와 암호를 꺼내옵니다.
// (만약 파일에 키가 없으면 빈 문자열 ""이라도 넣어서 에러를 방지합니다)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// [안전 장치] 만약 키를 못 찾았으면 콘솔에 경고를 띄워줍니다.
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("⚠️ 경고: Supabase 환경 변수가 설정되지 않았습니다!");
}

// 2. '전화번호(Url)'와 '암호(Key)'로 '전용 전화기(Supabase 클라이언트)'를 만듭니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);