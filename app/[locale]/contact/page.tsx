import type { Metadata } from "next";
import Link from "next/link";
import { StructuredData } from "../../../components/StructuredData";
import { ContactMailForm } from "../../../components/contact-mail-form";
import { SectionTitle, SiteShell } from "../../../components/site-shell";
import { resolveLocale } from "../../../lib/locale";
import { buildBreadcrumbSchema, buildPageMetadata } from "../../../lib/seo";
import { getRoute, getSiteCopy } from "../../../lib/site-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);
  return buildPageMetadata({
    locale,
    routeKey: "contact",
    title: copy.meta.contact.title,
    description: copy.meta.contact.description
  });
}

export default async function ContactPage({ params }: PageProps) {
  const locale = resolveLocale((await params).locale);
  const copy = getSiteCopy(locale);

  return (
    <SiteShell current="contact" locale={locale} pathname={getRoute(locale, "contact")}>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Accueil", url: getRoute(locale, "home") },
          { name: "Contact", url: getRoute(locale, "contact") }
        ])}
      />
      <section className="mx-auto w-full max-w-none px-4 py-10 sm:px-6 xl:px-8 xl:py-14">
        <SectionTitle as="h1" index="09" text={copy.contactPage.intro} title={copy.contactPage.title} />
        <div className="mt-10 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            {copy.contactPage.channels.map((channel, index) => (
              <Link
                className={`${index === 1 ? "bg-[#ffb000]" : index === 2 ? "bg-[#351815] text-[#f6eadf]" : "bg-[#d96ab4]"} group border-2 border-[#351815] p-6 transition hover:-translate-y-1 hover:shadow-[8px_8px_0_#ffb000]`}
                href={channel.href}
                key={channel.title}
              >
                <p className="font-mono text-xs font-black uppercase opacity-70">{channel.title}</p>
                <h2 className="mt-4 font-display text-[clamp(1.9rem,3.5vw,3rem)] uppercase leading-[0.96]">{channel.value}</h2>
                <p className="mt-4 text-lg font-bold leading-tight opacity-75">{channel.text}</p>
              </Link>
            ))}
          </div>
          <ContactMailForm />
        </div>
      </section>
    </SiteShell>
  );
}
