import { createBrowserClient } from "@supabase/ssr";
import { assertSupabasePublicEnv, supabaseAnonKey, supabaseUrl } from "./config";

export function createSupabaseBrowserClient() {
  assertSupabasePublicEnv();

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
