import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CITIES = [
  {
    key: "ottawa", name: "Ottawa", province: "Ontario",
    url: "https://ottawafairrent.ca",
    desc: "35 neighbourhoods · CMHC + community data",
    accent: "#22c55e", accentDim: "#16a34a",
    coords: { lat: 45.42, lng: -75.69 },
    avgRent: "$1,945", unitLabel: "1-bedroom avg",
  },
  {
    key: "toronto", name: "Toronto", province: "Ontario",
    url: "https://torontofairrent.ca",
    desc: "30 neighbourhoods · CMHC + community data",
    accent: "#3b82f6", accentDim: "#2563eb",
    coords: { lat: 43.65, lng: -79.38 },
    avgRent: "$2,183", unitLabel: "1-bedroom avg",
  },
  {
    key: "vancouver", name: "Vancouver", province: "British Columbia",
    url: "https://vancouverfairrent.ca",
    desc: "31 neighbourhoods · CMHC + community data",
    accent: "#06b6d4", accentDim: "#0891b2",
    coords: { lat: 49.28, lng: -123.12 },
    avgRent: "$2,362", unitLabel: "1-bedroom avg",
  },
];

const BLOG_POST = {
  slug: "market-rate",
  date: "March 2026",
  readTime: "6 min read",
  title: "Your Rent Isn\u2019t \u201cMarket Rate.\u201d It\u2019s Whatever the Market Can Get Away With.",
  lede: "People keep saying rent is \u201ccooling\u201d in Canada like that means renters can finally breathe again. That\u2019s not what the data says.",
  stats: [
    { figure: "34%", label: "more paid by recent renters vs long-term tenants (Statistics Canada)" },
    { figure: "52%", label: "gap in Toronto between new and established renters" },
    { figure: "45%", label: "of Canadians very concerned about housing affordability in 2024" },
    { figure: "17", label: "straight months of year-over-year rent declines nationally — yet it still feels brutal" },
  ],
  body: [
    {
      type: "p",
      text: "Yes, average asking rent in Canada has come down a bit. Rentals.ca says the national average asking rent fell to $2,030 in February 2026, marking 17 straight months of year-over-year declines. CMHC also says the purpose-built rental vacancy rate rose to 3.1% in 2025, up from 2.2% in 2024. On paper, that sounds like relief. In real life, it still feels brutal. Because lower than a peak does not mean fair.",
    },
    {
      type: "p",
      text: "In fact, part of the reason rents look "better" is not because housing suddenly became affordable. It is because units got smaller. Rentals.ca reported that the average rental listing size in Canada dropped to 857 square feet in January 2026, down from 943 square feet two years earlier. At the same time, rent per square foot still rose 1.4% year over year. So no, renters are not suddenly getting a great deal. They are often just paying slightly less for less space.",
    },
    {
      type: "pullquote",
      text: "Two people can live in the same city, in similar units, with the same job and same income — and one can be paying massively more just because they had the bad luck of moving later.",
    },
    {
      type: "p",
      text: "And here is the part that should make people angry: the real punishment in Canada's rental market is not just renting. It is having to move. Statistics Canada found that across Canadian cities, recent renters in 2021 were paying 34% more than renters who had been in their home for five years or more. In Toronto, that gap was 52%. In Ottawa, it was 39%. In Vancouver, it was 31%.",
    },
    {
      type: "p",
      text: "Think about that for a second. Two people can live in the same city, in similar units, with the same job and same income, and one can be paying massively more just because they had the bad luck of moving later. That is not transparency. That is not fairness. That is a penalty for not already being inside the system.",
    },
    {
      type: "h2",
      text: "People feel this — even if they don't have policy language for it",
    },
    {
      type: "p",
      text: "Statistics Canada reported that nearly half of Canadians — 45% — were very concerned about housing affordability in 2024. Among young adults aged 20 to 35, that number jumped to 59%. Half of young adults said rising prices affected their moving plans. About one-third of Canadians reported difficulty meeting basic financial needs like housing, food, and transportation. This is not some small niche issue anymore. Housing stress is shaping people's lives, choices, relationships, and futures.",
    },
    {
      type: "p",
      text: "One in three Canadians rents their primary home. But fewer renters are moving than they used to. Statistics Canada says the share of renters who lived at a different address one year earlier fell from 29.5% in 1996 to 19.9% in 2021. That looks like stability until you ask the obvious question: are people staying because they want to, or because moving has become financially reckless? For a lot of people, staying put is not freedom. It is survival.",
    },
    {
      type: "h2",
      text: "The numbers in your city",
    },
    {
      type: "p",
      text: "Even in the biggest cities, where people are told high rent is just \"normal,\" the numbers are hard to ignore. Rentals.ca says that as of January 2026, the average one-bedroom rent was about $1,945 in Ottawa, $2,183 in Toronto, and $2,362 in Vancouver. Statistics Canada's quarterly rent data also showed that in the first quarter of 2025, average asking rent for a two-bedroom apartment was $2,490 in Ottawa, $2,690 in Toronto, and $3,170 in Vancouver. These are not rare luxury prices anymore. These are ordinary market prices. That is exactly the problem.",
    },
    {
      type: "h2",
      text: "Why this matters for Fair Rent Canada",
    },
    {
      type: "p",
      text: "Not because a calculator is going to solve Canada's housing crisis on its own. It won't. But because renters have been expected to make some of the biggest financial decisions of their lives with terrible transparency. Landlords have listings. Platforms have data. Governments publish reports. But renters still end up asking the same question in the dark: am I getting ripped off?",
    },
    {
      type: "p",
      text: "Fair Rent Canada is built around that question. It brings together public data, market data, and renter-submitted information to give people a better read on whether a rent price actually looks fair. Not perfect. Not final. But better than guessing. Better than relying on one listing. Better than being told to just accept whatever the market throws at you.",
    },
    {
      type: "pullquote",
      text: "CMHC says new tenants are still paying more than sitting tenants. So when someone says 'rents are down,' the real response should be: down for who?",
    },
    {
      type: "p",
      text: "CMHC says affordable units are still in high demand even as vacancy rates rise, and that new tenants are still paying more than sitting tenants. So when someone says \"rents are down,\" the real response should be: down for who? Because for a lot of renters — especially anyone who needs to move right now — it still does not feel down at all.",
    },
    {
      type: "p",
      text: "If you have ever found out your neighbour pays hundreds less than you for a similar unit, you already understand why this matters. Check the calculator. Submit your rent. Share it with someone apartment hunting. Because the more renters compare notes, the harder it gets for this market to hide behind averages.",
    },
  ],
  sources: [
    "Statistics Canada, Housing challenges related to affordability, adequacy, condition and discrimination (2024)",
    "Statistics Canada, The Canadian rental conundrum (2025)",
    "Statistics Canada, Quarterly rent statistics (2025)",
    "CMHC, 2025 Rental Market Report",
    "Rentals.ca / Urbanation, National Rent Report (2026)",
    "Rentals.ca city rent pages for Ottawa, Toronto, and Vancouver (January 2026)",
  ],
};

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
      setVal(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);
  return val;
}

