import { ImageResponse } from "next/og";

export const alt = "Bankrollary – Your Bankroll Diary";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          color: "#f5fffc",
          background:
            "radial-gradient(circle at 80% 15%, #174e43 0%, transparent 34%), linear-gradient(145deg, #071714 0%, #0b2520 100%)",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 420,
            height: 420,
            right: -100,
            bottom: -180,
            borderRadius: 999,
            background: "#0e9f7a",
            opacity: 0.12,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 280,
            height: 280,
            left: -80,
            top: -100,
            borderRadius: 999,
            background: "#0e9f7a",
            opacity: 0.08,
          }}
        />

        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            padding: "60px 80px",
            alignItems: "center",
            justifyContent: "center",
            gap: 60,
          }}
        >
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div
                style={{
                  display: "flex",
                  width: 64,
                  height: 64,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 18,
                  color: "white",
                  background: "#0e9f7a",
                  fontSize: 38,
                  fontWeight: 700,
                }}
              >
                B
              </div>
              <span style={{ fontSize: 32, fontWeight: 700 }}>Bankrollary</span>
            </div>
            <h1
              style={{
                margin: "42px 0 0",
                fontSize: 68,
                lineHeight: 1.02,
                letterSpacing: -3,
                textAlign: "center",
              }}
            >
              Your Bankroll Diary
            </h1>
            <p
              style={{
                margin: "24px 0 0",
                color: "#9fb8b2",
                fontSize: 27,
                lineHeight: 1.4,
                textAlign: "center",
              }}
            >
              Track every session. Understand every result.
            </p>
            <span
              style={{
                marginTop: 42,
                color: "#5de0bd",
                fontSize: 21,
                fontWeight: 700,
              }}
            >
              www.bankrollary.com
            </span>
          </div>

          <div
            style={{
              display: "flex",
              width: 340,
              flexDirection: "column",
              padding: 24,
              border: "1px solid #ffffff1f",
              borderRadius: 24,
              background: "#ffffff0d",
              boxShadow: "0 28px 70px #00000045",
            }}
          >
            <span style={{ color: "#9fb8b2", fontSize: 16 }}>
              Bankroll development
            </span>
            <strong style={{ marginTop: 10, fontSize: 36 }}>€4,860.00</strong>
            <span
              style={{
                marginTop: 8,
                color: "#5de0bd",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              +€742.00 this month
            </span>
            <svg
              width="292"
              height="140"
              viewBox="0 0 292 140"
              style={{ marginTop: 28 }}
            >
              <path
                d="M0 120 C40 102 58 115 88 86 S140 100 172 62 S230 73 292 20 L292 140 L0 140Z"
                fill="#0e9f7a"
                opacity="0.18"
              />
              <path
                d="M0 120 C40 102 58 115 88 86 S140 100 172 62 S230 73 292 20"
                fill="none"
                stroke="#35d3a9"
                strokeWidth="6"
                strokeLinecap="round"
              />
            </svg>
            <div
              style={{
                display: "flex",
                marginTop: 16,
                justifyContent: "space-between",
                color: "#9fb8b2",
                fontSize: 14,
              }}
            >
              <span>ROI +18.4%</span>
              <span>28 sessions</span>
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
