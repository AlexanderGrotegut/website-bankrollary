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
            display: "flex",
            width: "100%",
            padding: "72px 78px",
            alignItems: "center",
            gap: 70,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 560,
              flexDirection: "column",
              alignItems: "flex-start",
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
                margin: "62px 0 0",
                fontSize: 65,
                lineHeight: 1.02,
                letterSpacing: -3,
              }}
            >
              Your Bankroll Diary
            </h1>
            <p
              style={{
                margin: "25px 0 0",
                color: "#9fb8b2",
                fontSize: 27,
                lineHeight: 1.4,
              }}
            >
              Track every session. Understand every result.
            </p>
            <span
              style={{
                marginTop: 54,
                color: "#5de0bd",
                fontSize: 21,
                fontWeight: 700,
              }}
            >
              bankrollary.com
            </span>
          </div>

          <div
            style={{
              display: "flex",
              width: 410,
              height: 420,
              flexDirection: "column",
              padding: 28,
              border: "1px solid #ffffff1f",
              borderRadius: 28,
              background: "#ffffff0d",
              boxShadow: "0 28px 70px #00000045",
            }}
          >
            <span style={{ color: "#9fb8b2", fontSize: 18 }}>
              Bankroll development
            </span>
            <strong style={{ marginTop: 12, fontSize: 42 }}>€4,860.00</strong>
            <span
              style={{
                marginTop: 10,
                color: "#5de0bd",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              +€742.00 this month
            </span>
            <svg
              width="354"
              height="180"
              viewBox="0 0 354 180"
              style={{ marginTop: 38 }}
            >
              <path
                d="M0 155 C50 132 72 148 108 112 S171 129 210 81 S280 94 354 28 L354 180 L0 180Z"
                fill="#0e9f7a"
                opacity="0.18"
              />
              <path
                d="M0 155 C50 132 72 148 108 112 S171 129 210 81 S280 94 354 28"
                fill="none"
                stroke="#35d3a9"
                strokeWidth="7"
                strokeLinecap="round"
              />
            </svg>
            <div
              style={{
                display: "flex",
                marginTop: 22,
                justifyContent: "space-between",
                color: "#9fb8b2",
                fontSize: 16,
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
