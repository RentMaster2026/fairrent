import { useState, useEffect } from "react";

const CITIES = [
  {
    key: "ottawa",
    name: "Ottawa",
    province: "Ontario",
    url: "https://ottawafairrent.ca",
    desc: "National Capital Region",
    accent: "#2e5c30",
    accentLight: "#86efac",
    bg: "#f0fdf4",
    rule: "#86efac",
    coords: { lat: 45.42, lng: -75.69 },
  },
  {
    key: "toronto",
    name: "Toronto",
    province: "Ontario",
    url: "https://torontofairrent.ca",
    desc: "Greater Toronto Area",
    accent: "#1d3461",
    accentLight: "#c8a951",
    bg: "#eff3fb",
    rule: "#93acd4",
    coords: { lat: 43.65, lng: -79.38 },
  },
  {
    key: "vancouver",
    name: "Vancouver",
    province: "British Columbia",
    url: "https://vancouverfairrent.ca",
    desc: "Greater Vancouver",
    accent: "#1e4d6b",
    accentLight: "#5ba3c9",
    bg: "#eef4f9",
    rule: "#8ab4cc",
    coords: { lat: 49.28, lng: -123.12 },
  },
];

function detectCity(lat, lng) {
  let closest = null;
  let minDist = Infinity;
  for (const city of CITIES) {
    const d = Math.sqrt(
      Math.pow(lat - city.coords.lat, 2) + Math.pow(lng - city.coords.lng, 2)
    );
    if (d < minDist) { minDist = d; closest = city; }
  }
  return closest;
}

