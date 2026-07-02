import Image from "next/image";
import { StructuredData } from "./StructuredData";
import { CheckoutForm } from "./checkout-form";
import { SectionTitle, SiteShell } from "./site-shell";
import { buildBreadcrumbSchema } from "../lib/seo";
import { getRoute, getSiteCopy, type Locale } from "../lib/site-content";

export function AboutPageView({ locale }: { locale: Locale }) {
  const copy = getSiteCopy(locale);

  return (
    <SiteShell current="about" locale={locale} pathname={getRoute(locale, "about")}>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Accueil", url: getRoute(locale, "home") },
          { name: "À propos", url: getRoute(locale, "about") }
        ])}
      />
      <section className="mx-auto grid w-full max-w-none gap-8 px-4 py-10 sm:px-6 xl:grid-cols-[0.92fr_1.08fr] xl:px-8 xl:py-14">
        <div>
          <SectionTitle as="h1" index="08" text={copy.aboutPage.intro} title={copy.aboutPage.title} />
          <div className="mt-8 border-2 border-[#351815] bg-[#d96ab4] p-5 font-mono text-sm font-black uppercase leading-tight">
            Ecole, metro, boulot dehors. Musique, sueur, lien social dedans.
          </div>
        </div>
        <div className="relative min-h-[520px] overflow-hidden border-2 border-[#351815] bg-[#351815]">
          <Image alt="NULLL.CLUB lifestyle mood" className="object-cover" fill sizes="(min-width: 1280px) 54vw, 100vw" src="/assets/nulll-new/water-face.png" />
          <Image alt="NULLL.CLUB" className="absolute left-1/2 top-1/2 h-auto w-[78%] -translate-x-1/2 -translate-y-1/2" height={157} src="/assets/nulll-new/logo-yellow.png" width={1225} />
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-none gap-4 px-4 pb-14 sm:px-6 md:grid-cols-2 xl:px-8">
        {copy.aboutPage.values.map((value, index) => (
          <article className="border-2 border-[#351815] bg-[#f6eadf] p-6 transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#ffb000] lg:p-8" key={value.title}>
            <p className="font-mono text-xs font-black uppercase text-[#d96ab4]">{String(index + 1).padStart(2, "0")} / Valeur</p>
            <h2 className="mt-4 font-display text-[clamp(2.4rem,4.6vw,3.8rem)] uppercase leading-[0.96]">{value.title}</h2>
            <p className="mt-4 text-lg font-bold leading-tight text-[#351815]/72">{value.text}</p>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}

export function CommunityPageView({ locale }: { locale: Locale }) {
  const copy = getSiteCopy(locale);

  return (
    <SiteShell current="community" locale={locale} pathname={getRoute(locale, "community")}>
      <section className="mx-auto grid w-full max-w-none gap-8 px-4 py-10 sm:px-6 xl:grid-cols-[1.02fr_0.98fr] xl:px-8 xl:py-14">
        <div>
          <SectionTitle as="h1" index="07" text={copy.communityPage.intro} title={copy.communityPage.title} />
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="border-2 border-[#351815] bg-[#ffb000] p-4 font-mono text-xs font-black uppercase">Zero ecouteurs</div>
            <div className="border-2 border-[#351815] bg-[#d96ab4] p-4 font-mono text-xs font-black uppercase">Tu viens seul, tu repars lie</div>
          </div>
        </div>
        <div className="relative min-h-[560px] overflow-hidden border-2 border-[#351815] bg-[#351815]">
          <Image alt="Ambiance communautaire NULLL.CLUB" className="object-cover" fill priority sizes="(min-width: 1280px) 48vw, 100vw" src="/assets/nulll-new/smile-sun.png" />
        </div>
      </section>
      <section className="mx-auto grid w-full max-w-none gap-4 px-4 pb-14 sm:px-6 xl:grid-cols-3 xl:px-8">
        {copy.communityPage.pillars.map((pillar, index) => (
          <article className="border-2 border-[#351815] bg-[#f6eadf] p-6 transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#d96ab4]" key={pillar.title}>
            <p className="font-mono text-xs font-black uppercase text-[#d96ab4]">0{index + 1} / Family</p>
            <h2 className="mt-4 font-display text-[clamp(2.3rem,3.8vw,3.4rem)] uppercase leading-[0.96]">{pillar.title}</h2>
            <p className="mt-4 text-lg font-bold leading-tight text-[#351815]/72">{pillar.text}</p>
          </article>
        ))}
      </section>
    </SiteShell>
  );
}

export function CheckoutPageView({ locale }: { locale: Locale }) {
  const copy = getSiteCopy(locale);

  return (
    <SiteShell current="merch" locale={locale} pathname={getRoute(locale, "checkout")}>
      <section className="mx-auto w-full max-w-none px-4 py-10 sm:px-6 xl:px-8 xl:py-14">
        <SectionTitle as="h1" index="11" text={copy.checkoutPage.intro} title={copy.checkoutPage.title} />
        <div className="mt-10 max-w-4xl border-2 border-[#351815] bg-[#f6eadf] p-5 shadow-[8px_8px_0_#ffb000]">
          <CheckoutForm locale={locale} />
        </div>
      </section>
    </SiteShell>
  );
}