function BlogPost({ onClose }) {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Back bar */}
      <div style={{ borderBottom: "1px solid #f1f5f9", padding: "0 20px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#64748b", fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6, padding: 0 }}>
            ← Fair Rent Canada
          </button>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#94a3b8", letterSpacing: ".05em", textTransform: "uppercase" }}>
            {BLOG_POST.date} · {BLOG_POST.readTime}
          </div>
        </div>
      </div>

      <article style={{ maxWidth: 680, margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#22c55e", letterSpacing: ".06em", textTransform: "uppercase", marginBottom: 16 }}>
            Fair Rent Canada · Analysis
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-.03em", lineHeight: 1.2, marginBottom: 20 }}>
            {BLOG_POST.title}
          </h1>
          <p style={{ fontSize: 18, color: "#475569", lineHeight: 1.75, fontStyle: "italic" }}>
            {BLOG_POST.lede}
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 40 }}>
          {BLOG_POST.stats.map(s => (
            <div key={s.figure} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 18px" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 500, color: "#0f172a", lineHeight: 1, marginBottom: 6 }}>{s.figure}</div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.55 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          {BLOG_POST.body.map((block, i) => {
            if (block.type === "p") return (
              <p key={i} style={{ fontSize: 16, color: "#334155", lineHeight: 1.8 }}>{block.text}</p>
            );
            if (block.type === "h2") return (
              <h2 key={i} style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", letterSpacing: "-.02em", marginTop: 14 }}>{block.text}</h2>
            );
            if (block.type === "pullquote") return (
              <blockquote key={i} style={{ margin: 0, padding: "20px 24px", borderLeft: "3px solid #22c55e", background: "#f0fdf4", borderRadius: "0 8px 8px 0" }}>
                <p style={{ fontSize: 17, color: "#166534", lineHeight: 1.7, fontStyle: "italic", fontWeight: 500 }}>{block.text}</p>
              </blockquote>
            );
            return null;
          })}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 48, padding: "28px 26px", background: "#0f172a", borderRadius: 12 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>Check your rent</div>
          <p style={{ fontSize: 15, color: "#e2e8f0", lineHeight: 1.7, marginBottom: 20 }}>
            Find out if your rent is above or below market — free, anonymous, takes 30 seconds.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {CITIES.map(c => (
              <a key={c.key} href={c.url} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 16px", background: c.accent, color: "#0f172a", borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                {c.name} →
              </a>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1px solid #f1f5f9" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: 12 }}>Sources</div>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
            {BLOG_POST.sources.map((s, i) => (
              <li key={i} style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, paddingLeft: 14, position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#cbd5e1" }}>·</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}

export default function App() {
  const [detected,    setDetected]    = useState(null);
  const [locating,    setLocating]    = useState(true);
  const [counts,      setCounts]      = useState({ ottawa: 0, toronto: 0, vancouver: 0 });
  const [countsReady, setCountsReady] = useState(false);
  const [showPost,    setShowPost]    = useState(false);

  const totalCount = useCountUp(countsReady ? Object.values(counts).reduce((a, b) => a + b, 0) : 0);

  useEffect(() => {
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
      pos => { setDetected(detectCity(pos.coords.latitude, pos.coords.longitude)); setLocating(false); },
      () => setLocating(false),
      { timeout: 4000 }
    );
  }, []);

  if (showPost) return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: "#0f172a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        html, body, #root { width: 100%; margin: 0; padding: 0; }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @media (max-width: 580px) { article > div:nth-child(2) { grid-template-columns: 1fr !important; } }
      `}</style>
      <BlogPost onClose={() => { setShowPost(false); window.scrollTo(0, 0); }} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", color: "#0f172a" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
        html, body, #root { width: 100%; margin: 0; padding: 0; }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .city-card { display: block; text-decoration: none; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 12px; padding: 22px 20px; transition: border-color .15s, box-shadow .15s, transform .15s; }
        .city-card:hover { border-color: #cbd5e1; box-shadow: 0 4px 20px rgba(0,0,0,.07); transform: translateY(-2px); }

        .blog-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; cursor: pointer; transition: box-shadow .15s, transform .15s; }
        .blog-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.07); transform: translateY(-2px); }

        .trust-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 20px; }

        .fade-up { opacity: 0; transform: translateY(10px); animation: fadeUp .45s ease forwards; }
        @keyframes fadeUp { to { opacity: 1; transform: none; } }
        .d1 { animation-delay: .04s; } .d2 { animation-delay: .1s; }
        .d3 { animation-delay: .16s; } .d4 { animation-delay: .22s; }
        .d5 { animation-delay: .28s; } .d6 { animation-delay: .34s; }

        .pulse { width: 7px; height: 7px; border-radius: 50%; background: #22c55e; animation: pulse 2s ease-in-out infinite; flex-shrink: 0; }
        @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(1.3); } }

        @media (max-width: 660px) {
          .city-grid  { grid-template-columns: 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .trust-grid { grid-template-columns: 1fr !important; }
          .stat-grid  { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* Header */}
      <header style={{ background: "#0f172a", borderBottom: "1px solid #1e293b" }}>
        <div style={{ maxWidth: 840, margin: "0 auto", padding: "18px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <div style={{ width: 28, height: 28, background: "#22c55e", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#0f172a" }}>FR</span>
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, color: "#fff", letterSpacing: "-.02em" }}>Fair Rent Canada</span>
          </div>
          <p style={{ fontSize: 12, color: "#64748b", marginLeft: 38 }}>
            Free rent calculator for Canadian renters — compare your rent to real market data
          </p>
        </div>
      </header>

      <main style={{ maxWidth: 840, margin: "0 auto", padding: "40px 20px 80px" }}>

        {/* Hero */}
        <div className="fade-up d1" style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: "clamp(26px,5vw,40px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-.03em", lineHeight: 1.15, marginBottom: 14 }}>
            Is your rent fair?
          </h1>
          <p style={{ fontSize: 16, color: "#475569", lineHeight: 1.75, maxWidth: 540, marginBottom: 18 }}>
            Most renters have no idea if they're overpaying. Fair Rent Canada gives you free, anonymous access to neighbourhood-level rent benchmarks across Canada.
          </p>
          {countsReady && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "7px 14px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 100 }}>
              <div className="pulse" />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#475569" }}>
                <strong style={{ color: "#0f172a" }}>{totalCount.toLocaleString()}</strong> anonymous rent submissions across Canada
              </span>
            </div>
          )}
        </div>

        {/* Location banner */}
        {!locating && detected && (
          <div className="fade-up d2" style={{ background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: 10, padding: "13px 18px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className="pulse" />
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#16a34a", letterSpacing: ".05em", textTransform: "uppercase", marginBottom: 2 }}>Location detected</div>
                <div style={{ fontSize: 14, color: "#0f172a" }}>Looks like you're near <strong>{detected.name}</strong></div>
              </div>
            </div>
            <a href={detected.url} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "8px 16px", background: "#0f172a", color: "#fff", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}
              onMouseOver={e => e.currentTarget.style.opacity = ".85"}
              onMouseOut={e => e.currentTarget.style.opacity = "1"}>
              Open {detected.name} →
            </a>
          </div>
        )}

        {/* City cards */}
        <div className="city-grid fade-up d3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 48 }}>
          {CITIES.map(city => {
            const isDetected = detected?.key === city.key;
            return (
              <a key={city.key} href={city.url} className="city-card" style={{ borderColor: isDetected ? city.accent + "55" : "#e2e8f0" }}>
                <div style={{ height: 3, background: city.accent, borderRadius: 3, marginBottom: 16 }} />
                {isDetected && (
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginBottom: 9, padding: "3px 8px", background: city.accent + "18", borderRadius: 100, fontSize: 9, fontWeight: 600, color: city.accentDim, fontFamily: "'JetBrains Mono', monospace", letterSpacing: ".07em", textTransform: "uppercase" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: city.accent }} /> Your city
                  </div>
                )}
                <div style={{ fontSize: 21, fontWeight: 800, color: "#0f172a", letterSpacing: "-.02em", marginBottom: 2 }}>{city.name}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#94a3b8", marginBottom: 12, letterSpacing: ".03em" }}>{city.province}</div>
                <div style={{ padding: "9px 11px", background: "#f8fafc", borderRadius: 7, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#94a3b8" }}>{city.unitLabel}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 500, color: "#0f172a" }}>{city.avgRent}</span>
                </div>
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, marginBottom: 16 }}>{city.desc}</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#94a3b8" }}>
                    {countsReady ? <><strong style={{ color: "#475569" }}>{counts[city.key].toLocaleString()}</strong> submissions</> : "—"}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: city.accentDim }}>Check rent →</div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Featured blog post */}
        <div className="fade-up d4" style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".08em" }}>From the blog</div>
          </div>

          <div className="blog-card" onClick={() => setShowPost(true)}>
            {/* Top accent */}
            <div style={{ height: 3, background: "linear-gradient(to right, #22c55e, #3b82f6, #06b6d4)" }} />

            <div style={{ padding: "26px 26px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".06em" }}>{BLOG_POST.date}</span>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#e2e8f0" }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: ".06em" }}>{BLOG_POST.readTime}</span>
              </div>

              <h2 style={{ fontSize: "clamp(18px,3vw,22px)", fontWeight: 800, color: "#0f172a", letterSpacing: "-.02em", lineHeight: 1.3, marginBottom: 12 }}>
                {BLOG_POST.title}
              </h2>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: 20 }}>
                {BLOG_POST.lede}
              </p>

              {/* Mini stat row */}
              <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 22 }}>
                {BLOG_POST.stats.map(s => (
                  <div key={s.figure} style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 10px" }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 500, color: "#0f172a", lineHeight: 1, marginBottom: 4 }}>{s.figure}</div>
                    <div style={{ fontSize: 10, color: "#94a3b8", lineHeight: 1.4 }}>{s.label.split("(")[0].trim()}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "#22c55e" }}>
                Read the full piece →
              </div>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="fade-up d5" style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "28px 24px", marginBottom: 16 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 22, letterSpacing: "-.01em" }}>How it works</h2>
          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
            {[
              { n: "01", head: "Enter your details", body: "Select your neighbourhood, unit type, rent, and move-in year. No name or email." },
              { n: "02", head: "Get your benchmark", body: "We blend CMHC data with anonymous community submissions from your exact neighbourhood." },
              { n: "03", head: "Know your position", body: "See if you're overpaying, at market, or getting a deal — plus your province's tenant rights." },
            ].map(({ n, head, body }) => (
              <div key={n}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 28, fontWeight: 500, color: "#e2e8f0", lineHeight: 1, marginBottom: 10 }}>{n}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 5 }}>{head}</div>
                <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.65 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust signals */}
        <div className="trust-grid fade-up d6" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[
            { icon: "🔒", head: "Fully anonymous", body: "No account, no email. Your submission is just a number in a pool." },
            { icon: "📊", head: "Real market data", body: "CMHC Rental Market Survey and Rentals.ca monthly reports." },
            { icon: "🧠", head: "Gets smarter", body: "Blends CMHC data with community submissions as they grow." },
            { icon: "⚖️", head: "Tenant-focused", body: "Province-specific rent guideline context with every result." },
          ].map(({ icon, head, body }) => (
            <div key={head} className="trust-card">
              <div style={{ fontSize: 18, marginBottom: 7 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{head}</div>
              <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6 }}>{body}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div style={{ background: "#0f172a", borderRadius: 12, padding: "28px 24px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 12 }}>Why this exists</div>
          <p style={{ fontSize: 15, color: "#e2e8f0", lineHeight: 1.8, marginBottom: 12, maxWidth: 560 }}>
            Rent is the largest expense for most Canadians — but it's nearly impossible to know if what you're paying is actually fair. Landlords have data. Tenants don't.
          </p>
          <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8, maxWidth: 560 }}>
            Fair Rent Canada is free and anonymous. Every submission makes the benchmark more accurate for the next renter.
          </p>
        </div>

      </main>

      <footer style={{ borderTop: "1px solid #e2e8f0", padding: "18px 20px", textAlign: "center" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#94a3b8", letterSpacing: ".04em" }}>
          Anonymous · No personal data stored · Not legal or financial advice · © {new Date().getFullYear()} Fair Rent Canada
        </p>
      </footer>
    </div>
  );
}
