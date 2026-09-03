import { ImageResponse } from "next/og";

export const alt = "SHIGHUSH — Shibchar public record";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#f7f3e9",
        color: "#10221e",
        display: "flex",
        height: "100%",
        padding: "58px",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#e95132",
          height: "100%",
          marginRight: "42px",
          width: "18px",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            display: "flex",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 5,
          }}
        >
          <span
            style={{
              background: "#a9d86e",
              borderRadius: 999,
              display: "flex",
              fontSize: 22,
              height: 52,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 18,
              width: 52,
            }}
          >
            S
          </span>
          SHIGHUSH
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#e95132",
              display: "flex",
              fontSize: 25,
              fontWeight: 700,
              letterSpacing: 5,
            }}
          >
            PUBLIC RECORD / SHIBCHAR
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 80,
              fontWeight: 800,
              letterSpacing: -3,
              marginTop: 18,
            }}
          >
            <span>CITIZEN VOICES.</span>
            <span>PUBLIC ACCOUNTABILITY.</span>
          </div>
        </div>
        <div
          style={{
            borderTop: "2px solid #10221e",
            display: "flex",
            fontSize: 23,
            justifyContent: "space-between",
            paddingTop: 20,
            width: "100%",
          }}
        >
          <span>Privacy-first civic reporting</span>
          <span style={{ color: "#e95132", fontWeight: 700 }}>shighush</span>
        </div>
      </div>
    </div>,
    size,
  );
}
