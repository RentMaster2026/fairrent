import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CITIES = [
  { key:"ottawa",    name:"Ottawa",    province:"Ontario",           url:"https://ottawafairrent.ca",    avgRent:"$1,945", rentRange:"$1,750-$2,200", unitLabel:"1-bedroom avg", hoods:35, tag:"Ontario rent guideline applies",  accent:"#16a34a", accentLight:"#f0fdf4", accentBorder:"#bbf7d0", coords:{lat:45.42,lng:-75.69} },
  { key:"toronto",   name:"Toronto",   province:"Ontario",           url:"https://torontofairrent.ca",   avgRent:"$2,183", rentRange:"$1,950-$2,450", unitLabel:"1-bedroom avg", hoods:30, tag:"Ontario rent guideline applies",  accent:"#2563eb", accentLight:"#eff6ff", accentBorder:"#bfdbfe", coords:{lat:43.65,lng:-79.38} },
  { key:"vancouver", name:"Vancouver", province:"British Columbia",  url:"https://vancouverfairrent.ca", avgRent:"$2,362", rentRange:"$2,100-$2,650", unitLabel:"1-bedroom avg", hoods:31, tag:"BC rent guideline applies",        accent:"#0891b2", accentLight:"#ecfeff", accentBorder:"#a5f3fc", coords:{lat:49.28,lng:-123.12} },
];

const BLOG = {
  date:"March 2026", readTime:"6 min",
  title:"Your rent is not market rate. It is whatever the market can get away with.",
  lede:"People keep saying rent is cooling in Canada like that means renters can finally breathe again. That is not what the data says.",
  stats:[
    {figure:"34%",  label:"more paid by recent renters vs long-term tenants"},
    {figure:"52%",  label:"new-vs-established renter gap in Toronto"},
    {figure:"45%",  label:"of Canadians very concerned about housing costs"},
    {figure:"17mo", label:"of falling asking rents, yet it still feels brutal"},
  ],
  body:[
    {type:"p",         text:"Yes, average asking rent in Canada has come down a bit. Rentals.ca says the national average asking rent fell to $2,030 in February 2026, marking 17 straight months of year-over-year declines. CMHC also says the purpose-built rental vacancy rate rose to 3.1% in 2025, up from 2.2% in 2024. On paper, that sounds like relief. In real life, it still feels brutal. Because lower than a peak does not mean fair."},
    {type:"p",         text:"In fact, part of the reason rents look better is not because housing suddenly became affordable. It is because units got smaller. Rentals.ca reported that the average rental listing size in Canada dropped to 857 square feet in January 2026, down from 943 square feet two years earlier. At the same time, rent per square foot still rose 1.4% year over year. So no, renters are not suddenly getting a great deal. They are often just paying slightly less for less space."},
    {type:"pullquote", text:"Two people can live in the same city, in similar units, with the same job and same income, and one can be paying massively more just because they had the bad luck of moving later."},
    {type:"p",         text:"And here is the part that should make people angry: the real punishment in Canada's rental market is not just renting. It is having to move. Statistics Canada found that across Canadian cities, recent renters in 2021 were paying 34% more than renters who had been in their home for five years or more. In Toronto, that gap was 52%. In Ottawa, it was 39%. In Vancouver, it was 31%."},
    {type:"h2",        text:"People feel this, even without policy language for it"},
    {type:"p",         text:"Statistics Canada reported that nearly half of Canadians, 45%, were very concerned about housing affordability in 2024. Among young adults aged 20 to 35, that number jumped to 59%. Half of young adults said rising prices affected their moving plans. About one-third of Canadians reported difficulty meeting basic financial needs like housing, food, and transportation."},
    {type:"p",         text:"One in three Canadians rents their primary home. But fewer renters are moving than they used to. Statistics Canada says the share of renters who lived at a different address one year earlier fell from 29.5% in 1996 to 19.9% in 2021. That looks like stability until you ask the obvious question: are people staying because they want to, or because moving has become financially reckless? For a lot of people, staying put is not freedom. It is survival."},
    {type:"h2",        text:"The numbers in your city"},
    {type:"p",         text:"Even in the biggest cities, where people are told high rent is just normal, the numbers are hard to ignore. Rentals.ca says that as of January 2026, the average one-bedroom rent was about $1,945 in Ottawa, $2,183 in Toronto, and $2,362 in Vancouver. Statistics Canada's quarterly data showed that in Q1 2025, average asking rent for a two-bedroom was $2,490 in Ottawa, $2,690 in Toronto, and $3,170 in Vancouver. These are not rare luxury prices. These are ordinary market prices. That is exactly the problem."},
    {type:"h2",        text:"Why this matters"},
    {type:"p",         text:"Not because a calculator is going to solve Canada's housing crisis on its own. It will not. But because renters have been expected to make some of the biggest financial decisions of their lives with terrible transparency. Landlords have listings. Platforms have data. Governments publish reports. But renters still end up asking the same question in the dark: am I getting ripped off?"},
    {type:"pullquote", text:"When someone says rents are down, the real response should be: down for who? Because for a lot of renters, especially anyone who needs to move right now, it still does not feel down at all."},
    {type:"p",         text:"If you have ever found out your neighbour pays hundreds less than you for a similar unit, you already understand why this matters. Check the calculator. Submit your rent. Share it with someone apartment hunting. Because the more renters compare notes, the harder it gets for this market to hide behind averages."},
  ],
  sources:[
    "Statistics Canada, Housing challenges related to affordability (2024)",
    "Statistics Canada, The Canadian rental conundrum (2025)",
    "Statistics Canada, Quarterly rent statistics (2025)",
    "CMHC, 2025 Rental Market Report",
    "Rentals.ca / Urbanation, National Rent Report (2026)",
  ],
};

