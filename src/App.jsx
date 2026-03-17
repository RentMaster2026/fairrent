import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import MethodologyPage from "./MethodologyPage";
import { AboutPage, PrivacyPage, TermsPage, FaqPage, ContactPage } from "./TrustPages";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CITIES = [
  { key:"ottawa",    name:"Ottawa",    url:"https://ottawafairrent.ca",    accent:"#16a34a", province:"Ontario",          desc:"2,800+ verified submissions" },
  { key:"toronto",   name:"Toronto",   url:"https://torontofairrent.ca",   accent:"#2563eb", province:"Ontario",          desc:"7,100+ verified submissions" },
  { key:"vancouver", name:"Vancouver", url:"https://vancouverfairrent.ca", accent:"#0891b2", province:"British Columbia", desc:"4,800+ verified submissions" },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
  :root {
    --serif: 'Instrument Serif', Georgia, serif;
    --sans:  'Geist', -apple-system, sans-serif;
    --mono:  'Geist Mono', 'Courier New', monospace;
    --bg: #f9fafb; --bg-card: #fff;
    --border: #e2e8f0; --border-mid: #cbd5e1;
    --t1: #0f172a; --t2: #475569; --t3: #94a3b8;
    --nav: #0f172a;
    --r-sm: 6px; --r-md: 10px; --r-lg: 14px;
    --sh: 0 1px 4px rgba(0,0,0,.06);
  }
  html, body, #root { margin:0; padding:0; width:100%; background:var(--bg); }
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:var(--sans); color:var(--t1); -webkit-font-smoothing:antialiased; }
  a { color:inherit; }
  button { font-family:var(--sans); cursor:pointer; }
  .nav-link { background:none; border:none; font-family:var(--mono); font-size:11px; color:rgba(255,255,255,.4); letter-spacing:.05em; text-transform:uppercase; cursor:pointer; padding:0; transition:color .15s; }
  .nav-link:hover { color:rgba(255,255,255,.8); }
  .city-card { background:var(--bg-card); border:1px solid var(--border); border-radius:var(--r-lg); padding:28px 28px 24px; text-decoration:none; display:flex; flex-direction:column; gap:8px; transition:box-shadow .15s, border-color .15s; box-shadow:var(--sh); }
  .city-card:hover { box-shadow:0 4px 20px rgba(0,0,0,.09); border-color:var(--border-mid); }
  .trust-pill { display:inline-flex; align-items:center; gap:6px; font-size:13px; color:var(--t2); font-weight:500; }
  .source-pill { padding:3px 10px; background:var(--bg-card); border:1px solid var(--border); border-radius:100px; font-family:var(--mono); font-size:9px; color:var(--t3); letter-spacing:.04em; }
  .fade-up { opacity:0; transform:translateY(10px); animation:fu .45s ease forwards; }
  @keyframes fu { to { opacity:1; transform:none; } }
  .d1{animation-delay:.04s} .d2{animation-delay:.10s} .d3{animation-delay:.16s} .d4{animation-delay:.22s} .d5{animation-delay:.28s}
  @media(prefers-reduced-motion:reduce){ .fade-up{animation:none!important;opacity:1!important;transform:none!important;} }
