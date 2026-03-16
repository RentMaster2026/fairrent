import { useState } from "react";

// ─── Fair Rent Canada — Trust Pages ──────────────────────────────────────────
// Single file containing 5 trust pages: About, Privacy, Terms, FAQ, Contact.
// Each is a named export. Import whichever you need.
// All match the hub design system: Instrument Serif + Geist + Geist Mono,
// #f9fafb background, #0f172a nav, #16a34a accent.
//
// Usage in hub App.jsx:
//   import { AboutPage, PrivacyPage, TermsPage, FaqPage, ContactPage } from "./TrustPages";
//
// Render conditionally using showAbout / showPrivacy / showTerms etc. state,
// the same pattern used for the Methodology page.
// ─────────────────────────────────────────────────────────────────────────────

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
    --max:680px;
  }
  html,body,#root{margin:0;padding:0;width:100%;background:var(--bg);}
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:var(--sans);color:var(--t1);-webkit-font-smoothing:antialiased;}
  .tp-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-lg);box-shadow:var(--sh);padding:28px 28px 24px;}
  .tp-section{display:flex;flex-direction:column;gap:12px;}
  .tp-h2{font-family:var(--serif);font-size:20px;font-weight:400;color:var(--t1);letter-spacing:-.02em;line-height:1.3;margin-bottom:2px;}
  .tp-p{font-size:14px;color:var(--t2);line-height:1.85;}
  .tp-label{font-family:var(--mono);font-size:10px;color:var(--t3);text-transform:uppercase;letter-spacing:.1em;margin-bottom:12px;}
  .faq-item{border-bottom:1px solid var(--border);}
  .faq-item:last-child{border-bottom:none;}
  .faq-trigger{width:100%;display:flex;align-items:center;justify-content:space-between;padding:15px 0;background:none;border:none;cursor:pointer;text-align:left;gap:16px;font-family:var(--sans);}
  .faq-chevron{flex-shrink:0;color:var(--t3);transition:transform .2s;}
  .faq-chevron.open{transform:rotate(180deg);}
  .faq-body{overflow:hidden;transition:max-height .25s ease,opacity .2s ease;max-height:0;opacity:0;}
  .faq-body.open{max-height:500px;opacity:1;}
  .fade-up{opacity:0;transform:translateY(10px);animation:fu .45s ease forwards;}
  @keyframes fu{to{opacity:1;transform:none;}}
  .d1{animation-delay:.04s}.d2{animation-delay:.10s}.d3{animation-delay:.16s}
  .d4{animation-delay:.22s}.d5{animation-delay:.28s}.d6{animation-delay:.34s}
  @media(max-width:540px){.tp-card{padding:20px 16px 18px;}}
