import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import MethodologyPage from "./MethodologyPage";
import { AboutPage, PrivacyPage, TermsPage, FaqPage, ContactPage } from "./TrustPages";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CITIES = [
  { key:"ottawa",    name:"Ottawa",    province:"Ontario",          url:"https://ottawafairrent.ca",    accent:"#1a5c34" },
  { key:"toronto",   name:"Toronto",   province:"Ontario",          url:"https://torontofairrent.ca",   accent:"#1a3a7a" },
  { key:"vancouver", name:"Vancouver", province:"British Columbia", url:"https://vancouverfairrent.ca", accent:"#0a4a5c" },
];

const CSS = `
  :root {
    --sans:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;
    --mono:"Courier New",Courier,monospace;
    --bg:#f5f5f5; --white:#ffffff;
    --border:#cccccc; --border-dark:#999999;
    --t1:#111111; --t2:#444444; --t3:#767676;
    --accent:#1a5c34; --accent-bg:#f0f7f2;
    --nav-bg:#1c2b36; --bar-bg:#2f4553;
  }
  html,body,#root{margin:0;padding:0;width:100%;background:var(--bg);}
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:var(--sans);font-size:15px;color:var(--t1);-webkit-font-smoothing:antialiased;line-height:1.5;}
  button{font-family:var(--sans);cursor:pointer;}

  /* Nav */
  .gov-nav{background:var(--nav-bg);border-bottom:3px solid var(--accent);}
  .gov-nav-inner{max-width:1100px;margin:0 auto;padding:0 16px;display:flex;align-items:center;height:48px;gap:16px;}
  .gov-wordmark{font-size:14px;font-weight:700;color:#fff;text-decoration:none;white-space:nowrap;}
  .gov-subbar{background:var(--bar-bg);border-bottom:1px solid #3d5a6e;}
  .gov-subbar-inner{max-width:1100px;margin:0 auto;padding:0 16px;height:36px;display:flex;align-items:center;gap:20px;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;}
  .gov-subbar-inner::-webkit-scrollbar{display:none;}
  .gov-subbar button{background:none;border:none;font-size:12px;color:#aab8c2;cursor:pointer;padding:0;white-space:nowrap;flex-shrink:0;}
  .gov-subbar button:hover{color:#fff;text-decoration:underline;}

  /* Layout */
  .page-wrap{max-width:1100px;margin:0 auto;padding:28px 20px 60px;}
  .page-hero{margin-bottom:24px;padding-bottom:20px;border-bottom:1px solid var(--border);}
  .page-hero h1{font-size:clamp(18px,2.5vw,26px);font-weight:700;color:var(--t1);margin-bottom:8px;line-height:1.2;}
  .page-hero p{font-size:14px;color:var(--t2);line-height:1.6;max-width:580px;}
  .trust-bar{display:flex;flex-wrap:wrap;gap:8px 20px;margin-bottom:24px;padding:10px 14px;background:var(--white);border:1px solid var(--border);border-left:3px solid var(--accent);}
  .trust-item{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--t2);}
  .trust-check{color:var(--accent);font-weight:700;font-size:13px;}

  /* Two-column */
  .page-grid{display:grid;grid-template-columns:1fr 300px;gap:20px;align-items:start;}
  .main-col{display:flex;flex-direction:column;gap:16px;}
  .sidebar-col{display:flex;flex-direction:column;gap:16px;position:sticky;top:88px;}

  /* City table */
  .city-table{width:100%;border-collapse:collapse;background:var(--white);border:1px solid var(--border);}
  .city-table thead th{padding:9px 14px;background:#f0f0f0;border-bottom:2px solid var(--border-dark);font-size:11px;font-weight:700;text-align:left;text-transform:uppercase;letter-spacing:0.04em;color:var(--t2);}
  .city-table tbody tr{border-bottom:1px solid var(--border);}
  .city-table tbody tr:last-child{border-bottom:none;}
  .city-table tbody tr:hover{background:#fafafa;}
  .city-table td{padding:13px 14px;vertical-align:middle;}
  .city-link{font-size:15px;font-weight:700;color:var(--t1);text-decoration:none;display:block;}
  .city-link:hover{color:var(--accent);text-decoration:underline;}
  .city-province{font-size:12px;color:var(--t3);margin-top:2px;}
  .city-count{font-family:var(--mono);font-size:13px;color:var(--t2);}
  .city-cta{display:inline-block;padding:7px 14px;background:var(--accent);color:#fff;font-size:12px;font-weight:700;text-decoration:none;letter-spacing:0.02em;}
  .city-cta:hover{opacity:0.85;}

  /* Panels */
  .how-panel{background:var(--white);border:1px solid var(--border);}
  .how-panel-header{padding:9px 14px;background:#f0f0f0;border-bottom:1px solid var(--border);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--t2);}
  .how-step{display:flex;gap:12px;padding:13px 14px;border-bottom:1px solid var(--border);}
  .how-step:last-child{border-bottom:none;}
  .how-num{font-family:var(--mono);font-size:12px;font-weight:700;color:var(--accent);width:20px;flex-shrink:0;padding-top:1px;}
  .how-title{font-size:13px;font-weight:700;color:var(--t1);margin-bottom:3px;}
  .how-desc{font-size:12px;color:var(--t2);line-height:1.55;}
  .sidebar-panel{background:var(--white);border:1px solid var(--border);}
  .sidebar-header{padding:9px 14px;background:#f0f0f0;border-bottom:1px solid var(--border);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.04em;color:var(--t2);}
  .sidebar-body{padding:14px;}
  .total-count{font-family:var(--mono);font-size:26px;font-weight:700;color:var(--t1);line-height:1;margin-bottom:4px;}
  .total-label{font-size:12px;color:var(--t3);}
  .source-row{display:flex;gap:8px;align-items:flex-start;padding:8px 0;border-bottom:1px solid #ebebeb;}
  .source-row:last-child{border-bottom:none;}
  .source-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);flex-shrink:0;margin-top:4px;}
  .source-name{font-size:13px;font-weight:600;color:var(--t1);}
  .source-freq{font-size:11px;color:var(--t3);font-family:var(--mono);}
  .link-list{display:flex;flex-direction:column;}
  .link-item{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid #ebebeb;font-size:13px;color:var(--t2);background:none;border-left:none;border-right:none;border-top:none;text-align:left;width:100%;cursor:pointer;}
  .link-item:last-child{border-bottom:none;}
  .link-item:hover{color:var(--accent);}
  .link-arrow{font-size:11px;color:var(--t3);}
  .disclaimer{font-size:11px;color:var(--t3);line-height:1.6;padding-top:14px;border-top:1px solid var(--border);margin-top:20px;}

  /* Responsive */
  @media(max-width:768px){
    .page-grid{grid-template-columns:1fr;}
    .sidebar-col{position:static;}
    .city-table thead th:nth-child(2){display:none;}
    .city-table td:nth-child(2){display:none;}
  }
  @media(max-width:480px){
    .page-wrap{padding:16px 14px 40px;}
    .gov-subbar-inner{gap:14px;}
    .city-cta{padding:6px 10px;font-size:11px;}
  }
`;
function useCountUp(target, dur=800) {
  const [val,set] = useState(0), raf = useRef(null), prev = useRef(0);
  useEffect(() => {
    if (!target) return;
    const from = prev.current; prev.current = target; let t0 = null;
    const tick = ts => { if(!t0)t0=ts; const p=Math.min((ts-t0)/dur,1); set(Math.round(from+(target-from)*p)); if(p<1)raf.current=requestAnimationFrame(tick); };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);
  return val;
}

export default function App() {
  // Read initial page from URL path
  const pathToPage = (p) => {
    const map = { "/methodology":"methodology", "/about":"about", "/privacy":"privacy", "/terms":"terms", "/faq":"faq", "/contact":"contact" };
    return map[p] || "home";
  };

  const [page, setPage] = useState(() => pathToPage(window.location.pathname));
  const [counts, setCounts] = useState({ ottawa:0, toronto:0, vancouver:0 });
  const [countsLoaded, setCountsLoaded] = useState(false);

  // Update URL when page changes
  function navigate(pg) {
    const pageToPath = { home:"/", methodology:"/methodology", about:"/about", privacy:"/privacy", terms:"/terms", faq:"/faq", contact:"/contact" };
    window.history.pushState({}, "", pageToPath[pg] || "/");
    setPage(pg);
    window.scrollTo(0, 0);
  }

  const totalRaw = counts.ottawa + counts.toronto + counts.vancouver;
  const totalDisplay = useCountUp(countsLoaded ? totalRaw : 0);

  useEffect(() => {
    const KEY = "frc_hub_counts";
    try {
      const {data,ts} = JSON.parse(localStorage.getItem(KEY)||"{}");
      if (data && Date.now()-ts < 5*60*1000) { setCounts(data); setCountsLoaded(true); }
    } catch {}
    Promise.all(
      ["ottawa","toronto","vancouver"].map(city =>
        supabase.from("rent_submissions").select("*",{count:"exact",head:true}).eq("city",city)
          .then(({count}) => ({ city, count: count??0 }))
      )
    ).then(results => {
      const data = {};
      results.forEach(r => { data[r.city] = r.count; });
      setCounts(data); setCountsLoaded(true);
      try { localStorage.setItem(KEY, JSON.stringify({data,ts:Date.now()})); } catch {}
    }).catch(()=>{});
  }, []);

  if (page==="methodology") return <><style>{CSS}</style><MethodologyPage onBack={()=>navigate("home")}/></>;
  if (page==="about")       return <><style>{CSS}</style><AboutPage       onBack={()=>navigate("home")}/></>;
  if (page==="privacy")     return <><style>{CSS}</style><PrivacyPage     onBack={()=>navigate("home")}/></>;
  if (page==="terms")       return <><style>{CSS}</style><TermsPage       onBack={()=>navigate("home")}/></>;
  if (page==="faq")         return <><style>{CSS}</style><FaqPage         onBack={()=>navigate("home")}/></>;
  if (page==="contact")     return <><style>{CSS}</style><ContactPage     onBack={()=>navigate("home")}/></>;

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight:"100vh", background:"var(--bg)" }}>

        {/* NAV */}
        <div className="gov-nav">
          <div className="gov-nav-inner">
            <span className="gov-wordmark">Fair Rent Canada</span>
          </div>
        </div>

        {/* SUB-NAV */}
        <div className="gov-subbar">
          <div className="gov-subbar-inner">
            {[["Methodology","methodology"],["About","about"],["Privacy","privacy"],["FAQ","faq"],["Contact","contact"]].map(([label,pg])=>(
              <button key={pg} onClick={()=>navigate(pg)}>{label}</button>
            ))}
          </div>
        </div>

        <div className="page-wrap">

          {/* Hero */}
          <div className="page-hero">
            <h1>Canadian Rent Analysis Tool</h1>
            <p>
              Free, anonymous tool that helps renters understand whether their rent is in line with local market rates.
              Based on data from CMHC, Rentals.ca, and verified community submissions. Not legal advice.
            </p>
          </div>

          {/* Trust bar */}
          <div className="trust-bar">
            {[
              "Based on CMHC and Rentals.ca data",
              "Anonymous — no personal data collected",
              "No account required",
              "Free to use",
              "No data sold",
            ].map(t=>(
              <div key={t} className="trust-item">
                <span className="trust-check">&#10003;</span>
                {t}
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className="page-grid">

            {/* LEFT */}
            <div className="main-col">

              {/* City table */}
              <table className="city-table">
                <thead>
                  <tr>
                    <th>City</th>
                    <th>Verified submissions</th>
                    <th>Open calculator</th>
                  </tr>
                </thead>
                <tbody>
                  {CITIES.map(c => (
                    <tr key={c.key}>
                      <td>
                        <a href={c.url} className="city-link">{c.name}</a>
                        <div className="city-province">{c.province}</div>
                      </td>
                      <td>
                        <span className="city-count">
                          {countsLoaded ? (counts[c.key]??0).toLocaleString("en-CA") : "—"}
                        </span>
                      </td>
                      <td>
                        <a href={c.url} className="city-cta">Check my rent &rarr;</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* How it works */}
              <div className="how-panel">
                <div className="how-panel-header">How it works</div>
                {[
                  { n:"1", title:"Enter your rental details", desc:"Select your city, neighbourhood, and unit type. Enter your monthly rent and move-in year. Takes about 60 seconds." },
                  { n:"2", title:"We compare against real data", desc:"Your rent is matched against CMHC survey data and anonymous submissions from renters in the same neighbourhood and unit type." },
                  { n:"3", title:"Receive a market position report", desc:"You get an estimated fair range, a confidence score, and, for Ontario units, a rent control status and estimated legal maximum." },
                ].map(({n,title,desc})=>(
                  <div key={n} className="how-step">
                    <span className="how-num">{n}</span>
                    <div>
                      <div className="how-title">{title}</div>
                      <div className="how-desc">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Why it matters */}
              <div className="how-panel">
                <div className="how-panel-header">Why this matters</div>
                {[
                  { title:"Published averages are misleading", desc:"CMHC data is comprehensive but lags 12 to 18 months. Listing-site averages reflect asking prices, not signed rents. Neighbourhood-level data is rarely published." },
                  { title:"Rents vary widely within the same city", desc:"A 1-bedroom in one Ottawa neighbourhood can rent for $600 more per month than the same unit a few kilometres away. City-wide averages hide this." },
                  { title:"This tool shows your real market position", desc:"We combine official data with anonymized tenant submissions to produce a neighbourhood-level range and tell you the confidence level behind it." },
                ].map(({title,desc})=>(
                  <div key={title} className="how-step">
                    <span className="how-num" style={{ color:"var(--t3)" }}>&#8212;</span>
                    <div>
                      <div className="how-title">{title}</div>
                      <div className="how-desc">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SIDEBAR */}
            <div className="sidebar-col">

              {/* Submission count */}
              <div className="sidebar-panel">
                <div className="sidebar-header">Live submission count</div>
                <div className="sidebar-body">
                  <div className="total-count">{countsLoaded ? totalDisplay.toLocaleString("en-CA") : "—"}</div>
                  <div className="total-label">verified rent submissions across Canada</div>
                  <div style={{ marginTop:12, paddingTop:12, borderTop:"1px solid var(--border)", fontSize:12, color:"var(--t3)" }}>
                    Submissions are anonymous. We store only neighbourhood, unit type, monthly rent, and move-in year. No personal information is collected.
                  </div>
                </div>
              </div>

              {/* Data sources */}
              <div className="sidebar-panel">
                <div className="sidebar-header">Data sources</div>
                <div className="sidebar-body" style={{ padding:"0 14px" }}>
                  {[
                    { name:"CMHC Rental Market Survey",  freq:"Annual — October"    },
                    { name:"Rentals.ca National Report",  freq:"Monthly"             },
                    { name:"Anonymous renter submissions", freq:"Continuous — live"  },
                  ].map(({name,freq})=>(
                    <div key={name} className="source-row">
                      <div className="source-dot"/>
                      <div>
                        <div className="source-name">{name}</div>
                        <div className="source-freq">{freq}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="sidebar-panel">
                <div className="sidebar-header">Documentation</div>
                <div style={{ padding:"0 14px" }}>
                  <div className="link-list">
                    {[["Methodology","methodology"],["About this project","about"],["Privacy policy","privacy"],["Terms of use","terms"],["Frequently asked questions","faq"],["Contact","contact"]].map(([label,pg])=>(
                      <button key={pg} className="link-item" onClick={()=>navigate(pg)}>
                        {label}
                        <span className="link-arrow">&rarr;</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div style={{ background:"var(--white)", border:"1px solid var(--border)", borderLeft:"3px solid #999", padding:"12px 14px", fontSize:12, color:"var(--t2)", lineHeight:1.6 }}>
                <strong>Not legal advice.</strong> Results are market estimates for general informational purposes only. Do not use as the basis for legal action or formal rent dispute proceedings without consulting a qualified professional.
              </div>
            </div>
          </div>

          <div className="disclaimer">
            Fair Rent Canada is an independent, non-commercial project. Data sources: CMHC Rental Market Survey (Oct 2024) &middot; Rentals.ca National Rent Report (Feb 2025) &middot; Anonymous community submissions.
            Results are estimates only. Not legal or financial advice.
          </div>
        </div>
      </div>
    </>
  );
}
