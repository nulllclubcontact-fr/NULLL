"use client";

import { useActionState } from "react";
import { remettreLot, type RemiseState } from "../../app/admin/roulette-actions";

const initial: RemiseState = {};

export function FormulaireRemiseRoulette() {
  const [etat, valider, enCours] = useActionState(remettreLot, initial);

  return (
    <form action={valider} className="grid gap-4 border-2 border-[#773331] bg-[#F1EDE9] p-5 shadow-[8px_8px_0_#EBA0CD] sm:p-6">
      <label className="grid gap-2 font-mono text-xs font-black uppercase tracking-[.12em]" htmlFor="roulette-code">
        Code montré par le gagnant
        <input autoCapitalize="characters" autoComplete="off" className="field font-mono text-lg" id="roulette-code" name="code" placeholder="NULLL-RB-7Q4KX" required />
      </label>
      <button className="primary-button justify-center sm:justify-self-start" disabled={enCours} type="submit">
        {enCours ? "Vérification…" : "Valider et remettre le lot"}
      </button>
      {etat.ok ? (
        <p className="border-2 border-[#773331] bg-[#FFB200] px-4 py-3 font-mono text-sm font-black uppercase" role="status">
          {etat.ok}
        </p>
      ) : null}
      {etat.erreur ? (
        <p className="border-2 border-[#773331] bg-[#EBA0CD] px-4 py-3 font-mono text-sm font-black uppercase" role="alert">
          {etat.erreur}
        </p>
      ) : null}
    </form>
  );
}
