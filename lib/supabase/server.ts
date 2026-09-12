import { cache } from "react";
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

/**
 * La session du visiteur, verifiee une seule fois par requete. Le layout
 * de l'espace membre et sa page faisaient chacun leur getUser, soit deux
 * allers-retours vers Supabase avant d'afficher quoi que ce soit : cache()
 * les fait partager le meme. null si Supabase est injoignable.
 */
export const sessionServeur = cache(async () => {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    return { supabase, user };
  } catch {
    return null;
  }
});
