import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NULLL.CLUB, social sport club à Aix-en-Provence";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

/**
 * Apercu affiche quand un lien nulll.club est partage (WhatsApp, iMessage,
 * reseaux). Il portait un « N » tape en texte sur un degrade : on y met le
 * vrai mot-logo, sur les aplats de la palette du club.
 */
export default async function OpenGraphImage() {
  const logo = await fetch(new URL("../public/assets/nulll-new/logo-cream.png", import.meta.url)).then((reponse) => reponse.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#773331",
          color: "#F1EDE9"
        }}
      >
        <div style={{ display: "flex", flex: 1, flexDirection: "column", justifyContent: "space-between", padding: "64px 72px 48px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <img alt="NULLL.CLUB" height={70} src={logo as unknown as string} width={548} />
            <div
              style={{
                display: "flex",
                border: "3px solid #EBA0CD",
                color: "#EBA0CD",
                padding: "8px 16px",
                fontSize: "22px",
                letterSpacing: "0.12em",
                textTransform: "uppercase"
              }}
            >
              Aix-en-Provence
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", fontSize: "84px", fontWeight: 800, lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
              Social sport club.
            </div>
            <div style={{ display: "flex", fontSize: "34px", color: "#FFB200", fontWeight: 700 }}>
              On vient pour courir. On revient pour les gens.
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#FFB200",
            color: "#773331",
            padding: "20px 72px",
            fontSize: "26px",
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase"
          }}
        >
          <span>Tous les samedis · 8h30</span>
          <span>Ouvert à tous · Gratuit</span>
        </div>
      </div>
    ),
    size
  );
}
