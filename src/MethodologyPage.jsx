import { useState } from "react";

const CSS = `
  :root {
    --sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    --mono: "Courier New", Courier, monospace;
    --bg:   #f5f5f5;
    --white:#ffffff;
    --border: #cccccc;
    --border-dark: #999999;
    --t1: #111111;
    --t2: #444444;
    --t3: #767676;
    --accent: #1a5c34;
    --accent-bg: #f0f7f2;
    --nav-bg: #1c2b36;
    --bar-bg: #2f4553;
  }
  html,body,#root{margin:0;padding:0;width:100%;background:var(--bg);}
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:var(--sans);font-size:15px;color:var(--t1);-webkit-font-smoothing:antialiased;line-height:1.5;}
  button,a{font-family:var(--sans);}
  .gov-nav{background:var(--nav-bg);border-bottom:3px solid var(--accent);}
  .gov-nav-inner{max-width:1100px;margin:0 auto;padding:0 16px;display:flex;align-items:center;justify-content:space-between;height:48px;gap:16px;}
  .gov-wordmark{font-size:13px;font-weight:700;color:#fff;text-decoration:none;white-space:nowrap;}
  .gov-wordmark span{font-weight:400;color:#aab8c2;}
  .back-btn{background:none;border:none;font-size:12px;color:#aab8c2;cursor:pointer;padding:0;}
  .back-btn:hover{color:#fff;text-decoration:underline;}
  .gov-subbar{background:var(--bar-bg);border-bottom:1px solid #3d5a6e;}
  .gov-subbar-inner{max-width:1100px;margin:0 auto;padding:0 16px;height:34px;display:flex;align-items:center;}
  .breadcrumb{font-size:12px;color:#aab8c2;}
  .breadcrumb a{color:#aab8c2;text-decoration:none;}
  .breadcrumb a:hover{text-decoration:underline;}
  .page-wrap{max-width:900px;margin:0 auto;padding:32px 16px 64px;}
  .page-heading{margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid var(--border);}
  .page-label{font-size:11px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;}
  .page-title{font-size:clamp(20px,3vw,28px);font-weight:700;color:var(--t1);margin-bottom:8px;line-height:1.2;}
  .page-intro{font-size:14px;color:var(--t2);line-height:1.65;max-width:640px;}
  .section-divider{font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:0.06em;margin:24px 0 10px;padding-bottom:6px;border-bottom:2px solid var(--border);}
  .panel{background:var(--white);border:1px solid var(--border);margin-bottom:12px;}
  .panel-header{padding:11px 16px;background:#f0f0f0;border-bottom:1px solid var(--border);font-size:13px;font-weight:700;color:var(--t1);}
  .panel-body{padding:16px;font-size:13px;color:var(--t2);line-height:1.75;}
  .panel-body p+p{margin-top:10px;}
  .notice{padding:12px 14px;border-left:3px solid;font-size:13px;line-height:1.6;margin-bottom:12px;}
  .notice-amber{background:#fdf8f0;border-color:#7a4f00;color:#5a3d00;}
  .notice-green{background:#f0f7f2;border-color:#1a5c34;color:#1a4a28;}
  .data-table{width:100%;border-collapse:collapse;font-size:13px;}
  .data-table thead th{padding:8px 12px;background:#f5f5f5;border:1px solid var(--border);font-size:11px;font-weight:700;text-align:left;text-transform:uppercase;letter-spacing:0.04em;color:var(--t2);}
  .data-table tbody td{padding:9px 12px;border:1px solid #e8e8e8;color:var(--t1);vertical-align:top;}
  .data-table tbody td:first-child{font-weight:600;}
  .blend-table{width:100%;border-collapse:collapse;font-size:13px;margin-top:12px;}
  .blend-table thead th{padding:8px 12px;background:#f5f5f5;border:1px solid var(--border);font-size:11px;font-weight:700;text-align:left;text-transform:uppercase;letter-spacing:0.04em;color:var(--t2);}
  .blend-table tbody td{padding:8px 12px;border:1px solid #e8e8e8;font-family:var(--mono);font-size:12px;}
  .blend-table tbody td:first-child{font-family:var(--sans);font-size:13px;}
  .blend-table td.w-zero{color:var(--t3);}
  .blend-table td.w-active{color:#1a5c34;font-weight:700;}
  .score-table{width:100%;border-collapse:collapse;font-size:13px;margin-top:12px;}
  .score-table thead th{padding:8px 12px;background:#f5f5f5;border:1px solid var(--border);font-size:11px;font-weight:700;text-align:left;text-transform:uppercase;letter-spacing:0.04em;color:var(--t2);}
  .score-table tbody td{padding:9px 12px;border:1px solid #e8e8e8;color:var(--t1);vertical-align:top;}
  .score-table tbody td:first-child{font-family:var(--mono);font-weight:700;}
  .update-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px;}
  .update-card{background:#f5f5f5;border:1px solid var(--border);padding:12px 14px;}
  .update-title{font-size:13px;font-weight:700;color:var(--t1);margin-bottom:4px;}
  .update-freq{font-family:var(--mono);font-size:11px;color:var(--accent);margin-bottom:4px;}
  .update-note{font-size:11px;color:var(--t3);line-height:1.5;}
  .lim-row{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #ebebeb;align-items:flex-start;}
  .lim-row:last-child{border-bottom:none;}
  .lim-dot{width:6px;height:6px;border-radius:50%;background:var(--t3);flex-shrink:0;margin-top:5px;}
  .lim-title{font-size:13px;font-weight:700;color:var(--t1);margin-bottom:3px;}
  .lim-body{font-size:13px;color:var(--t2);line-height:1.6;}
  .faq-item{border-bottom:1px solid var(--border);}
  .faq-item:last-child{border-bottom:none;}
  .faq-trigger{width:100%;display:flex;align-items:center;justify-content:space-between;padding:12px 0;background:none;border:none;cursor:pointer;text-align:left;gap:16px;font-family:var(--sans);}
  .faq-q{font-size:13px;font-weight:700;color:var(--t1);line-height:1.4;}
  .faq-icon{font-size:16px;color:var(--t3);font-weight:700;flex-shrink:0;line-height:1;}
  .faq-body{font-size:13px;color:var(--t2);line-height:1.75;padding-bottom:12px;}
  .footer-note{margin-top:32px;padding-top:16px;border-top:1px solid var(--border);font-size:11px;color:var(--t3);text-align:center;font-family:var(--mono);}
  @media(max-width:560px){.update-grid{grid-template-columns:1fr;}.page-wrap{padding:20px 12px 48px;}}
`;

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-trigger" onClick={() => setOpen(o => !o)}>
        <span className="faq-q">{q}</span>
        <span className="faq-icon">{open ? "\u2212" : "+"}</span>
      </button>
      {open && <p className="faq-body">{a}</p>}
    </div>
  );
}

