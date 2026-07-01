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
  let supabase;

  try {
    supabase = await createSupabaseServerClient();
  } catch {
    redirect("/membre/login");
  }

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
    <section className="grid min-h-[calc(100vh-92px)] bg-[#f6eadf] text-[#351815]">
      <div className="shell grid content-center gap-8 py-8">
        <div>
          <p className="inline-flex border-2 border-[#351815] bg-[#ffb000] px-3 py-2 font-mono text-xs font-black uppercase">QR membre</p>
          <h1 className="mt-6 font-display text-[clamp(3.6rem,10vw,8rem)] uppercase leading-[0.94]">Fais scanner.</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(280px,0.55fr)] lg:items-center">
          <div className="border-2 border-[#351815] bg-white p-4 shadow-[8px_8px_0_#d96ab4] sm:p-8">
            <div
              className="mx-auto aspect-square w-full max-w-[520px]"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          </div>

          <aside className="border-2 border-[#351815] bg-[#351815] p-5 text-[#f6eadf] sm:p-8">
            <p className="font-mono text-sm font-black uppercase text-[#ffb000]">
              {profile.first_name ? profile.first_name : "Membre NULLL"}
            </p>
            <p className="mt-5 font-display text-[clamp(2.4rem,5.6vw,4.4rem)] uppercase leading-[0.96]">
              Présente ce code aux partenaires NULLL pour gagner tes points.
            </p>
            <p className="mt-5 text-sm text-[#f6eadf]/60">
              Token opaque. Pas ton UUID. Pas ton mail. Juste ce qu'il faut pour créditer.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
