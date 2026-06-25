import { LoginForm } from "./LoginForm";

export default function MemberLoginPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="shell grid min-h-screen content-center gap-8 py-10">
        <div className="max-w-4xl">
          <p className="font-mono text-sm uppercase tracking-[0.28em] text-shock">Espace membre</p>
          <h1 className="brutal-title mt-4 font-display text-[clamp(4rem,14vw,10rem)] uppercase">Reviens au reel.</h1>
          <p className="mt-5 max-w-xl text-lg text-white/72">
            Tes points, ton palier, ton QR. Rien de magique. Juste ton compte.
          </p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}
