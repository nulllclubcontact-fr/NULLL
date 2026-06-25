import QRCode from "qrcode";
import { redirect } from "next/navigation";
import { encodeMemberQrToken } from "../../../../lib/qr/token";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

type ProfileQr = {
  first_name: string | null;
  qr_token: string;
};

export const metadata = {
  robots: {
    index: false,
    follow: false
  }
};

export default async function MemberQrPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/membre/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name,qr_token")
    .eq("id", user.id)
    .maybeSingle<ProfileQr>();

  if (!profile?.qr_token) {
    redirect("/membre");
  }

  const encodedToken = encodeMemberQrToken(profile.qr_token);
  const qrSvg = await QRCode.toString(encodedToken, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff"
    }
  });

  return (
    <section className="grid min-h-[calc(100vh-92px)] bg-white text-black">
      <div className="shell grid content-center gap-8 py-8">
        <div>
          <p className="font-mono text-sm font-black uppercase tracking-[0.28em] text-black/60">QR membre</p>
          <h1 className="brutal-title mt-4 font-display text-[clamp(4rem,14vw,10rem)] uppercase">Fais scanner.</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(280px,0.55fr)] lg:items-center">
          <div className="border-4 border-black bg-white p-4 sm:p-8">
            <div
              className="mx-auto aspect-square w-full max-w-[520px]"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          </div>

          <aside className="border-4 border-black bg-black p-5 text-white sm:p-8">
            <p className="font-mono text-sm uppercase tracking-[0.2em] text-shock">
              {profile.first_name ? profile.first_name : "Membre NULLL"}
            </p>
            <p className="mt-5 font-display text-[clamp(2.6rem,7vw,5rem)] uppercase leading-none">
              Présente ce code aux partenaires NULLL pour gagner tes points.
            </p>
            <p className="mt-5 text-sm text-white/60">
              Token opaque. Pas ton UUID. Pas ton mail. Juste ce qu'il faut pour créditer.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
