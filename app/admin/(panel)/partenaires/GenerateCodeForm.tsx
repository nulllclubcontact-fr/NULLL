"use client";

import { useActionState } from "react";
import { generatePartnerCode, type GenerateCodeState } from "../../actions";

const initialState: GenerateCodeState = {};

export function GenerateCodeForm({ partnerId }: { partnerId: string }) {
  const [state, formAction, pending] = useActionState(generatePartnerCode, initialState);

  return (
    <form action={formAction} className="grid gap-3">
      <input name="partner_id" type="hidden" value={partnerId} />
      <button className="primary-button w-full" disabled={pending} type="submit">
        {pending ? "Generation..." : "Generer code"}
      </button>
      {state.code ? (
        <p className="border-2 border-shock bg-shock px-4 py-3 font-mono text-sm font-black uppercase text-black" role="status">
          Code clair: {state.code}
        </p>
      ) : null}
      {state.error ? (
        <p className="border-2 border-shock px-4 py-3 font-mono text-sm font-black uppercase text-shock" role="alert">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
