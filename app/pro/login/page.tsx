import { ProLoginForm } from "./ProLoginForm";

export default function ProLoginPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="shell grid min-h-screen content-center gap-8 py-10">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.28em] text-shock">Espace pro</p>
          <h1 className="brutal-title mt-4 font-display text-[clamp(4rem,14vw,10rem)] uppercase">Scan. Caisse. Points.</h1>
          <p className="mt-5 max-w-xl text-lg text-white/72">
            Code fourni par NULLL. Pas d'inscription. Pas de blabla.
          </p>
        </div>

        <ProLoginForm />
      </section>
    </main>
  );
}
