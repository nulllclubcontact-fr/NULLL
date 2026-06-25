export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function hasSupabasePublicEnv() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function assertSupabasePublicEnv() {
  if (!hasSupabasePublicEnv()) {
    throw new Error("Missing Supabase public environment variables");
  }
}

export function assertSupabaseServiceEnv() {
  assertSupabasePublicEnv();

  if (!supabaseServiceRoleKey) {
    throw new Error("Missing Supabase service role environment variable");
  }
}
