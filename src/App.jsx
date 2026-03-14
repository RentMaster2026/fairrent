import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const CITIES = [
  {
    key: "ottawa",
    name: "Ottawa",
    province: "Ontario",
    url: "https://ottawafairrent.ca",
    accent: "#4ade80",
    accentDim: "#16a34a",
    accentBg: "rgba(74,222,128,0.08)",
    accentBorder: "rgba(74,222,128,0.2)",
    coords: { lat: 45.42, lng: -75.69 },
    avgRent: "$1,945",
    rentRange: "$1,750 – $2,200",
    unitLabel: "1-bedroom avg",
    hoods: 35,
    tag: "Ontario rent control applies",
  },
  {
    key: "toronto",
    name: "Toronto",
    province: "Ontario",
    url: "https://torontofairrent.ca",
    accent: "#60a5fa",
    accentDim: "#2563eb",
    accentBg: "rgba(96,165,250,0.08)",
    accentBorder: "rgba(96,165,250,0.2)",
    coords: { lat: 43.65, lng: -79.38 },
    avgRent: "$2,183",
    rentRange: "$1,950 – $2,450",
    unitLabel: "1-bedroom avg",
    hoods: 30,
    tag: "Ontario rent control applies",
  },
  {
    key: "vancouver",
    name: "Vancouver",
    province: "British Columbia",
    url: "https://vancouverfairrent.ca",
    accent: "#22d3ee",
    accentDim: "#0891b2",
    accentBg: "rgba(34,211,238,0.08)",
    accentBorder: "rgba(34,211,238,0.2)",
    coords: { lat: 49.28, lng: -123.12 },
    avgRent: "$2,362",
    rentRange: "$2,100 – $2,650",
    unitLabel: "1-bedroom avg",
    hoods: 31,
    tag: "BC guideline cap applies",
  },
];