function detectCity(lat,lng){let c=null,d=Infinity;for(const x of CITIES){const v=Math.hypot(lat-x.coords.lat,lng-x.coords.lng);if(v<d){d=v;c=x;}}return c;}

function useCountUp(target,dur=1200){
  const[val,set]=useState(0);const raf=useRef(null);const prev=useRef(0);
  useEffect(()=>{
    if(!target)return;const from=prev.current;prev.current=target;let t0=null;
    const tick=ts=>{if(!t0)t0=ts;const p=Math.min((ts-t0)/dur,1);set(Math.round(from+(target-from)*(1-Math.pow(1-p,4))));if(p<1)raf.current=requestAnimationFrame(tick);};
    raf.current=requestAnimationFrame(tick);return()=>cancelAnimationFrame(raf.current);
  },[target]);return val;
}

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500&display=swap');
  :root{
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
    --sh-hover:0 4px 16px rgba(0,0,0,.09);
    --max-hub:880px; --max-art:700px;
  }
  html,body,#root{margin:0;padding:0;width:100%;background:var(--bg);}
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:var(--sans);color:var(--t1);-webkit-font-smoothing:antialiased;}
  a{color:inherit;}
  .city-card{display:block;text-decoration:none;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-lg);padding:24px 20px;box-shadow:var(--sh);transition:border-color .18s,box-shadow .18s,transform .18s;color:inherit;}
  .city-card:hover{border-color:var(--border-mid);box-shadow:var(--sh-hover);transform:translateY(-2px);}
  .blog-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-lg);overflow:hidden;cursor:pointer;box-shadow:var(--sh);transition:border-color .18s,box-shadow .18s,transform .18s;}
  .blog-card:hover{border-color:var(--border-mid);box-shadow:var(--sh-hover);transform:translateY(-2px);}
  .trust-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-md);padding:20px;}
  .pill{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;background:var(--bg-card);border:1px solid var(--border);border-radius:100px;font-family:var(--mono);font-size:11px;color:var(--t2);letter-spacing:.03em;}
  .live-dot{width:6px;height:6px;border-radius:50%;background:var(--green);flex-shrink:0;animation:pulse 2.4s ease-in-out infinite;}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.5)}}
  .fade-up{opacity:0;transform:translateY(12px);animation:fu .5s ease forwards;}
  @keyframes fu{to{opacity:1;transform:none}}
  .d1{animation-delay:.05s}.d2{animation-delay:.12s}.d3{animation-delay:.19s}
  .d4{animation-delay:.26s}.d5{animation-delay:.33s}.d6{animation-delay:.40s}
  .slabel{font-family:var(--mono);font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.1em;margin-bottom:16px;}
  .ab p{font-size:16px;color:var(--t2);line-height:1.85;}
  .ab h2{font-family:var(--serif);font-size:22px;font-weight:400;color:var(--t1);letter-spacing:-.02em;margin-top:8px;}
  .ab blockquote{margin:0;padding:18px 22px;border-left:3px solid var(--green);background:var(--green-lt);border-radius:0 var(--r-sm) var(--r-sm) 0;}
  .ab blockquote p{font-size:17px;color:#166534;font-style:italic;font-weight:500;line-height:1.65;}
  @media(max-width:700px){.cgrid{grid-template-columns:1fr!important}.sgrid{grid-template-columns:1fr!important}.tgrid{grid-template-columns:1fr!important}.stgrid{grid-template-columns:1fr 1fr!important}}
  @media(max-width:480px){.stgrid{grid-template-columns:1fr!important}}

  @media(prefers-reduced-motion:reduce){.fade-up{animation:none!important;opacity:1!important;transform:none!important;}*{transition-duration:.01ms!important;}}
  .btn-primary:focus-visible,.btn-ghost:focus-visible,.opt-btn:focus-visible{outline:2px solid #16a34a;outline-offset:2px;}`;

function Article({onClose}){
  useEffect(()=>{window.scrollTo(0,0);},[]);
  return(
    <div style={{minHeight:"100vh",background:"#fff",fontFamily:"var(--sans)"}}>
      <div style={{borderBottom:"1px solid var(--border)",background:"#fff",position:"sticky",top:0,zIndex:10}}>
        <div style={{maxWidth:"var(--max-art)",margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:52}}>
          <button onClick={onClose} style={{background:"none",border:"none",cursor:"pointer",fontFamily:"var(--mono)",fontSize:11,color:"var(--t3)",letterSpacing:".06em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:6,padding:0}}>
            Back to Fair Rent Canada
          </button>
          <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)",letterSpacing:".06em"}}>{BLOG.date} · {BLOG.readTime} read</span>
        </div>
      </div>
      <article style={{maxWidth:"var(--max-art)",margin:"0 auto",padding:"52px 20px 96px"}}>
        <div style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--green)",letterSpacing:".08em",textTransform:"uppercase",marginBottom:18}}>Analysis · Fair Rent Canada</div>
        <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(24px,3.8vw,36px)",fontWeight:400,color:"var(--t1)",lineHeight:1.2,letterSpacing:"-.02em",marginBottom:20}}>{BLOG.title}</h1>
        <p style={{fontSize:18,color:"var(--t2)",lineHeight:1.75,fontStyle:"italic",marginBottom:40}}>{BLOG.lede}</p>
        <div className="stgrid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:48}}>
          {BLOG.stats.map(s=>(
            <div key={s.figure} style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--r-md)",padding:"18px 20px"}}>
              <div style={{fontFamily:"var(--mono)",fontSize:28,fontWeight:500,color:"var(--t1)",lineHeight:1,marginBottom:8}}>{s.figure}</div>
              <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.5}}>{s.label}</div>
            </div>
          ))}
        </div>
        <div className="ab" style={{display:"flex",flexDirection:"column",gap:22}}>
          {BLOG.body.map((b,i)=>{
            if(b.type==="p")         return <p key={i}>{b.text}</p>;
            if(b.type==="h2")        return <h2 key={i}>{b.text}</h2>;
            if(b.type==="pullquote") return <blockquote key={i}><p>{b.text}</p></blockquote>;
            return null;
          })}
        </div>
        <div style={{marginTop:52,padding:"28px",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)"}}>
          <div className="slabel">Check your rent</div>
          <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.7,marginBottom:20}}>Find out where your rent sits relative to market. Free, anonymous, 30 seconds.</p>
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            {CITIES.map(c=>(
              <a key={c.key} href={c.url} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"9px 16px",background:c.accentLight,border:`1px solid ${c.accentBorder}`,color:c.accent,borderRadius:"var(--r-sm)",fontSize:13,fontWeight:600,textDecoration:"none",transition:"opacity .15s"}}
                onMouseOver={e=>e.currentTarget.style.opacity=".75"} onMouseOut={e=>e.currentTarget.style.opacity="1"}>
                {c.name} →
              </a>
            ))}
          </div>
        </div>
        <div style={{marginTop:44,paddingTop:24,borderTop:"1px solid var(--border)"}}>
          <div className="slabel">Sources</div>
          {BLOG.sources.map((s,i)=>(
            <div key={i} style={{fontSize:12,color:"var(--t3)",lineHeight:1.65,paddingLeft:12,position:"relative",marginBottom:4}}>
              <span style={{position:"absolute",left:0,color:"var(--border-mid)"}}>·</span>{s}
            </div>
          ))}
        </div>
      </article>
    </div>
  );
}

