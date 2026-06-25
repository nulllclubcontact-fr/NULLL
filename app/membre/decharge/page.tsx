import Link from "next/link";

const waiverSections = [
  {
    title: "1. Reconnaissance des risques.",
    text:
      "Je reconnais que la pratique de la course à pied et la participation aux runs, sorties, événements et activités organisés par NULLL.CLUB comportent des risques inhérents (chutes, blessures, malaises, accidents, aléas liés à la voie publique, à la circulation et aux conditions météorologiques). Je déclare y participer librement et en pleine connaissance de ces risques."
  },
  {
    title: "2. État de santé.",
    text:
      "Je déclare être en condition physique me permettant de pratiquer la course à pied, ne pas avoir connaissance de contre-indication médicale, et participer sous ma propre responsabilité. Il m'appartient de m'assurer de mon aptitude et, en cas de doute, de consulter un médecin."
  },
  {
    title: "3. Renonciation à recours.",
    text:
      "Je participe sous mon entière responsabilité et renonce à tout recours contre NULLL.CLUB, ses organisateurs, ses bénévoles et ses membres en cas de dommages, blessures ou séquelles consécutifs à ma participation, notamment ceux résultant de mon propre état de santé ou d'une préparation insuffisante, sauf faute avérée de l'organisateur."
  },
  {
    title: "4. Effets personnels.",
    text: "NULLL.CLUB décline toute responsabilité en cas de vol, perte ou dégradation des effets personnels et du matériel."
  },
  {
    title: "5. Mineurs.",
    text: "La participation d'une personne mineure requiert l'autorisation préalable d'un représentant légal."
  },
  {
    title: "6. Données personnelles.",
    text:
      "J'accepte que mes nom, prénom et e-mail soient utilisés pour la gestion de mon compte membre et du programme de fidélité, conformément au RGPD. Je dispose d'un droit d'accès, de rectification et de suppression."
  }
];

export default function MemberWaiverPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="shell grid gap-8 py-10">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.28em] text-shock">Décharge</p>
          <h1 className="brutal-title mt-4 font-display text-[clamp(4rem,14vw,10rem)] uppercase">
            Décharge de responsabilité.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-white/72">
            NULLL.CLUB. Lis. Comprends. Accepte si tu es ok.
          </p>
        </div>

        <article className="panel panel-grid max-w-4xl p-5 md:p-8">
          <h2 className="font-display text-[clamp(2.6rem,7vw,5rem)] uppercase leading-none">
            Décharge de responsabilité - NULLL.CLUB
          </h2>
          <p className="mt-6 text-lg text-white/78">
            En cochant la case d'acceptation et en validant mon inscription, je reconnais et j'accepte ce qui suit :
          </p>
          <div className="mt-8 grid gap-6">
            {waiverSections.map((section) => (
              <section className="border-t-2 border-white pt-5" key={section.title}>
                <h3 className="font-mono text-sm font-black uppercase tracking-[0.16em] text-shock">{section.title}</h3>
                <p className="mt-3 leading-relaxed text-white/78">{section.text}</p>
              </section>
            ))}
          </div>
          <p className="mt-8 border-t-2 border-white pt-5 font-mono text-sm font-black uppercase text-white">
            Je certifie avoir lu et compris la présente décharge et l'accepter sans réserve.
          </p>
        </article>

        <Link className="primary-link w-fit" href="/membre/register">
          Retour inscription
        </Link>
      </section>
    </main>
  );
}