export default function App() {
  const [detected, setDetected] = useState(null);
  const [locating, setLocating] = useState(true);
  const [hovered,  setHovered]  = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) { setLocating(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const city = detectCity(pos.coords.latitude, pos.coords.longitude);
        setDetected(city);
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 4000 }
    );
  }, []);

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#ede9df", fontFamily: "'Source Serif 4', serif", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,600&display=swap');

        html, body, #root { width: 100%; margin: 0; padding: 0; }
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .city-card {
          background: #fdfcf8;
          border-radius: 12px;
          border: 2px solid #ddd8cd;
          padding: 28px 24px;
          cursor: pointer;
          transition: all .25s cubic-bezier(.34,1.2,.64,1);
          text-decoration: none;
          display: block;
          position: relative;
          overflow: hidden;
        }
        .city-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,.12);
        }
        .city-card.detected {
          border-width: 2.5px;
          box-shadow: 0 4px 24px rgba(0,0,0,.10);
        }

        .detected-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: #1c1a17; color: #fdfcf8;
          padding: 4px 12px; border-radius: 100px;
          font-family: 'DM Mono', monospace; font-size: 10px;
          letter-spacing: .1em; text-transform: uppercase;
          margin-bottom: 10px;
        }

        .pulse {
          width: 6px; height: 6px; border-radius: 50%;
          background: #86efac;
          animation: pulse 1.8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: .5; transform: scale(1.4); }
        }

        .arrow {
          opacity: 0; transform: translateX(-4px);
          transition: all .2s;
        }
        .city-card:hover .arrow {
          opacity: 1; transform: translateX(0);
        }

        .fade-up {
          opacity: 0; transform: translateY(16px);
          animation: fadeUp .6s ease forwards;
        }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .s1 { animation-delay: .05s; }
        .s2 { animation-delay: .15s; }
        .s3 { animation-delay: .25s; }
        .s4 { animation-delay: .35s; }

        @media (max-width: 640px) {
          .city-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{ background: "#1c1a17", color: "#fdfcf8", borderBottom: "4px solid #2e5c30", width: "100%" }}>
        <div style={{ borderBottom: "1px solid rgba(255,255,255,.1)", padding: "9px 28px", display: "flex", justifyContent: "space-between" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,.35)" }}>
            Canada
          </div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: "rgba(255,255,255,.35)", letterSpacing: ".06em" }}>
            {new Date().toLocaleDateString("en-CA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
        </div>
        <div style={{ padding: "24px 28px 22px", textAlign: "center" }}>
          <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(30px, 6vw, 52px)", fontWeight: 900, lineHeight: 1, letterSpacing: "-.01em" }}>
            Fair Rent Canada
          </div>
          <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15, color: "rgba(255,255,255,.5)", marginTop: 8, fontStyle: "italic" }}>
            A free, anonymous rent transparency tool for Canadian renters
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 780, margin: "0 auto", padding: "40px 20px 72px" }}>

        {/* Headline */}
        <div className="fade-up s1" style={{ textAlign: "center", marginBottom: 36 }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 900, color: "#1c1a17", lineHeight: 1.2, marginBottom: 12 }}>
            Are you paying fair rent?
          </h2>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 15, color: "#7a7060", lineHeight: 1.75, maxWidth: 520, margin: "0 auto" }}>
            Select your city below to instantly compare your rent to real market rates in your neighbourhood. Free, anonymous, no account required.
          </p>
        </div>

        {/* Location banner */}
        {!locating && detected && (
          <div className="fade-up s2" style={{
            background: "#f0fdf4", border: "1.5px solid #86efac",
            borderRadius: 10, padding: "14px 20px", marginBottom: 28,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="pulse" />
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#15803d", marginBottom: 2 }}>
                  Location detected
                </div>
                <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 14, color: "#1c1a17" }}>
                  Looks like you're in <strong>{detected.name}</strong> — jump straight in:
                </div>
              </div>
            </div>
            <a href={detected.url} style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: detected.accent, color: "white",
              padding: "10px 20px", borderRadius: 8,
              fontFamily: "'DM Mono', monospace", fontSize: 12,
              letterSpacing: ".08em", textTransform: "uppercase",
              textDecoration: "none", transition: "opacity .2s",
              flexShrink: 0,
            }}
              onMouseOver={e => e.currentTarget.style.opacity = ".88"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}
            >
              Check {detected.name} →
            </a>
          </div>
        )}

        {/* City cards */}
        <div className={`city-grid fade-up s3`} style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 40,
        }}>
          {CITIES.map((city) => {
            const isDetected = detected?.key === city.key;
            return (
              <a
                key={city.key}
                href={city.url}
                className={`city-card${isDetected ? " detected" : ""}`}
                style={{ borderColor: isDetected ? city.rule : "#ddd8cd" }}
                onMouseEnter={() => setHovered(city.key)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Top accent bar */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 4,
                  background: city.accent, borderRadius: "10px 10px 0 0",
                }} />

                <div style={{ paddingTop: 8 }}>
                  {isDetected && (
                    <div className="detected-pill">
                      <div className="pulse" />
                      Your city
                    </div>
                  )}

                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900, color: "#1c1a17", lineHeight: 1, marginBottom: 4 }}>
                    {city.name}
                  </div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "#7a7060", marginBottom: 16 }}>
                    {city.province}
                  </div>

                  <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: "#555", lineHeight: 1.6, marginBottom: 20 }}>
                    Compare your rent to real market rates across {city.desc} neighbourhoods.
                  </div>

                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    paddingTop: 16, borderTop: "1px solid #ece7dd",
                  }}>
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: city.accent }}>
                      Check my rent
                    </div>
                    <div className="arrow" style={{ color: city.accent, fontSize: 18, fontWeight: 700 }}>→</div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* How it works */}
        <div className="fade-up s4" style={{ background: "#fdfcf8", borderRadius: 12, border: "1px solid #ddd8cd", padding: "28px 28px" }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: ".12em", textTransform: "uppercase", color: "#7a7060", marginBottom: 18 }}>
            How it works
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { n: "1", head: "Enter your details", body: "Select your neighbourhood, unit type, monthly rent, and move-in year." },
              { n: "2", head: "Get your result", body: "See instantly how your rent compares to today's market and when you moved in." },
              { n: "3", head: "Know your rights", body: "Get contextual advice and links to tenant rights resources for your province." },
            ].map(({ n, head, body }) => (
              <div key={n}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: "#ddd8cd", lineHeight: 1, marginBottom: 8 }}>{n}</div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "#1c1a17", marginBottom: 6 }}>{head}</div>
                <div style={{ fontFamily: "'Source Serif 4', serif", fontSize: 13, color: "#7a7060", lineHeight: 1.65 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "0 20px 40px", fontFamily: "'DM Mono', monospace", fontSize: 10, color: "#9ca3af", letterSpacing: ".06em", lineHeight: 1.9 }}>
        Anonymous · No personal data stored · Not legal or financial advice
        <br />© {new Date().getFullYear()} Fair Rent Canada
      </footer>
    </div>
  );
}
