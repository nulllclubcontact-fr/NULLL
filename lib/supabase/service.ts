import "server-only";

import { createClient } from "@supabase/supabase-js";
import { assertSupabaseServiceEnv, supabaseServiceRoleKey, supabaseUrl } from "./config";

export function createSupabaseServiceClient() {
  assertSupabaseServiceEnv();

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
