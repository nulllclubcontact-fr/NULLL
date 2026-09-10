import { createBrowserClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { assertSupabasePublicEnv, supabaseAnonKey, supabaseUrl } from "./config";
import { MARQUEUR_SESSION_COURTE, sansDuree } from "./session";

export function createSupabaseBrowserClient() {
  assertSupabasePublicEnv();

  // Le navigateur renouvelle lui aussi la session. Sans ce relais, il
  // reecrirait des cookies de 400 jours et « Se souvenir de moi » decoche
  // ne tiendrait qu'une heure.
  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return parseCookieHeader(document.cookie).map(({ name, value }) => ({ name, value: value ?? "" }));
      },
      setAll(cookiesToSet) {
        const courte = parseCookieHeader(document.cookie).some(({ name, value }) => name === MARQUEUR_SESSION_COURTE && value === "1");

        cookiesToSet.forEach(({ name, value, options }) => {
          document.cookie = serializeCookieHeader(name, value, courte ? sansDuree(options) : options);
        });
      }
    }
  });
}
