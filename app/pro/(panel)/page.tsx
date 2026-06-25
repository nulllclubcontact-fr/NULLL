export default function ProScanPlaceholderPage() {
  return (
    <section className="shell grid min-h-[calc(100vh-92px)] content-center gap-6 py-10">
      <p className="font-mono text-sm uppercase tracking-[0.28em] text-shock">Scanner pro</p>
      <h1 className="brutal-title font-display text-[clamp(4rem,14vw,10rem)] uppercase">Camera bientot branchee.</h1>
      <div className="panel panel-grid max-w-2xl p-5">
        <p className="text-lg text-white/72">
          Route protegee OK. Le scan QR et la saisie achat arrivent apres la connexion pro.
        </p>
      </div>
    </section>
  );
}