// Inline version used on result cards
export function MethodologyShort() {
  return (
    <div style={{ fontFamily:"-apple-system,BlinkMacSystemFont,Segoe UI,Arial,sans-serif" }}>
      <div style={{ fontFamily:"'Courier New',Courier,monospace", fontSize:10, color:"#767676", textTransform:"uppercase", letterSpacing:".1em", marginBottom:10 }}>How this estimate was built</div>
      <p style={{ fontSize:13, color:"#444", lineHeight:1.75, marginBottom:10 }}>The benchmark starts with CMHC's annual Rental Market Survey data and Rentals.ca's monthly reports, adjusted for your neighbourhood and unit type. When enough anonymous renter submissions exist for your specific area, they are blended in using a weighted average.</p>
      <p style={{ fontSize:13, color:"#444", lineHeight:1.75, marginBottom:10 }}>The Fair Rent Canada Score (1 to 10) combines your market position, price per square foot (if provided), and rent control status into a single fairness benchmark.</p>
      <p style={{ fontSize:12, color:"#767676", lineHeight:1.65 }}>This is a market estimate for general reference only. It is not legal advice and should not be used in rent disputes or legal proceedings.</p>
    </div>
  );
}

const SOURCES = [
  {
    name: "CMHC Rental Market Survey",
    freq: "Annual \u2014 October",
    what: "Canada's most comprehensive survey of purpose-built rental buildings. Covers vacancy rates, average rents, and bedroom type data across major Canadian cities. Based on surveys of landlords and property managers.",
    limits: "Covers purpose-built rentals only, not condos rented by individual landlords. Lags by several months. Does not capture rent at the street or micro-neighbourhood level.",
    role: "Primary baseline for all estimates.",
  },
  {
    name: "Rentals.ca National Rent Report",
    freq: "Monthly",
    what: "Tracks asking rents from active listings across Canada. More current than CMHC and covers a broader mix of property types including condos, basement suites, and privately-owned rentals.",
    limits: "Reflects advertised asking prices, not signed rents. Landlords list at aspirational prices. May skew slightly high in competitive markets.",
    role: "Used to calibrate and update the CMHC baseline between annual surveys.",
  },
  {
    name: "Anonymous renter submissions",
    freq: "Continuous \u2014 live",
    what: "Rent amounts submitted voluntarily by renters using this tool. Each submission includes neighbourhood, unit type, and monthly rent. No personal information is collected.",
    limits: "Self-reported data. Accuracy depends on honest submissions. Small sample sizes in less-used neighbourhoods reduce reliability.",
    role: "Blended into the estimate when enough local submissions exist. Improves neighbourhood precision over time.",
  },
  {
    name: "Provincial rent control guidelines",
    freq: "Annual \u2014 as announced",
    what: "Published annually by the Ontario and British Columbia governments. Used to estimate legal maximum rents for controlled tenancies.",
    limits: "Guideline rates change each year. Legal determinations depend on individual circumstances.",
    role: "Used for rent control calculations and the rent control component of the Fair Rent Canada Score.",
  },
];

