import { ProQrScanner } from "./ProQrScanner";

export default function ProScanPage() {
  return (
    <section className="shell grid gap-8 py-8 lg:py-12">
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.28em] text-shock">Scanner pro</p>
        <h1 className="brutal-title mt-4 font-display text-[clamp(4rem,14vw,10rem)] uppercase">Scan. Applique. Encaisse.</h1>
        <p className="mt-5 max-w-xl text-white/72">
          Lis le QR membre, vois son palier, applique la reduction en caisse. Le credit de points arrive en T9.
        </p>
      </div>

      <ProQrScanner />
    </section>
  );
}