export default function App(){
  const[detected,setDetected]=useState(null);
  const[locating,setLocating]=useState(true);
  const[counts,setCounts]=useState({ottawa:0,toronto:0,vancouver:0});
  const[countsReady,setCountsReady]=useState(false);
  const[showPost,setShowPost]=useState(false);

  const total=countsReady?Object.values(counts).reduce((a,b)=>a+b,0):0;
  const displayNum=useCountUp(total);

  useEffect(()=>{
    Promise.all(CITIES.map(c=>supabase.from("rent_submissions").select("*",{count:"exact",head:true}).eq("city",c.key).then(({count})=>({key:c.key,count:count||0}))))
      .then(res=>{const m={};res.forEach(r=>{m[r.key]=r.count;});setCounts(m);setCountsReady(true);});
  },[]);

  useEffect(()=>{
    if(!navigator.geolocation){setLocating(false);return;}
    navigator.geolocation.getCurrentPosition(
      pos=>{setDetected(detectCity(pos.coords.latitude,pos.coords.longitude));setLocating(false);},
      ()=>setLocating(false),{timeout:4000}
    );
  },[]);

  if(showPost) return(<><style>{CSS}</style><Article onClose={()=>{setShowPost(false);window.scrollTo(0,0);}}/></>);

  return(
    <><style>{CSS}</style>
    <div style={{minHeight:"100vh"}}>

      <header style={{background:"var(--nav)",borderBottom:"1px solid rgba(255,255,255,.06)",position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:"var(--max-hub)",margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:28,height:28,background:"var(--green)",borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <span style={{fontFamily:"var(--mono)",fontSize:11,fontWeight:500,color:"#fff",letterSpacing:"-.01em"}}>FR</span>
            </div>
            <span style={{fontFamily:"var(--sans)",fontSize:14,fontWeight:600,color:"#f8fafc",letterSpacing:"-.01em"}}>Fair Rent Canada</span>
          </div>
          {countsReady&&(
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <div className="live-dot"/>
              <span style={{fontFamily:"var(--mono)",aria-live:"polite",fontSize:11,color:"rgba(255,255,255,.35)",letterSpacing:".04em"}}>{displayNum.toLocaleString()} submissions</span>
            </div>
          )}
        </div>
      </header>

      <main style={{maxWidth:"var(--max-hub)",margin:"0 auto",padding:"52px 20px 0"}}>

        <div className="fade-up d1" style={{marginBottom:44}}>
          <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(32px,5.5vw,54px)",fontWeight:400,color:"var(--t1)",lineHeight:1.1,letterSpacing:"-.025em",marginBottom:18,maxWidth:620}}>
            Free rent benchmarks for Canadian renters.
          </h1>
          <p style={{fontSize:16,color:"var(--t2)",lineHeight:1.75,maxWidth:500,marginBottom:24}}>
            Compare your rent to neighbourhood-level market data from CMHC and local renter data. Anonymous. No account required.
          </p>
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {["Anonymous","No account required","CMHC data","Free"].map(t=>(
              <span key={t} className="pill">{t}</span>
            ))}
          </div>
        </div>

        {!locating&&detected&&(
          <div className="fade-up d2" style={{background:detected.accentLight,border:`1px solid ${detected.accentBorder}`,borderRadius:"var(--r-md)",padding:"14px 18px",marginBottom:28,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
            <div>
              <div style={{fontFamily:"var(--mono)",fontSize:10,color:detected.accent,letterSpacing:".08em",textTransform:"uppercase",marginBottom:3}}>Location detected</div>
              <div style={{fontSize:14,color:"var(--t1)"}}>Looks like you're near <strong>{detected.name}</strong></div>
            </div>
            <a href={detected.url} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"8px 16px",background:detected.accent,color:"#fff",borderRadius:"var(--r-sm)",fontSize:13,fontWeight:600,textDecoration:"none",transition:"opacity .15s"}}
              onMouseOver={e=>e.currentTarget.style.opacity=".85"} onMouseOut={e=>e.currentTarget.style.opacity="1"}>
              Open {detected.name} →
            </a>
          </div>
        )}

        <div className="cgrid fade-up d3" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:16,marginBottom:52}}>
          {CITIES.map(c=>{
            const isNear=detected?.key===c.key;
            return(
              <a key={c.key} href={c.url} className="city-card" style={{borderColor:isNear?c.accentBorder:"var(--border)"}}>
                <div style={{height:2,background:c.accent,borderRadius:2,marginBottom:20,opacity:isNear?1:.3}}/>
                {isNear&&(
                  <div style={{display:"inline-flex",alignItems:"center",gap:5,marginBottom:10,padding:"2px 8px",background:c.accentLight,border:`1px solid ${c.accentBorder}`,borderRadius:100,fontFamily:"var(--mono)",fontSize:9,color:c.accent,letterSpacing:".08em",textTransform:"uppercase"}}>
                    <div style={{width:4,height:4,borderRadius:"50%",background:c.accent}}/> Near you
                  </div>
                )}
                <div style={{fontSize:19,fontWeight:700,color:"var(--t1)",letterSpacing:"-.02em",marginBottom:2}}>{c.name}</div>
                <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)",marginBottom:16,letterSpacing:".04em"}}>{c.province}</div>
                <div style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",padding:"11px 13px",marginBottom:14}}>
                  <div style={{fontFamily:"var(--mono)",fontSize:9,color:"var(--t3)",textTransform:"uppercase",letterSpacing:".08em",marginBottom:5}}>{c.unitLabel}</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:17,fontWeight:500,color:"var(--t1)",marginBottom:2}}>{c.avgRent}</div>
                  <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)"}}>range {c.rentRange}</div>
                </div>
                <div style={{fontSize:12,color:"var(--t3)",lineHeight:1.5,marginBottom:16}}>{c.hoods} neighbourhoods · {c.tag}</div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:14,borderTop:"1px solid var(--border)"}}>
                  <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)"}}>
                    {countsReady?<><strong style={{color:"var(--t2)"}}>{counts[c.key].toLocaleString()}</strong> local submissions</>:"—"}
                  </div>
                  <div style={{fontSize:12,fontWeight:600,color:c.accent}}>Compare →</div>
                </div>
              </a>
            );
          })}
        </div>

        <div className="fade-up d4" style={{background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:"var(--r-lg)",padding:"32px 28px",boxShadow:"var(--sh)",marginBottom:16}}>
          <div className="slabel">How the estimate is built</div>
          <div className="sgrid" style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:28}}>
            {[
              {n:"01",head:"Public data baseline",body:"Every estimate starts with CMHC's annual Rental Market Survey and Rentals.ca's monthly data, adjusted for neighbourhood and unit type."},
              {n:"02",head:"Local renter data layer",body:"Anonymous rent submissions from your specific neighbourhood are blended in as they grow. More data means a higher confidence score."},
              {n:"03",head:"Range with confidence score",body:"The result is a range, not a single number. The confidence score tells you exactly how much data is behind the estimate."},
            ].map(({n,head,body})=>(
              <div key={n}>
                <div style={{fontFamily:"var(--mono)",fontSize:26,fontWeight:500,color:"var(--border)",lineHeight:1,marginBottom:12}}>{n}</div>
                <div style={{fontSize:13,fontWeight:600,color:"var(--t1)",marginBottom:7,letterSpacing:"-.01em"}}>{head}</div>
                <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.7}}>{body}</div>
              </div>
            ))}
          </div>
          <div style={{marginTop:24,paddingTop:20,borderTop:"1px solid var(--border)"}}>
            <p style={{fontSize:12,color:"var(--t3)",lineHeight:1.75}}>
              <strong style={{color:"var(--t2)"}}>Honest about uncertainty.</strong> Rent benchmarks are estimates, not facts. Building age, condition, parking, and included utilities all affect fair value. This tool gives you a starting point, not a definitive answer.
            </p>
          </div>
        </div>

        <div className="tgrid fade-up d5" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          {[
            {head:"Fully anonymous",         body:"No account, no email, no IP stored. Your submission is one number added to a pool."},
            {head:"No fake precision",        body:"Results show a range and a confidence level. We tell you what we know and what we do not."},
            {head:"Sourced data only",        body:"Benchmarks come from CMHC's annual survey and Rentals.ca's monthly national report."},
            {head:"Tenant rights included",   body:"Every result includes province-specific rent guideline information and a link to your rights."},
          ].map(({head,body})=>(
            <div key={head} className="trust-card">
              <div style={{fontSize:13,fontWeight:600,color:"var(--t1)",marginBottom:6,letterSpacing:"-.01em"}}>{head}</div>
              <div style={{fontSize:12,color:"var(--t2)",lineHeight:1.7}}>{body}</div>
            </div>
          ))}
        </div>

        <div className="fade-up d6" style={{marginBottom:0}}>
          <div className="slabel" style={{marginBottom:14}}>From the blog</div>
          <div className="blog-card" onClick={()=>setShowPost(true)} role="button" tabIndex={0} onKeyDown={e=>e.key==="Enter"&&setShowPost(true)}>
            <div style={{height:2,background:"linear-gradient(to right,#16a34a 33%,#2563eb 66%,#0891b2)"}}/>
            <div style={{padding:"28px 26px 24px"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)",letterSpacing:".06em"}}>{BLOG.date}</span>
                <span style={{width:3,height:3,borderRadius:"50%",background:"var(--border)",display:"inline-block"}}/>
                <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)",letterSpacing:".06em"}}>{BLOG.readTime} read</span>
              </div>
              <h2 style={{fontFamily:"var(--serif)",fontSize:"clamp(16px,2.4vw,21px)",fontWeight:400,color:"var(--t1)",lineHeight:1.3,marginBottom:12}}>{BLOG.title}</h2>
              <p style={{fontSize:14,color:"var(--t2)",lineHeight:1.7,marginBottom:24}}>{BLOG.lede}</p>
              <div className="stgrid" style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:22}}>
                {BLOG.stats.map(s=>(
                  <div key={s.figure} style={{background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)",padding:"12px 10px"}}>
                    <div style={{fontFamily:"var(--mono)",fontSize:18,fontWeight:500,color:"var(--t1)",lineHeight:1,marginBottom:5}}>{s.figure}</div>
                    <div style={{fontSize:10,color:"var(--t3)",lineHeight:1.4}}>{s.label.split("(")[0].trim()}</div>
                  </div>
                ))}
              </div>
              <div style={{fontFamily:"var(--mono)",fontSize:12,fontWeight:500,color:"var(--green)",letterSpacing:".03em"}}>Read the full piece →</div>
            </div>
          </div>
        </div>

      </main>

      <div style={{background:"var(--nav)",borderTop:"1px solid rgba(255,255,255,.06)",marginTop:52}}>
        <div style={{maxWidth:"var(--max-hub)",margin:"0 auto",padding:"52px 20px"}}>
          <div style={{fontFamily:"var(--mono)",fontSize:10,color:"rgba(255,255,255,.22)",textTransform:"uppercase",letterSpacing:".1em",marginBottom:18}}>Why this exists</div>
          <p style={{fontSize:16,color:"rgba(255,255,255,.65)",lineHeight:1.85,maxWidth:560,marginBottom:16}}>
            Rent is the largest expense for most Canadians, but it is nearly impossible to know if what you are paying is actually fair. Landlords have listings. Platforms have data. Governments publish reports. Renters have almost none of it.
          </p>
          <p style={{fontSize:14,color:"rgba(255,255,255,.3)",lineHeight:1.85,maxWidth:520}}>
            Fair Rent Canada gives renters access to the same neighbourhood-level benchmarks the industry already uses. Every anonymous submission improves the estimate for the next renter.
          </p>
        </div>
      </div>

      <footer style={{borderTop:"1px solid var(--border)",padding:"20px",textAlign:"center",background:"var(--bg)"}}>
        <p style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)",letterSpacing:".04em"}}>
          Anonymous · No personal data stored · Not legal or financial advice · {new Date().getFullYear()} Fair Rent Canada
        </p>
      </footer>

    </div>
    </>
  );
}