const BLOG_POST = {
  date: "March 2026",
  readTime: "6 min",
  title: "Your Rent Isn't 'Market Rate.' It's Whatever the Market Can Get Away With.",
  lede: "People keep saying rent is 'cooling' in Canada like that means renters can finally breathe again. That's not what the data says.",
  stats: [
    { figure: "34%", label: "more paid by recent renters vs long-term tenants" },
    { figure: "52%", label: "new-vs-established renter gap in Toronto" },
    { figure: "45%", label: "of Canadians very concerned about housing costs" },
    { figure: "17mo", label: "of falling asking rents — yet it still feels brutal" },
  ],
  body: [
    { type: "p", text: "Yes, average asking rent in Canada has come down a bit. Rentals.ca says the national average asking rent fell to $2,030 in February 2026, marking 17 straight months of year-over-year declines. CMHC also says the purpose-built rental vacancy rate rose to 3.1% in 2025, up from 2.2% in 2024. On paper, that sounds like relief. In real life, it still feels brutal. Because lower than a peak does not mean fair." },
    { type: "p", text: "In fact, part of the reason rents look 'better' is not because housing suddenly became affordable. It is because units got smaller. Rentals.ca reported that the average rental listing size in Canada dropped to 857 square feet in January 2026, down from 943 square feet two years earlier. At the same time, rent per square foot still rose 1.4% year over year. So no, renters are not suddenly getting a great deal. They are often just paying slightly less for less space." },
    { type: "pullquote", text: "Two people can live in the same city, in similar units, with the same job and same income — and one can be paying massively more just because they had the bad luck of moving later." },
    { type: "p", text: "And here is the part that should make people angry: the real punishment in Canada's rental market is not just renting. It is having to move. Statistics Canada found that across Canadian cities, recent renters in 2021 were paying 34% more than renters who had been in their home for five years or more. In Toronto, that gap was 52%. In Ottawa, it was 39%. In Vancouver, it was 31%." },
    { type: "p", text: "Think about that for a second. Two people can live in the same city, in similar units, with the same job and same income, and one can be paying massively more just because they had the bad luck of moving later. That is not transparency. That is not fairness. That is a penalty for not already being inside the system." },
    { type: "h2", text: "People feel this — even without policy language for it" },
    { type: "p", text: "Statistics Canada reported that nearly half of Canadians — 45% — were very concerned about housing affordability in 2024. Among young adults aged 20 to 35, that number jumped to 59%. Half of young adults said rising prices affected their moving plans. About one-third of Canadians reported difficulty meeting basic financial needs like housing, food, and transportation." },
    { type: "p", text: "One in three Canadians rents their primary home. But fewer renters are moving than they used to. Statistics Canada says the share of renters who lived at a different address one year earlier fell from 29.5% in 1996 to 19.9% in 2021. That looks like stability until you ask the obvious question: are people staying because they want to, or because moving has become financially reckless? For a lot of people, staying put is not freedom. It is survival." },
    { type: "h2", text: "The numbers in your city" },
    { type: "p", text: "Even in the biggest cities, where people are told high rent is just 'normal,' the numbers are hard to ignore. Rentals.ca says that as of January 2026, the average one-bedroom rent was about $1,945 in Ottawa, $2,183 in Toronto, and $2,362 in Vancouver. Statistics Canada's quarterly data showed that in Q1 2025, average asking rent for a two-bedroom was $2,490 in Ottawa, $2,690 in Toronto, and $3,170 in Vancouver. These are not rare luxury prices. These are ordinary market prices. That is exactly the problem." },
    { type: "h2", text: "Why this matters" },
    { type: "p", text: "Not because a calculator is going to solve Canada's housing crisis on its own. It won't. But because renters have been expected to make some of the biggest financial decisions of their lives with terrible transparency. Landlords have listings. Platforms have data. Governments publish reports. But renters still end up asking the same question in the dark: am I getting ripped off?" },
    { type: "p", text: "Fair Rent Canada is built around that question. It brings together public data, market data, and renter-submitted information to give people a better read on whether a rent price actually looks fair. Not perfect. Not final. But better than guessing." },
    { type: "pullquote", text: "When someone says 'rents are down,' the real response should be: down for who? Because for a lot of renters — especially anyone who needs to move right now — it still does not feel down at all." },
    { type: "p", text: "If you have ever found out your neighbour pays hundreds less than you for a similar unit, you already understand why this matters. Check the calculator. Submit your rent. Share it with someone apartment hunting. Because the more renters compare notes, the harder it gets for this market to hide behind averages." },
  ],
  sources: [
    "Statistics Canada, Housing challenges related to affordability (2024)",
    "Statistics Canada, The Canadian rental conundrum (2025)",
    "Statistics Canada, Quarterly rent statistics (2025)",
    "CMHC, 2025 Rental Market Report",
    "Rentals.ca / Urbanation, National Rent Report (2026)",
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectCity(lat, lng) {
  let closest = null, minDist = Infinity;
  for (const c of CITIES) {
    const d = Math.hypot(lat - c.coords.lat, lng - c.coords.lng);
    if (d < minDist) { minDist = d; closest = c; }
  }
  return closest;
}

function useCountUp(target, dur = 1200) {
  const [val, set] = useState(0);
  const raf = useRef(null);
  const prev = useRef(0);
  useEffect(() => {
    if (!target) return;
    const from = prev.current;
    prev.current = target;
    let t0 = null;
    const tick = ts => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      set(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);
  return val;
}

// ─── Blog article view ────────────────────────────────────────────────────────

function Article({ onClose }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={{ minHeight: "100vh", background: "#080c14", color: "#e2e8f0", fontFamily: "var(--font-body)" }}>

      {/* Back bar */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontFamily: "var(--font-mono)", fontSize: 12, display: "flex", alignItems: "center", gap: 8, padding: 0, letterSpacing: ".04em" }}>
            ← FAIR RENT CANADA
          </button>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#334155", letterSpacing: ".06em" }}>
            {BLOG_POST.date} · {BLOG_POST.readTime} read
          </span>
        </div>
      </div>

      <article style={{ maxWidth: 680, margin: "0 auto", padding: "56px 24px 96px" }}>

        {/* Eyebrow */}
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#4ade80", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 20 }}>
          Analysis · Fair Rent Canada
        </div>

        {/* Title */}
        <h1 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 700, lineHeight: 1.18, letterSpacing: "-.03em", color: "#f1f5f9", marginBottom: 24, fontFamily: "var(--font-display)" }}>
          {BLOG_POST.title}
        </h1>

        {/* Lede */}
        <p style={{ fontSize: 18, color: "#94a3b8", lineHeight: 1.75, marginBottom: 40, fontStyle: "italic" }}>
          {BLOG_POST.lede}
        </p>

        {/* Stat grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 48 }}>
          {BLOG_POST.stats.map(s => (
            <div key={s.figure} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "18px 20px" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 30, fontWeight: 500, color: "#f1f5f9", lineHeight: 1, marginBottom: 8 }}>{s.figure}</div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {BLOG_POST.body.map((block, i) => {
            if (block.type === "p") return (
              <p key={i} style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.85 }}>{block.text}</p>
            );
            if (block.type === "h2") return (
              <h2 key={i} style={{ fontSize: 22, fontWeight: 700, color: "#e2e8f0", letterSpacing: "-.02em", marginTop: 16, fontFamily: "var(--font-display)" }}>{block.text}</h2>
            );
            if (block.type === "pullquote") return (
              <blockquote key={i} style={{ margin: 0, padding: "20px 24px", borderLeft: "3px solid #4ade80", background: "rgba(74,222,128,0.05)", borderRadius: "0 8px 8px 0" }}>
                <p style={{ fontSize: 17, color: "#cbd5e1", lineHeight: 1.7, fontStyle: "italic", fontWeight: 500 }}>{block.text}</p>
              </blockquote>
            );
            return null;
          })}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 56, padding: "32px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#4ade80", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 12 }}>Check your rent</div>
          <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.7, marginBottom: 24 }}>
            Find out where your rent sits — free, anonymous, takes 30 seconds.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {CITIES.map(c => (
              <a key={c.key} href={c.url} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", background: c.accentBg, border: `1px solid ${c.accentBorder}`, color: c.accent, borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-mono)", letterSpacing: ".03em", transition: "opacity .15s" }}
                onMouseOver={e => e.currentTarget.style.opacity = ".75"}
                onMouseOut={e => e.currentTarget.style.opacity = "1"}>
                {c.name} →
              </a>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div style={{ marginTop: 48, paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#334155", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 14 }}>Sources</div>
          {BLOG_POST.sources.map((s, i) => (
            <div key={i} style={{ fontSize: 12, color: "#334155", lineHeight: 1.6, paddingLeft: 14, position: "relative", marginBottom: 4 }}>
              <span style={{ position: "absolute", left: 0, color: "#1e293b" }}>·</span>{s}
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

// ─── Main hub ─────────────────────────────────────────────────────────────────

export default function App() {
  const [detected,    setDetected]    = useState(null);
  const [locating,    setLocating]    = useState(true);
  const [counts,      setCounts]      = useState({ ottawa: 0, toronto: 0, vancouver: 0 });
  const [countsReady, setCountsReady] = useState(false);
  const [showPost,    setShowPost]    = useState(false);

  const total      = countsReady ? Object.values(counts).reduce((a, b) => a + b, 0) : 0;
  const displayNum = useCountUp(total);

  useEffect(() => {
    Promise.all(
      CITIES.map(c =>
        supabase.from("rent_submissions")
          .select("*", { count: "exact", head: true })
          .eq("city", c.key)
          .then(({ count }) => ({ key: c.key, count: count || 0 }))
      )
    ).then(res => {
      const m = {};
      res.forEach(r => { m[r.key] = r.count; });
      setCounts(m);
      setCountsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) { setLocating(false); return; }
    navigator.geolocation.getCurrentPosition(
      pos => { setDetected(detectCity(pos.coords.latitude, pos.coords.longitude)); setLocating(false); },
      () => setLocating(false),
      { timeout: 4000 }
    );
  }, []);

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&family=DM+Sans:wght@400;500;600;700&display=swap');

    :root {
      --font-display: 'DM Serif Display', Georgia, serif;
      --font-body: 'DM Sans', -apple-system, sans-serif;
      --font-mono: 'DM Mono', 'Courier New', monospace;
      --bg: #080c14;
      --bg-card: #0d1220;
      --bg-card-hover: #111827;
      --border: rgba(255,255,255,0.07);
      --border-hover: rgba(255,255,255,0.14);
      --text-primary: #f1f5f9;
      --text-secondary: #94a3b8;
      --text-muted: #475569;
      --green: #4ade80;
    }

    html, body, #root { margin: 0; padding: 0; width: 100%; background: var(--bg); }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .city-card {
      display: block; text-decoration: none;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 26px 22px;
      transition: border-color .2s, background .2s, transform .2s;
      position: relative; overflow: hidden;
    }
    .city-card:hover {
      border-color: var(--border-hover);
      background: var(--bg-card-hover);
      transform: translateY(-3px);
    }

    .blog-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      overflow: hidden;
      cursor: pointer;
      transition: border-color .2s, background .2s, transform .2s;
    }
    .blog-card:hover {
      border-color: var(--border-hover);
      background: var(--bg-card-hover);
      transform: translateY(-2px);
    }

    .trust-pill {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 5px 12px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 100px;
      font-family: var(--font-mono);
      font-size: 11px; color: var(--text-muted);
      letter-spacing: .04em;
    }

    .btn-city {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 9px 18px;
      border-radius: 8px;
      font-family: var(--font-mono);
      font-size: 12px; font-weight: 500;
      text-decoration: none;
      letter-spacing: .04em;
      border: 1px solid;
      transition: opacity .15s;
    }
    .btn-city:hover { opacity: .75; }

    .fade-up { opacity: 0; transform: translateY(14px); animation: fu .5s ease forwards; }
    @keyframes fu { to { opacity: 1; transform: none; } }
    .d1{animation-delay:.05s} .d2{animation-delay:.12s} .d3{animation-delay:.19s}
    .d4{animation-delay:.26s} .d5{animation-delay:.33s} .d6{animation-delay:.40s}

    .live-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--green);
      animation: blink 2.2s ease-in-out infinite;
      flex-shrink: 0;
    }
    @keyframes blink { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.4)} }

    .noise-overlay {
      position: fixed; inset: 0; pointer-events: none; z-index: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
      opacity: .022;
    }

    @media(max-width:680px){
      .city-grid { grid-template-columns: 1fr !important; }
      .stat-row  { grid-template-columns: 1fr 1fr !important; }
      .step-row  { grid-template-columns: 1fr !important; }
      .trust-row { grid-template-columns: 1fr !important; }
    }
  `;

  if (showPost) return (
    <>
      <style>{CSS}</style>
      <Article onClose={() => { setShowPost(false); window.scrollTo(0, 0); }} />
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="noise-overlay" />

      <div style={{ minHeight: "100vh", position: "relative", zIndex: 1 }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header style={{ borderBottom: "1px solid var(--border)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100, background: "rgba(8,12,20,0.9)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 30, height: 30, background: "var(--green)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#080c14", fontFamily: "var(--font-mono)", letterSpacing: "-.02em" }}>FR</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", fontFamily: "var(--font-body)", letterSpacing: "-.01em" }}>Fair Rent Canada</span>
            </div>
            {countsReady && (
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div className="live-dot" />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: ".04em" }}>
                  {displayNum.toLocaleString()} submissions
                </span>
              </div>
            )}
          </div>
        </header>

        <main style={{ maxWidth: 900, margin: "0 auto", padding: "64px 24px 100px" }}>

          {/* ── Hero ─────────────────────────────────────────────────────── */}
          <div className="fade-up d1" style={{ marginBottom: 56 }}>

            {/* Eyebrow */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
              <div className="live-dot" />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: ".07em", textTransform: "uppercase" }}>
                Canadian Rent Transparency Tool
              </span>
            </div>

            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(38px,6vw,68px)", fontWeight: 400, color: "var(--text-primary)", lineHeight: 1.08, letterSpacing: "-.02em", marginBottom: 24, maxWidth: 700 }}>
              Know if your rent<br />
              <span style={{ color: "var(--green)", fontStyle: "italic" }}>is actually fair.</span>
            </h1>

            <p style={{ fontSize: 17, color: "var(--text-secondary)", lineHeight: 1.75, maxWidth: 520, marginBottom: 32 }}>
              Free, anonymous rent benchmarks built from public housing data and renter submissions.
              No account. No guessing.
            </p>

            {/* Trust pills */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["CMHC data", "Rentals.ca data", "Anonymous submissions", "No account needed"].map(t => (
                <span key={t} className="trust-pill">{t}</span>
              ))}
            </div>
          </div>

          {/* ── Location banner ──────────────────────────────────────────── */}
          {!locating && detected && (
            <div className="fade-up d2" style={{ background: detected.accentBg, border: `1px solid ${detected.accentBorder}`, borderRadius: 12, padding: "16px 20px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: detected.accent, letterSpacing: ".08em", textTransform: "uppercase", marginBottom: 4 }}>Location detected</div>
                <div style={{ fontSize: 14, color: "var(--text-primary)" }}>Looks like you're near <strong>{detected.name}</strong></div>
              </div>
              <a href={detected.url} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", background: detected.accentBg, border: `1px solid ${detected.accentBorder}`, color: detected.accent, borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-mono)", letterSpacing: ".03em", transition: "opacity .15s" }}
            onMouseOver={e => e.currentTarget.style.opacity = ".75"}
            onMouseOut={e => e.currentTarget.style.opacity = "1"}>
                Check {detected.name} →
              </a>
            </div>
          )}

          {/* ── City cards ───────────────────────────────────────────────── */}
          <div className="city-grid fade-up d3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 56 }}>
            {CITIES.map(c => {
              const isDetected = detected?.key === c.key;
              return (
                <a key={c.key} href={c.url} className="city-card" style={{ borderColor: isDetected ? c.accentBorder : "var(--border)" }}>

                  {/* Top accent line */}
                  <div style={{ height: 2, background: c.accent, borderRadius: 2, marginBottom: 22, opacity: isDetected ? 1 : 0.4 }} />

                  {/* Detected badge */}
                  {isDetected && (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 10, padding: "3px 9px", background: c.accentBg, border: `1px solid ${c.accentBorder}`, borderRadius: 100, fontFamily: "var(--font-mono)", fontSize: 9, color: c.accent, letterSpacing: ".08em", textTransform: "uppercase" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: c.accent }} /> Near you
                    </div>
                  )}

                  {/* City name */}
                  <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-.02em", marginBottom: 2, fontFamily: "var(--font-body)" }}>{c.name}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", marginBottom: 18, letterSpacing: ".04em" }}>{c.province}</div>

                  {/* Rent range */}
                  <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, padding: "12px 14px", marginBottom: 16 }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 6 }}>{c.unitLabel}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 18, fontWeight: 500, color: "var(--text-primary)", letterSpacing: "-.01em" }}>{c.avgRent}</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", marginTop: 3 }}>range {c.rentRange}</div>
                  </div>

                  {/* Meta */}
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.5 }}>
                    {c.hoods} neighbourhoods · {c.tag}
                  </div>

                  {/* Footer */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)" }}>
                      {countsReady ? <><strong style={{ color: "#64748b" }}>{counts[c.key].toLocaleString()}</strong> submissions</> : "—"}
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 500, color: c.accent, letterSpacing: ".03em" }}>Check →</div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* ── How the estimate works ───────────────────────────────────── */}
          <div className="fade-up d4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 14, padding: "32px 28px", marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 24 }}>How the estimate is built</div>
            <div className="step-row" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 28 }}>
              {[
                { n: "01", head: "Public baseline", body: "We start with CMHC Rental Market Survey data and Rentals.ca monthly reports, adjusted for neighbourhood and unit type." },
                { n: "02", head: "Community layer", body: "Anonymous renter submissions from your exact neighbourhood are blended in as they accumulate. More submissions means higher confidence." },
                { n: "03", head: "Confidence score", body: "The result shows a rent range, not a single number. The confidence level tells you how much data sits behind the estimate." },
              ].map(({ n, head, body }) => (
                <div key={n}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 28, fontWeight: 500, color: "rgba(255,255,255,0.06)", lineHeight: 1, marginBottom: 14 }}>{n}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-.01em" }}>{head}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>{body}</div>
                </div>
              ))}
            </div>

            {/* Methodology note */}
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>
                <strong style={{ color: "#475569" }}>Honest about uncertainty:</strong> rent benchmarks are estimates, not facts. Building age, condition, included utilities, and parking all affect fair value. This tool gives you a starting point for a more informed conversation — not a definitive answer.
              </p>
            </div>
          </div>

          {/* ── Trust signals ────────────────────────────────────────────── */}
          <div className="trust-row fade-up d5" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 20 }}>
            {[
              { head: "Fully anonymous", body: "No account, no email, no IP stored. Your submission is a number added to a pool — nothing more." },
              { head: "No fake precision", body: "Results show a range and a confidence level, not a single invented number. We tell you what we know and what we don't." },
              { head: "Sourced, not made up", body: "Benchmarks come from CMHC's annual survey and Rentals.ca's monthly national report. Sources are listed with every result." },
              { head: "Your rights, included", body: "Every result links to province-specific tenant rights and rent guideline information relevant to your situation." },
            ].map(({ head, body }) => (
              <div key={head} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "20px 22px" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 7, letterSpacing: "-.01em" }}>{head}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7 }}>{body}</div>
              </div>
            ))}
          </div>

          {/* ── Featured blog post ───────────────────────────────────────── */}
          <div className="fade-up d6" style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 14 }}>From the blog</div>

            <div className="blog-card" onClick={() => setShowPost(true)} role="button" tabIndex={0} onKeyDown={e => e.key === "Enter" && setShowPost(true)}>
              <div style={{ height: 2, background: "linear-gradient(to right, #4ade80, #60a5fa, #22d3ee)" }} />
              <div style={{ padding: "28px 28px 26px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: ".06em" }}>{BLOG_POST.date}</span>
                  <span style={{ width: 3, height: 3, borderRadius: "50%", background: "var(--border-hover)", display: "inline-block" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-muted)", letterSpacing: ".06em" }}>{BLOG_POST.readTime} read</span>
                </div>

                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 400, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: 12 }}>
                  {BLOG_POST.title}
                </h2>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 24 }}>
                  {BLOG_POST.lede}
                </p>

                {/* Mini stats */}
                <div className="stat-row" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 24 }}>
                  {BLOG_POST.stats.map(s => (
                    <div key={s.figure} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "12px 10px" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 20, fontWeight: 500, color: "var(--text-primary)", lineHeight: 1, marginBottom: 5 }}>{s.figure}</div>
                      <div style={{ fontSize: 10, color: "var(--text-muted)", lineHeight: 1.4 }}>{s.label.split("(")[0].trim()}</div>
                    </div>
                  ))}
                </div>

                <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "#4ade80", letterSpacing: ".04em" }}>
                  Read the full piece →
                </div>
              </div>
            </div>
          </div>

          {/* ── Mission ──────────────────────────────────────────────────── */}
          <div style={{ background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.12)", borderRadius: 14, padding: "32px 28px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#4ade80", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>Why this exists</div>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.85, maxWidth: 560, marginBottom: 16 }}>
              Rent is the largest expense for most Canadians — but it's nearly impossible to know if what you're paying is actually fair. Landlords have listings. Platforms have data. Governments publish reports. Renters have almost none of it.
            </p>
            <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8, maxWidth: 540 }}>
              Fair Rent Canada gives renters access to the same neighbourhood-level benchmarks the industry already uses. Every anonymous submission improves the estimate for the next renter.
            </p>
          </div>

        </main>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer style={{ borderTop: "1px solid var(--border)", padding: "24px", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "#1e293b", letterSpacing: ".06em" }}>
            Anonymous · No personal data stored · Not legal or financial advice · © {new Date().getFullYear()} Fair Rent Canada
          </p>
        </footer>

      </div>
    </>
  );
}
