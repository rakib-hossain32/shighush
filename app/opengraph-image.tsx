import { ImageResponse } from "next/og";

export const alt = "শিঘুষ (shighush) — শিবচরের নাগরিক নথি ও জবাবদিহিতা";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#f7f3e9",
          color: "#10221e",
          display: "flex",
          height: "100%",
          padding: "60px",
          position: "relative",
          width: "100%",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Left Vermillion Brand Accent Bar */}
        <div
          style={{
            background: "#e95132",
            height: "100%",
            marginRight: "44px",
            width: "18px",
            borderRadius: "4px",
            display: "flex",
          }}
        />

        {/* Content Column */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          {/* Top Bar: Authentic SVG Logo + Name */}
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ alignItems: "center", display: "flex" }}>
              {/* Exact Header Vector SVG Logo */}
              <svg
                viewBox="0 0 40 44"
                width="48"
                height="53"
                style={{ marginRight: "16px" }}
              >
                <path d="M3 3h27v28H18L7 41V31H3V3Z" fill="#10221e" />
                <path d="M11 11h12v3H11zm0 7h9v3h-9z" fill="#f7f3e9" />
                <path d="M30 3h7v20h-7z" fill="#e95132" />
              </svg>
              <span
                style={{
                  fontSize: 44,
                  fontWeight: 900,
                  letterSpacing: -2,
                  display: "flex",
                }}
              >
                shighush<span style={{ color: "#e95132" }}>.</span>
              </span>
            </div>

            {/* Region Badge */}
            <div
              style={{
                background: "#10221e",
                color: "#f7f3e9",
                borderRadius: "30px",
                padding: "8px 20px",
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: 2,
                display: "flex",
              }}
            >
              SHIBCHAR / PUBLIC ARCHIVE
            </div>
          </div>

          {/* Middle: Bold Headline & Editorial Context */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                color: "#e95132",
                display: "flex",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              CIVIC REPOSITORY FOR TRANSPARENCY
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 76,
                fontWeight: 900,
                letterSpacing: -2,
                lineHeight: 1.05,
                marginTop: 16,
              }}
            >
              <span>CITIZEN VOICES.</span>
              <span style={{ color: "#e95132" }}>PUBLIC ACCOUNTABILITY.</span>
            </div>

            {/* Trust Signals Row */}
            <div
              style={{
                display: "flex",
                gap: "16px",
                marginTop: "24px",
              }}
            >
              <div
                style={{
                  background: "#ece3ce",
                  border: "1px solid #10221e25",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  fontSize: 16,
                  fontWeight: 700,
                  display: "flex",
                }}
              >
                100% Identity Protected
              </div>
              <div
                style={{
                  background: "#ece3ce",
                  border: "1px solid #10221e25",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  fontSize: 16,
                  fontWeight: 700,
                  display: "flex",
                }}
              >
                Evidence-backed Records
              </div>
              <div
                style={{
                  background: "#ece3ce",
                  border: "1px solid #10221e25",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  fontSize: 16,
                  fontWeight: 700,
                  display: "flex",
                }}
              >
                Shibchar Upazila
              </div>
            </div>
          </div>

          {/* Bottom Border & Mission Line */}
          <div
            style={{
              borderTop: "2px solid #10221e",
              display: "flex",
              fontSize: 20,
              fontWeight: 600,
              justifyContent: "space-between",
              paddingTop: 18,
              width: "100%",
            }}
          >
            <span style={{ color: "#10221e90" }}>
              Privacy-first citizen reporting & accountability platform
            </span>
            <span style={{ color: "#e95132", fontWeight: 800 }}>
              shighush.org
            </span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
