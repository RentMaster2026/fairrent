import { useState } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
  :root {
    --serif:'Instrument Serif',Georgia,serif;
    --sans:'Geist',-apple-system,BlinkMacSystemFont,sans-serif;
    --mono:'Geist Mono','Courier New',monospace;
    --bg:#f9fafb; --bg-card:#ffffff;
    --border:#e2e8f0; --border-mid:#cbd5e1;
    --t1:#0f172a; --t2:#475569; --t3:#94a3b8;
    --green:#16a34a; --green-lt:#f0fdf4; --green-bd:#bbf7d0;
    --nav:#0f172a;
    --r-sm:6px; --r-md:10px; --r-lg:14px;
    --sh:0 1px 4px rgba(0,0,0,.06);
    --max:700px;
  }
  html,body,#root{margin:0;padding:0;width:100%;background:var(--bg);}
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:var(--sans);color:var(--t1);-webkit-font-smoothing:antialiased;}
  .mcard{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-lg);box-shadow:var(--sh);padding:28px;}
  .slabel{font-family:var(--mono);font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.1em;margin-bottom:14px;}
  .source-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--r-md);padding:18px 20px;}
  .conf-row{display:flex;align-items:flex-start;gap:14px;padding:14px 0;border-bottom:1px solid var(--border);}
  .conf-row:last-child{border-bottom:none;}
  .lim-row{display:flex;gap:12px;padding:12px 0;border-bottom:1px solid var(--border);align-items:flex-start;}
  .lim-row:last-child{border-bottom:none;}
  .faq-item{border-bottom:1px solid var(--border);}
  .faq-item:last-child{border-bottom:none;}
  .faq-trigger{width:100%;display:flex;align-items:center;justify-content:space-between;padding:16px 0;background:none;border:none;cursor:pointer;text-align:left;gap:16px;font-family:var(--sans);}
  .faq-chevron{flex-shrink:0;color:var(--t3);transition:transform .2s;}
  .faq-chevron.open{transform:rotate(180deg);}
  .faq-body{overflow:hidden;transition:max-height .25s ease,opacity .2s ease;max-height:0;opacity:0;}
  .faq-body.open{max-height:600px;opacity:1;}
  .fade-up{opacity:0;transform:translateY(10px);animation:fu .45s ease forwards;}
  @keyframes fu{to{opacity:1;transform:none;}}
  .d1{animation-delay:.04s}.d2{animation-delay:.10s}.d3{animation-delay:.16s}
  .d4{animation-delay:.22s}.d5{animation-delay:.28s}.d6{animation-delay:.34s}
  .d7{animation-delay:.40s}.d8{animation-delay:.46s}.d9{animation-delay:.52s}
  @media(max-width:560px){.update-grid{grid-template-columns:1fr!important}.mcard{padding:20px 16px;}}