`;

function TrustNav({label, onBack}) {
  return(
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
  );
}

function TrustFooter() {
  return(
    <footer style={{borderTop:"1px solid var(--border)",padding:"20px",textAlign:"center",background:"var(--bg)"}}>
      <p style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)",letterSpacing:".04em"}}>
        Anonymous · No personal data stored · Not legal or financial advice · {new Date().getFullYear()} Fair Rent Canada
      </p>
    </footer>
  );
}

function TrustShell({label, title, subtitle, onBack, children}) {
  return(
    <><style>{CSS}</style>
    <div style={{minHeight:"100vh"}}>
      <TrustNav label={label} onBack={onBack}/>
      <main style={{maxWidth:"var(--max)",margin:"0 auto",padding:"48px 20px 80px",display:"flex",flexDirection:"column",gap:14}}>
        <div className="fade-up d1" style={{marginBottom:20}}>
          <div className="tp-label">{label}</div>
          <h1 style={{fontFamily:"var(--serif)",fontSize:"clamp(26px,4vw,38px)",fontWeight:400,color:"var(--t1)",lineHeight:1.15,letterSpacing:"-.02em",marginBottom:12}}>{title}</h1>
          {subtitle&&<p style={{fontSize:16,color:"var(--t2)",lineHeight:1.75,maxWidth:520}}>{subtitle}</p>}
        </div>
        {children}
      </main>
      <TrustFooter/>
    </div>
    </>
  );
}

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

// ─────────────────────────────────────────────────────────────────────────────
// ABOUT
// ─────────────────────────────────────────────────────────────────────────────

export function AboutPage({onBack}) {
  return(
    <TrustShell label="About" title="What Fair Rent Canada is and why it exists." subtitle="A free, anonymous tool that helps Canadian renters understand whether their rent is in line with local market rates." onBack={onBack}>

      <div className="tp-card fade-up d2">
        <div className="tp-section">
          <h2 className="tp-h2">The problem</h2>
          <p className="tp-p">Rent is the largest expense most Canadians carry every month. But when it comes time to sign a lease, renew a tenancy, or push back on a rent increase, renters rarely have reliable information on their side. Landlords know the market. Platforms track listings. Governments publish annual reports. Most renters have almost none of that.</p>
          <p className="tp-p">The result is that renters frequently make major financial decisions without knowing whether their rent is reasonable, below market, or significantly above what comparable units are renting for nearby.</p>
        </div>
      </div>

      <div className="tp-card fade-up d3">
        <div className="tp-section">
          <h2 className="tp-h2">What we built</h2>
          <p className="tp-p">Fair Rent Canada is a free, anonymous rent comparison tool. You enter your neighbourhood, unit type, monthly rent, and move-in year. We compare your rent against a benchmark built from public market data and, where available, anonymous rent data submitted by other renters in the same area.</p>
          <p className="tp-p">The result is a range with a confidence score, not a single precise number. We built it that way because honest ranges are more useful than made-up precision. The result also includes province-specific context on rent control guidelines and a plain-English explanation of how the estimate was built.</p>
        </div>
      </div>

      <div className="tp-card fade-up d4">
        <div className="tp-section">
          <h2 className="tp-h2">How it works</h2>
          <p className="tp-p">The benchmark starts with CMHC's annual Rental Market Survey and Rentals.ca's monthly data, adjusted for your specific neighbourhood. When enough anonymous renter submissions exist for your area and unit type, they are blended in to improve local accuracy. The more renters contribute, the better the data gets for everyone.</p>
          <p className="tp-p">No account is required. No personal information is collected. Your submission is one data point added to a pool.</p>
        </div>
      </div>

      <div className="tp-card fade-up d4">
        <div className="tp-section">
          <h2 className="tp-h2">What we are not</h2>
          <p className="tp-p">Fair Rent Canada is not a legal service. It does not provide legal advice, professional appraisals, or official determinations of fair market rent. Results are estimates for informational purposes only.</p>
          <p className="tp-p">We are also not a listing platform, a landlord tool, or a real estate service. This product exists for renters, built around the information renters actually need.</p>
        </div>
      </div>

      <div className="tp-card fade-up d5">
        <div className="tp-section">
          <h2 className="tp-h2">Cities currently covered</h2>
          <p className="tp-p">Fair Rent Canada currently covers Ottawa, Toronto, and Vancouver, with neighbourhood-level data for each city. More cities will be added as renter data grows and public data is available to support reliable estimates.</p>
        </div>
      </div>

    </TrustShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIVACY POLICY
// ─────────────────────────────────────────────────────────────────────────────

export function PrivacyPage({onBack}) {
  return(
    <TrustShell label="Privacy Policy" title="What we collect, what we don't, and why." subtitle="Fair Rent Canada is designed to collect as little information as possible. This page explains exactly what happens when you use the tool." onBack={onBack}>

      <div className="tp-card fade-up d2">
        <div className="tp-section">
          <h2 className="tp-h2">What we do not collect</h2>
          <p className="tp-p">We do not collect your name, email address, phone number, home address, or any other personal identifying information. We do not require an account to use the tool. We do not track your IP address in connection with your submission. We do not use cookies for advertising or cross-site tracking.</p>
        </div>
      </div>

      <div className="tp-card fade-up d3">
        <div className="tp-section">
          <h2 className="tp-h2">What we collect when you submit rent data</h2>
          <p className="tp-p">When you choose to submit your rent, the following data is stored in our database:</p>
          <ul style={{paddingLeft:18,display:"flex",flexDirection:"column",gap:6,marginTop:4}}>
            {["Neighbourhood","Unit type (e.g. 1 bedroom, 2 bedroom)","Monthly rent amount","Year you moved in","Whether your rent includes parking (yes or no)","Whether your rent includes utilities (yes or no)","The city (Ottawa, Toronto, or Vancouver)","Timestamp of submission"].map(item=>(
              <li key={item} style={{fontSize:14,color:"var(--t2)",lineHeight:1.6}}>{item}</li>
            ))}
          </ul>
          <p className="tp-p" style={{marginTop:8}}>None of these fields can identify you individually. There is no way to trace a submission back to a specific person.</p>
        </div>
      </div>

      <div className="tp-card fade-up d3">
        <div className="tp-section">
          <h2 className="tp-h2">Spam prevention</h2>
          <p className="tp-p">To prevent duplicate submissions from the same device, we store a timestamp in your browser's local storage after you submit. This is a number saved locally on your device — it is not sent to our servers and is not visible to us. It prevents the same browser from submitting more than once per minute. You can clear it at any time by clearing your browser's local storage.</p>
        </div>
      </div>

      <div className="tp-card fade-up d4">
        <div className="tp-section">
          <h2 className="tp-h2">How submitted data is used</h2>
          <p className="tp-p">Submitted rent data is aggregated and used to improve benchmark estimates for your neighbourhood. Individual submissions are never displayed publicly. They are combined with other submissions and with public market data to produce neighbourhood-level estimates. Your submission is one anonymous data point in a larger pool.</p>
        </div>
      </div>

      <div className="tp-card fade-up d4">
        <div className="tp-section">
          <h2 className="tp-h2">Third-party services</h2>
          <p className="tp-p">We use Supabase to store submitted rent data. Supabase is a data infrastructure provider. Submitted data is stored on their servers in accordance with their privacy policy. We do not sell or share data with advertisers, data brokers, or any third parties for commercial purposes.</p>
          <p className="tp-p">We use Google Fonts to load the typefaces used on this site. Google may log font requests in accordance with their privacy policy.</p>
        </div>
      </div>

      <div className="tp-card fade-up d5">
        <div className="tp-section">
          <h2 className="tp-h2">Data retention</h2>
          <p className="tp-p">Rent submissions are retained for use in benchmark calculations. Submissions older than two years are excluded from active estimates, though they may remain in the database. We do not have a fixed deletion schedule at this time.</p>
        </div>
      </div>

      <div className="tp-card fade-up d5">
        <div className="tp-section">
          <h2 className="tp-h2">Changes to this policy</h2>
          <p className="tp-p">If we make material changes to how we collect or use data, we will update this page. We do not notify users of changes by email because we do not collect email addresses. Check this page periodically if you want to stay informed.</p>
          <p className="tp-p" style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--t3)",marginTop:4}}>Last updated: March 2026</p>
        </div>
      </div>

    </TrustShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TERMS OF USE
// ─────────────────────────────────────────────────────────────────────────────

export function TermsPage({onBack}) {
  return(
    <TrustShell label="Terms of Use" title="The rules for using Fair Rent Canada." subtitle="By using this tool, you agree to these terms. They are written to be readable, not to intimidate." onBack={onBack}>

      <div className="tp-card fade-up d2">
        <div className="tp-section">
          <h2 className="tp-h2">What this tool is</h2>
          <p className="tp-p">Fair Rent Canada is a free informational tool that provides estimated rent ranges based on public market data and anonymous renter submissions. It is provided for general informational purposes only.</p>
        </div>
      </div>

      <div className="tp-card fade-up d3" style={{background:"#fffbeb",borderColor:"#fde68a"}}>
        <div className="tp-section">
          <h2 className="tp-h2" style={{color:"#78350f"}}>Not legal advice</h2>
          <p className="tp-p" style={{color:"#92400e"}}>The results produced by Fair Rent Canada are estimates. They are not professional appraisals, legal opinions, or official determinations of fair market rent. Nothing on this site constitutes legal advice.</p>
          <p className="tp-p" style={{color:"#92400e"}}>Do not use these results as the basis for legal action, formal rent dispute applications, or binding financial decisions without consulting a qualified professional. If you believe your landlord has charged above a legally permitted rent, contact a licensed paralegal or your provincial tenant rights organization.</p>
        </div>
      </div>

      <div className="tp-card fade-up d3">
        <div className="tp-section">
          <h2 className="tp-h2">Accuracy and limitations</h2>
          <p className="tp-p">We make reasonable efforts to keep our data accurate and up to date, but we do not guarantee the accuracy, completeness, or timeliness of any estimate. Market conditions change. Data has known limitations. Results may not reflect your specific unit's true market value.</p>
          <p className="tp-p">You use this tool at your own discretion. Fair Rent Canada is not responsible for decisions made based on estimates produced by the tool.</p>
        </div>
      </div>

      <div className="tp-card fade-up d4">
        <div className="tp-section">
          <h2 className="tp-h2">Submitting data</h2>
          <p className="tp-p">When you submit rent data, you confirm that the information you are submitting is accurate to the best of your knowledge. Submitting deliberately false or misleading rent data degrades the quality of estimates for other renters. We reserve the right to exclude submissions that fall outside plausible ranges.</p>
          <p className="tp-p">You grant Fair Rent Canada a non-exclusive, royalty-free licence to use your submitted data in aggregated, anonymized form to produce rent benchmarks.</p>
        </div>
      </div>

      <div className="tp-card fade-up d4">
        <div className="tp-section">
          <h2 className="tp-h2">Acceptable use</h2>
          <p className="tp-p">You agree not to use this tool to scrape data, reverse-engineer estimates, submit automated or bulk submissions, or use the tool in any way that could harm other renters or degrade the quality of the data.</p>
          <p className="tp-p">This tool is intended for individual renters seeking information about their own rental situation. Commercial use, including use by real estate professionals, property management companies, or data aggregators, is not permitted without written consent.</p>
        </div>
      </div>

      <div className="tp-card fade-up d5">
        <div className="tp-section">
          <h2 className="tp-h2">Intellectual property</h2>
          <p className="tp-p">The design, copy, methodology, and software of Fair Rent Canada are owned by Fair Rent Canada. The underlying public data (CMHC, Rentals.ca) is owned by its respective publishers. You may share results for personal, non-commercial purposes with attribution.</p>
        </div>
      </div>

      <div className="tp-card fade-up d5">
        <div className="tp-section">
          <h2 className="tp-h2">Limitation of liability</h2>
          <p className="tp-p">To the maximum extent permitted by law, Fair Rent Canada is not liable for any direct, indirect, incidental, or consequential damages arising from your use of this tool or reliance on its results. The tool is provided as-is, without warranty of any kind.</p>
        </div>
      </div>

      <div className="tp-card fade-up d6">
        <div className="tp-section">
          <h2 className="tp-h2">Governing law</h2>
          <p className="tp-p">These terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein.</p>
          <p className="tp-p" style={{fontFamily:"var(--mono)",fontSize:11,color:"var(--t3)",marginTop:4}}>Last updated: March 2026</p>
        </div>
      </div>

    </TrustShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FAQ
// ─────────────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q:"How is my estimate calculated?",
    a:"The estimate starts with a baseline built from CMHC's annual Rental Market Survey and Rentals.ca's monthly data, adjusted for your neighbourhood and unit type. If enough anonymous renter submissions exist for your specific area, they are blended in using a weighted average. The more local submissions we have, the more the estimate reflects real rents in your neighbourhood rather than city-wide averages.",
  },
  {
    q:"Is this legal advice?",
    a:"No. Fair Rent Canada provides market estimates for general informational purposes only. Results are not professional appraisals, legal opinions, or official determinations of fair market rent. If you are involved in a rent dispute or believe your landlord has charged above a legally permitted amount, consult a licensed paralegal or contact your provincial tenant rights organization.",
  },
  {
    q:"Is my submission anonymous?",
    a:"Yes. We do not collect your name, email address, IP address, or any other personal identifying information. When you submit rent data, we store only your neighbourhood, unit type, rent amount, move-in year, and whether parking or utilities are included. There is no way to trace that submission back to you.",
  },
  {
    q:"Why is my result a range and not one number?",
    a:"Because a single number would be misleading. Rents for comparable units in the same neighbourhood vary by hundreds of dollars depending on building age, condition, finishes, and included amenities. A range honestly reflects that variation. We would rather give you a range you can trust than a precise number that implies a certainty the data does not support.",
  },
  {
    q:"Why is confidence low in some areas?",
    a:"The confidence score reflects how many local renter submissions exist for your specific neighbourhood and unit type. In areas where fewer people have used the tool, there is less community data to blend with the public baseline. The estimate becomes less precise, so the range is wider and the confidence is lower. Submitting your own rent data directly improves this for your neighbourhood.",
  },
  {
    q:"What data do you use?",
    a:"We use three sources. First, CMHC's Rental Market Survey, published annually each fall, which covers purpose-built rental buildings across major Canadian cities. Second, Rentals.ca's monthly national rent report, which tracks asking rents from active listings. Third, anonymous rent submissions from renters who use this tool. Each source is described in detail on our Methodology page.",
  },
  {
    q:"Can I trust this result in rent negotiations?",
    a:"You can use it as a reference point to inform a conversation, but you should not present it as an authoritative figure. This is a market estimate, not a professional appraisal. It can help you understand the general range of what comparable units rent for in your area. For formal negotiations or disputes, a licensed professional or official rental market data from your province would carry more weight.",
  },
  {
    q:"How often is the data updated?",
    a:"CMHC data is updated annually each fall. Rentals.ca data is updated monthly. Neighbourhood multipliers are reviewed and recalibrated after each CMHC release. Anonymous renter submissions are live and update continuously as people use the tool. Submissions older than two years are excluded from active estimates to keep the data current.",
  },
];

export function FaqPage({onBack}) {
  return(
    <TrustShell label="FAQ" title="Common questions, answered clearly." subtitle="If your question is not here, the Methodology page covers the technical details in full." onBack={onBack}>
      <div className="tp-card fade-up d2">
        {FAQS.map((item,i)=><FaqItem key={i} q={item.q} a={item.a}/>)}
      </div>
    </TrustShell>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT
// ─────────────────────────────────────────────────────────────────────────────

export function ContactPage({onBack}) {
  return(
    <TrustShell label="Contact" title="Get in touch." subtitle="Fair Rent Canada is a small independent project. We read every message." onBack={onBack}>

      <div className="tp-card fade-up d2">
        <div className="tp-section">
          <h2 className="tp-h2">How to reach us</h2>
          <p className="tp-p">The best way to get in touch is by email. We aim to respond within a few business days.</p>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,padding:"12px 18px",background:"var(--green-lt)",border:"1px solid var(--green-bd)",borderRadius:"var(--r-md)",marginTop:6}}>
            <span style={{fontFamily:"var(--mono)",fontSize:13,fontWeight:500,color:"var(--green)"}}>hello@fairrent.ca</span>
          </div>
        </div>
      </div>

      <div className="tp-card fade-up d3">
        <div className="tp-section">
          <h2 className="tp-h2">What we can help with</h2>
          <p className="tp-p">We welcome messages about any of the following:</p>
          <ul style={{paddingLeft:18,display:"flex",flexDirection:"column",gap:6,marginTop:4}}>
            {[
              "Questions about how the tool works",
              "Feedback on estimate accuracy in your neighbourhood",
              "Data corrections or concerns about methodology",
              "Press and media inquiries",
              "Partnership or collaboration inquiries",
              "Privacy questions or data deletion requests",
            ].map(item=>(
              <li key={item} style={{fontSize:14,color:"var(--t2)",lineHeight:1.6}}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="tp-card fade-up d4">
        <div className="tp-section">
          <h2 className="tp-h2">What we cannot help with</h2>
          <p className="tp-p">We are not able to provide legal advice, assist with individual rent disputes, verify specific rent amounts, or act as a mediator between tenants and landlords. For legal help, contact a licensed paralegal or your provincial tenant rights organization.</p>
          <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:8}}>
            {[
              {city:"Ontario", org:"Community Legal Education Ontario (CLEO)", url:"https://www.cleo.on.ca"},
              {city:"BC", org:"Residential Tenancy Branch", url:"https://www2.gov.bc.ca/gov/content/housing-tenancy/residential-tenancies"},
            ].map(({city,org,url})=>(
              <div key={city} style={{padding:"10px 14px",background:"var(--bg)",border:"1px solid var(--border)",borderRadius:"var(--r-sm)"}}>
                <div style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--t3)",letterSpacing:".06em",textTransform:"uppercase",marginBottom:3}}>{city}</div>
                <a href={url} target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:"var(--green)",textDecoration:"none",fontWeight:500}}>{org} →</a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="tp-card fade-up d5">
        <div className="tp-section">
          <h2 className="tp-h2">Response times</h2>
          <p className="tp-p">Fair Rent Canada is operated by a small team. We read every message and respond to most within two to four business days. During busy periods it may take a little longer. We appreciate your patience.</p>
        </div>
      </div>

    </TrustShell>
  );
}
