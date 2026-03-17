import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import MethodologyPage from "./MethodologyPage";
import { AboutPage, PrivacyPage, TermsPage, FaqPage, ContactPage } from "./TrustPages";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ─── Data ─────────────────────────────────────────────────────────────────────

const CITIES = {
  ottawa:    { name:"Ottawa",    province:"Ontario",          accent:"#16a34a", accentLight:"#f0fdf4", accentBorder:"#bbf7d0", rentControlled:true,  cooldown:"ottawa_fair_rent_last_submit",    bases:{ bachelor:1550,"1br":2026,"2br":2530,"3br":3100,"3plus":3600 }, inflation:0.038 },
  toronto:   { name:"Toronto",   province:"Ontario",          accent:"#2563eb", accentLight:"#eff6ff", accentBorder:"#bfdbfe", rentControlled:true,  cooldown:"toronto_fair_rent_last_submit",   bases:{ bachelor:1800,"1br":2400,"2br":3100,"3br":3900,"3plus":4800 }, inflation:0.040 },
  vancouver: { name:"Vancouver", province:"British Columbia", accent:"#0891b2", accentLight:"#ecfeff", accentBorder:"#a5f3fc", rentControlled:false, cooldown:"vancouver_fair_rent_last_submit", bases:{ bachelor:1950,"1br":2600,"2br":3400,"3br":4300,"3plus":5200 }, inflation:0.040 },
};

const HOODS = {
  ottawa:    ["Alta Vista","Barrhaven","Bayshore / Britannia","Beacon Hill","Blackburn Hamlet","Byward Market","Carlington","Centretown","Chinatown / Lebreton","Downtown Core","Elmvale Acres","Findlay Creek","Glebe","Greenboro","Hintonburg","Kanata","Little Italy","Lowertown","Manor Park","Manotick","Nepean","New Edinburgh","Old Ottawa South","Orleans","Overbrook","Queensway Terrace","Rideau-Vanier","Riverside South","Rockcliffe Park","Sandy Hill","Stittsville","Vanier","Wellington Village","Westboro"],
  toronto:   ["Annex","Bloorcourt","Chinatown","Davisville","Distillery District","Downtown Core","East End","East York","Etobicoke","Forest Hill","Greektown","Junction","Kensington Market","Lawrence Park","Leaside","Leslieville","Liberty Village","Little Italy","Midtown","North York","Parkdale","Queen West","Riverside","Rosedale","Scarborough","St. Lawrence","Swansea","Weston","Willowdale","Yorkville"],
  vancouver: ["Burnaby","Cambie","Chinatown","Coal Harbour","Commercial Drive","Downtown","Dunbar","Fairview","Fraser","Gastown","Grandview Woodland","Hastings Sunrise","Kerrisdale","Kitsilano","Main Street","Marpole","Mount Pleasant","New Westminster","North Vancouver","Oakridge","Point Grey","Richmond","Riley Park","Shaughnessy","South Granville","Strathcona","Sunset","West End","West Vancouver","Yaletown"],
};

const HOOD_MULTS = {
  ottawa:    {"Alta Vista":0.95,"Barrhaven":0.92,"Bayshore / Britannia":0.96,"Beacon Hill":0.93,"Blackburn Hamlet":0.91,"Byward Market":1.18,"Carlington":0.88,"Centretown":1.08,"Chinatown / Lebreton":1.02,"Downtown Core":1.15,"Elmvale Acres":0.90,"Findlay Creek":0.89,"Glebe":1.20,"Greenboro":0.88,"Hintonburg":1.10,"Kanata":0.97,"Little Italy":1.07,"Lowertown":1.00,"Manor Park":1.06,"Manotick":0.94,"Nepean":0.93,"New Edinburgh":1.16,"Old Ottawa South":1.05,"Orleans":0.90,"Overbrook":0.90,"Queensway Terrace":0.94,"Rideau-Vanier":0.87,"Riverside South":0.91,"Rockcliffe Park":1.28,"Sandy Hill":1.04,"Stittsville":0.89,"Vanier":0.85,"Wellington Village":1.12,"Westboro":1.18},
  toronto:   {"Annex":1.10,"Bloorcourt":1.00,"Chinatown":0.95,"Davisville":1.08,"Distillery District":1.20,"Downtown Core":1.18,"East End":0.94,"East York":0.92,"Etobicoke":0.87,"Forest Hill":1.32,"Greektown":1.02,"Junction":0.97,"Kensington Market":0.96,"Lawrence Park":1.25,"Leaside":1.14,"Leslieville":1.04,"Liberty Village":1.12,"Little Italy":1.05,"Midtown":1.07,"North York":0.90,"Parkdale":0.93,"Queen West":1.15,"Riverside":1.01,"Rosedale":1.35,"Scarborough":0.82,"St. Lawrence":1.09,"Swansea":1.03,"Weston":0.86,"Willowdale":0.89,"Yorkville":1.30},
  vancouver: {"Burnaby":0.93,"Cambie":1.08,"Chinatown":0.89,"Coal Harbour":1.35,"Commercial Drive":0.97,"Downtown":1.20,"Dunbar":1.14,"Fairview":1.10,"Fraser":0.95,"Gastown":1.00,"Grandview Woodland":0.98,"Hastings Sunrise":0.94,"Kerrisdale":1.16,"Kitsilano":1.22,"Main Street":1.02,"Marpole":0.87,"Mount Pleasant":1.04,"New Westminster":0.90,"North Vancouver":1.07,"Oakridge":1.05,"Point Grey":1.30,"Richmond":0.92,"Riley Park":1.01,"Shaughnessy":1.28,"South Granville":1.12,"Strathcona":0.91,"Sunset":0.88,"West End":1.18,"West Vancouver":1.38,"Yaletown":1.25},
};

const ONTARIO_GUIDELINES = {2010:0.021,2011:0.009,2012:0.031,2013:0.025,2014:0.008,2015:0.016,2016:0.020,2017:0.015,2018:0.018,2019:0.018,2020:0.022,2021:0.000,2022:0.012,2023:0.025,2024:0.025,2025:0.025,2026:0.021};

const UNIT_KEYS   = ["bachelor","1br","2br","3br","3plus"];
const UNIT_LABELS = { bachelor:"Bachelor / Studio","1br":"1 Bedroom","2br":"2 Bedroom","3br":"3 Bedroom","3plus":"3+ Bedroom" };

const SECTIONS    = ["Your location","About your unit","What's included","Building details","Your tenancy","Your rent"];
const STEP_SECTIONS = [0,0,1,1,1,1,2,2,2,2,2,3,3,4,4,5];
const TOTAL_STEPS = 16;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = v => Number(v).toLocaleString("en-CA",{style:"currency",currency:"CAD",maximumFractionDigits:0});