`;

const SOURCES = [
  {
    name:"CMHC Rental Market Survey",
    freq:"Annual — October",
    what:"Canada's most comprehensive survey of purpose-built rental buildings. Covers vacancy rates, average rents, and bedroom type data across major Canadian cities. Based on surveys of landlords and property managers.",
    limits:"Covers purpose-built rentals only, not condos rented by individual landlords. Lags by several months. Does not capture rent at the street or micro-neighbourhood level.",
    role:"Primary baseline for all estimates.",
  },
  {
    name:"Rentals.ca National Rent Report",
    freq:"Monthly",
    what:"Tracks asking rents from active listings across Canada. More current than CMHC and covers a broader mix of property types including condos, basement suites, and privately-owned rentals.",
    limits:"Reflects advertised asking prices, not signed rents. Landlords list at aspirational prices. May skew slightly high in competitive markets.",
    role:"Used to calibrate and update the CMHC baseline between annual surveys.",
  },
  {
    name:"Anonymous renter submissions",
    freq:"Ongoing — live",
    what:"Rent amounts submitted voluntarily by renters using this tool. Each submission includes neighbourhood, unit type, and monthly rent. No personal information is collected.",
    limits:"Self-reported data. Accuracy depends on honest submissions. Small sample sizes in less-used neighbourhoods reduce reliability.",
    role:"Blended into the estimate when enough local submissions exist. Improves neighbourhood precision over time.",
  },
];

const CONFIDENCE = [
  {
    dot:"#16a34a", label:"High", range:"20+ local submissions",
    desc:"The estimate is blended from a meaningful number of real rents from your exact neighbourhood and unit type, combined with CMHC data. The range is narrower. This is the most reliable level.",
  },
  {
    dot:"#d97706", label:"Medium", range:"8 to 19 local submissions",
    desc:"A moderate number of local submissions have been blended with the public data baseline. The estimate is reasonably well-calibrated but carries more uncertainty than a High confidence result.",
  },
  {
    dot:"#dc2626", label:"Low", range:"0 to 7 local submissions",
    desc:"There are not enough local submissions for this neighbourhood and unit type. The estimate relies almost entirely on CMHC and Rentals.ca data adjusted for neighbourhood. The range is wider to reflect this uncertainty.",
  },
];

const LIMITATIONS = [
  {label:"Asking rent vs. signed rent", body:"Rentals.ca data reflects advertised asking prices, not finalized lease amounts. Actual signed rents may be lower, especially in slower markets."},
  {label:"Condition and finishes", body:"The estimate does not account for unit condition, renovation quality, appliances, or building amenities. A renovated unit may reasonably command more than an unrenovated one nearby."},
  {label:"Lease type and term", body:"Month-to-month leases often carry a premium over fixed-term leases. Short-term furnished rentals are not reflected in this data at all."},
  {label:"New construction", body:"Newly built units often rent at a premium compared to existing stock. The tool does not separately model new versus older buildings."},
  {label:"Micro-location variation", body:"Neighbourhoods are broad categories. A unit on a quiet street and one on a major corridor in the same neighbourhood may be treated the same in this estimate."},
  {label:"Rapidly changing markets", body:"If the market has shifted significantly since the most recent data update, the estimate may lag. This is most likely during periods of rapid rent growth or sudden market cooling."},
];

const FAQS = [
  {
    q:"Why is the result a range and not one number?",
    a:"Because a single number would be misleading. Rents for comparable units in the same neighbourhood vary by hundreds of dollars based on building age, condition, finishes, and included amenities. A range honestly reflects that variation. We would rather give you a range you can trust than a precise number you cannot.",
  },
  {
    q:"How is the neighbourhood adjustment calculated?",
    a:"Each neighbourhood has a multiplier derived from observed rent premiums or discounts relative to the city average. These multipliers are calibrated from CMHC ward-level data and cross-referenced with Rentals.ca listing patterns. They are reviewed and updated after each CMHC annual release.",
  },
  {
    q:"How are anonymous renter submissions used?",
    a:"When enough submissions exist for a specific neighbourhood and unit type, they are blended with the public data baseline using a weighted average. The community weight increases with sample size, up to a maximum of 80 percent. Public data always contributes to every estimate.",
  },
  {
    q:"What stops people from submitting fake rents?",
    a:"Submissions outside a reasonable range (below $500 or above $8,000 per month) are excluded automatically. Submissions older than two years are also excluded. No single submission can dramatically shift the estimate because it is always blended with the public data baseline.",
  },
  {
    q:"Does the tool account for rent control?",
    a:"Yes, for Ontario units first occupied before November 15, 2018 and for all BC tenancies. When applicable, the result includes an estimated legal maximum based on provincial guideline rates back to your move-in year. These calculations are estimates only and should not be used as legal determinations.",
  },
  {
    q:"How is the historical comparison calculated?",
    a:"The tool uses today's market baseline for your neighbourhood and unit type, then deflates it backward to your move-in year using an annual inflation rate. It also shows what your rent would be today if it had tracked that rate since you moved in, giving you a sense of how your rent compares to general market movement.",
  },
  {
    q:"Can I use this result in a dispute with my landlord?",
    a:"No. This tool provides general market estimates for informational purposes only. It is not a professional appraisal, not legal advice, and should not be used as evidence in legal proceedings. If you are involved in a rent dispute, consult a licensed paralegal or tenant rights organization in your province.",
  },
  {
    q:"How often is the data updated?",
    a:"CMHC data is updated annually each fall. Rentals.ca data is updated monthly. Neighbourhood multipliers are reviewed after each CMHC release. Anonymous renter submissions are live and update continuously.",
  },
  {
    q:"Is my submission truly anonymous?",
    a:"Yes. No name, email, IP address, or device identifier is stored with your submission. The only data recorded is neighbourhood, unit type, monthly rent, move-in year, and whether parking or utilities are included. There is no way to trace a submission back to an individual.",
  },
];

function FaqItem({q,a}){
  const[open,setOpen]=useState(false);
  return(
    <div className="faq-item">
      <button className="faq-trigger" onClick={()=>setOpen(o=>!o)}>
        <span style={{fontSize:14,fontWeight:600,color:"var(--t1)",lineHeight:1.4}}>{q}</span>
        <span className={`faq-chevron${open?" open":""}`}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
      <div className={`faq-body${open?" open":""}`}>
        <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.75,paddingBottom:16}}>{a}</p>
      </div>
    </div>
  );
}

export function MethodologyShort(){
  return(
    <div style={{fontFamily:"'Geist',-apple-system,sans-serif"}}>
      <div style={{fontFamily:"'Geist Mono',monospace",fontSize:10,color:"#94a3b8",textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>How this estimate was built</div>
      <p style={{fontSize:13,color:"#475569",lineHeight:1.75,marginBottom:14}}>The benchmark starts with CMHC's annual Rental Market Survey data and Rentals.ca's monthly reports, adjusted for your neighbourhood and unit type. When enough anonymous renter submissions exist for your specific area, they are blended in using a weighted average.</p>
      <p style={{fontSize:13,color:"#475569",lineHeight:1.75,marginBottom:14}}>The result is a range, not a single number, because rents for comparable units vary based on building age, condition, and included amenities. The confidence score tells you how much local data is behind the estimate.</p>
      <p style={{fontSize:12,color:"#94a3b8",lineHeight:1.65}}>This is a market estimate for general reference only. It is not legal advice and should not be used in rent disputes or legal proceedings.</p>
    </div>
  );
}

export default function MethodologyPage({onBack}){
  return(
    <><style>{CSS}</style>
    <div style={{minHeight:"100vh"}}>

      <header style={{background:"var(--nav)",borderBottom:"1px solid rgba(255,255,255,.06)",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:"var(--max)",margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <a href="https://fairrent.ca" style={{width:28,height:28,background:"var(--green)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none",flexShrink:0}}>
              <span style={{fontFamily:"var(--mono)",fontSize:11,fontWeight:500,color:"#fff"}}>FR</span>
            </a>
            <span style={{fontFamily:"var(--sans)",fontSize:14,fontWeight:600,color:"#f8fafc",letterSpacing:"-.01em"}}>Fair Rent Canada</span>
          </div>
          {onBack&&(
            <button onClick={onBack} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"var(--mono)",fontSize:11,color:"rgba(255,255,255,.4)",letterSpacing:".05em",textTransform:"uppercase"}}>Back</button>
          )}
        </div>
      </header>

      <main style={{maxWidth:"var(--max)",margin:"0 auto",padding:"52px 20px 96px",display:"flex",flexDirection:"column",gap:14}}>

        <div className="fade-up d1" style={{marginBottom:20}}>
          <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--green)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:16}}>Methodology</div>
          <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(28px,4.5vw,42px)",fontWeight:400,color:"var(--t1)",lineHeight:1.15,letterSpacing:"-.02em",marginBottom:16}}>
            How Fair Rent Canada<br/><span style={{fontStyle:"italic"}}>builds its estimates.</span>
          </h1>
          <p style={{fontSize:16,color:"var(--t2)",lineHeight:1.8,maxWidth:560}}>
            This page explains where the data comes from, how it is combined, and what the results can and cannot tell you. Transparency is the foundation of a tool worth trusting.
          </p>
        </div>

        {/* What the tool does */}
        <div className="mcard fade-up d2">
          <div className="slabel">What this tool does</div>
          <p style={{fontSize:15,color:"var(--t2)",lineHeight:1.8,marginBottom:14}}>Fair Rent Canada compares your current rent against a neighbourhood-level market benchmark. The benchmark is built from public housing data published by CMHC and Rentals.ca, adjusted for your specific neighbourhood and unit type, and optionally blended with anonymous rent data submitted by other renters in the same area.</p>
          <p style={{fontSize:15,color:"var(--t2)",lineHeight:1.8,marginBottom:14}}>The result is not a verdict. It is a reference point. It tells you where your rent sits relative to the estimated market range for comparable units. What you do with that information is up to you.</p>
          <p style={{fontSize:15,color:"var(--t2)",lineHeight:1.8}}>The tool also provides province-specific context on rent control guidelines where they apply, and a historical comparison showing how the market has changed since you moved in.</p>
        </div>

        {/* Data sources */}
        <div className="mcard fade-up d3">
          <div className="slabel">Data sources</div>
          <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.75,marginBottom:20}}>Three sources contribute to every estimate. Each measures something slightly different. Understanding what each does and does not measure is important context for reading results.</p>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {SOURCES.map((s,i)=>(
              <div key={i} className="source-card">
                <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:10,flexWrap:"wrap"}}>
                  <div style={{fontSize:14,fontWeight:700,color:"var(--t1)",letterSpacing:"-.01em"}}>{s.name}</div>
                  <span style={{padding:"2px 9px",background:"var(--green-lt)",border:"1px solid var(--green-bd)",borderRadius:100,fontFamily:"var(--mono)",fontSize:9,color:"var(--green)",letterSpacing:".06em",textTransform:"uppercase",flexShrink:0}}>{s.freq}</span>
                </div>
                <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.7,marginBottom:10}}>{s.what}</p>
                <div style={{paddingTop:10,borderTop:"1px solid var(--border)"}}>
                  <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:5}}>Limitations</div>
                  <p style={{fontSize:12,color:"var(--t3)",lineHeight:1.65}}>{s.limits}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How blending works */}
        <div className="mcard fade-up d4">
          <div className="slabel">How blending works</div>
          <p style={{fontSize:15,color:"var(--t2)",lineHeight:1.8,marginBottom:20}}>Every estimate starts with a public data baseline. When enough anonymous renter submissions exist for your specific neighbourhood and unit type, they are blended in using a weighted average. The weight increases with sample size.</p>
          <div style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--r-md)",overflow:"hidden",marginBottom:20}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",borderBottom:"1px solid var(--border)"}}>
              {["Local submissions","Community weight","What this means"].map(h=>(
                <div key={h} style={{padding:"10px 14px",fontFamily:"var(--mono)",fontSize:9,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".08em",borderRight:"1px solid var(--border)"}}>{h}</div>
              ))}
            </div>
            {[
              ["0 to 4",   "0%",  "Public data only"],
              ["5 to 9",   "20%", "Mostly public, slight community adjustment"],
              ["10 to 19", "40%", "Balanced blend"],
              ["20 to 49", "60%", "Community-weighted, public as anchor"],
              ["50+",      "80%", "Primarily community data"],
            ].map(([range,weight,meaning],i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",borderBottom:i<4?"1px solid var(--border)":"none"}}>
                <div style={{padding:"10px 14px",fontFamily:"var(--mono)",fontSize:13,color:"var(--t1)",borderRight:"1px solid var(--border)"}}>{range}</div>
                <div style={{padding:"10px 14px",fontFamily:"var(--mono)",fontSize:13,color:weight==="0%"?"var(--t3)":"var(--green)",borderRight:"1px solid var(--border)"}}>{weight}</div>
                <div style={{padding:"10px 14px",fontSize:12,color:"var(--t2)"}}>{meaning}</div>
              </div>
            ))}
          </div>
          <p style={{fontSize:13,color:"var(--t3)",lineHeight:1.7}}>Public data always contributes to the estimate. The community weight never reaches 100 percent. This ensures every estimate stays grounded in verified market data, even in areas with many submissions.</p>
        </div>

        {/* Why a range */}
        <div className="mcard fade-up d5">
          <div className="slabel">Why results are a range</div>
          <p style={{fontSize:15,color:"var(--t2)",lineHeight:1.8,marginBottom:14}}>A single number would suggest a level of precision the data does not support. Rents for comparable units in the same neighbourhood vary by hundreds of dollars depending on building age, condition, floor level, natural light, appliances, and landlord pricing strategy. Presenting a single number as the fair rent would be misleading.</p>
          <p style={{fontSize:15,color:"var(--t2)",lineHeight:1.8}}>Instead, the result shows an estimated fair range. The width of that range is tied to the confidence level. A High confidence estimate has a narrower range because more local data is available to constrain it. A Low confidence estimate has a wider range because the underlying data is less specific.</p>
        </div>

        {/* Confidence scores */}
        <div className="mcard fade-up d6">
          <div className="slabel">Confidence scores</div>
          <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.75,marginBottom:20}}>The confidence score reflects how much local renter data exists for your specific neighbourhood and unit type. It is not a judgment about whether your rent is fair. It is a signal about how precisely the estimate is calibrated.</p>
          <div>
            {CONFIDENCE.map((c,i)=>(
              <div key={i} className="conf-row">
                <div style={{width:8,height:8,borderRadius:"50%",background:c.dot,flexShrink:0,marginTop:5}}/>
                <div style={{flex:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:5}}>
                    <span style={{fontSize:14,fontWeight:700,color:"var(--t1)"}}>{c.label}</span>
                    <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)",letterSpacing:".04em"}}>{c.range}</span>
                  </div>
                  <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.65}}>{c.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why local data matters */}
        <div className="mcard fade-up d7">
          <div className="slabel">Why local data matters</div>
          <p style={{fontSize:15,color:"var(--t2)",lineHeight:1.8,marginBottom:14}}>National and city-level averages miss a lot. A neighbourhood one kilometre from the city centre can rent at 20 to 30 percent more than one two kilometres out. CMHC publishes ward-level data, but ward boundaries are large and do not map cleanly onto how renters experience their area.</p>
          <p style={{fontSize:15,color:"var(--t2)",lineHeight:1.8,marginBottom:18}}>Anonymous renter submissions provide granular real-world data at the neighbourhood level. When you submit your rent, you are not just checking your own situation. You are improving the estimate for every renter who uses the tool in your neighbourhood after you.</p>
          <div style={{padding:"16px 20px",background:"var(--green-lt)",border:"1px solid var(--green-bd)",borderRadius:"var(--r-md)"}}>
            <p style={{fontSize:13,color:"#166534",lineHeight:1.7}}><strong>This is a collective tool.</strong> Its accuracy improves as more renters contribute. If your neighbourhood shows a Low confidence score, your submission directly increases the reliability of estimates for your area.</p>
          </div>
        </div>

        {/* Limitations */}
        <div className="mcard fade-up d7">
          <div className="slabel">Known limitations</div>
          <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.75,marginBottom:18}}>Every data tool has limitations. These are the ones most likely to affect your result.</p>
          <div>
            {LIMITATIONS.map((l,i)=>(
              <div key={i} className="lim-row">
                <div style={{width:4,height:4,borderRadius:"50%",background:"var(--t3)",flexShrink:0,marginTop:7}}/>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--t1)",marginBottom:4}}>{l.label}</div>
                  <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.65}}>{l.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Not legal advice */}
        <div className="mcard fade-up d8" style={{background:"#fffbeb",borderColor:"#fde68a"}}>
          <div className="slabel" style={{color:"#b45309"}}>Not legal or financial advice</div>
          <p style={{fontSize:15,color:"#78350f",lineHeight:1.8,marginBottom:14}}>The results produced by Fair Rent Canada are market estimates for general informational purposes only. They are not professional appraisals, legal opinions, or financial advice.</p>
          <p style={{fontSize:14,color:"#92400e",lineHeight:1.75}}>If you believe your landlord has charged rent above a legally permitted amount, contact your provincial tenant rights organization or a licensed paralegal. In Ontario, file a T1 application with the Landlord and Tenant Board. In BC, contact the Residential Tenancy Branch. This tool cannot make that determination for you.</p>
        </div>

        {/* Update schedule */}
        <div className="mcard fade-up d8">
          <div className="slabel">Data update schedule</div>
          <div className="update-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            {[
              {source:"CMHC Rental Market Survey",  schedule:"Annual — October",         note:"Neighbourhood multipliers are recalibrated after each release."},
              {source:"Rentals.ca National Report",  schedule:"Monthly — first week",     note:"Used to update the asking-rent calibration between CMHC releases."},
              {source:"Renter submissions",           schedule:"Continuous — live",        note:"Included immediately. Submissions older than 2 years are excluded."},
              {source:"Rent control guidelines",      schedule:"Annual — as announced",   note:"Ontario and BC guideline rates are updated each year when announced."},
            ].map(({source,schedule,note})=>(
              <div key={source} style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",padding:"14px 16px"}}>
                <div style={{fontSize:13,fontWeight:600,color:"var(--t1)",marginBottom:4}}>{source}</div>
                <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--green)",letterSpacing:".05em",marginBottom:6}}>{schedule}</div>
                <p style={{fontSize:11,color:"var(--t3)",lineHeight:1.55}}>{note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mcard fade-up d9">
          <div className="slabel">Frequently asked questions</div>
          {FAQS.map((item,i)=><FaqItem key={i} q={item.q} a={item.a}/>)}
        </div>

        {/* CTA */}
        <div className="fade-up d9" style={{textAlign:"center",paddingTop:20}}>
          <p style={{fontSize:13,color:"var(--t3)",lineHeight:1.7,marginBottom:16}}>Questions about the methodology not answered here?</p>
          <a href="https://fairrent.ca" style={{display:"inline-flex",alignItems:"center",gap:6,padding:"10px 20px",background:"var(--t1)",color:"#fff",borderRadius:"var(--r-md)",fontSize:13,fontWeight:600,textDecoration:"none",transition:"opacity .15s"}}
            onMouseOver={e=>e.currentTarget.style.opacity=".85"} onMouseOut={e=>e.currentTarget.style.opacity="1"}>
            Back to Fair Rent Canada
          </a>
        </div>

      </main>

      <footer style={{borderTop:"1px solid var(--border)",padding:"20px",textAlign:"center",background:"var(--bg)"}}>
        <p style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)",letterSpacing:".04em"}}>
          Anonymous · No personal data stored · Not legal or financial advice · {new Date().getFullYear()} Fair Rent Canada
        </p>
      </footer>
    </div>
    </>
  );
}
