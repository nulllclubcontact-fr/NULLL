import { ProQrScanner } from "./ProQrScanner";

export default function ProScanPage() {
  return (
    <section className="shell grid gap-8 py-8 lg:py-12">
      <div>
        <p className="inline-flex border-2 border-[#351815] bg-[#ffb000] px-3 py-2 font-mono text-xs font-black uppercase">Scanner pro</p>
        <h1 className="mt-6 font-display text-[clamp(3.6rem,10vw,8rem)] uppercase leading-[0.94]">Scan. Applique. Encaisse.</h1>
        <p className="mt-5 max-w-xl font-bold leading-tight text-[#351815]/72">
          Lis le QR membre, vois son palier, applique la reduction en caisse. Le credit de points arrive en T9.
        </p>
      </div>

      <ProQrScanner />
    </section>
  );
}