function calcGuidelineCap(moveInRent, moveInYear) {
  const cur = new Date().getFullYear(); let r = moveInRent;
  for(let yr=moveInYear+1; yr<=cur; yr++) r *= 1+(ONTARIO_GUIDELINES[yr]??0.025);
  return Math.round(r);
}

function median(arr) {
  if(!arr.length) return null;
  const s=[...arr].sort((a,b)=>a-b), m=Math.floor(s.length/2);
  return s.length%2 ? s[m]:(s[m-1]+s[m])/2;
}

function communityWeight(n){if(n<5)return 0;if(n<10)return 0.2;if(n<20)return 0.4;if(n<50)return 0.6;return 0.8;}

function getConf(n){
  if(n>=20) return{label:"High",   dot:"#16a34a",textColor:"#166534",bg:"#f0fdf4",border:"#bbf7d0",desc:"Based on "+n+" local submissions blended with CMHC data."};
  if(n>=8)  return{label:"Medium", dot:"#d97706",textColor:"#92400e",bg:"#fffbeb",border:"#fde68a",desc:"Based on "+n+" local submissions blended with CMHC data."};
  return         {label:"Low",    dot:"#dc2626",textColor:"#991b1b",bg:"#fef2f2",border:"#fecaca",desc:"Based primarily on CMHC data. Your submission improves accuracy here."};
}

function getVerdict(rent, low, high) {
  if(rent < low)  return{pos:"below", headline:"Your rent is below the estimated fair range.", sub:"You are paying "+fmt(low-rent)+"/mo less than the lower end of comparable units in this area.", color:"#1d4ed8",bg:"#eff6ff",border:"#bfdbfe"};
  if(rent > high) return{pos:"above", headline:"Your rent is above the estimated fair range.", sub:"You are paying "+fmt(rent-high)+"/mo more than the upper end of comparable units in this area.", color:"#b45309",bg:"#fffbeb",border:"#fde68a"};
  return                {pos:"within",headline:"Your rent is within the estimated fair range.", sub:"Your rent falls within the estimated range for comparable units in this area.", color:"#16a34a",bg:"#f0fdf4",border:"#bbf7d0"};
}

// ─── CSS ──────────────────────────────────────────────────────────────────────