const LIMITATIONS = [
  { label:"Asking rent vs. signed rent", body:"Rentals.ca data reflects advertised asking prices, not finalized lease amounts. Actual signed rents may be lower, especially in slower markets." },
  { label:"Condition and finishes", body:"The estimate does not account for unit condition, renovation quality, appliances, or building amenities. A renovated unit may reasonably command more than an unrenovated one nearby." },
  { label:"Condo rentals", body:"CMHC data covers purpose-built rental buildings only, not individually owned condos rented by their owners. This introduces a gap in markets like Toronto and Vancouver where condo rentals are a large share of the market. We partially offset this with Rentals.ca data and community submissions." },
  { label:"Self-reported data", body:"Anonymous submissions are not verified. We rely on honest reporting. Outliers beyond reasonable bounds are excluded, but we cannot detect deliberate manipulation of a single data point." },
  { label:"Micro-location variation", body:"Neighbourhoods are broad categories. A unit on a quiet street and one on a major corridor in the same neighbourhood may be treated the same in this estimate." },
  { label:"Square footage data", body:"Price per square foot comparisons are only possible when the user provides their unit size. Median $/sq ft values are estimated from available data and may not reflect every sub-market within a neighbourhood." },
  { label:"Rapidly changing markets", body:"If the market has shifted significantly since the most recent data update, the estimate may lag. This is most likely during periods of rapid rent growth or sudden market cooling." },
];

