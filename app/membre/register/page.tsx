import { RegisterForm } from "./RegisterForm";

export default function MemberRegisterPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="shell grid min-h-screen content-center gap-8 py-10">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.28em] text-shock">Inscription membre</p>
          <h1 className="brutal-title mt-4 font-display text-[clamp(4rem,14vw,10rem)] uppercase">Entre dans le club.</h1>
          <p className="mt-5 max-w-xl text-lg text-white/72">
            Un compte. Un QR bientot. Des points qui ne dorment pas.
          </p>
        </div>

        <RegisterForm />
      </section>
    </main>
  );
}
