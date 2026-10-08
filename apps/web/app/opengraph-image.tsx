import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Fomobot — WhatsApp bots, automation & messaging API"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default async function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: 80,
          background:
            "linear-gradient(180deg, #0ea5e9 0%, #38bdf8 55%, #bae6fd 100%)",
          color: "#0c4a6e",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            left: 80,
            fontSize: 24,
            fontWeight: 700,
            color: "#0c4a6e",
          }}
        >
          Fomobot
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2 }}>
          WhatsApp bots,
        </div>
        <div
          style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, color: "rgba(12,74,110,0.55)" }}
        >
          minus the plumbing.
        </div>
        <div style={{ marginTop: 28, fontSize: 26, color: "rgba(12,74,110,0.8)", maxWidth: 800 }}>
          Connect a WhatsApp number. Get a real API, webhooks and automations.
        </div>
      </div>
    ),
    size
  )
}
