/**
 * Le programme de fidelite est en pause (decision du 11/09/2026) : le
 * scanner (ProQrScanner) reste dans le depot et reviendra avec lui.
 */
export default function ProScanPage() {
  return (
    <section className="shell grid gap-8 py-8 lg:py-12">
      <div>
        <p className="inline-flex border-2 border-[#773331] bg-[#FFB200] px-3 py-2 font-mono text-xs font-black uppercase">Scanner pro</p>
        <h1 className="mt-6 font-display text-[clamp(3.6rem,10vw,8rem)] uppercase leading-[0.94]">Scan en pause.</h1>
        <p className="mt-5 max-w-xl font-bold leading-tight text-[#773331]">
          Le scan partenaire est momentanément indisponible.
        </p>
      </div>
    </section>
  );
}
