import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NULLL.CLUB";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background: "linear-gradient(140deg, #23100F 0%, #3A1A18 100%)",
          color: "#F1EDE9"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                border: "2px solid #F1EDE9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "42px"
              }}
            >
              N
            </div>
            <div style={{ fontSize: "28px", textTransform: "uppercase", letterSpacing: "0.1em" }}>NULLL.CLUB</div>
          </div>
          <div style={{ color: "#E06CB2", fontSize: "22px", textTransform: "uppercase" }}>Aix-en-Provence</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ fontSize: "78px", lineHeight: 0.9, textTransform: "uppercase", maxWidth: "900px" }}>
            Social sport club à Aix-en-Provence.
          </div>
          <div style={{ fontSize: "30px", color: "rgba(244,240,232,0.74)", maxWidth: "840px" }}>
            Prochains runs, communauté locale et rendez-vous pour sortir de la bulle.
          </div>
        </div>
      </div>
    ),
    size
  );
}
