import { useState } from "react";

// ─── Shared CSS ───────────────────────────────────────────────────────────────

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
  button{font-family:var(--sans);cursor:pointer;}
  a{color:var(--accent);}
  .gov-nav{background:var(--nav-bg);border-bottom:3px solid var(--accent);}
  .gov-nav-inner{max-width:1100px;margin:0 auto;padding:0 16px;display:flex;align-items:center;justify-content:space-between;height:48px;gap:16px;}
  .gov-wordmark{font-size:13px;font-weight:700;color:#fff;text-decoration:none;white-space:nowrap;}
  .gov-wordmark span{font-weight:400;color:#aab8c2;}
  .back-btn{background:none;border:none;font-size:12px;color:#aab8c2;cursor:pointer;padding:0;letter-spacing:0.02em;}
  .back-btn:hover{color:#fff;text-decoration:underline;}
  .gov-subbar{background:var(--bar-bg);border-bottom:1px solid #3d5a6e;}
  .gov-subbar-inner{max-width:1100px;margin:0 auto;padding:0 16px;height:34px;display:flex;align-items:center;}
  .breadcrumb{font-size:12px;color:#aab8c2;}
  .breadcrumb a{color:#aab8c2;text-decoration:none;}
  .breadcrumb a:hover{text-decoration:underline;}
  .page-wrap{max-width:800px;margin:0 auto;padding:32px 16px 64px;}
  .page-heading{margin-bottom:28px;padding-bottom:20px;border-bottom:1px solid var(--border);}
  .page-label{font-size:11px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:0.06em;margin-bottom:10px;}
  .page-title{font-size:clamp(20px,3vw,28px);font-weight:700;color:var(--t1);margin-bottom:8px;line-height:1.2;}
  .page-intro{font-size:14px;color:var(--t2);line-height:1.65;max-width:600px;}
  .section{margin-bottom:0;}
  .section + .section{margin-top:0;}
  .panel{background:var(--white);border:1px solid var(--border);margin-bottom:12px;}
  .panel-header{padding:11px 16px;background:#f0f0f0;border-bottom:1px solid var(--border);font-size:13px;font-weight:700;color:var(--t1);}
  .panel-body{padding:16px;font-size:13px;color:var(--t2);line-height:1.75;}
  .panel-body p+p{margin-top:10px;}
  .panel-body ul{padding-left:18px;display:flex;flex-direction:column;gap:5px;margin-top:6px;}
  .panel-body li{font-size:13px;color:var(--t2);line-height:1.6;}
  .notice{padding:12px 14px;border-left:3px solid;font-size:13px;line-height:1.6;margin-bottom:12px;}
  .notice-amber{background:#fdf8f0;border-color:#7a4f00;color:#5a3d00;}
  .notice-green{background:#f0f7f2;border-color:#1a5c34;color:#1a4a28;}
  .notice-blue{background:#f0f4fd;border-color:#1a3a7a;color:#1a2a5a;}
  .contact-box{background:var(--accent-bg);border:1px solid #a8d5b5;border-left:3px solid var(--accent);padding:14px 16px;margin-bottom:12px;}
  .contact-email{font-family:var(--mono);font-size:14px;font-weight:700;color:var(--accent);}
  .data-row{display:flex;justify-content:space-between;align-items:baseline;padding:8px 0;border-bottom:1px solid #ebebeb;gap:12px;}
  .data-row:last-child{border-bottom:none;}
  .data-key{font-size:13px;color:var(--t2);}
  .data-val{font-family:var(--mono);font-size:12px;color:var(--t1);font-weight:600;flex-shrink:0;}
  .faq-item{border-bottom:1px solid var(--border);}
  .faq-item:last-child{border-bottom:none;}
  .faq-trigger{width:100%;display:flex;align-items:center;justify-content:space-between;padding:12px 0;background:none;border:none;cursor:pointer;text-align:left;gap:16px;font-family:var(--sans);}
  .faq-q{font-size:13px;font-weight:700;color:var(--t1);line-height:1.4;}
  .faq-icon{font-size:16px;color:var(--t3);font-weight:700;flex-shrink:0;line-height:1;}
  .faq-body{font-size:13px;color:var(--t2);line-height:1.75;padding-bottom:12px;}
  .resource-row{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #ebebeb;align-items:flex-start;}
  .resource-row:last-child{border-bottom:none;}
  .resource-name{font-size:13px;font-weight:600;color:var(--t1);margin-bottom:2px;}
  .resource-sub{font-size:12px;color:var(--t3);}
  .resource-link{font-size:12px;color:var(--accent);font-weight:600;}
  .section-divider{font-size:11px;font-weight:700;color:var(--t3);text-transform:uppercase;letter-spacing:0.06em;margin:20px 0 10px;padding-bottom:6px;border-bottom:2px solid var(--border);}
  .footer-note{margin-top:32px;padding-top:16px;border-top:1px solid var(--border);font-size:11px;color:var(--t3);text-align:center;font-family:var(--mono);}
  @media(max-width:480px){.page-wrap{padding:20px 12px 48px;}}
`;

// ─── Shared shell ─────────────────────────────────────────────────────────────

function Shell({ label, title, intro, onBack, breadcrumb, children }) {
  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight:"100vh", background:"var(--bg)" }}>

        <div className="gov-nav">
          <div className="gov-nav-inner">
            <a href="https://fairrent.ca" className="gov-wordmark">
              Fair Rent Canada <span>/ {label}</span>
            </a>
            {onBack && (
              <button className="back-btn" onClick={onBack}>&#8592; Back</button>
            )}
          </div>
        </div>

        <div className="gov-subbar">
          <div className="gov-subbar-inner">
            <span className="breadcrumb">
              <a href="https://fairrent.ca">Fair Rent Canada</a>
              {" / "}{breadcrumb || label}
            </span>
          </div>
        </div>

        <div className="page-wrap">
          <div className="page-heading">
            <div className="page-label">{label}</div>
            <h1 className="page-title">{title}</h1>
            {intro && <p className="page-intro">{intro}</p>}
          </div>
          {children}
          <div className="footer-note">
            Anonymous &middot; No personal data stored &middot; Not legal or financial advice &middot; {new Date().getFullYear()} Fair Rent Canada
          </div>
        </div>
      </div>
    </>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <button className="faq-trigger" onClick={() => setOpen(o => !o)}>
        <span className="faq-q">{q}</span>
        <span className="faq-icon">{open ? "−" : "+"}</span>
      </button>
      {open && <p className="faq-body">{a}</p>}
    </div>
  );
}

// ─── ABOUT ────────────────────────────────────────────────────────────────────

export function AboutPage({ onBack }) {
  return (
    <Shell label="About" title="About Fair Rent Canada" breadcrumb="About"
      intro="A free, anonymous tool that helps Canadian renters understand whether their rent is in line with local market rates."
      onBack={onBack}>

      <div className="section-divider">The problem</div>
      <div className="panel">
        <div className="panel-body">
          <p>Rent is the largest expense most Canadians carry every month. But when it comes time to sign a lease, renew a tenancy, or push back on a rent increase, renters rarely have reliable information on their side. Landlords know the market. Platforms track listings. Governments publish annual reports. Most renters have almost none of that.</p>
          <p>The result is that renters frequently make major financial decisions without knowing whether their rent is reasonable, below market, or significantly above what comparable units are renting for nearby.</p>
        </div>
      </div>

      <div className="section-divider">What we built</div>
      <div className="panel">
        <div className="panel-body">
          <p>Fair Rent Canada is a free, anonymous rent comparison tool. You enter your neighbourhood, unit type, monthly rent, and move-in year. We compare your rent against a benchmark built from public market data and, where available, anonymous rent data submitted by other renters in the same area.</p>
          <p>The result is a range with a confidence score, not a single precise number. We built it that way because honest ranges are more useful than made-up precision. The result also includes province-specific context on rent control guidelines and a plain-English explanation of how the estimate was built.</p>
        </div>
      </div>

      <div className="section-divider">How it works</div>
      <div className="panel">
        <div className="panel-body">
          <p>The benchmark starts with CMHC's annual Rental Market Survey and Rentals.ca's monthly data, adjusted for your specific neighbourhood. When enough anonymous renter submissions exist for your area and unit type, they are blended in to improve local accuracy. The more renters contribute, the better the data gets for everyone.</p>
          <p>No account is required. No personal information is collected. Your submission is one data point added to an anonymized pool.</p>
        </div>
      </div>

      <div className="section-divider">What we are not</div>
      <div className="panel">
        <div className="panel-body">
          <div className="notice notice-amber" style={{ marginBottom:0 }}>
            <strong>Not a legal service.</strong> Fair Rent Canada does not provide legal advice, professional appraisals, or official determinations of fair market rent. Results are estimates for informational purposes only. This product exists for renters, built around the information renters actually need.
          </div>
        </div>
      </div>

      <div className="section-divider">Cities currently covered</div>
      <div className="panel">
        <div className="panel-body">
          {[
            { city:"Ottawa", province:"Ontario", url:"https://ottawafairrent.ca" },
            { city:"Toronto", province:"Ontario", url:"https://torontofairrent.ca" },
            { city:"Vancouver", province:"British Columbia", url:"https://vancouverfairrent.ca" },
          ].map(({ city, province, url }) => (
            <div key={city} className="data-row">
              <div className="data-key">{city}, {province}</div>
              <a href={url} className="data-val" style={{ color:"var(--accent)", textDecoration:"none" }}>{url.replace("https://","")}</a>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

// ─── PRIVACY ─────────────────────────────────────────────────────────────────

export function PrivacyPage({ onBack }) {
  return (
    <Shell label="Privacy Policy" title="Privacy Policy" breadcrumb="Privacy"
      intro="Fair Rent Canada is designed to collect as little information as possible. This page explains exactly what happens when you use the tool."
      onBack={onBack}>

      <div className="notice notice-green" style={{ marginBottom:12 }}>
        <strong>Short version:</strong> We do not collect your name, email, phone number, or IP address. When you submit rent data, we store only your neighbourhood, unit type, rent amount, move-in year, and whether parking or utilities are included. None of this can identify you.
      </div>

      <div className="section-divider">What we do not collect</div>
      <div className="panel">
        <div className="panel-body">
          <ul>
            <li>Name, email address, phone number, or home address</li>
            <li>IP address or device identifier</li>
            <li>Account credentials (no account exists)</li>
            <li>Cookies for advertising or cross-site tracking</li>
            <li>Any information that could identify you individually</li>
          </ul>
        </div>
      </div>

      <div className="section-divider">What we collect when you submit rent data</div>
      <div className="panel">
        <div className="panel-body">
          <p>When you choose to submit your rent, the following data is stored in our database:</p>
          <ul>
            <li>Neighbourhood</li>
            <li>Unit type (e.g. 1 bedroom, 2 bedroom)</li>
            <li>Monthly rent amount</li>
            <li>Year you moved in</li>
            <li>Whether your rent includes parking (yes or no)</li>
            <li>Whether your rent includes utilities (yes or no)</li>
            <li>The city (Ottawa, Toronto, or Vancouver)</li>
            <li>Timestamp of submission</li>
          </ul>
          <p style={{ marginTop:10 }}>None of these fields can identify you individually. There is no way to trace a submission back to a specific person.</p>
        </div>
      </div>

      <div className="section-divider">Spam prevention</div>
      <div className="panel">
        <div className="panel-body">
          <p>To prevent duplicate submissions from the same device, we store a timestamp in your browser's local storage after you submit. This number is saved locally on your device — it is not sent to our servers and is not visible to us. It prevents the same browser from submitting more than once per minute. You can clear it by clearing your browser's local storage.</p>
        </div>
      </div>

      <div className="section-divider">How submitted data is used</div>
      <div className="panel">
        <div className="panel-body">
          <p>Submitted rent data is aggregated and used to improve benchmark estimates for your neighbourhood. Individual submissions are never displayed publicly. They are combined with other submissions and with public market data to produce neighbourhood-level estimates. Your submission is one anonymous data point in a larger pool.</p>
        </div>
      </div>

      <div className="section-divider">Third-party services</div>
      <div className="panel">
        <div className="panel-body">
          <p>We use <strong>Supabase</strong> to store submitted rent data. Submitted data is stored on their servers in accordance with their privacy policy. We do not sell or share data with advertisers, data brokers, or any third parties for commercial purposes.</p>
          <p>We do not use Google Fonts or any third-party font service. All fonts are loaded from the operating system.</p>
        </div>
      </div>

      <div className="section-divider">Data retention</div>
      <div className="panel">
        <div className="panel-body">
          <p>Rent submissions are retained for use in benchmark calculations. Submissions older than two years are excluded from active estimates, though they may remain in the database. We do not have a fixed deletion schedule at this time.</p>
          <p style={{ marginTop:10, fontFamily:"var(--mono)", fontSize:11, color:"var(--t3)" }}>Last updated: March 2026</p>
        </div>
      </div>
    </Shell>
  );
}

// ─── TERMS ────────────────────────────────────────────────────────────────────

export function TermsPage({ onBack }) {
  return (
    <Shell label="Terms of Use" title="Terms of Use" breadcrumb="Terms"
      intro="By using this tool, you agree to these terms. They are written to be readable, not to intimidate."
      onBack={onBack}>

      <div className="section-divider">What this tool is</div>
      <div className="panel">
        <div className="panel-body">
          <p>Fair Rent Canada is a free informational tool that provides estimated rent ranges based on public market data and anonymous renter submissions. It is provided for general informational purposes only.</p>
        </div>
      </div>

      <div className="notice notice-amber">
        <strong>Not legal advice.</strong> The results produced by Fair Rent Canada are estimates. They are not professional appraisals, legal opinions, or official determinations of fair market rent. Nothing on this site constitutes legal advice. Do not use these results as the basis for legal action, formal rent dispute applications, or binding financial decisions without consulting a qualified professional.
      </div>

      <div className="section-divider">Accuracy and limitations</div>
      <div className="panel">
        <div className="panel-body">
          <p>We make reasonable efforts to keep our data accurate and up to date, but we do not guarantee the accuracy, completeness, or timeliness of any estimate. Market conditions change. Data has known limitations. Results may not reflect your specific unit's true market value.</p>
          <p>You use this tool at your own discretion. Fair Rent Canada is not responsible for decisions made based on estimates produced by the tool.</p>
        </div>
      </div>

      <div className="section-divider">Submitting data</div>
      <div className="panel">
        <div className="panel-body">
          <p>When you submit rent data, you confirm that the information is accurate to the best of your knowledge. Submitting deliberately false or misleading rent data degrades the quality of estimates for other renters. We reserve the right to exclude submissions that fall outside plausible ranges.</p>
          <p>You grant Fair Rent Canada a non-exclusive, royalty-free licence to use your submitted data in aggregated, anonymized form to produce rent benchmarks.</p>
        </div>
      </div>

      <div className="section-divider">Acceptable use</div>
      <div className="panel">
        <div className="panel-body">
          <p>You agree not to use this tool to scrape data, reverse-engineer estimates, submit automated or bulk submissions, or use the tool in any way that could harm other renters or degrade the quality of the data.</p>
          <p>This tool is intended for individual renters seeking information about their own rental situation. Commercial use, including use by real estate professionals, property management companies, or data aggregators, is not permitted without written consent.</p>
        </div>
      </div>

      <div className="section-divider">Limitation of liability</div>
      <div className="panel">
        <div className="panel-body">
          <p>To the maximum extent permitted by law, Fair Rent Canada is not liable for any direct, indirect, incidental, or consequential damages arising from your use of this tool or reliance on its results. The tool is provided as-is, without warranty of any kind.</p>
          <p style={{ marginTop:10 }}>These terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein.</p>
          <p style={{ marginTop:10, fontFamily:"var(--mono)", fontSize:11, color:"var(--t3)" }}>Last updated: March 2026</p>
        </div>
      </div>
    </Shell>
  );
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "How is my estimate calculated?",
    a: "The estimate starts with a baseline built from CMHC's annual Rental Market Survey and Rentals.ca's monthly data, adjusted for your neighbourhood and unit type. If enough anonymous renter submissions exist for your specific area, they are blended in using a weighted average. The more local submissions we have, the more the estimate reflects real rents in your neighbourhood rather than city-wide averages.",
  },
  {
    q: "Is this legal advice?",
    a: "No. Fair Rent Canada provides market estimates for general informational purposes only. Results are not professional appraisals, legal opinions, or official determinations of fair market rent. If you are involved in a rent dispute or believe your landlord has charged above a legally permitted amount, consult a licensed paralegal or contact your provincial tenant rights organization.",
  },
  {
    q: "Is my submission anonymous?",
    a: "Yes. We do not collect your name, email address, IP address, or any other personal identifying information. When you submit rent data, we store only your neighbourhood, unit type, rent amount, move-in year, and whether parking or utilities are included. There is no way to trace that submission back to you.",
  },
  {
    q: "Why is my result a range and not one number?",
    a: "Because a single number would be misleading. Rents for comparable units in the same neighbourhood vary by hundreds of dollars depending on building age, condition, finishes, and included amenities. A range honestly reflects that variation. We would rather give you a range you can trust than a precise number that implies a certainty the data does not support.",
  },
  {
    q: "Why is confidence low in some areas?",
    a: "The confidence score reflects how many local renter submissions exist for your specific neighbourhood and unit type. In areas where fewer people have used the tool, there is less community data to blend with the public baseline. The estimate becomes less precise, so the range is wider and the confidence is lower. Submitting your own rent data directly improves this for your neighbourhood.",
  },
  {
    q: "What data do you use?",
    a: "We use three sources. First, CMHC's Rental Market Survey, published annually each fall, which covers purpose-built rental buildings across major Canadian cities. Second, Rentals.ca's monthly national rent report, which tracks asking rents from active listings. Third, anonymous rent submissions from renters who use this tool.",
  },
  {
    q: "Can I trust this result in rent negotiations?",
    a: "You can use it as a reference point to inform a conversation, but you should not present it as an authoritative figure. This is a market estimate, not a professional appraisal. For formal negotiations or disputes, a licensed professional or official rental market data from your province would carry more weight.",
  },
  {
    q: "How often is the data updated?",
    a: "CMHC data is updated annually each fall. Rentals.ca data is updated monthly. Neighbourhood multipliers are reviewed and recalibrated after each CMHC release. Anonymous renter submissions are live and update continuously. Submissions older than two years are excluded from active estimates to keep the data current.",
  },
  {
    q: "Does the tool account for rent control?",
    a: "Yes, for Ontario units first occupied before November 15, 2018, and for all BC tenancies. When applicable, the result includes an estimated legal maximum based on provincial guideline rates back to your move-in year. These calculations are estimates only and should not be used as legal determinations.",
  },
];

export function FaqPage({ onBack }) {
  return (
    <Shell label="FAQ" title="Frequently asked questions" breadcrumb="FAQ"
      intro="Common questions about how Fair Rent Canada works, what the data means, and what the results can and cannot tell you."
      onBack={onBack}>

      <div className="panel">
        <div className="panel-body" style={{ padding:"0 16px" }}>
          {FAQS.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} />)}
        </div>
      </div>
    </Shell>
  );
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────

export function ContactPage({ onBack }) {
  return (
    <Shell label="Contact" title="Contact" breadcrumb="Contact"
      intro="Fair Rent Canada is a small independent project. We read every message."
      onBack={onBack}>

      <div className="section-divider">How to reach us</div>
      <div className="contact-box">
        <div style={{ fontSize:12, color:"var(--t3)", marginBottom:4 }}>Email</div>
        <div className="contact-email">hello@fairrent.ca</div>
        <div style={{ fontSize:12, color:"var(--t3)", marginTop:6 }}>We aim to respond within two to four business days.</div>
      </div>

      <div className="section-divider">What we can help with</div>
      <div className="panel">
        <div className="panel-body">
          <ul>
            <li>Questions about how the tool works</li>
            <li>Feedback on estimate accuracy in your neighbourhood</li>
            <li>Data corrections or concerns about methodology</li>
            <li>Press and media inquiries</li>
            <li>Partnership or collaboration inquiries</li>
            <li>Privacy questions or data deletion requests</li>
          </ul>
        </div>
      </div>

      <div className="section-divider">What we cannot help with</div>
      <div className="panel">
        <div className="panel-body">
          <p>We are not able to provide legal advice, assist with individual rent disputes, verify specific rent amounts, or act as a mediator between tenants and landlords. For legal help, contact a licensed paralegal or your provincial tenant rights organization.</p>
        </div>
      </div>

      <div className="section-divider">Tenant rights resources</div>
      <div className="panel">
        <div style={{ padding:"0 16px" }}>
          {[
            { province:"Ontario", org:"Community Legal Education Ontario (CLEO)", url:"https://www.cleo.on.ca", sub:"Free legal information for tenants in Ontario" },
            { province:"Ontario", org:"Landlord and Tenant Board", url:"https://tribunalsontario.ca/ltb", sub:"File applications and access tribunal decisions" },
            { province:"British Columbia", org:"Residential Tenancy Branch", url:"https://www2.gov.bc.ca/gov/content/housing-tenancy/residential-tenancies", sub:"BC government tenancy dispute resolution" },
          ].map(({ province, org, url, sub }) => (
            <div key={org} className="resource-row">
              <div style={{ width:8, height:8, borderRadius:"50%", background:"var(--accent)", flexShrink:0, marginTop:4 }}/>
              <div>
                <div style={{ fontSize:11, color:"var(--t3)", marginBottom:2 }}>{province}</div>
                <div className="resource-name">{org}</div>
                <div className="resource-sub">{sub}</div>
                <a href={url} target="_blank" rel="noopener noreferrer" className="resource-link">{url.replace("https://","").replace(/\/$/,"")} &rarr;</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
