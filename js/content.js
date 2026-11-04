/*
 * All copy and official sources for the guide live here so the page can be
 * refreshed without touching layout code. Facts verified against Twilio docs
 * on 2026-10-30 — re-check fees, timelines and product status before reuse.
 */
window.GUIDE = (() => {
  const T = 'https://www.twilio.com';

  // id → { t: title, u: url, d: what it supports, k: kind }
  const SOURCES = {
    campaignBP:     { t: '10DLC Campaign Approval Best Practices', u: 'https://help.twilio.com/articles/11847054539547-A2P-10DLC-Campaign-Approval-Best-Practices', d: 'Start here: how to get campaigns approved', k: 'Help Center', key: true },
    buildAccount:   { t: 'Build your account', u: `${T}/docs/messaging/onboarding/build-your-account`, d: 'Recommended ISV account setup', k: 'Docs' },
    subaccounts:    { t: 'Subaccounts API', u: `${T}/docs/iam/api/subaccounts`, d: 'Create, suspend, close, move numbers', k: 'Docs' },
    apiKeys:        { t: 'API keys', u: `${T}/docs/iam/api-keys`, d: 'Main, Standard and Restricted keys', k: 'Docs' },
    restrictedKeys: { t: 'Restricted API keys', u: `${T}/docs/iam/api-keys/restricted-api-keys`, d: 'Least-privilege keys', k: 'Docs' },
    secondaryToken: { t: 'Secondary Auth Token', u: `${T}/docs/iam/api/secondary_authtoken`, d: 'Rotate the Auth Token', k: 'Docs' },
    orgs:           { t: 'Organizations', u: `${T}/docs/iam/organizations`, d: 'Manage many accounts and users', k: 'Docs' },
    sso:            { t: 'Single Sign-On', u: `${T}/docs/iam/single-sign-on`, d: 'SAML SSO setup', k: 'Docs' },
    usageTriggers:  { t: 'Usage Triggers', u: `${T}/docs/usage/api/usage-trigger`, d: 'Spend alerts per account', k: 'Docs' },
    usageRecords:   { t: 'Usage Records', u: `${T}/docs/usage/api/usage-record`, d: 'Usage per account', k: 'Docs' },
    isvTactics:     { t: 'Messaging tactics for ISVs', u: `${T}/en-us/blog/insights/best-practices/successful-messaging-tactics-for-isvs`, d: 'Subaccounts and customer vetting', k: 'Blog' },

    chooseSender:   { t: 'Choose a sender type', u: `${T}/docs/numbers-and-senders/choose-sender-type`, d: 'All sender types compared', k: 'Docs' },
    senderStrategy: { t: 'Sender strategy', u: `${T}/docs/messaging/onboarding/prepare-your-sender-strategy`, d: 'North America options and lead times', k: 'Docs' },
    intlSms:        { t: 'International SMS', u: `${T}/docs/messaging/guides/sending-international-sms-guide`, d: 'Sender types by country', k: 'Docs' },
    a2p10dlc:       { t: 'A2P 10DLC', u: `${T}/docs/messaging/compliance/a2p-10dlc`, d: 'Brand types and daily caps', k: 'Docs' },
    directStd:      { t: '10DLC Standard onboarding', u: `${T}/docs/messaging/compliance/a2p-10dlc/direct-standard-onboarding`, d: 'Review times and limits', k: 'Docs' },
    block10dlc:     { t: 'Unregistered 10DLC blocked', u: `${T}/en-us/changelog/-u-s--a2p-10dlc--full-blocking-of-traffic-sent-from-unregistered`, d: 'Since Sept 1, 2023', k: 'Changelog' },
    mmsRates:       { t: '10DLC MMS rate limits', u: `${T}/en-us/changelog/increased-mms-rate-limits-for-a2p-10dlc-phone-numbers-in-the-u-s0`, d: 'MMS speed by Trust Score', k: 'Changelog' },
    atScale:        { t: 'Messaging at scale', u: `${T}/docs/messaging/guides/best-practices-at-scale`, d: 'Throughput and Canada rules', k: 'Docs' },
    msgServices:    { t: 'Messaging Services', u: `${T}/docs/messaging/services`, d: 'Sender pools and Sticky Sender', k: 'Docs' },
    alphaInMs:      { t: 'Alphanumeric Sender IDs', u: `${T}/docs/messaging/services/alphanumeric-sender-ids-in-messaging-services`, d: 'Branded one-way IDs', k: 'Docs' },
    alphaReg:       { t: 'Alphanumeric registration', u: `${T}/docs/trust-hub/registrations/alphanumeric-sender-id`, d: 'Countries needing pre-registration', k: 'Docs' },
    caSms:          { t: 'Canada SMS guidelines', u: `${T}/en-us/guidelines/ca/sms`, d: 'Canadian sender rules', k: 'Guidelines' },
    caShortCode:    { t: 'Canada short codes', u: `${T}/en-us/guidelines/ca/short-code`, d: 'CWTA approval process', k: 'Guidelines' },
    usShortCode:    { t: 'US short codes', u: `${T}/en-us/guidelines/us/short-code`, d: 'US short code process', k: 'Guidelines' },
    waTechProvider: { t: 'WhatsApp Tech Provider', u: `${T}/docs/whatsapp/isv/tech-provider-program`, d: 'WhatsApp for ISVs', k: 'Docs' },
    rcs:            { t: 'RCS onboarding', u: `${T}/docs/rcs/onboarding`, d: 'RCS registration', k: 'Docs' },
    err30034:       { t: 'Error 30034', u: `${T}/docs/api/errors/30034`, d: 'Unregistered 10DLC number', k: 'Docs' },
    err30032:       { t: 'Error 30032', u: `${T}/docs/api/errors/30032`, d: 'Unverified toll-free number', k: 'Docs' },

    isvApi:         { t: '10DLC ISV API guide', u: `${T}/docs/messaging/compliance/a2p-10dlc/onboarding-isv-api`, d: 'Profile → Brand → Campaign', k: 'Docs' },
    isvSoleProp:    { t: 'Sole Proprietor (ISV API)', u: `${T}/docs/messaging/compliance/a2p-10dlc/onboarding-isv-api-sole-prop-new`, d: 'Customers without a Tax ID', k: 'Docs' },
    brandFees:      { t: '10DLC Brand fees', u: `${T}/docs/trust-hub/registrations/a2p-10dlc-brand`, d: 'Registration and vetting fees', k: 'Docs' },
    tfvApi:         { t: 'Toll-Free Verification API', u: `${T}/docs/messaging/compliance/toll-free/api-onboarding`, d: 'Fields, statuses, timing', k: 'Docs' },
    tfvConsole:     { t: 'Toll-Free Verification (Console)', u: `${T}/docs/messaging/compliance/toll-free/console-onboarding`, d: 'Console steps', k: 'Docs' },
    tfvPolicy:      { t: 'Toll-free policy update', u: `${T}/en-us/blog/toll-free-verification-policy`, d: 'Business Registration Number rule', k: 'Blog' },
    err30474:       { t: 'Error 30474', u: `${T}/docs/api/errors/30474`, d: 'ISV details used instead of customer', k: 'Docs' },
    err30527:       { t: 'Error 30527', u: `${T}/docs/api/errors/30527`, d: 'Missing Business Registration Number', k: 'Docs' },
    embedTfv:       { t: 'Embeddable: Toll-Free', u: `${T}/docs/messaging/compliance/toll-free/compliance-embeddable-onboarding`, d: 'Embed toll-free verification', k: 'Docs' },
    embed10dlc:     { t: 'Embeddable: 10DLC', u: `${T}/docs/messaging/compliance/a2p-10dlc/compliance-embeddable-onboarding`, d: 'Embed 10DLC registration', k: 'Docs' },
    embedLaunch:    { t: 'Compliance Embeddable launch', u: `${T}/en-us/blog/products/launches/ISV-Compliance-Embeddable`, d: 'Overview and roadmap', k: 'Blog' },
    trustHubRegs:   { t: 'Trust Hub registrations', u: `${T}/docs/trust-hub/registrations`, d: 'Registrations by region', k: 'Docs' },
    regApi:         { t: 'Regulatory Compliance API', u: `${T}/docs/phone-numbers/regulatory/api`, d: 'Bundles and documents', k: 'Docs' },
    regStart:       { t: 'Regulatory Compliance', u: `${T}/docs/phone-numbers/regulatory/getting-started`, d: 'Buying numbers abroad', k: 'Docs' },
    regBundle:      { t: 'Create a bundle', u: `${T}/docs/phone-numbers/regulatory/getting-started/console-create-new-bundle`, d: 'Console steps', k: 'Docs' },
    optOut:         { t: 'Advanced Opt-Out', u: `${T}/docs/messaging/tutorials/advanced-opt-out`, d: 'STOP/HELP handling', k: 'Docs' },
    msgPolicy:      { t: 'Messaging Policy', u: `${T}/en-us/legal/messaging-policy`, d: 'Consent and content rules', k: 'Policy' },
    aup:            { t: 'Acceptable Use Policy', u: `${T}/en-us/legal/aup`, d: 'Prohibited use', k: 'Policy' },

    antiFraud:      { t: 'Anti-fraud guide', u: `${T}/docs/usage/anti-fraud-developer-guide`, d: 'Core fraud protections', k: 'Docs' },
    fraudResponse:  { t: 'Fraud response guide', u: `${T}/docs/usage/fraud-response-guide`, d: 'What to do if attacked', k: 'Docs' },
    pumping:        { t: 'SMS Pumping Protection', u: `${T}/docs/messaging/features/sms-pumping-protection-programmable-messaging`, d: 'Block fake SMS traffic', k: 'Docs' },
    smsGeo:         { t: 'SMS Geo Permissions', u: `${T}/docs/messaging/guides/sms-geo-permissions`, d: 'Allowed countries for SMS', k: 'Docs' },
    fraudGuard:     { t: 'Verify Fraud Guard', u: `${T}/docs/verify/preventing-toll-fraud/sms-fraud-guard`, d: 'OTP fraud protection', k: 'Docs' },
    verifyGeo:      { t: 'Verify Geo Permissions', u: `${T}/docs/verify/preventing-toll-fraud/verify-geo-permissions`, d: 'Allowed countries for Verify', k: 'Docs' },
    voiceGeo:       { t: 'Voice Geo Permissions', u: `${T}/docs/sip-trunking/voice-dialing-geographic-permissions`, d: 'Allowed countries for calls', k: 'Docs' },
    dialingApi:     { t: 'Dialing Permissions API', u: `${T}/docs/voice/api/dialing-permissions-resources`, d: 'Voice permissions by API', k: 'Docs' },
    sipSecurity:    { t: 'SIP security', u: `${T}/docs/voice/api/sip-security`, d: 'Secure SIP trunks', k: 'Docs' },
    webhookSec:     { t: 'Webhook security', u: `${T}/docs/usage/webhooks/webhooks-security`, d: 'Validate request signatures', k: 'Docs' },
    sharedKeys:     { t: 'Webhook SharedKeys', u: `${T}/docs/usage/webhooks/webhook-shared-keys`, d: 'Your own signing key', k: 'Docs' },
    pkcv:           { t: 'Public Key Client Validation', u: `${T}/docs/iam/pkcv`, d: 'Signed API requests', k: 'Docs' },
    shaken:         { t: 'SHAKEN/STIR', u: `${T}/docs/voice/trusted-calling-with-shakenstir`, d: 'Verified caller ID', k: 'Docs' },
    voiceIntegrity: { t: 'Voice Integrity', u: `${T}/docs/voice/spam-monitoring-with-voiceintegrity`, d: 'Avoid "Spam Likely"', k: 'Docs' },
    cnam:           { t: 'CNAM', u: `${T}/docs/voice/brand-your-calls-using-cnam`, d: 'Business name on caller ID', k: 'Docs' },
    brandedCalling: { t: 'Branded Calling', u: `${T}/docs/voice/branded-calling`, d: 'Logo and reason on calls', k: 'Docs' },
    errorDict:      { t: 'Error and warning dictionary', u: `${T}/docs/api/errors`, d: 'Every Twilio error code', k: 'Docs' },
    a2pTroubleshoot:{ t: 'Troubleshooting A2P brands', u: `${T}/docs/messaging/compliance/a2p-10dlc/troubleshooting-a2p-brands`, d: 'Fix brand and campaign failures', k: 'Docs' },
    a2pNumberIssues:{ t: 'A2P number registration issues', u: `${T}/docs/messaging/compliance/a2p-10dlc/troubleshooting-a2p-brands/troubleshooting-a2p-phone-number-registration-issues`, d: 'Numbers stuck unregistered', k: 'Docs' },
    debugging:      { t: 'Debugging your application', u: `${T}/docs/usage/troubleshooting/debugging-your-application`, d: 'Find errors in Console logs', k: 'Docs' },
    monitorAlerts:  { t: 'Monitor Alerts API', u: `${T}/docs/usage/monitor-alert`, d: 'Pull errors per subaccount by API', k: 'Docs' },
    fraudUpdate:    { t: 'Fraud update (July 2025)', u: `${T}/en-us/blog/insights/best-practices/quarterly-fraud-update-july-2025`, d: 'Fraud trends targeting ISVs', k: 'Blog' },
  };

  const a = (id, text) => `<a href="${SOURCES[id].u}" target="_blank" rel="noopener">${text}</a>`;

  const CHAPTERS = [
    {
      id: 'start', short: 'Start here', icon: '🧭',
      title: 'Your onboarding journey',
      concept: 'buildAccount',
      teach: `<p><b>Five steps, in order.</b> Click any step on the left to jump to it.</p>`,
      sections: [
        { label: 'What makes ISVs different', html: `
          <ul>
            <li>You register <b>your customers</b>, not yourself.</li>
            <li>You're responsible for your customers' traffic.</li>
            <li>US/Canada: <b>no sending until registered</b> (${a('err30034', '30034')}, ${a('err30032', '30032')}).</li>
          </ul>` },
        { label: 'Time to first message', html: `
          <ul class="tasks">
            <li><span class="ico">⚡</span><span>Toll-free<span class="how">Up to 3 business days</span></span></li>
            <li><span class="ico">📇</span><span>10DLC<span class="how">Days to ~2 weeks</span></span></li>
            <li><span class="ico">🏁</span><span>Short code<span class="how">US 8–12 weeks · Canada 12–16 weeks</span></span></li>
          </ul>` },
        { label: 'About this guide', deep: true, html: `
          <p>Every chapter links to official Twilio docs. <span class="verify">confirm with Twilio</span> marks anything the docs don't settle.</p>` },
      ],
      sources: ['buildAccount', 'senderStrategy', 'block10dlc', 'tfvApi'],
    },

    {
      id: 'architecture', short: 'Accounts', icon: '🏗️',
      title: 'Account architecture',
      concept: 'buildAccount',
      teach: `<p><b>Parent sends nothing. One subaccount per customer.</b></p>
              <p>Twilio's recommended ISV setup.</p>`,
      sections: [
        { label: 'Why', html: `
          <ul>
            <li><b>Contain risk:</b> one bad customer doesn't affect the rest.</li>
            <li><b>Bill accurately:</b> usage per customer.</li>
            <li><b>Configure per customer:</b> e.g. geo permissions.</li>
            <li><b>Suspend one</b>, not everyone.</li>
          </ul>` },
        { label: 'Credentials', html: `
          <ul>
            <li>One <b>API key per subaccount</b>. Don't share the Auth Token.</li>
            <li>Suspend, close and move numbers with <b>parent</b> credentials.</li>
          </ul>` },
        { label: 'Key types', deep: true, html: `
          <table class="tbl">
            <tr><th>Key</th><th>Access</th></tr>
            <tr><td><b>Main</b></td><td>Full access. Console only.</td></tr>
            <tr><td><b>Standard</b></td><td>All but Accounts and Keys.</td></tr>
            <tr><td><b>Restricted</b></td><td>Chosen permissions. US region only.</td></tr>
          </table>
          <p style="margin-top:8px">Studio and TaskRouter need the subaccount's own credentials.</p>` },
        { label: 'Gotchas', deep: true, html: `
          <ul>
            <li><b>Suspend:</b> stops traffic; numbers still billed.</li>
            <li><b>Close:</b> permanent. Numbers released.</li>
            <li><b>Move a number:</b> redo registrations and webhooks.</li>
            <li><b>Switching to subaccounts later</b> resets opt-out lists. Keep your own.</li>
            <li><b>Limit:</b> 1,000 subaccounts by default.</li>
          </ul>` },
        { label: 'Create a subaccount (Node.js)', deep: true, html: `
<pre class="code"><span class="k">const</span> sub = <span class="k">await</span> parent.api.v2010.accounts.create({
  friendlyName: <span class="s">'cust_8842'</span>   <span class="c">// your customer ID</span>
});

<span class="k">const</span> key = <span class="k">await</span> twilio(sub.sid, sub.authToken)
  .newKeys.create({ friendlyName: <span class="s">'cust_8842-prod'</span> });</pre>` },
        { label: 'Organizations vs subaccounts', deep: true, html: `
          <ul>
            <li><b>Organization:</b> separate accounts and billing, plus users and SSO.</li>
            <li><b>Subaccounts:</b> share the parent's balance. Suspend the parent and all stop.</li>
          </ul>` },
      ],
      sources: ['buildAccount', 'subaccounts', 'apiKeys', 'restrictedKeys', 'secondaryToken', 'orgs', 'sso', 'usageRecords'],
    },

    {
      id: 'senders', short: 'Senders', icon: '📱',
      title: 'Number & sender types',
      concept: 'chooseSender',
      teach: `<p>Answer three questions on the left for a recommendation. Click any card for details.</p>`,
      sections: [
        { label: 'Selected sender', id: 'sender-detail', html: '' },
        { label: 'Always', html: `
          <ul>
            <li>Send through a <b>Messaging Service</b>, one per use case.</li>
            <li><b>Don't add numbers to go faster</b>; carriers filter it. Upgrade the sender type instead.</li>
          </ul>` },
        { label: 'Messaging Service details', deep: true, html: `
          <ul>
            <li>Sender order: RCS → short code → alphanumeric → long code / toll-free.</li>
            <li><b>Sticky Sender:</b> same number per recipient.</li>
            <li>Throughput is per parent account; messages can queue up to 4 hours.</li>
          </ul>` },
      ],
      sources: ['chooseSender', 'senderStrategy', 'intlSms', 'a2p10dlc', 'directStd', 'block10dlc', 'mmsRates', 'atScale', 'msgServices', 'alphaInMs', 'caSms', 'usShortCode', 'caShortCode', 'waTechProvider', 'rcs'],
    },

    {
      id: 'compliance', short: 'Compliance', icon: '✅',
      title: 'Registration & compliance',
      concept: 'campaignBP',
      teach: `<p>Pick a region on the left.</p>
              <p><b>Always register the customer's business, not yours</b> (${a('err30474', '30474')}).</p>`,
      sections: [
        { label: 'Compliance Embeddable', html: `
          <p>A free registration form you embed in your app. Customers fill in their own details.</p>
          <table class="tbl">
            <tr><th>Covers</th><th>Region</th><th>Status</th></tr>
            <tr><td>Toll-free verification</td><td>US + CA</td><td><span class="st beta">Beta</span></td></tr>
            <tr><td>10DLC Brand + Campaign</td><td>US</td><td><span class="st beta">Request access</span></td></tr>
            <tr><td>Regulatory bundles</td><td>Intl</td><td><span class="st pilot">Pilot</span></td></tr>
            <tr><td>Branded Calling / SHAKEN / CNAM</td><td>US</td><td><span class="st pilot">Pilot</span></td></tr>
          </table>
          <p style="margin-top:8px;font-size:12.5px;color:var(--text-invert-muted)">Needs an approved Business Profile. Status as of Oct 2026.</p>` },
        { label: 'Embed it (React)', deep: true, html: `
<pre class="code"><span class="k">import</span> { TwilioComplianceEmbed } <span class="k">from</span> <span class="s">'@twilio/twilio-compliance-embed'</span>;

<span class="c">// inquiryId + token come from your server</span>
&lt;TwilioComplianceEmbed
  inquiryId={inquiryId}
  inquirySessionToken={inquirySessionToken}
/&gt;</pre>` },
        { label: 'Consent & opt-out', html: `
          <ul>
            <li>Get consent first. Marketing needs <b>written</b> consent. Keep proof.</li>
            <li>STOP is handled automatically.</li>
            <li>Twilio's Messaging Policy binds your customers too.</li>
          </ul>` },
        { label: '10DLC fees (subject to change)', deep: true, html: `
          <table class="tbl">
            <tr><td>Brand registration</td><td>$4.50 one-time</td></tr>
            <tr><td>Standard vetting</td><td>$41.50</td></tr>
            <tr><td>Vetting appeal</td><td>$11</td></tr>
            <tr><td>Authentication+</td><td>$12.50</td></tr>
          </table>
          <p style="margin-top:8px">Monthly campaign fees vary; see Twilio pricing.</p>` },
      ],
      sources: ['campaignBP', 'isvApi', 'isvSoleProp', 'a2p10dlc', 'brandFees', 'tfvApi', 'tfvConsole', 'tfvPolicy', 'err30474', 'err30527', 'embedLaunch', 'embedTfv', 'embed10dlc', 'trustHubRegs', 'caSms', 'caShortCode', 'regStart', 'regApi', 'regBundle', 'alphaReg', 'optOut', 'msgPolicy', 'aup'],
    },

    {
      id: 'fraud', short: 'Fraud & security', icon: '🛡️',
      title: 'Fraud & security',
      concept: 'antiFraud',
      teach: `<p>Fraudsters target ISVs with weak checks. Biggest risks: <b>SMS pumping</b> and <b>toll fraud</b>.</p>
              <p>Tick off the checklist. Progress is saved.</p>`,
      sections: [
        { label: 'Often missed', html: `
          <ul>
            <li><b>SMS geo permissions are Console-only.</b> Subaccounts inherit the parent's.</li>
            <li><b>Usage Triggers alert; they don't stop spend.</b> Suspend from your webhook.</li>
            <li><b>No high-risk voice ranges</b> for trial customers.</li>
          </ul>` },
        { label: 'Auto-suspend on spend', deep: true, html: `
<pre class="code"><span class="c">// $30/day trigger on a customer subaccount</span>
<span class="k">await</span> parent.api.v2010.accounts(subSid).usage.triggers.create({
  usageCategory: <span class="s">'totalprice'</span>, triggerBy: <span class="s">'price'</span>,
  triggerValue: <span class="s">'30'</span>, recurring: <span class="s">'daily'</span>,
  callbackUrl: <span class="s">'https://isv.example.com/hooks/spend'</span>
});

<span class="c">// webhook: suspend it</span>
<span class="k">await</span> parent.api.v2010.accounts(req.body.AccountSid)
  .update({ status: <span class="s">'suspended'</span> });</pre>` },
        { label: 'Caller ID trust (voice)', deep: true, html: `
          <p>Each uses the customer's <b>Primary Business Profile</b>.</p>
          <ul>
            <li><b>SHAKEN/STIR:</b> verified caller ID.</li>
            <li><b>Voice Integrity:</b> avoid "Spam Likely".</li>
            <li><b>CNAM:</b> business name on caller ID.</li>
            <li><b>Branded Calling:</b> logo and reason on mobile.</li>
          </ul>` },
        { label: 'If attacked', html: `
          <ul class="tasks">
            <li><span class="ico">1</span><span>Suspend the subaccount</span></li>
            <li><span class="ico">2</span><span>Rotate the Auth Token and keys</span></li>
            <li><span class="ico">3</span><span>Email fraud@twilio.com</span></li>
          </ul>` },
      ],
      sources: ['antiFraud', 'fraudResponse', 'pumping', 'smsGeo', 'fraudGuard', 'verifyGeo', 'voiceGeo', 'dialingApi', 'sipSecurity', 'usageTriggers', 'webhookSec', 'sharedKeys', 'pkcv', 'shaken', 'voiceIntegrity', 'cnam', 'brandedCalling', 'fraudUpdate'],
    },

    {
      id: 'errors', short: 'Error lookup', icon: '🔎',
      title: 'Error code lookup',
      concept: 'errorDict',
      teach: `<p>Search all Twilio error codes. Use the filters for compliance failures.</p>`,
      sections: [
        { label: 'Selected error', id: 'error-detail', html: '' },
        { label: 'Find errors at scale', deep: true, html: `
          <ul>
            <li>Pull each customer's errors with the <b>Monitor Alerts API</b>, per subaccount.</li>
            <li>Registration failures arrive by webhook or Event Streams, so alert on them.</li>
          </ul>` },
      ],
      sources: ['errorDict', 'campaignBP', 'a2pTroubleshoot', 'a2pNumberIssues', 'debugging', 'monitorAlerts'],
    },

    {
      id: 'faq', short: 'FAQ', icon: '💬',
      title: 'Common questions',
      concept: 'buildAccount',
      teach: `<p>Quick answers. All sources below.</p>`,
      sections: [],
      sources: 'ALL',
    },
  ];

  // Sender cards for the picker. `regions` drives filtering.
  const SENDERS = [
    { id: 'tenDlc', icon: '📇', name: 'US 10DLC long code', regions: ['us'],
      reg: 'A2P 10DLC', time: 'Days–2 weeks', mps: 'By Trust Score',
      voice: true, mms: true, twoWay: true,
      detail: `<p><b>Best for:</b> two-way local texting.</p>
        <ul>
          <li>Register a Brand + Campaign. Unregistered = <b>blocked and billed</b> (${a('err30034', '30034')}).</li>
          <li>Brand types: Sole Proprietor (~1,000/day), Low-Volume (2,000/day), Standard (2,000+).</li>
        </ul>`, src: ['campaignBP', 'a2p10dlc', 'directStd', 'block10dlc'] },
    { id: 'tollFree', icon: '⚡', name: 'Toll-free', regions: ['us', 'ca'],
      reg: 'Verification', time: '≤ 3 business days', mps: '3 MPS, can raise',
      voice: true, mms: true, twoWay: true,
      detail: `<p><b>Best for:</b> alerts, OTP, support. One number for US + Canada.</p>
        <ul>
          <li>Blocked until verified (${a('err30032', '30032')}).</li>
          <li>Needs the customer's business registration number.</li>
        </ul>`, src: ['tfvApi', 'tfvPolicy', 'err30032'] },
    { id: 'shortCode', icon: '🏁', name: 'Short code', regions: ['us', 'ca'],
      reg: 'Carrier approval', time: '8–16 weeks', mps: '100+ MPS',
      voice: false, mms: true, twoWay: true,
      detail: `<p><b>Best for:</b> high volume and marketing.</p>
        <ul>
          <li>Fastest and priciest. Longest lead time.</li>
          <li>Holiday freeze mid-Dec to early Jan.</li>
          <li>Domestic only.</li>
        </ul>`, src: ['usShortCode', 'caShortCode', 'senderStrategy'] },
    { id: 'caLong', icon: '🍁', name: 'Canadian long code', regions: ['ca'],
      reg: 'None', time: 'Instant', mps: 'Not published',
      voice: true, mms: true, twoWay: true,
      detail: `<p><b>Best for:</b> low-volume conversations in Canada.</p>
        <ul>
          <li>Business traffic is <b>heavily filtered</b>. Use toll-free or a short code.</li>
          <li>Sending to the US? <span class="verify">confirm with Twilio</span></li>
        </ul>`, src: ['caSms', 'atScale'] },
    { id: 'alpha', icon: '🔤', name: 'Alphanumeric ID', regions: ['intl'],
      reg: 'Some countries', time: 'Instant–16 days', mps: '10 MPS',
      voice: false, mms: false, twoWay: false,
      detail: `<p><b>Best for:</b> branded one-way alerts, e.g. "ACMEBANK".</p>
        <ul>
          <li><b>Not in US/Canada.</b></li>
          <li>No replies, so offer another way to opt out.</li>
        </ul>`, src: ['alphaInMs', 'alphaReg', 'intlSms'] },
    { id: 'intlLong', icon: '🌍', name: 'International long code', regions: ['intl'],
      reg: 'Regulatory bundle', time: 'Varies', mps: '10 MPS',
      voice: true, mms: false, twoWay: true,
      detail: `<p><b>Best for:</b> two-way texting or calls abroad.</p>
        <ul>
          <li>Most countries need an approved bundle first (up to 3 business days).</li>
          <li>Rules vary by country; check the Regulations API.</li>
        </ul>`, src: ['regStart', 'regApi', 'intlSms'] },
    { id: 'whatsapp', icon: '💬', name: 'WhatsApp', regions: ['us', 'ca', 'intl'],
      reg: 'Meta Tech Provider', time: '3–4 weeks once', mps: 'Meta limits',
      voice: false, mms: true, twoWay: true,
      detail: `<p><b>Best for:</b> markets where WhatsApp is the default.</p>
        <ul>
          <li>Join Meta's Tech Provider program once; customers then self-onboard in minutes.</li>
        </ul>`, src: ['waTechProvider'] },
    { id: 'rcs', icon: '✨', name: 'RCS', regions: ['us', 'intl'],
      reg: 'Google + carriers', time: '4–6 weeks', mps: 'Not published',
      voice: false, mms: true, twoWay: true,
      detail: `<p><b>Best for:</b> branded, rich messages.</p>
        <ul>
          <li>Falls back to SMS automatically.</li>
          <li>Limited countries. <span class="verify">confirm with Twilio</span></li>
        </ul>`, src: ['rcs'] },
  ];

  const COMPLIANCE = {
    us: {
      label: '🇺🇸 US',
      tracks: [
        { title: '10DLC (local numbers)', guide: 'campaignBP', steps: [
          { t: 'Primary Business Profile', s: "Customer's own, in their subaccount." },
          { t: 'Brand', s: 'Your customer, not you.' },
          { t: 'Campaign', s: 'One per use case.' },
          { t: 'Add numbers → send', s: '' },
        ]},
        { title: 'Toll-free verification', steps: [
          { t: 'Primary Business Profile', s: 'Same profile as above.' },
          { t: 'Verify each number', s: "Customer's business registration number." },
          { t: 'Approved → send', s: 'Up to 3 business days.' },
        ]},
      ],
      table: { head: ['Brand type', 'For', 'Daily cap'], rows: [
        ['Sole Proprietor', 'No Tax ID', '~1,000'],
        ['Low-Volume', 'Small senders', '2,000'],
        ['Standard', 'Most businesses', '2,000+'],
      ]},
      note: { kind: 'warn', html: 'Public companies also need email verification (Authentication+).' },
    },
    ca: {
      label: '🇨🇦 Canada',
      tracks: [
        { title: 'Toll-free (recommended)', steps: [
          { t: 'Primary Business Profile', s: "Customer's own, in their subaccount." },
          { t: 'Verify each number', s: 'Same as the US, with a Canadian business number.' },
          { t: 'Approved → send', s: 'Covers US and Canada.' },
        ]},
        { title: 'Short code (high volume)', steps: [
          { t: 'Apply for CWTA approval', s: '12–16 weeks.' },
        ]},
      ],
      table: { head: ['Sender', 'Registration', 'Business texts?'], rows: [
        ['Toll-free', 'Verification', '✅ Yes'],
        ['Short code', 'CWTA', '✅ Yes'],
        ['Long code', 'None', '⚠️ Filtered'],
        ['Alphanumeric', 'n/a', '❌ No'],
      ]},
      note: { kind: 'warn', html: '<b>No 10DLC in Canada</b>, but long codes are filtered. Review CASL consent rules with counsel.' },
    },
    intl: {
      label: '🌍 International',
      tracks: [
        { title: 'Buying numbers', steps: [
          { t: 'Check requirements', s: 'Vary by country and number type.' },
          { t: 'Create a regulatory bundle', s: "Customer's ID, address and documents." },
          { t: 'Approved → buy number', s: 'Up to 3 business days.' },
        ]},
        { title: 'Alphanumeric IDs', steps: [
          { t: 'Pre-register if required', s: 'Some countries; up to ~16 days.' },
        ]},
      ],
      table: null,
      note: { kind: 'good', html: 'Embeddable for bundles is in pilot. Use the Regulatory Compliance API for now.' },
    },
  };

  const CHECKLIST = [
    { tag: 'acct', t: 'One subaccount per customer', w: 'Parent sends nothing.' },
    { tag: 'acct', t: 'Vet customers before access', w: 'Fraudsters target weak checks.' },
    { tag: 'msg',  t: 'Minimal geo permissions', w: 'Only countries you need.' },
    { tag: 'voice',t: 'No high-risk voice ranges for trials', w: 'Top cause of toll fraud.' },
    { tag: 'acct', t: 'Daily spend trigger + auto-suspend', w: 'Triggers alert only.' },
    { tag: 'msg',  t: 'SMS Pumping Protection + Fraud Guard', w: 'Free in US/Canada.' },
    { tag: 'acct', t: 'API key per customer, in a vault', w: 'Never share the Auth Token.' },
    { tag: 'acct', t: '2FA for all Console users', w: 'Limit Owner/Admin roles.' },
    { tag: 'acct', t: 'Validate webhook signatures', w: 'Check X-Twilio-Signature.' },
    { tag: 'voice',t: 'Secure SIP trunks', w: 'IP ACLs + credentials + TLS.' },
  ];

  const FAQ = [
    { q: 'One subaccount per customer?', a: "<p>Yes. It's Twilio's recommended ISV setup.</p>", go: 'architecture' },
    { q: 'Can we register customers under our brand?', a: '<p>No. Each customer registers with their own business details.</p>', go: 'compliance' },
    { q: 'Which number type first?', a: '<p>US: toll-free for alerts, 10DLC for conversations. Canada: toll-free. Short code for high volume.</p>', go: 'senders' },
    { q: 'How long until we can send?', a: '<p>Toll-free ≤ 3 days · 10DLC days–2 weeks · Short code 8–16 weeks.</p>', go: 'senders' },
    { q: 'Does Canada need 10DLC?', a: '<p>No, but long codes are filtered. Use toll-free.</p>', go: 'compliance' },
    { q: 'Does the Embeddable cover Canada and international?', a: '<p>Canada: yes, for toll-free. International: pilot only.</p>', go: 'compliance' },
    { q: 'What if a customer sends spam?', a: "<p>Only their subaccount is affected, if isolated. Otherwise your whole account is at risk.</p>", go: 'fraud' },
    { q: 'Geo permissions by API?', a: '<p>Voice: yes. SMS: Console only.</p>', go: 'fraud' },
    { q: 'Can we move numbers between subaccounts?', a: '<p>Yes, but registrations and webhooks must be redone.</p>', go: 'architecture' },
    { q: 'Where do we look up an error code?', a: '<p>Use the Error lookup tab. It covers every Twilio code.</p>', go: 'errors' },
    { q: 'Organization vs subaccount?', a: '<p>Organization: separate accounts and billing. Subaccounts: share the parent\'s balance.</p>', go: 'architecture' },
  ];

  // Error lookup filters match against the error's title. `null` = no filter.
  const ERROR_FILTERS = [
    { id: 'compliance', label: 'All compliance', re: null },
    { id: '10dlc', label: '10DLC', re: /a2p|10dlc|campaign|brand/i },
    { id: 'tf', label: 'Toll-free', re: /toll.?free/i },
    { id: 'trust', label: 'Profiles & bundles', re: /customer profile|business profile|trust product|trust ?hub|end.?user|supporting document|regulat|bundle/i },
    { id: 'delivery', label: 'Filtered & opt-out', re: /filtered|opt.?out|unsubscribed|spam|carrier violation|message blocked|delivery blocked/i },
    { id: 'fraud', label: 'Geo & fraud', re: /geo|fraud|pumping|high.?risk/i },
    { id: 'voice', label: 'Caller ID', re: /shaken|stir|cnam|voice integrity|branded call|attestation/i },
    { id: 'all', label: 'All errors', re: null },
  ];
  const ERROR_TOP = [30034, 30032, 30474, 30527, 30007, 21610, 21408, 30450, 21649];

  return { SOURCES, CHAPTERS, SENDERS, COMPLIANCE, CHECKLIST, FAQ, ERROR_FILTERS, ERROR_TOP };
})();