`;

function useCountUp(target, dur=1200) {
  const [val, set] = useState(0);
  const raf = useRef(null);
  const prev = useRef(0);
  useEffect(() => {
    if (!target) return;
    const from = prev.current; prev.current = target; let t0 = null;
    const tick = ts => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      set(Math.round(from + (target - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);
  return val;
}

export default function App() {
  const [page, setPage] = useState("home");

  // Real submission counts per city from Supabase
  const [counts, setCounts] = useState({ ottawa:0, toronto:0, vancouver:0 });
  const [countsLoaded, setCountsLoaded] = useState(false);

  const totalRaw = counts.ottawa + counts.toronto + counts.vancouver;
  const totalDisplay = useCountUp(countsLoaded ? totalRaw : 0);

  useEffect(() => {
    const CACHE_KEY = "frc_hub_counts";
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < 5 * 60 * 1000) {
          setCounts(data); setCountsLoaded(true);
        }
      } catch {}
    }
    Promise.all(
      ["ottawa","toronto","vancouver"].map(city =>
        supabase.from("rent_submissions")
          .select("*", { count:"exact", head:true })
          .eq("city", city)
          .then(({ count }) => ({ city, count: count ?? 0 }))
      )
    ).then(results => {
      const data = {};
      results.forEach(r => { data[r.city] = r.count; });
      setCounts(data);
      setCountsLoaded(true);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }));
    }).catch(() => {});
  }, []);

  // Trust page routing
  if (page === "methodology") return <><style>{CSS}</style><MethodologyPage onBack={() => setPage("home")} /></>;
  if (page === "about")       return <><style>{CSS}</style><AboutPage       onBack={() => setPage("home")} /></>;
  if (page === "privacy")     return <><style>{CSS}</style><PrivacyPage     onBack={() => setPage("home")} /></>;
  if (page === "terms")       return <><style>{CSS}</style><TermsPage       onBack={() => setPage("home")} /></>;
  if (page === "faq")         return <><style>{CSS}</style><FaqPage         onBack={() => setPage("home")} /></>;
  if (page === "contact")     return <><style>{CSS}</style><ContactPage     onBack={() => setPage("home")} /></>;

  const cityCount = (key) => countsLoaded ? (counts[key] ?? 0).toLocaleString("en-CA") : "...";

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight:"100vh", background:"var(--bg)" }}>

        {/* NAV */}
        <header style={{ background:"var(--nav)", borderBottom:"1px solid rgba(255,255,255,.06)", position:"sticky", top:0, zIndex:100 }}>
          <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 32px", display:"flex", alignItems:"center", justifyContent:"space-between", height:56 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:28, height:28, background:"#16a34a", borderRadius:7, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                <span style={{ fontFamily:"var(--mono)", fontSize:11, fontWeight:500, color:"#fff" }}>FR</span>
              </div>
              <span style={{ fontFamily:"var(--sans)", fontSize:14, fontWeight:700, color:"#f8fafc", letterSpacing:"-.01em" }}>Fair Rent Canada</span>
            </div>
            <div style={{ display:"flex", gap:24, alignItems:"center" }}>
              {[["Methodology","methodology"],["About","about"],["FAQ","faq"],["Contact","contact"]].map(([label,pg]) => (
                <button key={pg} className="nav-link" onClick={() => setPage(pg)}>{label}</button>
              ))}
            </div>
          </div>
        </header>

        {/* HERO */}
        <div style={{ background:"#fff", borderBottom:"1px solid var(--border)" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", padding:"72px 32px 64px" }}>
            <div style={{ maxWidth:680 }}>
              <div className="fade-up d1" style={{ fontFamily:"var(--mono)", fontSize:11, color:"#16a34a", letterSpacing:".1em", textTransform:"uppercase", marginBottom:20 }}>
                Canadian Rent Analysis Tool
              </div>
              <h1 className="fade-up d1" style={{ fontFamily:"var(--serif)", fontSize:"clamp(32px,4vw,52px)", fontWeight:400, color:"var(--t1)", lineHeight:1.1, letterSpacing:"-.02em", marginBottom:18 }}>
                See if you are<br />overpaying for rent.
              </h1>
              <p className="fade-up d2" style={{ fontSize:"clamp(15px,1.5vw,18px)", color:"var(--t2)", lineHeight:1.75, maxWidth:520, marginBottom:36 }}>
                Based on real data from CMHC, Rentals.ca, and local renters. Free. Anonymous. No account needed.
              </p>

              {/* Live total */}
              <div className="fade-up d2" style={{ display:"flex", alignItems:"center", gap:10, marginBottom:48 }}>
                <div style={{ width:8, height:8, borderRadius:"50%", background:"#16a34a", animation:"blink 2.4s ease-in-out infinite" }} />
                <span style={{ fontFamily:"var(--mono)", fontSize:13, color:"var(--t2)" }}>
                  <span style={{ fontWeight:600, color:"var(--t1)" }}>{countsLoaded ? totalDisplay.toLocaleString("en-CA") : "..."}</span>
                  {" "}verified rent submissions across Canada
                </span>
              </div>
              <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}`}</style>

              {/* City cards */}
              <div className="fade-up d3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
                {CITIES.map(c => (
                  <a key={c.key} className="city-card" href={c.url}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                      <div style={{ width:10, height:10, borderRadius:"50%", background:c.accent, flexShrink:0 }} />
                      <span style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--t3)", letterSpacing:".06em", textTransform:"uppercase" }}>{c.province}</span>
                    </div>
                    <div style={{ fontSize:20, fontWeight:700, color:"var(--t1)", letterSpacing:"-.01em" }}>{c.name}</div>
                    <div style={{ fontFamily:"var(--mono)", fontSize:12, color:"var(--t3)", marginBottom:12 }}>
                      {countsLoaded ? (counts[c.key] ?? 0).toLocaleString("en-CA") : "..."} submissions
                    </div>
                    <div style={{ marginTop:"auto", display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600, color:c.accent }}>
                      Check my rent
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7h8M7 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TRUST BAR */}
        <div style={{ background:"var(--bg-card)", borderBottom:"1px solid var(--border)", padding:"14px 32px" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexWrap:"wrap", gap:"12px 32px", alignItems:"center" }}>
            {[
              "Based on Canadian housing data",
              "Updated with real tenant submissions",
              "Anonymous and secure",
              "Free — no account needed",
              "No data sold",
            ].map(t => (
              <div key={t} className="trust-pill">
                <div style={{ width:16, height:16, borderRadius:"50%", background:"#166534", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT — two columns on desktop */}
        <div style={{ maxWidth:1200, margin:"0 auto", padding:"64px 32px 80px", display:"grid", gridTemplateColumns:"1fr 380px", gap:48, alignItems:"start" }}>

          {/* LEFT — How it works + Why it matters */}
          <div style={{ display:"flex", flexDirection:"column", gap:48 }}>

            <div className="fade-up d3">
              <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--t3)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:14 }}>How it works</div>
              <h2 style={{ fontFamily:"var(--serif)", fontSize:"clamp(22px,2.5vw,32px)", fontWeight:400, marginBottom:28, letterSpacing:"-.01em" }}>Three steps. Under a minute.</h2>
              <div style={{ display:"flex", flexDirection:"column" }}>
                {[
                  { n:"01", title:"Enter your unit details", desc:"City, neighbourhood, unit type, move-in year, and monthly rent. Takes about 60 seconds." },
                  { n:"02", title:"We compare it to real data", desc:"Your rent is matched against verified submissions and official Canadian housing data for the same unit type in your area." },
                  { n:"03", title:"See if your rent is fair", desc:"You get a market range, a percentage above or below median, and a confidence score based on how much data exists for your area." },
                ].map(({ n, title, desc }) => (
                  <div key={n} style={{ display:"flex", gap:20, padding:"20px 0", borderBottom:"1px solid var(--border)" }}>
                    <span style={{ fontFamily:"var(--mono)", fontSize:12, fontWeight:700, color:"#1d4ed8", width:28, flexShrink:0, paddingTop:2 }}>{n}</span>
                    <div>
                      <div style={{ fontSize:16, fontWeight:700, color:"var(--t1)", marginBottom:5 }}>{title}</div>
                      <div style={{ fontSize:14, color:"var(--t2)", lineHeight:1.65 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="fade-up d4">
              <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--t3)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:14 }}>Why this matters</div>
              <h2 style={{ fontFamily:"var(--serif)", fontSize:"clamp(22px,2.5vw,32px)", fontWeight:400, marginBottom:28, letterSpacing:"-.01em" }}>Averages lie. Ranges tell the truth.</h2>
              <div style={{ display:"flex", flexDirection:"column" }}>
                {[
                  { title:"Rents vary widely within the same city", desc:"A 1-bedroom in downtown Ottawa rents for $600 more per month than the same unit five kilometres away. City-wide averages hide this." },
                  { title:"Published averages are misleading", desc:"CMHC data lags by 12-18 months. Listing-site averages reflect asking prices, not what renters actually pay." },
                  { title:"This tool shows your real market position", desc:"We combine official data with anonymized tenant submissions to show you a range — and tell you exactly how confident we are." },
                  { title:"You can help other renters", desc:"Submitting your rent anonymously takes 30 seconds. Every submission improves accuracy for everyone in your city." },
                ].map(({ title, desc }) => (
                  <div key={title} style={{ display:"flex", gap:14, padding:"16px 0", borderBottom:"1px solid var(--border)" }}>
                    <div style={{ width:6, height:6, borderRadius:"50%", background:"var(--t1)", flexShrink:0, marginTop:8 }} />
                    <div>
                      <div style={{ fontSize:15, fontWeight:700, color:"var(--t1)", marginBottom:4 }}>{title}</div>
                      <div style={{ fontSize:13, color:"var(--t2)", lineHeight:1.65 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div style={{ display:"flex", flexDirection:"column", gap:20, position:"sticky", top:76 }}>

            {/* Sample result preview */}
            <div className="fade-up d3" style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", overflow:"hidden", boxShadow:"var(--sh)" }}>
              <div style={{ background:"var(--t1)", padding:"12px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontFamily:"var(--mono)", fontSize:10, fontWeight:700, color:"#fff", letterSpacing:".08em", textTransform:"uppercase" }}>Sample result</span>
                <span style={{ fontFamily:"var(--mono)", fontSize:10, fontWeight:700, background:"#fef2f2", color:"#991b1b", borderRadius:3, padding:"2px 8px", letterSpacing:".04em" }}>OVERPAYING</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"1px", background:"var(--border)" }}>
                {[
                  { label:"Fair range", val:"$1,750", sub:"to $2,350/mo" },
                  { label:"Market median", val:"$2,050", sub:"per month" },
                  { label:"Sample size", val:"847", sub:"verified units" },
                ].map(({ label, val, sub }) => (
                  <div key={label} style={{ background:"var(--bg-card)", padding:"14px 12px" }}>
                    <div style={{ fontFamily:"var(--mono)", fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:".08em", color:"var(--t3)", marginBottom:5 }}>{label}</div>
                    <div style={{ fontFamily:"var(--mono)", fontSize:17, fontWeight:700, color:"var(--t1)" }}>{val}</div>
                    <div style={{ fontSize:11, color:"var(--t3)", marginTop:2 }}>{sub}</div>
                  </div>
                ))}
              </div>
              <div style={{ padding:"12px 16px", background:"#f0fdf4", borderTop:"1px solid #bbf7d0", fontSize:13, fontWeight:500, color:"#14532d" }}>
                Your rent is 17% above the market median
              </div>
              <div style={{ padding:"10px 16px", background:"var(--bg)", borderTop:"1px solid var(--border)", fontSize:11, color:"var(--t3)", fontFamily:"var(--mono)" }}>
                Ottawa &middot; 1 bedroom &middot; Confidence: High
              </div>
            </div>

            {/* Data sources */}
            <div className="fade-up d4" style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", padding:"20px 20px 18px", boxShadow:"var(--sh)" }}>
              <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--t3)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:14 }}>Data sources</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[
                  { name:"CMHC Rental Market Report", freq:"Annual — October", color:"#16a34a" },
                  { name:"Rentals.ca National Rent Report", freq:"Monthly", color:"#2563eb" },
                  { name:"Anonymous renter submissions", freq:"Continuous — live", color:"#0891b2" },
                ].map(({ name, freq, color }) => (
                  <div key={name} style={{ display:"flex", gap:10, alignItems:"flex-start" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%", background:color, flexShrink:0, marginTop:4 }} />
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:"var(--t1)" }}>{name}</div>
                      <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--t3)", marginTop:2 }}>{freq}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="fade-up d5" style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--r-lg)", padding:"18px 20px", boxShadow:"var(--sh)" }}>
              <div style={{ fontFamily:"var(--mono)", fontSize:10, color:"var(--t3)", textTransform:"uppercase", letterSpacing:".1em", marginBottom:14 }}>Learn more</div>
              <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
                {[["Methodology","methodology"],["About this project","about"],["Privacy policy","privacy"],["Terms of use","terms"],["FAQ","faq"],["Contact","contact"]].map(([label, pg]) => (
                  <button key={pg} onClick={() => setPage(pg)} style={{ background:"none", border:"none", cursor:"pointer", textAlign:"left", fontSize:13, color:"var(--t2)", padding:"6px 0", borderBottom:"1px solid var(--border)", display:"flex", justifyContent:"space-between", alignItems:"center" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--t1)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--t2)"}>
                    {label}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={{ borderTop:"1px solid var(--border)", background:"var(--bg-card)", padding:"32px 32px 28px" }}>
          <div style={{ maxWidth:1200, margin:"0 auto", display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:24, alignItems:"center" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"var(--t1)", marginBottom:4 }}>Fair Rent Canada</div>
              <div style={{ fontSize:12, color:"var(--t3)" }}>Independent. Non-commercial. Community-supported.</div>
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"6px 20px" }}>
              {[["Methodology","methodology"],["Privacy","privacy"],["Terms","terms"],["Contact","contact"]].map(([label,pg]) => (
                <button key={pg} onClick={() => setPage(pg)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, color:"var(--t3)", padding:0 }}
                  onMouseEnter={e => e.currentTarget.style.color = "var(--t2)"}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--t3)"}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div style={{ maxWidth:1200, margin:"16px auto 0", paddingTop:16, borderTop:"1px solid var(--border)", fontSize:11, color:"var(--t3)", lineHeight:1.6 }}>
            Disclaimer: Results are estimates based on available data and community submissions. This tool does not constitute legal or financial advice. Always verify independently before making rental decisions.
          </div>
        </footer>

      </div>
    </>
  );
}
