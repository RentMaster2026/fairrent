import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CITIES = [
  {
    key: "ottawa",
    name: "Ottawa",
    province: "Ontario",
    url: "https://ottawafairrent.ca",
    desc: "35 neighbourhoods · CMHC + Rentals.ca data",
    accent: "#22c55e",
    accentDim: "#16a34a",
    coords: { lat: 45.42, lng: -75.69 },
  },
  {
    key: "toronto",
    name: "Toronto",
    province: "Ontario",
    url: "https://torontofairrent.ca",
    desc: "30 neighbourhoods · CMHC + Rentals.ca data",
    accent: "#3b82f6",
    accentDim: "#2563eb",
    coords: { lat: 43.65, lng: -79.38 },
  },
  {
    key: "vancouver",
    name: "Vancouver",
    province: "British Columbia",
    url: "https://vancouverfairrent.ca",
    desc: "31 neighbourhoods · CMHC + Rentals.ca data",
    accent: "#06b6d4",
    accentDim: "#0891b2",
    coords: { lat: 49.28, lng: -123.12 },
  },
];

function detectCity(lat, lng) {
  let closest = null, minDist = Infinity;
  for (const city of CITIES) {
    const d = Math.sqrt(Math.pow(lat - city.coords.lat, 2) + Math.pow(lng - city.coords.lng, 2));
    if (d < minDist) { minDist = d; closest = city; }
  }
  return closest;
}

function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  const prev = useRef(0);
  useEffect(() => {
    if (target === 0) return;
    const from = prev.current;
    prev.current = target;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from + (target - from) * e));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val;
}

