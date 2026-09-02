import { RaceScanner } from "./RaceScanner";
import { requireAdminUser } from "../../../../lib/admin/require-admin";

export const metadata = { robots: { index: false, follow: false } };

export default async function AdminScannerPage({
  searchParams
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course } = await searchParams;
  const { supabase } = await requireAdminUser();

  // Les sorties qu'on peut raisonnablement pointer aujourd'hui : publiees
  // ou fermees aux inscriptions, mais pas les brouillons ni les annulees.
  const { data } = await supabase
    .from("races")
    .select("id,title,start_datetime")
    .in("status", ["published", "closed"])
    .order("start_datetime", { ascending: true })
    .returns<Array<{ id: string; title: string; start_datetime: string }>>();

  const courses = data ?? [];

  return (
    <section className="shell grid gap-6 py-6 lg:py-10">
      <header>
        <p className="font-mono text-xs font-black uppercase tracking-[.18em] text-[#351815]/55">Administration</p>
        <h1 className="mt-3 font-display text-[clamp(2.2rem,6vw,3.6rem)] uppercase leading-[.95]">
          Scanner<span className="text-[#d96ab4]">.</span>
        </h1>
      </header>

      {courses.length === 0 ? (
        <p className="border-2 border-dashed border-[#351815]/30 p-6 font-bold text-[#351815]/60">
          Aucune sortie à pointer. Publie-en une d’abord.
        </p>
      ) : (
        <RaceScanner courseInitiale={course} courses={courses} />
      )}
    </section>
  );
}