const FAQS = [
  { q:"What is the Fair Rent Canada Score?", a:"The Fair Rent Canada Score is a number from 1 to 10 that measures how fair your rent is relative to the local market. A 10 means your rent is significantly below market. A 6 means you are paying a typical rate. Anything below 5 suggests you may be overpaying. The score combines your market position (60%), price per square foot (25%, when provided), and rent control status (15%)." },
  { q:"Why is the result a range and not one number?", a:"Because a single number would be misleading. Rents for comparable units in the same neighbourhood vary by hundreds of dollars based on building age, condition, finishes, and included amenities. A range honestly reflects that variation." },
  { q:"How is the neighbourhood adjustment calculated?", a:"Each neighbourhood has a multiplier derived from observed rent premiums or discounts relative to the city average. These multipliers are calibrated from CMHC ward-level data and cross-referenced with Rentals.ca listing patterns. They are reviewed and updated after each CMHC annual release." },
  { q:"How are anonymous renter submissions used?", a:"When enough submissions exist for a specific neighbourhood and unit type, they are blended with the public data baseline using a weighted average. The community weight increases with sample size, up to a maximum of 80 percent. Public data always contributes to every estimate." },
  { q:"What stops people from submitting fake rents?", a:"Submissions outside a reasonable range (below $500 or above $8,000 per month) are excluded automatically. Submissions older than two years are also excluded. No single submission can dramatically shift the estimate because it is always blended with the public data baseline." },
  { q:"How does price per square foot work?", a:"When you provide your unit's square footage, we calculate your price per square foot and compare it to the neighbourhood median for the same unit type. This catches situations where a rent looks reasonable in absolute terms but is actually expensive for the space you get. It accounts for 25% of the Fair Rent Canada Score when provided." },
  { q:"Does the tool account for rent control?", a:"Yes, for Ontario units first occupied before November 15, 2018 and for all BC tenancies. When applicable, the result includes an estimated legal maximum based on provincial guideline rates. Whether your unit is rent-controlled also affects 15% of your Fair Rent Canada Score." },
  { q:"Can I use this result in a dispute with my landlord?", a:"No. This tool provides general market estimates for informational purposes only. It is not a professional appraisal, not legal advice, and should not be used as evidence in legal proceedings. If you are involved in a rent dispute, consult a licensed paralegal or tenant rights organization in your province." },
  { q:"How often is the data updated?", a:"CMHC data is updated annually each fall. Rentals.ca data is updated monthly. Neighbourhood multipliers are reviewed after each CMHC release. Anonymous renter submissions are live and update continuously. Submissions older than two years are excluded." },
  { q:"Is my submission truly anonymous?", a:"Yes. No name, email, IP address, or device identifier is stored with your submission. The only data recorded is neighbourhood, unit type, monthly rent, move-in year, and whether parking or utilities are included. There is no way to trace a submission back to an individual." },
];