export default function App() {
  const [detected,    setDetected]    = useState(null);
  const [locating,    setLocating]    = useState(true);
  const [counts,      setCounts]      = useState({ ottawa: 0, toronto: 0, vancouver: 0 });
  const [countsReady, setCountsReady] = useState(false);

  const totalCount = useCountUp(countsReady ? Object.values(counts).reduce((a, b) => a + b, 0) : 0);

  useEffect(() => {
    // Fetch counts for all 3 cities in parallel
    Promise.all(
      CITIES.map(city =>
        supabase
          .from("rent_submissions")
          .select("*", { count: "exact", head: true })
          .eq("city", city.key)
          .then(({ count }) => ({ key: city.key, count: count || 0 }))
      )
    ).then(results => {
      const c = {};
      results.forEach(r => { c[r.key] = r.count; });
      setCounts(c);
      setCountsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) { setLocating(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setDetected(detectCity(pos.coords.latitude, pos.coords.longitude)); setLocating(false); },
      () => setLocating(false),
      { timeout: 4000 }
    );
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: "#0f172a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        html, body, #root { width: 100%; margin: 0; padding: 0; }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .city-card { display: block; text-decoration: none; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 22px 20px; transition: border-color .15s, box-shadow .15s, transform .15s; cursor: pointer; }
        .city-card:hover { border-color: #cbd5e1; box-shadow: 0 4px 20px rgba(0,0,0,.08); transform: translateY(-2px); }
        .city-card.detected { box-shadow: 0 2px 12px rgba(0,0,0,.07); }

        .fade-up { opacity: 0; transform: translateY(12px); animation: fadeUp .5s ease forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: none; } }
        .d1 { animation-delay: .05s; } .d2 { animation-delay: .12s; }
        .d3 { animation-delay: .19s; } .d4 { animation-delay: .26s; }

        .pulse { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; animation: pulse 2s ease-in-out infinite; flex-shrink: 0; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .5; transform: scale(1.3); } }

        @media (max-width: 640px) { .city-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* ── Header ── */}
      <header style={{ background: "#0f172a", borderBottom: "1px solid #1e293b" }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "20px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ width: 30, height: 30, background: "#22c55e", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 800, color: "#0f172a" }}>FR</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-.02em" }}>Fair Rent Canada</span>
          </div>
          <p style={{ fontSize: 13, color: "#64748b", marginLeft: 40 }}>
            Free rent calculator for Canadian renters — see if you're paying a fair price
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 780, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* ── Hero ── */}
        <div className="fade-up d1" style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: "clamp(26px, 5vw, 38px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-.03em", lineHeight: 1.15, marginBottom: 14 }}>
            Is your rent fair?
          </h1>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.7, maxWidth: 540 }}>
            Compare your rent to real market data from CMHC and Rentals.ca. 
            Free, anonymous, no account needed.
          </p>
          {countsReady && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 16, padding: "7px 14px", background: "#f1f5f9", borderRadius: 100 }}>
              <div className="pulse" />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#475569" }}>
                <strong style={{ color: "#0f172a" }}>{totalCount.toLocaleString()}</strong> anonymous submissions across Canada
              </span>
            </div>
          )}
        </div>

        {/* ── Location banner ── */}
        {!locating && detected && (
          <div className="fade-up d2" style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 10, padding: "14px 18px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="pulse" />
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#16a34a", letterSpacing: ".04em", textTransform: "uppercase", marginBottom: 2 }}>Location detected</div>
                <div style={{ fontSize: 14, color: "#0f172a" }}>Looks like you're near <strong>{detected.name}</strong></div>
              </div>
            </div>
            <a href={detected.url} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", background: "#0f172a", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", flexShrink: 0, transition: "opacity .15s" }}
              onMouseOver={e => e.currentTarget.style.opacity = ".85"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}>
              Open {detected.name} Calculator →
            </a>
          </div>
        )}

        {/* ── City cards ── */}
        <div className={`city-grid fade-up d3`} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 48 }}>
          {CITIES.map((city) => {
            const isDetected = detected?.key === city.key;
            const count = counts[city.key];
            return (
              <a key={city.key} href={city.url} className={`city-card${isDetected ? " detected" : ""}`}
                style={{ borderColor: isDetected ? city.accent + "60" : "#e2e8f0" }}>

                {/* Top bar */}
                <div style={{ height: 3, background: city.accent, borderRadius: 3, marginBottom: 16 }} />

                {isDetected && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 8, padding: "3px 8px", background: city.accent + "18", borderRadius: 100, fontSize: 10, fontWeight: 600, color: city.accentDim, fontFamily: "'JetBrains Mono', monospace", letterSpacing: ".06em", textTransform: "uppercase" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: city.accent }} />
                    Your city
                  </div>
                )}

                <div style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: "-.02em", marginBottom: 3 }}>
                  {city.name}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 12, letterSpacing: ".02em" }}>
                  {city.province}
                </div>
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, marginBottom: 16 }}>
                  {city.desc}
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#94a3b8" }}>
                    {countsReady ? <><strong style={{ color: "#475569" }}>{count.toLocaleString()}</strong> submissions</> : "—"}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: city.accentDim }}>
                    Check rent →
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* ── How it works ── */}
        <div className="fade-up d4" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "28px 24px", marginBottom: 24 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 20 }}>How it works</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { n: "01", head: "Enter your details", body: "Select your neighbourhood, unit type, monthly rent, and when you moved in." },
              { n: "02", head: "See your result", body: "Compare your rent to today's market and to what you were paying when you moved in." },
              { n: "03", head: "Understand your rights", body: "Get province-specific context and links to tenant rights resources." },
            ].map(({ n, head, body }) => (
              <div key={n}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 500, color: "#e2e8f0", lineHeight: 1, marginBottom: 10 }}>{n}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{head}</div>
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.65 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Mission ── */}
        <div style={{ background: "#0f172a", borderRadius: 12, padding: "28px 24px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Why this exists</div>
          <p style={{ fontSize: 15, color: "#e2e8f0", lineHeight: 1.75, marginBottom: 16, maxWidth: 560 }}>
            Rent is the largest expense for most Canadians. But it's nearly impossible to know if what you're paying is actually fair.
          </p>
          <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.75, maxWidth: 560 }}>
            Fair Rent Canada gives renters access to the same market data that landlords and property companies already use. Every anonymous submission makes the tool more accurate for everyone.
          </p>
        </div>

      </main>

      <footer style={{ borderTop: "1px solid #e2e8f0", padding: "20px", textAlign: "center" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#94a3b8", letterSpacing: ".04em" }}>
          Anonymous · No personal data stored · Not legal or financial advice · © {new Date().getFullYear()} Fair Rent Canada
        </p>
      </footer>
    </div>
  );
}
