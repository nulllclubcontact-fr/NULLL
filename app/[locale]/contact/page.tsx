import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle, SiteShell } from "../../../components/site-shell";
import { resolveLocale } from "../../../lib/locale";
import { buildPageMetadata } from "../../../lib/seo";
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
      <section className="shell py-10 lg:py-14">
        <SectionTitle as="h1" index="09" text={copy.contactPage.intro} title={copy.contactPage.title} />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {copy.contactPage.channels.map((channel) => (
            <Link className="panel p-6 transition hover:border-[rgba(255,107,71,0.4)]" href={channel.href} key={channel.title}>
              <p className="text-sm uppercase tracking-[0.18em] text-accent">{channel.title}</p>
              <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3rem)] uppercase leading-[0.92]">{channel.value}</h2>
              <p className="mt-4 text-paper/72">{channel.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
