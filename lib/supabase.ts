import { createClient } from '@supabase/supabase-js'

// 서버사이드에서만 사용 (클라이언트에 노출되지 않음)
const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const createBrowserSupabaseClient = () => {
  if (typeof window === "undefined") {
    throw new Error("Browser Supabase client requested on the server");
  }
  const baseUrl = window.location.origin;
  return createClient(`${baseUrl}/api/supabase`, "edge-proxy");
};

// 클라이언트용 - Next.js API 라우트를 통해 프록시 호출
export const supabase =
  typeof window === "undefined"
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createBrowserSupabaseClient();

// 서버사이드 관리자 클라이언트
export const supabaseAdmin = typeof window === 'undefined' && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null
