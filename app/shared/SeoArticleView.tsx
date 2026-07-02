import { StructuredData } from "../../components/StructuredData";
import { PrimaryLink, SectionTitle, SiteShell } from "../../components/site-shell";
import { buildBreadcrumbSchema } from "../../lib/seo";
import { getRoute, type Article, type Locale } from "../../lib/site-content";

export function SeoArticleView({
  article,
  locale,
  pathname
}: {
  article: Article;
  locale: Locale;
  pathname: string;
}) {
  return (
    <SiteShell current="home" locale={locale} pathname={pathname}>
      <StructuredData
        data={buildBreadcrumbSchema([
          { name: "Accueil", url: getRoute(locale, "home") },
          { name: article.h1, url: pathname }
        ])}
      />
      <section className="shell py-10 lg:py-14">
        <SectionTitle as="h1" index="12" text={article.intro} title={article.h1} />
        <div className="mt-10 grid gap-6">
          {article.sections.map((section) => (
            <article className="panel p-6 lg:p-8" key={section.title}>
              <h2 className="font-display text-[clamp(2.2rem,4vw,3.6rem)] uppercase leading-[0.94]">{section.title}</h2>
              <div className="mt-5 space-y-4 text-paper/74">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <PrimaryLink href={getRoute(locale, "runs")}>Voir les prochains runs</PrimaryLink>
          <PrimaryLink href={getRoute(locale, "contact")} secondary>
            Contacter le club
          </PrimaryLink>
        </div>
      </section>
    </SiteShell>
  );
}
