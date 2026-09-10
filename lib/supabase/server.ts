import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { assertSupabasePublicEnv, supabaseAnonKey, supabaseUrl } from "./config";
import { MARQUEUR_SESSION_COURTE, sansDuree } from "./session";

/**
 * sessionCourte force le choix au moment de la connexion ; ensuite, c'est
 * le marqueur pose par loginMember qui decide.
 */
export async function createSupabaseServerClient({ sessionCourte }: { sessionCourte?: boolean } = {}) {
  assertSupabasePublicEnv();

  const cookieStore = await cookies();
  const courte = sessionCourte ?? cookieStore.get(MARQUEUR_SESSION_COURTE)?.value === "1";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, courte ? sansDuree(options) : options);
          });
        } catch {
          // Server Components cannot always set cookies. Server actions can.
        }
      }
    }
  });
}