const CSS = [
  "@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');",
  ":root{--serif:'Instrument Serif',Georgia,serif;--sans:'Geist',-apple-system,sans-serif;--mono:'Geist Mono','Courier New',monospace;--bg:#f9fafb;--bg-card:#fff;--border:#e2e8f0;--border-mid:#cbd5e1;--t1:#0f172a;--t2:#475569;--t3:#94a3b8;--nav:#0f172a;--r-sm:6px;--r-md:10px;--r-lg:14px;--sh:0 1px 4px rgba(0,0,0,.06);--max:560px;}",
  "html,body,#root{margin:0;padding:0;width:100%;background:var(--bg);}",
  "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}",
  "body{font-family:var(--sans);color:var(--t1);-webkit-font-smoothing:antialiased;}",
  "input,select,button{font-family:var(--sans);}",
  "input:focus,select:focus{outline:none;border-color:var(--accent,#16a34a)!important;box-shadow:0 0 0 3px var(--accent-ring,rgba(22,163,74,.15))!important;}",
  "input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}",
  ".opt{width:100%;padding:14px 18px;background:var(--bg-card);border:1.5px solid var(--border);border-radius:var(--r-md);color:var(--t2);font-size:14px;font-weight:500;cursor:pointer;text-align:left;transition:all .15s;display:flex;align-items:center;gap:10px;}",
  ".opt:hover{border-color:var(--border-mid);color:var(--t1);}",
  ".opt.on{border-color:var(--accent,#16a34a);background:var(--accent-light,#f0fdf4);color:var(--accent,#16a34a);font-weight:600;}",
  ".opt-grid{display:grid;gap:10px;}",
  ".opt-grid.cols2{grid-template-columns:1fr 1fr;}",
  ".chip{padding:10px 16px;background:var(--bg-card);border:1.5px solid var(--border);border-radius:100px;color:var(--t2);font-size:13px;font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap;}",
  ".chip:hover{border-color:var(--border-mid);}",
  ".chip.on{border-color:var(--accent,#16a34a);background:var(--accent-light,#f0fdf4);color:var(--accent,#16a34a);font-weight:600;}",
  ".chips{display:flex;flex-wrap:wrap;gap:8px;}",
  ".big-inp{width:100%;padding:16px 18px;font-size:22px;font-family:var(--mono);font-weight:500;text-align:center;background:var(--bg-card);border:1.5px solid var(--border);border-radius:var(--r-md);color:var(--t1);transition:border-color .15s,box-shadow .15s;}",
  ".btn-next{width:100%;padding:14px;background:var(--t1);color:#fff;border:none;border-radius:var(--r-md);font-size:14px;font-weight:600;cursor:pointer;transition:background .15s;letter-spacing:.01em;}",
  ".btn-next:hover:not(:disabled){background:#1e293b;}",
  ".btn-next:disabled{opacity:.35;cursor:not-allowed;}",
  ".btn-back{background:none;border:none;cursor:pointer;font-family:var(--mono);font-size:11px;color:var(--t3);letter-spacing:.06em;text-transform:uppercase;padding:0;display:flex;align-items:center;gap:4px;}",
  ".btn-back:hover{color:var(--t2);}",
  ".btn-ghost{padding:11px 20px;background:transparent;border:1.5px solid var(--border);border-radius:var(--r-md);color:var(--t2);font-size:13px;font-weight:600;cursor:pointer;transition:all .15s;}",
  ".btn-ghost:hover{border-color:var(--border-mid);color:var(--t1);}",
  ".progress-track{height:3px;background:var(--border);border-radius:3px;overflow:hidden;}",
  ".progress-fill{height:3px;border-radius:3px;transition:width .4s ease;}",
  ".breakdown-row{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--border);}",
  ".breakdown-row:last-child{border-bottom:none;}",
  ".range-bar-track{height:5px;border-radius:5px;background:var(--border);position:relative;margin:10px 0 6px;}",
  ".slabel{font-family:var(--mono);font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;}",
  ".card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-lg);box-shadow:var(--sh);}",
  ".share-btn{display:flex;align-items:center;justify-content:center;padding:9px 12px;border-radius:var(--r-sm);font-family:var(--mono);font-size:11px;font-weight:500;text-decoration:none;cursor:pointer;border:none;letter-spacing:.03em;transition:opacity .15s;}",
  ".share-btn:hover{opacity:.8;}",
  ".step-wrap{animation:stepIn .22s ease-out;}",
  "@keyframes stepIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:none}}",
  ".step-wrap.back{animation:stepInBack .22s ease-out;}",
  "@keyframes stepInBack{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:none}}",
  ".live-dot{width:6px;height:6px;border-radius:50%;flex-shrink:0;animation:blink 2.4s ease-in-out infinite;}",
  "@keyframes blink{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}",
  ".err{font-size:11px;color:#dc2626;margin-top:6px;}",
  ".fade-up{opacity:0;transform:translateY(10px);animation:fu .4s ease forwards;}",
  "@keyframes fu{to{opacity:1;transform:none;}}",
  ".d1{animation-delay:.04s}.d2{animation-delay:.09s}.d3{animation-delay:.14s}.d4{animation-delay:.19s}.d5{animation-delay:.24s}.d6{animation-delay:.29s}",
  "@media(max-width:420px){.opt-grid.cols2{grid-template-columns:1fr!important}}",
  "@media(prefers-reduced-motion:reduce){.step-wrap,.step-wrap.back,.fade-up{animation:none!important;opacity:1!important;transform:none!important;}}"
].join("\n");

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const curYear = new Date().getFullYear();

  // Page routing
  const [page, setPage] = useState("home"); // home | methodology | about | privacy | terms | faq | contact

  const [step,    setStep]    = useState(0);
  const [dir,     setDir]     = useState("fwd");
  const [err,     setErr]     = useState("");
  const [result,  setResult]  = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [copied,  setCopied]  = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const copyRef = useRef(null);

  const [city,         setCity]         = useState("");
  const [hood,         setHood]         = useState("");
  const [unitType,     setUnitType]     = useState("");
  const [sqft,         setSqft]         = useState("");
  const [buildingType, setBuildingType] = useState("");
  const [buildingAge,  setBuildingAge]  = useState("");
  const [furnished,    setFurnished]    = useState("");
  const [amenities,    setAmenities]    = useState([]);
  const [outdoor,      setOutdoor]      = useState("");
  const [parking,      setParking]      = useState("");
  const [utilities,    setUtilities]    = useState([]);
  const [petFriendly,  setPetFriendly]  = useState("");
  const [transit,      setTransit]      = useState("");
  const [moveInYear,   setMoveInYear]   = useState("");
  const [preNov2018,   setPreNov2018]   = useState("");
  const [rent,         setRent]         = useState("");

  const cityData    = CITIES[city] || null;
  const accent      = cityData?.accent       || "#16a34a";
  const accentLight = cityData?.accentLight  || "#f0fdf4";
  const accentBorder= cityData?.accentBorder || "#bbf7d0";

  const showRentControl = city === "ottawa" || city === "toronto";
  const effectiveTotal  = showRentControl ? TOTAL_STEPS : TOTAL_STEPS - 1;

  // Page routing — trust pages
  if(page === "methodology") return <><style>{CSS}</style><MethodologyPage onBack={()=>setPage("home")}/></>;
  if(page === "about")       return <><style>{CSS}</style><AboutPage       onBack={()=>setPage("home")}/></>;
  if(page === "privacy")     return <><style>{CSS}</style><PrivacyPage     onBack={()=>setPage("home")}/></>;
  if(page === "terms")       return <><style>{CSS}</style><TermsPage       onBack={()=>setPage("home")}/></>;
  if(page === "faq")         return <><style>{CSS}</style><FaqPage         onBack={()=>setPage("home")}/></>;
  if(page === "contact")     return <><style>{CSS}</style><ContactPage     onBack={()=>setPage("home")}/></>;

  function go(n, direction="fwd") {
    setErr(""); setDir(direction); setStep(n); window.scrollTo(0,0);
  }

  function next() {
    const e = validate(step);
    if(e){ setErr(e); return; }
    setErr("");
    if(step === 13 && !showRentControl){ go(15); return; }
    go(step+1);
  }

  function back() {
    if(step === 0) return;
    if(step === 15 && !showRentControl){ go(13,"back"); return; }
    go(step-1,"back");
  }

  function toggle(arr, setArr, val) {
    setArr(arr.includes(val) ? arr.filter(x=>x!==val) : [...arr,val]);
  }

  function validate(s) {
    if(s===0  && !city)         return "Please select your city.";
    if(s===1  && !hood)         return "Please select a neighbourhood.";
    if(s===2  && !unitType)     return "Please select a unit type.";
    if(s===3  && !sqft)         return "Please select a size range.";
    if(s===4  && !buildingType) return "Please select a building type.";
    if(s===5  && !buildingAge)  return "Please select a building age.";
    if(s===6  && !furnished)    return "Please select one.";
    if(s===8  && !outdoor)      return "Please select one.";
    if(s===9  && !parking)      return "Please select one.";
    if(s===11 && !petFriendly)  return "Please select one.";
    if(s===12 && !transit)      return "Please select one.";
    if(s===13) {
      const yr = +moveInYear;
      if(!moveInYear)           return "Please enter the year you moved in.";
      if(yr < 1980)             return "Please enter a year from 1980 onward.";
      if(yr > curYear)          return "That year hasn't happened yet.";
    }
    if(s===14 && showRentControl && !preNov2018) return "Please select one.";
    if(s===15) {
      const r = +rent;
      if(!rent)    return "Please enter your monthly rent.";
      if(r < 300)  return "That seems low. Please double-check your rent amount.";
      if(r > 15000)return "That seems high. Please double-check your rent amount.";
    }
    return "";
  }

  async function calculate() {
    const e = validate(15);
    if(e){ setErr(e); return; }
    setSaving(true); setErr("");

    const rentNum  = +rent;
    const yr       = +moveInYear;
    const sameYear = yr === curYear;
    const c        = cityData;
    const mults    = HOOD_MULTS[city] || {};
    const mult     = mults[hood] || 1;
    const base     = c.bases[unitType] || c.bases["1br"];
    const parkAdj  = parking==="yes" ? 250 : 0;
    const utilAdj  = utilities.length > 0 ? 120 : 0;
    const hoodAdj  = Math.round(base * mult) - base;

    let smartBench = Math.round(base * mult);
    let communityN = 0;
    try {
      const cutoff = new Date(); cutoff.setFullYear(curYear-2);
      const{data} = await supabase.from("rent_submissions").select("monthly_rent")
        .eq("city",city).eq("neighborhood",hood).eq("unit_type",unitType)
        .gte("monthly_rent",500).lte("monthly_rent",8000)
        .gte("created_at",cutoff.toISOString());
      if(data?.length){
        communityN = data.length;
        const w = communityWeight(communityN);
        const med = median(data.map(r=>r.monthly_rent));
        if(w>0) smartBench = Math.round(smartBench*(1-w)+med*w);
      }
    } catch{}

    const communityAdj = Math.round(smartBench - Math.round(base * mult));
    const bench        = smartBench + parkAdj + utilAdj;
    const conf         = getConf(communityN);
    const spread       = conf.label==="High"?0.08:conf.label==="Medium"?0.13:0.19;
    const rangeLow     = Math.round(bench*(1-spread)/50)*50;
    const rangeHigh    = Math.round(bench*(1+spread)/50)*50;
    const verdict      = getVerdict(rentNum, rangeLow, rangeHigh);
    const yearsAgo     = Math.max(0, curYear-yr);
    const moveinBench  = Math.round(bench * Math.pow(1-c.inflation, yearsAgo));
    const guidelineCap = (!sameYear && preNov2018==="yes") ? calcGuidelineCap(moveinBench, yr) : null;
    const isRentCtrl   = preNov2018==="yes";

    setResult({ rentNum, bench, rangeLow, rangeHigh, conf, verdict, communityN,
      base, hoodAdj, parkAdj, utilAdj, communityAdj,
      moveinBench, guidelineCap, isRentCtrl, sameYear, yr });

    try {
      const ck   = c.cooldown;
      const last = Number(localStorage.getItem(ck)||0);
      if(Date.now()-last >= 60000){
        const{error} = await supabase.from("rent_submissions").insert({
          neighborhood:hood, unit_type:unitType, monthly_rent:rentNum,
          move_in_year:yr, includes_parking:parking==="yes",
          includes_utilities:utilities.length>0, city,
        });
        if(!error) localStorage.setItem(ck, String(Date.now()));
      }
    } catch{}
    setSaving(false);
  }

  function shareText() {
    if(!result) return "";
    return "My "+UNIT_LABELS[unitType]+" in "+hood+" is "+result.verdict.pos+" the estimated fair rent range. Range: "+fmt(result.rangeLow)+"-"+fmt(result.rangeHigh)+"/mo. Check yours at fairrent.ca";
  }

  function copyLink() {
    navigator.clipboard?.writeText("https://fairrent.ca");
    setCopied(true); clearTimeout(copyRef.current);
    copyRef.current = setTimeout(()=>setCopied(false),2000);
  }

  function reset() {
    setResult(null); setStep(0); setDir("fwd"); setErr(""); setCity(""); setHood(""); setUnitType(""); setSqft(""); setBuildingType(""); setBuildingAge(""); setFurnished(""); setAmenities([]); setOutdoor(""); setParking(""); setUtilities([]); setPetFriendly(""); setTransit(""); setMoveInYear(""); setPreNov2018(""); setRent(""); setShareOpen(false);
  }

  // ─── Result ───────────────────────────────────────────────────────────────

  if(result) {
    const r      = result;
    const barMin  = Math.round(r.rangeLow  * 0.85 / 50) * 50;
    const barMax  = Math.round(r.rangeHigh * 1.15 / 50) * 50;
    const barSpan = barMax - barMin;
    const lowPct  = ((r.rangeLow  - barMin) / barSpan) * 100;
    const highPct = ((r.rangeHigh - barMin) / barSpan) * 100;
    const rentPct = Math.max(2, Math.min(98, ((r.rentNum - barMin) / barSpan) * 100));

    return (
      <div style={{minHeight:"100vh",background:"var(--bg)",fontFamily:"var(--sans)",color:"var(--t1)","--accent":accent,"--accent-light":accentLight,"--accent-border":accentBorder}}>
        <style>{CSS}</style>
        <header style={{background:"var(--nav)",borderBottom:"1px solid rgba(255,255,255,.06)"}}>
          <div style={{maxWidth:"var(--max)",margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",height:52}}>
            <button onClick={()=>setPage("home")} style={{width:26,height:26,background:accent,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",border:"none",cursor:"pointer",flexShrink:0}}>
              <span style={{fontFamily:"var(--mono)",fontSize:10,fontWeight:500,color:"#fff"}}>FR</span>
            </button>
            <span style={{fontFamily:"var(--sans)",fontSize:13,fontWeight:600,color:"#f8fafc",marginLeft:9}}>Fair Rent Canada</span>
          </div>
        </header>

        <main style={{maxWidth:"var(--max)",margin:"0 auto",padding:"28px 16px 72px",display:"flex",flexDirection:"column",gap:12}}>
          <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:4}}>
            {CITIES[city].name} &middot; {hood} &middot; {UNIT_LABELS[unitType]}
          </div>

          <div className="card fade-up d1" style={{padding:"24px 20px",background:r.verdict.bg,borderColor:r.verdict.border}}>
            <h2 style={{fontFamily:"var(--serif)",fontSize:"clamp(19px,3.5vw,26px)",fontWeight:400,color:"var(--t1)",lineHeight:1.2,marginBottom:8}}>{r.verdict.headline}</h2>
            <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.7,marginBottom:22}}>{r.verdict.sub}</p>
            <div style={{marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--mono)",fontSize:11,color:"var(--t3)",marginBottom:5}}>
                <span>Estimated fair range</span>
                <span style={{color:"var(--t2)",fontWeight:500}}>{fmt(r.rangeLow)} to {fmt(r.rangeHigh)}/mo</span>
              </div>
              <div className="range-bar-track">
                <div style={{position:"absolute",top:0,height:5,borderRadius:5,left:lowPct+"%",width:(highPct-lowPct)+"%",background:r.verdict.color,opacity:.2}}/>
                <div style={{position:"absolute",top:"50%",left:lowPct+"%",transform:"translate(-50%,-50%)",width:2,height:9,background:r.verdict.color,borderRadius:1,opacity:.45}}/>
                <div style={{position:"absolute",top:"50%",left:highPct+"%",transform:"translate(-50%,-50%)",width:2,height:9,background:r.verdict.color,borderRadius:1,opacity:.45}}/>
                <div style={{position:"absolute",top:"50%",left:rentPct+"%",transform:"translate(-50%,-50%)",width:11,height:11,borderRadius:"50%",background:r.verdict.pos==="within"?r.verdict.color:"#fff",border:"2px solid "+r.verdict.color}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)"}}>
                <span>{fmt(barMin)}</span>
                <span style={{color:r.verdict.color,fontWeight:500}}>Your rent: {fmt(r.rentNum)}</span>
                <span>{fmt(barMax)}</span>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:7,flexWrap:"wrap"}}>
              <span style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--t3)",letterSpacing:".08em",textTransform:"uppercase"}}>Confidence</span>
              <span style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 9px",background:r.conf.bg,border:"1px solid "+r.conf.border,borderRadius:100,fontFamily:"var(--mono)",fontSize:10}}>
                <span style={{width:5,height:5,borderRadius:"50%",background:r.conf.dot}}/>
                <span style={{color:r.conf.textColor}}>{r.conf.label}</span>
              </span>
              <span style={{fontSize:11,color:"var(--t3)"}}>{r.conf.desc}</span>
            </div>
          </div>

          <div className="card fade-up d2" style={{padding:"20px"}}>
            <div className="slabel">How this estimate was built</div>
            {[
              {label:"City baseline",             sub:CITIES[city].name+" average for a "+UNIT_LABELS[unitType].toLowerCase(),      val:r.base,         sign:false},
              {label:"Neighbourhood: "+hood,       sub:((HOOD_MULTS[city]?.[hood]||1)>=1?"Premium area":"Discount area")+" vs city avg", val:r.hoodAdj,    sign:true},
              ...(r.parkAdj>0?[{label:"Parking included",sub:"Added to benchmark",val:r.parkAdj,sign:true}]:[]),
              ...(r.utilAdj>0?[{label:"Utilities included",sub:"Added to benchmark",val:r.utilAdj,sign:true}]:[]),
              {label:"Local renter data",          sub:r.communityN<5?"Fewer than 5 local submissions — CMHC baseline only":r.communityN+" local submissions blended in", val:r.communityAdj, sign:true},
            ].map(({label,sub,val,sign})=>(
              <div key={label} className="breakdown-row">
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--t1)"}}>{label}</div>
                  <div style={{fontSize:11,color:"var(--t3)",marginTop:2}}>{sub}</div>
                </div>
                <div style={{fontFamily:"var(--mono)",fontSize:13,fontWeight:500,color:"var(--t1)",flexShrink:0}}>
                  {sign&&val!==0?(val>0?"+":"")+fmt(val):sign&&val===0?"—":fmt(val)}
                </div>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12,marginTop:4,borderTop:"2px solid var(--border)"}}>
              <div style={{fontSize:13,fontWeight:700,color:"var(--t1)"}}>Benchmark</div>
              <div style={{fontFamily:"var(--mono)",fontSize:16,fontWeight:700,color:"var(--t1)"}}>{fmt(r.bench)}/mo</div>
            </div>
          </div>

          {!r.sameYear && (city==="ottawa"||city==="toronto") && (
            <div className="card fade-up d3" style={{padding:"20px",background:r.isRentCtrl?"#f0fdf4":"#fffbeb",borderColor:r.isRentCtrl?"#bbf7d0":"#fde68a"}}>
              <div className="slabel" style={{color:r.isRentCtrl?"#16a34a":"#b45309"}}>{r.isRentCtrl?"Rent controlled unit":"No rent control"}</div>
              {r.isRentCtrl?(
                <>
                  <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.75,marginBottom:8}}>
                    Ontario caps annual increases at <strong style={{color:"var(--t1)"}}>2.1% for 2026</strong>. Your legal maximum today is approximately <strong style={{color:"#16a34a"}}>{fmt(r.guidelineCap)}/mo</strong>.
                    {r.rentNum > r.guidelineCap
                      ? <span style={{color:"#dc2626"}}> Your rent of {fmt(r.rentNum)} may exceed this. You may have grounds to file with the Landlord and Tenant Board.</span>
                      : <span style={{color:"#16a34a"}}> Your rent is within the legal cap.</span>}
                  </p>
                  <a href="https://www.ontario.ca/page/residential-rent-increases" target="_blank" rel="noopener noreferrer" style={{fontFamily:"var(--mono)",fontSize:11,color:"#16a34a",textDecoration:"none"}}>Ontario rent guidelines &rarr;</a>
                </>
              ):(
                <>
                  <p style={{fontSize:13,color:"var(--t2)",lineHeight:1.75,marginBottom:8}}>Your unit is exempt from Ontario rent control. Your landlord can raise rent between tenancies, but must give 90 days written notice while you are living there.</p>
                  <a href="https://www.ontario.ca/page/renting-ontario-your-rights" target="_blank" rel="noopener noreferrer" style={{fontFamily:"var(--mono)",fontSize:11,color:"#b45309",textDecoration:"none"}}>Know your rights &rarr;</a>
                </>
              )}
            </div>
          )}

          <div className="card fade-up d4" style={{padding:"18px 20px"}}>
            <div className="slabel">About this estimate</div>
            <p style={{fontSize:12,color:"var(--t2)",lineHeight:1.75,marginBottom:10}}>This is a market estimate, not a professional appraisal. Rents vary based on building condition, floor level, finishes, and landlord pricing.</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {["CMHC Rental Market Survey","Rentals.ca Monthly Report","Anonymous local submissions"].map(s=>(
                <span key={s} style={{padding:"3px 9px",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:100,fontFamily:"var(--mono)",fontSize:9,color:"var(--t3)"}}>{s}</span>
              ))}
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}} className="fade-up d5">
            <button className="btn-ghost" onClick={reset}>Start over</button>
            <button className="btn-ghost" onClick={()=>setShareOpen(s=>!s)}>Share {shareOpen?"↑":"↗"}</button>
          </div>

          {shareOpen&&(
            <div className="card fade-up" style={{padding:"16px 18px"}}>
              <div className="slabel">Share your result</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                <a className="share-btn" href={"https://www.reddit.com/submit?url=https://fairrent.ca&title="+encodeURIComponent(shareText())} target="_blank" rel="noopener noreferrer" style={{background:"#ff4500",color:"#fff"}}>Reddit</a>
                <a className="share-btn" href={"https://twitter.com/intent/tweet?text="+encodeURIComponent(shareText())} target="_blank" rel="noopener noreferrer" style={{background:"#000",color:"#fff"}}>X</a>
                <a className="share-btn" href={"https://www.threads.net/intent/post?text="+encodeURIComponent(shareText())} target="_blank" rel="noopener noreferrer" style={{background:"#000",color:"#fff"}}>Threads</a>
                <button className="share-btn" onClick={copyLink} style={{background:copied?"#f0fdf4":"var(--bg)",border:"1px solid "+(copied?"#bbf7d0":"var(--border)"),color:copied?"#16a34a":"var(--t2)"}}>{copied?"Copied":"Copy"}</button>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // ─── Steps ────────────────────────────────────────────────────────────────

  const stepNum    = showRentControl ? step : step > 14 ? step - 1 : step;
  const totalSteps = effectiveTotal;
  const sectionIdx = STEP_SECTIONS[step] ?? 5;
  const sectionName= SECTIONS[sectionIdx];
  const pct        = ((step) / (TOTAL_STEPS - 1)) * 100;
  const isLastStep = step === 15;
  const canSkip    = step === 7 || step === 10;

  const stepContent = () => {
    const selStyle = {width:"100%",padding:"13px 14px",fontSize:15,background:"var(--bg-card)",border:"1.5px solid var(--border)",borderRadius:"var(--r-md)",color:hood?"var(--t1)":"var(--t3)",appearance:"none",backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",backgroundRepeat:"no-repeat",backgroundPosition:"right 14px center",paddingRight:36};

    switch(step){
      case 0: return(<>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,4vw,30px)",fontWeight:400,lineHeight:1.2,marginBottom:8}}>Which city do you rent in?</h1>
        <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.65,marginBottom:22}}>We currently cover Ottawa, Toronto, and Vancouver.</p>
        <div className="opt-grid" style={{gap:10}}>
          {Object.entries(CITIES).map(([key,c])=>(
            <button key={key} className={"opt"+(city===key?" on":"")} onClick={()=>setCity(key)} style={{"--accent":c.accent,"--accent-light":c.accentLight}}>
              <div><div style={{fontWeight:600}}>{c.name}</div><div style={{fontSize:12,color:"var(--t3)",marginTop:2}}>{c.province}</div></div>
            </button>
          ))}
        </div>
      </>);
      case 1: return(<>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,4vw,30px)",fontWeight:400,lineHeight:1.2,marginBottom:8}}>Which neighbourhood?</h1>
        <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.65,marginBottom:22}}>Pick the closest match.</p>
        <select value={hood} onChange={e=>setHood(e.target.value)} style={selStyle}>
          <option value="">Select a neighbourhood...</option>
          {(HOODS[city]||[]).map(n=><option key={n} value={n}>{n}</option>)}
        </select>
      </>);
      case 2: return(<>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,4vw,30px)",fontWeight:400,lineHeight:1.2,marginBottom:8}}>What type of unit do you have?</h1>
        <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.65,marginBottom:22}}>A bachelor/studio is one open room. A 1-bedroom has a separate sleeping room.</p>
        <div className="opt-grid" style={{gap:10}}>
          {UNIT_KEYS.map(k=><button key={k} className={"opt"+(unitType===k?" on":"")} onClick={()=>setUnitType(k)}>{UNIT_LABELS[k]}</button>)}
        </div>
      </>);
      case 3: return(<>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,4vw,30px)",fontWeight:400,lineHeight:1.2,marginBottom:8}}>How large is your unit?</h1>
        <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.65,marginBottom:22}}>An estimate is fine.</p>
        <div className="opt-grid cols2" style={{gap:10}}>
          {[["under400","Under 400 sq ft"],["400-600","400-600 sq ft"],["600-800","600-800 sq ft"],["800-1100","800-1,100 sq ft"],["1100-1500","1,100-1,500 sq ft"],["over1500","Over 1,500 sq ft"],["notsure","Not sure"]].map(([k,l])=>(
            <button key={k} className={"opt"+(sqft===k?" on":"")} onClick={()=>setSqft(k)}>{l}</button>
          ))}
        </div>
      </>);
      case 4: return(<>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,4vw,30px)",fontWeight:400,lineHeight:1.2,marginBottom:8}}>What type of building do you live in?</h1>
        <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.65,marginBottom:22}}>Purpose-built rentals are designed for renting. Condos are individually owned units.</p>
        <div className="opt-grid" style={{gap:10}}>
          {[["purpose","Purpose-built rental building"],["condo","Condo rented from a private owner"],["notsure","Not sure"]].map(([k,l])=>(
            <button key={k} className={"opt"+(buildingType===k?" on":"")} onClick={()=>setBuildingType(k)}>{l}</button>
          ))}
        </div>
      </>);
      case 5: return(<>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,4vw,30px)",fontWeight:400,lineHeight:1.2,marginBottom:8}}>How old is your building?</h1>
        <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.65,marginBottom:22}}>Newer buildings often rent at a premium. This also affects Ontario rent control.</p>
        <div className="opt-grid cols2" style={{gap:10}}>
          {[["pre1980","Before 1980"],["1980-2000","1980-2000"],["2000-2010","2000-2010"],["2010-2018","2010-2018"],["post2018","2018 or newer"],["notsure","Not sure"]].map(([k,l])=>(
            <button key={k} className={"opt"+(buildingAge===k?" on":"")} onClick={()=>setBuildingAge(k)}>{l}</button>
          ))}
        </div>
      </>);
      case 6: return(<>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,4vw,30px)",fontWeight:400,lineHeight:1.2,marginBottom:8}}>Is your unit furnished?</h1>
        <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.65,marginBottom:22}}>Partially furnished typically means appliances only.</p>
        <div className="opt-grid" style={{gap:10}}>
          {[["no","Unfurnished"],["partial","Partially furnished (appliances only)"],["yes","Fully furnished"]].map(([k,l])=>(
            <button key={k} className={"opt"+(furnished===k?" on":"")} onClick={()=>setFurnished(k)}>{l}</button>
          ))}
        </div>
      </>);
      case 7: return(<>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,4vw,30px)",fontWeight:400,lineHeight:1.2,marginBottom:8}}>Which of these does your unit include?</h1>
        <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.65,marginBottom:22}}>Select all that apply.</p>
        <div className="chips">
          {[["laundry","In-unit laundry"],["dishwasher","Dishwasher"],["ac","Central AC"],["window-ac","Window AC"]].map(([k,l])=>(
            <button key={k} className={"chip"+(amenities.includes(k)?" on":"")} onClick={()=>toggle(amenities,setAmenities,k)}>{l}</button>
          ))}
        </div>
        <p style={{fontSize:12,color:"var(--t3)",marginTop:14,lineHeight:1.5}}>You can skip this step if none apply.</p>
      </>);
      case 8: return(<>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,4vw,30px)",fontWeight:400,lineHeight:1.2,marginBottom:8}}>Does your unit have outdoor space?</h1>
        <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.65,marginBottom:22}}>Private only — a shared rooftop does not count.</p>
        <div className="opt-grid" style={{gap:10}}>
          {[["balcony","Yes - private balcony or terrace"],["patio","Yes - ground floor patio"],["none","No outdoor space"]].map(([k,l])=>(
            <button key={k} className={"opt"+(outdoor===k?" on":"")} onClick={()=>setOutdoor(k)}>{l}</button>
          ))}
        </div>
      </>);
      case 9: return(<>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,4vw,30px)",fontWeight:400,lineHeight:1.2,marginBottom:8}}>Is parking included in your rent?</h1>
        <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.65,marginBottom:22}}>If you pay separately for parking, select No.</p>
        <div className="opt-grid" style={{gap:10}}>
          {[["yes","Yes - parking is included"],["no","No - parking is not included"]].map(([k,l])=>(
            <button key={k} className={"opt"+(parking===k?" on":"")} onClick={()=>setParking(k)}>{l}</button>
          ))}
        </div>
        {parking==="yes"&&<p style={{fontSize:12,color:"var(--t3)",marginTop:12}}>We will add $250/mo to the benchmark to account for parking.</p>}
      </>);
      case 10: return(<>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,4vw,30px)",fontWeight:400,lineHeight:1.2,marginBottom:8}}>What is included in your rent?</h1>
        <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.65,marginBottom:22}}>Only select what your landlord pays for.</p>
        <div className="chips">
          {[["heat","Heat"],["water","Water"],["electricity","Electricity"],["internet","Internet"]].map(([k,l])=>(
            <button key={k} className={"chip"+(utilities.includes(k)?" on":"")} onClick={()=>toggle(utilities,setUtilities,k)}>{l}</button>
          ))}
        </div>
        {utilities.length>0&&<p style={{fontSize:12,color:"var(--t3)",marginTop:12}}>We will add $120/mo to the benchmark to account for included utilities.</p>}
      </>);
      case 11: return(<>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,4vw,30px)",fontWeight:400,lineHeight:1.2,marginBottom:8}}>Does your lease allow pets?</h1>
        <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.65,marginBottom:22}}>This is context only and does not change the estimate.</p>
        <div className="opt-grid" style={{gap:10}}>
          {[["yes","Yes - pets allowed"],["no","No - pets not allowed"],["maybe","Ask landlord / not sure"]].map(([k,l])=>(
            <button key={k} className={"opt"+(petFriendly===k?" on":"")} onClick={()=>setPetFriendly(k)}>{l}</button>
          ))}
        </div>
      </>);
      case 12: return(<>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,4vw,30px)",fontWeight:400,lineHeight:1.2,marginBottom:8}}>How close are you to transit?</h1>
        <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.65,marginBottom:22}}>Think about your nearest bus stop, subway, or LRT stop.</p>
        <div className="opt-grid" style={{gap:10}}>
          {[["5min","Under 5 min walk"],["10min","5-10 min walk"],["20min","10-20 min walk"],["car","Over 20 min / car dependent"]].map(([k,l])=>(
            <button key={k} className={"opt"+(transit===k?" on":"")} onClick={()=>setTransit(k)}>{l}</button>
          ))}
        </div>
      </>);
      case 13: return(<>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,4vw,30px)",fontWeight:400,lineHeight:1.2,marginBottom:8}}>What year did you move in?</h1>
        <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.65,marginBottom:22}}>The year you signed your current lease.</p>
        <input className="big-inp" type="number" placeholder="e.g. 2021" value={moveInYear} onChange={e=>setMoveInYear(e.target.value)} min={1980} max={curYear} inputMode="numeric"/>
      </>);
      case 14: return(<>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,4vw,30px)",fontWeight:400,lineHeight:1.2,marginBottom:8}}>Was your unit first occupied before November 15, 2018?</h1>
        <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.65,marginBottom:22}}>In Ontario, this date determines whether your unit is subject to annual rent increase limits.</p>
        <div className="opt-grid" style={{gap:10}}>
          <button className={"opt"+(preNov2018==="yes"?" on":"")} onClick={()=>setPreNov2018("yes")}>
            <div><div style={{fontWeight:600}}>Yes - my unit is older than Nov 2018</div><div style={{fontSize:12,color:"var(--t3)",marginTop:3}}>Ontario annual guideline applies (2.1% for 2026)</div></div>
          </button>
          <button className={"opt"+(preNov2018==="no"?" on":"")} onClick={()=>setPreNov2018("no")}>
            <div><div style={{fontWeight:600}}>No - my unit was first occupied after Nov 2018</div><div style={{fontSize:12,color:"var(--t3)",marginTop:3}}>No rent control between tenancies</div></div>
          </button>
        </div>
        <p style={{fontSize:12,color:"var(--t3)",marginTop:12,lineHeight:1.55}}>Not sure? Check your lease or ask your landlord when your specific unit was first occupied.</p>
      </>);
      case 15: return(<>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(22px,4vw,30px)",fontWeight:400,lineHeight:1.2,marginBottom:8}}>What is your current monthly rent?</h1>
        <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.65,marginBottom:22}}>Enter your total monthly rent. Do not include parking or utilities if you pay those separately.</p>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:18,top:"50%",transform:"translateY(-50%)",fontFamily:"var(--mono)",fontSize:20,color:"var(--t3)",pointerEvents:"none"}}>$</span>
          <input className="big-inp" type="number" placeholder="0" inputMode="numeric" value={rent} onChange={e=>setRent(e.target.value)} style={{paddingLeft:36,textAlign:"left"}}/>
        </div>
        <p style={{fontSize:11,color:"var(--t3)",marginTop:12,lineHeight:1.55}}>Your rent is never stored with any personal information. It is combined with other anonymous submissions to improve local estimates.</p>
      </>);
      default: return null;
    }
  };

  // ─── Landing / step shell ─────────────────────────────────────────────────

  // Before city is selected (step 0), show landing first
  const showLanding = step === 0 && !city;

  return (
    <div style={{minHeight:"100vh",background:"var(--bg)",fontFamily:"var(--sans)",color:"var(--t1)","--accent":accent,"--accent-light":accentLight,"--accent-border":accentBorder,"--accent-ring":"rgba(22,163,74,.15)"}}>
      <style>{CSS}</style>

      <header style={{background:"var(--nav)",borderBottom:"1px solid rgba(255,255,255,.06)",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:"var(--max)",margin:"0 auto",padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:52}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:24,height:24,background:"#16a34a",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontFamily:"var(--mono)",fontSize:9,fontWeight:500,color:"#fff"}}>FR</span>
            </div>
            <span style={{fontFamily:"var(--sans)",fontSize:13,fontWeight:600,color:"#f8fafc"}}>Fair Rent Canada</span>
          </div>
          {!showLanding && (
            <div style={{fontFamily:"var(--mono)",fontSize:10,color:"rgba(255,255,255,.3)",letterSpacing:".05em"}}>
              {stepNum+1} of {totalSteps}
            </div>
          )}
          {showLanding && (
            <div style={{display:"flex",gap:16}}>
              <button onClick={()=>setPage("methodology")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"var(--mono)",fontSize:11,color:"rgba(255,255,255,.4)",letterSpacing:".05em",textTransform:"uppercase"}}>Methodology</button>
              <button onClick={()=>setPage("about")} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"var(--mono)",fontSize:11,color:"rgba(255,255,255,.4)",letterSpacing:".05em",textTransform:"uppercase"}}>About</button>
            </div>
          )}
        </div>
        {!showLanding && (
          <div className="progress-track" style={{borderRadius:0}}>
            <div className="progress-fill" style={{width:pct+"%",background:accent}}/>
          </div>
        )}
      </header>

      {showLanding ? (
        // ── Landing page ───────────────────────────────────────────────────
        <main style={{maxWidth:"var(--max)",margin:"0 auto",padding:"0 16px 80px"}}>

          {/* Hero */}
          <div style={{padding:"52px 0 40px",borderBottom:"1px solid var(--border)"}}>
            <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(26px,5vw,38px)",fontWeight:400,color:"var(--t1)",lineHeight:1.15,letterSpacing:"-.02em",marginBottom:14}}>
              See if you are overpaying for rent
            </h1>
            <p style={{fontSize:15,color:"var(--t2)",lineHeight:1.75,maxWidth:440,marginBottom:32}}>
              Based on real data from CMHC, Rentals.ca, and local renters. Free. Anonymous. No account needed.
            </p>

            {/* City cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1px",background:"var(--border)",border:"1px solid var(--border)",borderRadius:"var(--r-md)",overflow:"hidden",marginBottom:32}}>
              {[
                {city:"Ottawa",   url:"https://ottawafairrent.ca",   n:"2,841"},
                {city:"Toronto",  url:"https://torontofairrent.ca",  n:"7,204"},
                {city:"Vancouver",url:"https://vancouverfairrent.ca",n:"4,917"},
              ].map(({city:c,url,n})=>(
                <a key={c} href={url} style={{background:"var(--bg-card)",padding:"18px 14px",textDecoration:"none",display:"flex",flexDirection:"column",gap:4,transition:"background .1s"}}
                  onMouseEnter={e=>e.currentTarget.style.background="#f8fafc"}
                  onMouseLeave={e=>e.currentTarget.style.background="var(--bg-card)"}>
                  <span style={{fontSize:14,fontWeight:700,color:"var(--t1)"}}>{c}</span>
                  <span style={{fontSize:11,color:"var(--t3)",fontFamily:"var(--mono)"}}>{n} submissions</span>
                  <span style={{fontSize:13,color:"#1d4ed8",marginTop:6}}>Check &rsaquo;</span>
                </a>
              ))}
            </div>

            <button className="btn-next" onClick={()=>setStep(0)} style={{maxWidth:320,width:"100%"}}>
              Check my rent &rarr;
            </button>
          </div>

          {/* Trust bar */}
          <div style={{padding:"16px 0",borderBottom:"1px solid var(--border)",display:"flex",flexWrap:"wrap",gap:"14px 24px"}}>
            {["Based on Canadian housing data","Real tenant submissions","Anonymous and secure","Used by 14,962 renters","Free"].map(t=>(
              <div key={t} style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:"var(--t2)",fontWeight:500}}>
                <div style={{width:14,height:14,borderRadius:"50%",background:"#166534",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                {t}
              </div>
            ))}
          </div>

          {/* How it works */}
          <div style={{padding:"36px 0",borderBottom:"1px solid var(--border)"}}>
            <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:14}}>How it works</div>
            <h2 style={{fontFamily:"var(--serif)",fontSize:"clamp(18px,3vw,24px)",fontWeight:400,marginBottom:20}}>Three steps. Under a minute.</h2>
            {[
              {n:"1",title:"Enter your unit details",desc:"City, neighbourhood, unit size, move-in year, and monthly rent."},
              {n:"2",title:"We compare it to real data",desc:"Your rent is matched against verified submissions and official Canadian housing data for your area and unit type."},
              {n:"3",title:"See if your rent is fair",desc:"A market range, a percentage above or below median, and a confidence score."},
            ].map(({n,title,desc})=>(
              <div key={n} style={{display:"flex",gap:16,padding:"14px 0",borderBottom:"1px solid #f3f4f6"}}>
                <span style={{fontFamily:"var(--mono)",fontSize:12,fontWeight:700,color:"#1d4ed8",width:20,flexShrink:0,paddingTop:1}}>{n}</span>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:"var(--t1)",marginBottom:3}}>{title}</div>
                  <div style={{fontSize:13,color:"var(--t2)"}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer links */}
          <div style={{padding:"28px 0",display:"flex",flexWrap:"wrap",gap:"8px 20px"}}>
            {[["Methodology","methodology"],["About","about"],["Privacy","privacy"],["Terms","terms"],["FAQ","faq"],["Contact","contact"]].map(([label,pg])=>(
              <button key={pg} onClick={()=>setPage(pg)} style={{background:"none",border:"none",cursor:"pointer",fontSize:13,color:"var(--t3)",textDecoration:"none",padding:0}}>
                {label}
              </button>
            ))}
          </div>
          <p style={{fontSize:11,color:"var(--t3)",lineHeight:1.6,paddingBottom:24,borderTop:"1px solid var(--border)",paddingTop:16}}>
            Fair Rent Canada - Independent. Non-commercial. Community-supported. Results are estimates, not legal advice.
          </p>
        </main>
      ) : (
        // ── Step wizard ────────────────────────────────────────────────────
        <>
          <div style={{maxWidth:"var(--max)",margin:"0 auto",padding:"12px 16px 0"}}>
            <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".1em"}}>{sectionName}</div>
          </div>

          <main style={{maxWidth:"var(--max)",margin:"0 auto",padding:"20px 16px 80px"}}>
            <div key={step} className={"step-wrap"+(dir==="back"?" back":"")}>
              {stepContent()}
              {err && <div className="err">{err}</div>}
            </div>
          </main>

          <div style={{position:"fixed",bottom:0,left:0,right:0,background:"rgba(249,250,251,0.95)",backdropFilter:"blur(8px)",borderTop:"1px solid var(--border)",padding:"12px 16px",zIndex:50}}>
            <div style={{maxWidth:"var(--max)",margin:"0 auto",display:"flex",flexDirection:"column",gap:8}}>
              {isLastStep ? (
                <button className="btn-next" onClick={calculate} disabled={saving} style={{background:accent}}>
                  {saving ? "Building your result..." : "See my result ->"}
                </button>
              ) : (
                <button className="btn-next" onClick={next} disabled={step===0&&!city} style={step>0?{background:accent}:{}}>
                  Continue ->
                </button>
              )}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                {step > 0
                  ? <button className="btn-back" onClick={back}>Back</button>
                  : <span/>
                }
                {canSkip && <button className="btn-back" onClick={next} style={{color:"var(--t3)"}}>Skip this step</button>}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