export default function MethodologyPage({ onBack }) {
  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight:"100vh", background:"var(--bg)" }}>

        <div className="gov-nav">
          <div className="gov-nav-inner">
            <a href="https://fairrent.ca" className="gov-wordmark">
              Fair Rent Canada <span>/ Methodology</span>
            </a>
            {onBack && <button className="back-btn" onClick={onBack}>&#8592; Back</button>}
          </div>
        </div>

        <div className="gov-subbar">
          <div className="gov-subbar-inner">
            <span className="breadcrumb">
              <a href="https://fairrent.ca">Fair Rent Canada</a>
              {" / "}Methodology
            </span>
          </div>
        </div>

        <div className="page-wrap">
          <div className="page-heading">
            <div className="page-label">Methodology</div>
            <h1 className="page-title">How Fair Rent Canada Works</h1>
            <p className="page-intro">This page explains how estimates are built, what the Fair Rent Canada Score means, where the data comes from, and what the results can and cannot tell you.</p>
          </div>

          {/* What we measure */}
          <div className="section-divider">What we measure</div>
          <div className="panel">
            <div className="panel-body">
              <p>Fair Rent Canada estimates whether a renter's monthly rent is above, within, or below the typical range for comparable units in their neighbourhood. We produce a Fair Rent Canada Score on a scale of 1 to 10, where 10 means the rent is significantly below market and 1 means it is significantly above.</p>
              <p>We do not measure unit quality, landlord responsiveness, or living conditions. We measure price fairness relative to the local rental market.</p>
            </div>
          </div>

          {/* How estimates are built */}
          <div className="section-divider">How estimates are built</div>
          <div className="panel">
            <div className="panel-body">
              <p>Every estimate starts with a baseline derived from CMHC's annual Rental Market Survey, the most comprehensive source of rental data in Canada. CMHC surveys landlords and property managers of purpose-built rental buildings each October and publishes average rents and vacancy rates by city and zone.</p>
              <p>We adjust the CMHC baseline using Rentals.ca's monthly national rent report, which tracks asking rents from active listings across Canada. This helps us account for market movement between CMHC's annual releases.</p>
              <p>We then apply a neighbourhood multiplier. This is a percentage adjustment that reflects how a specific neighbourhood typically compares to the city-wide average. Multipliers are calibrated from a combination of CMHC zone data, Rentals.ca listing distributions, and the median of anonymous renter submissions in each neighbourhood.</p>
              <p>When enough anonymous submissions exist for a specific neighbourhood and unit type, they are blended into the estimate using a weighted average. The weight given to community data increases with sample size. CMHC data always retains a minimum weight to anchor the estimate against self-reporting bias.</p>
            </div>
          </div>

          {/* How blending works */}
          <div className="section-divider">How blending works</div>
          <div className="panel">
            <div className="panel-body">
              <p>The community weight determines how much influence anonymous renter submissions have on the final estimate. More submissions means more influence, but public data always contributes.</p>
              <table className="blend-table">
                <thead>
                  <tr>
                    <th>Local submissions</th>
                    <th>Community weight</th>
                    <th>What this means</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["0 to 4",   "0%",  "w-zero",   "Public data only"],
                    ["5 to 9",   "20%", "w-active",  "Mostly public, slight community adjustment"],
                    ["10 to 19", "40%", "w-active",  "Balanced blend"],
                    ["20 to 49", "60%", "w-active",  "Community-weighted, public as anchor"],
                    ["50+",      "80%", "w-active",  "Primarily community data"],
                  ].map(([range,weight,cls,meaning]) => (
                    <tr key={range}>
                      <td>{range}</td>
                      <td className={cls}>{weight}</td>
                      <td style={{ fontFamily:"var(--sans)", fontSize:13, color:"var(--t2)" }}>{meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ marginTop:12, fontSize:12, color:"var(--t3)" }}>Public data always contributes to the estimate. The community weight never reaches 100 percent. This ensures every estimate stays grounded in verified market data, even in areas with many submissions.</p>
            </div>
          </div>

          {/* Fair Rent Canada Score */}
          <div className="section-divider">The Fair Rent Canada Score</div>
          <div className="panel">
            <div className="panel-body">
              <p>The Fair Rent Canada Score is a single number from 1 to 10 that summarizes how fair your rent is. It is strict by design. A high score is difficult to earn. The score combines three components:</p>
              <table className="score-table">
                <thead>
                  <tr>
                    <th>Component</th>
                    <th>Weight</th>
                    <th>What it measures</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Market Position</td>
                    <td style={{ fontFamily:"var(--mono)" }}>60%</td>
                    <td style={{ color:"var(--t2)" }}>Where your rent falls relative to the estimated fair range for your neighbourhood and unit type. Below the range scores higher. Above scores lower.</td>
                  </tr>
                  <tr>
                    <td>Price per sq ft</td>
                    <td style={{ fontFamily:"var(--mono)" }}>25%</td>
                    <td style={{ color:"var(--t2)" }}>How your price per square foot compares to the neighbourhood median for the same unit type. Only active when you provide your unit's square footage.</td>
                  </tr>
                  <tr>
                    <td>Rent Control</td>
                    <td style={{ fontFamily:"var(--mono)" }}>15%</td>
                    <td style={{ color:"var(--t2)" }}>Whether your unit is rent-controlled and whether your current rent is within the estimated legal maximum. Rewards tenants in stable, controlled tenancies.</td>
                  </tr>
                </tbody>
              </table>
              <p style={{ marginTop:12 }}>When square footage is not provided, the weights shift to 75% Market Position and 25% Rent Control. Providing your unit size gives a more accurate score.</p>
            </div>
          </div>

          {/* Score bands */}
          <div className="panel">
            <div className="panel-header">Score bands</div>
            <div className="panel-body">
              {[
                { range:"9.0 to 10.0", label:"Excellent", color:"#1a5c34", desc:"Rent is significantly below market. A genuinely good deal by any measure. Rare and hard to earn." },
                { range:"7.5 to 8.9",  label:"Good",      color:"#1a5c34", desc:"Rent is below or at the low end of the local range. Renter is in a favourable position." },
                { range:"6.0 to 7.4",  label:"Fair",       color:"#7a4f00", desc:"Rent is within the estimated fair range. Renter is paying a reasonable market rate." },
                { range:"4.5 to 5.9",  label:"Above Market", color:"#b45309", desc:"Rent is above the estimated fair range. Renter may be overpaying relative to comparable units." },
                { range:"3.0 to 4.4",  label:"High",       color:"#8b1a1a", desc:"Rent is significantly above market. Renter is almost certainly overpaying." },
                { range:"1.0 to 2.9",  label:"Very High",  color:"#8b1a1a", desc:"Rent is far above comparable units. Renter should investigate alternatives or negotiate." },
              ].map(b => (
                <div key={b.range} style={{ display:"flex", gap:12, padding:"8px 0", borderBottom:"1px solid #ebebeb", alignItems:"flex-start" }}>
                  <div style={{ fontFamily:"var(--mono)", fontSize:12, fontWeight:700, color:b.color, minWidth:80, flexShrink:0 }}>{b.range}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:b.color, marginBottom:2 }}>{b.label}</div>
                    <div style={{ fontSize:12, color:"var(--t2)", lineHeight:1.5 }}>{b.desc}</div>
                  </div>
                </div>
              ))}
              <p style={{ marginTop:12, fontSize:12, color:"var(--t3)" }}>When data confidence is Low, the score is still calculated but labelled as estimated. The score becomes more precise as local submission volume increases.</p>
            </div>
          </div>

          {/* Price per square foot */}
          <div className="section-divider">Price per square foot</div>
          <div className="panel">
            <div className="panel-body">
              <p>Average rent is the most commonly cited number in Canadian housing reports. It is also one of the most misleading. A city's average rent can stay flat or even decline while actual affordability worsens, because the units being rented are getting smaller.</p>
              <p>Price per square foot solves this. It tells you what you are actually paying for the space you get. A $2,000/month apartment sounds reasonable until you learn it is 350 square feet. That is $5.71 per square foot, which is expensive by most Canadian standards.</p>
              <p>When you provide your unit's square footage, we calculate your price per square foot and compare it to the neighbourhood median for the same unit type. This comparison accounts for 25% of your Fair Rent Canada Score and gives you a much more accurate picture of whether your rent is fair than the dollar amount alone.</p>
            </div>
          </div>

          {/* Data sources */}
          <div className="section-divider">Data sources</div>
          <p style={{ fontSize:13, color:"var(--t2)", lineHeight:1.65, marginBottom:12 }}>Four sources contribute to Fair Rent Canada estimates. Each measures something slightly different.</p>
          <table className="data-table" style={{ marginBottom:12 }}>
            <thead>
              <tr>
                <th>Source</th>
                <th>Update frequency</th>
                <th>Role in estimate</th>
                <th>Key limitation</th>
              </tr>
            </thead>
            <tbody>
              {SOURCES.map(s => (
                <tr key={s.name}>
                  <td>{s.name}</td>
                  <td style={{ fontFamily:"var(--mono)", fontSize:11, whiteSpace:"nowrap" }}>{s.freq}</td>
                  <td style={{ color:"var(--t2)" }}>{s.role}</td>
                  <td style={{ color:"var(--t3)", fontSize:12 }}>{s.limits}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Confidence scores */}
          <div className="section-divider">Confidence scores</div>
          <div className="panel">
            <div className="panel-body">
              <p style={{ marginBottom:12 }}>The confidence score reflects how much local renter data exists for your specific neighbourhood and unit type. It is not a judgment about whether your rent is fair. It is a signal about how precisely the estimate is calibrated.</p>
              {[
                { label:"High", range:"20+ local submissions", color:"#1a5c34", bg:"#f0f7f2", border:"#a8d5b5", desc:"The estimate is blended from a meaningful number of real rents from your exact neighbourhood and unit type, combined with CMHC data. The range is narrower and the score is more precise." },
                { label:"Medium", range:"8 to 19 local submissions", color:"#7a4f00", bg:"#fdf8f0", border:"#e8c97a", desc:"A moderate number of local submissions have been blended with the public data baseline. The estimate is reasonably well-calibrated but carries more uncertainty." },
                { label:"Low", range:"0 to 7 local submissions", color:"#8b1a1a", bg:"#fdf0f0", border:"#e8a8a8", desc:"There are not enough local submissions for this neighbourhood and unit type. The estimate relies primarily on CMHC data adjusted for neighbourhood. The range is wider and the score should be interpreted as approximate." },
              ].map(c => (
                <div key={c.label} style={{ display:"flex", gap:12, padding:"10px 0", borderBottom:"1px solid #ebebeb", alignItems:"flex-start" }}>
                  <div style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"2px 8px", background:c.bg, border:`1px solid ${c.border}`, flexShrink:0, marginTop:2 }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:c.color, display:"inline-block" }}/>
                    <span style={{ fontSize:11, fontWeight:700, color:c.color }}>{c.label}</span>
                  </div>
                  <div>
                    <div style={{ fontSize:11, fontFamily:"var(--mono)", color:"var(--t3)", marginBottom:3 }}>{c.range}</div>
                    <p style={{ fontSize:13, color:"var(--t2)", lineHeight:1.6 }}>{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Known limitations */}
          <div className="section-divider">Known limitations</div>
          <div className="panel">
            <div style={{ padding:"0 16px" }}>
              {LIMITATIONS.map(l => (
                <div key={l.label} className="lim-row">
                  <div className="lim-dot"/>
                  <div>
                    <div className="lim-title">{l.label}</div>
                    <div className="lim-body">{l.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="notice notice-amber">
            <strong>Not legal or financial advice.</strong> The results produced by Fair Rent Canada are market estimates for general informational purposes only. They are not professional appraisals, legal opinions, or financial advice. If you believe your landlord has charged rent above a legally permitted amount, contact your provincial tenant rights organization or a licensed paralegal.
          </div>

          {/* Data update schedule */}
          <div className="section-divider">Data update schedule</div>
          <div className="update-grid">
            {[
              { source:"CMHC Rental Market Survey", schedule:"Annual \u2014 October", note:"Neighbourhood multipliers are recalibrated after each release." },
              { source:"Rentals.ca National Report",  schedule:"Monthly \u2014 first week", note:"Used to update the asking-rent calibration between CMHC releases." },
              { source:"Renter submissions",           schedule:"Continuous \u2014 live", note:"Included immediately. Submissions older than 2 years are excluded." },
              { source:"Rent control guidelines",      schedule:"Annual \u2014 as announced", note:"Ontario and BC guideline rates are updated each year when announced." },
            ].map(({ source, schedule, note }) => (
              <div key={source} className="update-card">
                <div className="update-title">{source}</div>
                <div className="update-freq">{schedule}</div>
                <div className="update-note">{note}</div>
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="section-divider" style={{ marginTop:28 }}>Frequently asked questions</div>
          <div className="panel">
            <div style={{ padding:"0 16px" }}>
              {FAQS.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
            </div>
          </div>

          <div className="footer-note">
            Anonymous &middot; No personal data stored &middot; Not legal or financial advice &middot; {new Date().getFullYear()} Fair Rent Canada
          </div>
        </div>
      </div>
    </>
  );
}
