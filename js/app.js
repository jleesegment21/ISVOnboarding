(() => {
  const { SOURCES, CHAPTERS, SENDERS, COMPLIANCE, CHECKLIST, FAQ, ERROR_FILTERS, ERROR_TOP } = window.GUIDE;
  const $ = (sel, root = document) => root.querySelector(sel);
  const left = $('#left');
  const right = $('#right');
  const ext = 'target="_blank" rel="noopener"';

  const state = {
    chapter: 0,
    seen: new Set(JSON.parse(localStorage.getItem('isv.seen') || '[]')),
    depth: localStorage.getItem('isv.depth') || 'overview',
    arch: 'recommended',
    archNode: 'parent',
    picker: { where: 'us', twoWay: 'yes', volume: 'med' },
    sender: null,
    region: 'us',
    errQuery: '',
    errFilter: 'compliance',
    errCode: ERROR_TOP[0],
    checks: new Set(JSON.parse(localStorage.getItem('isv.checks') || '[]')),
  };

  // ─── Personalisation: ?customer=Acme shows "Prepared for Acme" ──────────
  const customer = new URLSearchParams(location.search).get('customer');
  if (customer) {
    const tag = $('#brand-tag');
    tag.textContent = `Prepared for ${customer}`;
    tag.hidden = false;
    document.title = `ISV Messaging Onboarding · ${customer}`;
  }

  // ─── Shell: chapter nav, pager, depth toggle, keys, hash ────────────────
  const nav = $('#chapter-nav');
  nav.innerHTML = CHAPTERS.map((c, i) =>
    `<button data-i="${i}"><span class="num">${i + 1}</span><span class="lbl">${c.short}</span></button>`).join('');
  nav.addEventListener('click', e => { const b = e.target.closest('button'); if (b) go(+b.dataset.i); });
  $('#prev').addEventListener('click', () => go(state.chapter - 1));
  $('#next').addEventListener('click', () => go(state.chapter + 1));

  const depth = $('#depth');
  depth.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    state.depth = b.dataset.depth;
    localStorage.setItem('isv.depth', state.depth);
    applyDepth();
    toast(state.depth === 'deep' ? 'Deep dive on' : 'Overview');
  });
  function applyDepth() {
    document.body.classList.toggle('overview', state.depth === 'overview');
    depth.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.depth === state.depth));
  }

  document.addEventListener('keydown', e => {
    if (e.target.closest('input, textarea, select') || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 'ArrowRight') go(state.chapter + 1);
    if (e.key === 'ArrowLeft') go(state.chapter - 1);
    if (e.key.toLowerCase() === 'd') depth.querySelector(`[data-depth=${state.depth === 'deep' ? 'overview' : 'deep'}]`).click();
  });
  window.addEventListener('hashchange', fromHash);

  function fromHash() {
    const [id, sub] = location.hash.slice(1).split('/');
    const i = CHAPTERS.findIndex(c => c.id === id);
    if (id === 'compliance' && COMPLIANCE[sub]) state.region = sub;
    if (id === 'errors' && /^\d+$/.test(sub || '')) state.errCode = +sub;
    render(i >= 0 ? i : 0);
  }
  function go(i) {
    if (i < 0 || i >= CHAPTERS.length) return;
    const id = CHAPTERS[i].id;
    history.replaceState(null, '', `${location.search}#${id}${subPath(id)}`);
    render(i);
  }

  function subPath(id) {
    if (id === 'compliance') return '/' + state.region;
    if (id === 'errors') return '/' + state.errCode;
    return '';
  }

  function render(i) {
    state.chapter = i;
    const ch = CHAPTERS[i];
    state.seen.add(ch.id);
    localStorage.setItem('isv.seen', JSON.stringify([...state.seen]));
    nav.querySelectorAll('button').forEach((b, j) => {
      b.classList.toggle('active', j === i);
      b.classList.toggle('seen', state.seen.has(CHAPTERS[j].id));
    });
    nav.children[i].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    $('#prev').disabled = i === 0;
    $('#next').disabled = i === CHAPTERS.length - 1;
    $('#next').textContent = i < CHAPTERS.length - 1 ? `Next: ${CHAPTERS[i + 1].short} →` : 'Done ✓';
    LEFT[ch.id]();
    renderRight(ch);
    left.scrollTop = 0;
    right.scrollTop = 0;
  }

  // ─── Right pane: teaching + sources ─────────────────────────────────────
  function renderRight(ch) {
    const concept = SOURCES[ch.concept];
    const srcIds = ch.sources === 'ALL' ? Object.keys(SOURCES) : ch.sources;
    right.innerHTML = `
      <div class="rp-header">
        <div>
          <div class="rp-step">Chapter ${state.chapter + 1} of ${CHAPTERS.length}</div>
          <h2 class="rp-title">${ch.icon} ${ch.title}</h2>
        </div>
        <a class="rp-concept" href="${concept.u}" ${ext}>📖 ${concept.t}</a>
      </div>
      <div class="rp-teach">${ch.teach}</div>
      ${ch.sections.map(s => `
        <div class="${s.deep ? 'deep' : ''}" ${s.id ? `id="${s.id}"` : ''}>
          <div class="rp-section-label">${s.label}${s.deep ? '<span class="deep-tag">deep dive</span>' : ''}</div>
          <div class="rp-body">${s.html}</div>
        </div>`).join('')}
      <div class="rp-section-label">📎 Official documentation${ch.sources === 'ALL' ? ` · all ${srcIds.length} sources` : ''}</div>
      ${sourceList(srcIds)}`;
    if (ch.id === 'senders') renderSenderDetail();
    if (ch.id === 'errors') renderErrorDetail();
  }

  function sourceList(ids) {
    return `<ul class="sources">${ids.map(id => {
      const s = SOURCES[id];
      return `<li><a href="${s.u}" ${ext} class="${s.key ? 'key' : ''}"><span class="kind">${s.k}</span>${s.key ? '⭐ ' : ''}${s.t}<span class="d">${s.d}</span></a></li>`;
    }).join('')}</ul>`;
  }

  // ─── Left pane renderers, one per chapter ───────────────────────────────
  const LEFT = {
    start() {
      const steps = CHAPTERS.slice(1, 5);
      const subs = {
        architecture: 'One subaccount per customer',
        senders: 'Pick the right number',
        compliance: 'Register by region',
        fraud: 'Lock it down',
      };
      left.innerHTML = `
        <div class="card hero">
          <div class="scope-pill">📨 Messaging compliance & onboarding</div>
          <h1>Onboard your customers onto Twilio Messaging</h1>
          <p>For platforms (ISVs) that text on behalf of their customers. Voice is covered briefly.</p>
        </div>
        <div class="card">
          <p class="card-label">The journey</p>
          <div class="journey">
            ${steps.map((c, k) => `
              <button class="j-step" data-go="${k + 1}">
                <div class="j-num">STEP ${k + 1}</div>
                <div class="j-icon">${c.icon}</div>
                <div class="j-name">${c.short}</div>
                <div class="j-sub">${subs[c.id]}</div>
              </button>`).join('')}
            <button class="j-step" data-go="${CHAPTERS.findIndex(c => c.id === 'faq')}">
              <div class="j-num">STEP 5</div>
              <div class="j-icon">🚀</div>
              <div class="j-name">Launch</div>
              <div class="j-sub">FAQ & sources</div>
            </button>
          </div>
        </div>
        <div class="card">
          <p class="card-label">Three golden rules</p>
          <div class="rules">
            <div class="rule"><div class="r-num">1</div><div><b>Your parent account sends nothing.</b><span>One subaccount per customer.</span></div></div>
            <div class="rule"><div class="r-num">2</div><div><b>Register the customer, not yourself.</b><span>Use the customer's business details.</span></div></div>
            <div class="rule"><div class="r-num">3</div><div><b>Register before you send.</b><span>Unregistered US/Canada traffic is blocked.</span></div></div>
          </div>
        </div>
        <div class="card">
          <p class="card-label">Are you an ISV?</p>
          <div class="who">
            <div class="yes"><b>✅ You're an ISV</b>You message <i>on behalf of other businesses</i>.</div>
            <div><b>➖ You're a direct customer</b>You only message <i>your own</i> customers. Use Twilio's direct guides.</div>
          </div>
        </div>`;
      left.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => go(+b.dataset.go)));
    },

    architecture() {
      const NODES = {
        parent: ['🏢 ISV parent account', 'Admin and billing only. <b>Sends nothing.</b>'],
        env: ['🧪 Dev & Staging subaccounts', 'Keep testing separate from production.'],
        cust: ['👤 Customer subaccount', "Created at signup via API. Holds <b>everything</b> the customer needs to send."],
        profile: ['🪪 Primary Business Profile', "The <b>customer's own</b> profile, in their subaccount. All registrations build on it."],
        brand: ['📇 A2P Brand + Campaigns', "In the customer's name. One campaign per use case."],
        ms: ['📨 Messaging Service per use case', 'One per use case, e.g. reminders vs marketing.'],
        nums: ['📱 Numbers', "Bought inside the customer's subaccount."],
        key: ['🔑 API key', 'One per customer. Revoke without affecting others.'],
        trigger: ['⏰ Usage trigger', "Daily spend alert. Your webhook suspends the subaccount."],
        shared: ['⚠️ Everything in one account', "Shared numbers, opt-outs and reputation. One bad sender risks <b>everyone</b>."],
      };
      const custCol = (name) => `
        <div class="col">
          <button class="node cust" data-n="cust">
            <div class="n-title">👤 ${name}</div>
            <div class="n-sub">Subaccount</div>
            <div class="chip-list">
              <span class="chip" data-n="profile">🪪 Primary Profile</span>
              <span class="chip" data-n="brand">📇 Brand + Campaigns</span>
              <span class="chip" data-n="ms">📨 Messaging Services</span>
              <span class="chip" data-n="nums">📱 Numbers</span>
              <span class="chip" data-n="key">🔑 API key</span>
              <span class="chip" data-n="trigger">⏰ Usage trigger</span>
            </div>
          </button>
        </div>`;
      const diagram = state.arch === 'recommended' ? `
        <div class="arch">
          <button class="node parent" data-n="parent">
            <div class="n-title">🏢 ISV parent account</div>
            <div class="n-sub">Admin · billing · default geo permissions · <b>no traffic</b></div>
          </button>
          <div class="connector"></div>
          <div class="bus"></div>
          <div class="subs">
            <div class="col">
              <button class="node env" data-n="env"><div class="n-title">🧪 Dev</div><div class="n-sub">Subaccount</div></button>
              <button class="node env" data-n="env"><div class="n-title">🧪 Staging</div><div class="n-sub">Subaccount</div></button>
            </div>
            ${custCol('Customer A')}${custCol('Customer B')}${custCol('Customer C')}
          </div>
        </div>
        <div class="legend"><span class="l-parent">Parent (one)</span><span class="l-cust">Per end customer</span><span class="l-env">Test environments</span><span class="l-note">Up to 1,000 subaccounts by default</span></div>` : `
        <div class="arch">
          <button class="node bad" data-n="shared" style="max-width:520px">
            <div class="n-title">🏢 One account for everyone</div>
            <div class="n-sub">Customers A, B and C all send from here</div>
            <div class="chip-list">
              <span class="chip bad">📱 Shared numbers & reputation</span>
              <span class="chip bad">🚫 Shared opt-out list</span>
              <span class="chip bad">💸 No per-customer usage</span>
              <span class="chip bad">🔑 One credential for all</span>
            </div>
          </button>
        </div>
        <div class="callout bad">If Customer B spams, <b>everyone</b> can be restricted.</div>`;

      left.innerHTML = `
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px">
            <p class="card-label" style="margin:0">Account structure</p>
            <div class="seg" id="arch-seg">
              <button data-a="recommended" class="${state.arch === 'recommended' ? 'active' : ''}">✅ Recommended</button>
              <button data-a="shared" class="${state.arch === 'shared' ? 'active' : ''}">⚠️ Shared account</button>
            </div>
          </div>
          ${diagram}
        </div>
        <div class="card" id="node-detail"></div>`;

      $('#arch-seg', left).addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        state.arch = b.dataset.a;
        state.archNode = state.arch === 'shared' ? 'shared' : 'parent';
        LEFT.architecture();
      });
      const showNode = (n) => {
        state.archNode = n;
        const [t, d] = NODES[n];
        $('#node-detail', left).innerHTML = `<h3>${t}</h3><div style="font-size:13.5px;color:#334155">${d}</div><div class="hint" style="font-size:12px;color:var(--text-muted);margin-top:8px">Click any box to learn more.</div>`;
        left.querySelectorAll('[data-n]').forEach(el => el.classList.toggle('sel', el.dataset.n === n));
      };
      left.querySelectorAll('[data-n]').forEach(el => el.addEventListener('click', e => { e.stopPropagation(); showNode(el.dataset.n); }));
      showNode(state.archNode);
    },

    senders() {
      const p = state.picker;
      const opt = (key, val, label) => `<button data-k="${key}" data-v="${val}" class="${p[key] === val ? 'active' : ''}">${label}</button>`;
      const rec = recommend(p);
      left.innerHTML = `
        <div class="card picker">
          <p class="card-label" style="margin:0">Find the right sender</p>
          <div class="q"><div class="q-label">Where are recipients?</div>
            <div class="seg">${opt('where', 'us', '🇺🇸 US')}${opt('where', 'ca', '🇨🇦 Canada')}${opt('where', 'intl', '🌍 International')}</div></div>
          <div class="q"><div class="q-label">Two-way?</div>
            <div class="seg">${opt('twoWay', 'yes', 'Yes')}${opt('twoWay', 'no', 'No')}</div></div>
          <div class="q"><div class="q-label">Volume?</div>
            <div class="seg">${opt('volume', 'low', 'Low')}${opt('volume', 'med', 'Medium')}${opt('volume', 'high', 'High')}</div></div>
          <div class="rec">
            <div class="rec-icon">${byId(rec.primary).icon}</div>
            <div>
              <div class="rec-label">Start with</div>
              <div class="rec-name">${byId(rec.primary).name}</div>
              <div class="rec-why">${rec.why}</div>
              ${rec.alt ? `<div class="rec-alt">Also consider: <b>${rec.alt.map(a => byId(a).name).join(', ')}</b></div>` : ''}
            </div>
          </div>
        </div>
        <div class="senders">
          ${SENDERS.map(s => {
            const relevant = s.regions.includes(p.where);
            const cls = [s.id === state.sender ? 'sel' : '', relevant ? '' : 'dim', s.id === rec.primary ? 'rec-primary' : ''].join(' ');
            return `
            <button class="sender ${cls}" data-s="${s.id}">
              <div class="s-head">${s.icon} ${s.name}</div>
              <dl>
                <dt>Register</dt><dd>${s.reg}</dd>
                <dt>Live in</dt><dd>${s.time}</dd>
                <dt>Speed</dt><dd>${s.mps}</dd>
              </dl>
              <div class="caps">
                <span class="cap ${s.twoWay ? 'on' : 'off'}">2-way</span>
                <span class="cap ${s.voice ? 'on' : 'off'}">Voice</span>
                <span class="cap ${s.mms ? 'on' : 'off'}">Media</span>
              </div>
            </button>`;
          }).join('')}
        </div>`;

      left.querySelectorAll('.picker [data-k]').forEach(b => b.addEventListener('click', () => {
        p[b.dataset.k] = b.dataset.v;
        state.sender = recommend(p).primary;
        LEFT.senders();
        renderSenderDetail();
      }));
      left.querySelectorAll('[data-s]').forEach(b => b.addEventListener('click', () => {
        state.sender = b.dataset.s;
        left.querySelectorAll('[data-s]').forEach(x => x.classList.toggle('sel', x === b));
        renderSenderDetail(true);
      }));
    },

    compliance() {
      const r = COMPLIANCE[state.region];
      left.innerHTML = `
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
            <p class="card-label" style="margin:0">Region</p>
            <div class="seg" id="region-seg">
              ${Object.entries(COMPLIANCE).map(([k, v]) => `<button data-r="${k}" class="${k === state.region ? 'active' : ''}">${v.label}</button>`).join('')}
            </div>
          </div>
        </div>
        ${r.tracks.map(tr => `
          <div class="card">
            <h3>${tr.title}</h3>
            ${tr.guide ? `<a class="guide-link" href="${SOURCES[tr.guide].u}" ${ext}>⭐ ${SOURCES[tr.guide].t} →</a>` : ''}
            <div class="flow">
              ${tr.steps.map((s, k) => `
                <div class="f-step ${s.once ? 'once' : 'per'}">
                  <div class="f-dot">${k + 1}</div>
                  <div class="f-body"><b>${s.t}<span class="who-tag ${s.once ? 'once' : 'per'}">${s.once ? 'Once' : 'Per customer'}</span></b><span>${s.s}</span></div>
                </div>`).join('')}
            </div>
          </div>`).join('')}
        ${r.table ? `
          <div class="card">
            <table class="mini-tbl">
              <tr>${r.table.head.map(h => `<th>${h}</th>`).join('')}</tr>
              ${r.table.rows.map(row => `<tr>${row.map((c, k) => `<td>${k === 0 ? `<b>${c}</b>` : c}</td>`).join('')}</tr>`).join('')}
            </table>
          </div>` : ''}
        <div class="callout ${r.note.kind}">${r.note.html}</div>`;
      $('#region-seg', left).addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        state.region = b.dataset.r;
        history.replaceState(null, '', `${location.search}#compliance/${state.region}`);
        LEFT.compliance();
      });
    },

    fraud() {
      const done = CHECKLIST.filter((_, k) => state.checks.has(k)).length;
      const pct = Math.round((done / CHECKLIST.length) * 100);
      const tagName = { msg: 'Messaging', voice: 'Voice', acct: 'Account' };
      left.innerHTML = `
        <div class="card">
          <p class="card-label">ISV security checklist</p>
          <div class="progress-row"><span>${done} of ${CHECKLIST.length} in place</span><span>${pct === 100 ? '🎉 Launch-ready' : `${pct}%`}</span></div>
          <div class="progress"><div style="width:${pct}%"></div></div>
        </div>
        <ul class="checklist">
          ${CHECKLIST.map((c, k) => `
            <li class="${state.checks.has(k) ? 'done' : ''}" data-c="${k}" role="checkbox" aria-checked="${state.checks.has(k)}" tabindex="0">
              <div class="box"></div>
              <div><div class="c-title">${c.t}</div><div class="c-why">${c.w}</div></div>
              <span class="tag ${c.tag}">${tagName[c.tag]}</span>
            </li>`).join('')}
        </ul>
        <div style="text-align:right"><button class="btn btn-ghost" id="reset-checks" style="font-size:12px;padding:5px 12px">Reset checklist</button></div>`;
      const toggle = (li) => {
        const k = +li.dataset.c;
        state.checks.has(k) ? state.checks.delete(k) : state.checks.add(k);
        localStorage.setItem('isv.checks', JSON.stringify([...state.checks]));
        LEFT.fraud();
      };
      left.querySelectorAll('[data-c]').forEach(li => {
        li.addEventListener('click', () => toggle(li));
        li.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(li); } });
      });
      $('#reset-checks', left).addEventListener('click', () => {
        state.checks.clear();
        localStorage.removeItem('isv.checks');
        LEFT.fraud();
      });
    },

    errors() {
      left.innerHTML = `
        <div class="card">
          <input type="search" id="err-q" class="err-search" placeholder="Code or keyword, e.g. 30034 or toll-free" value="${esc(state.errQuery)}" autocomplete="off" aria-label="Search error codes" />
          <div class="err-filters" id="err-filters">
            ${ERROR_FILTERS.map(f => `<button data-f="${f.id}" class="fchip-l ${f.id === state.errFilter ? 'on' : ''}">${f.label}</button>`).join('')}
          </div>
          <div class="err-top"><span>Most common:</span>
            ${ERROR_TOP.map(c => `<button data-code="${c}" class="code-chip">${c}</button>`).join('')}
          </div>
        </div>
        <div class="card err-results" id="err-results"><div class="empty-note">Loading Twilio error codes…</div></div>`;
      const q = $('#err-q', left);
      q.addEventListener('input', () => { state.errQuery = q.value; renderErrorList(); });
      $('#err-filters', left).addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        state.errFilter = b.dataset.f;
        left.querySelectorAll('#err-filters button').forEach(x => x.classList.toggle('on', x === b));
        renderErrorList();
      });
      left.querySelectorAll('.err-top [data-code]').forEach(b => b.addEventListener('click', () => selectError(+b.dataset.code)));
      loadErrors(renderErrorList);
    },

    faq() {
      left.innerHTML = `
        <div class="card hero">
          <h1>Common questions</h1>
          
        </div>
        <div class="faq">
          ${FAQ.map(f => `
            <details>
              <summary>${f.q}</summary>
              <div class="a">${f.a}<a href="#${f.go}" class="go" data-go="${f.go}">→ ${CHAPTERS.find(c => c.id === f.go).short}</a></div>
            </details>`).join('')}
        </div>`;
      left.querySelectorAll('[data-go]').forEach(a => a.addEventListener('click', e => {
        e.preventDefault();
        go(CHAPTERS.findIndex(c => c.id === a.dataset.go));
      }));
    },
  };

  // ─── Error lookup ───────────────────────────────────────────────────────
  // The catalog (~2.5 MB) is loaded only when the Error lookup chapter opens.
  let errorsLoading = null;
  function loadErrors(cb) {
    if (window.TWILIO_ERRORS) return cb();
    if (!errorsLoading) {
      errorsLoading = new Promise((resolve, reject) => {
        const el = document.createElement('script');
        el.src = 'js/errors-data.js';
        el.onload = resolve;
        el.onerror = reject;
        document.head.appendChild(el);
      });
    }
    errorsLoading.then(cb, () => {
      const box = $('#err-results');
      if (box) box.innerHTML = `<div class="empty-note">Couldn't load error data. Use the <a href="${SOURCES.errorDict.u}" ${ext}>official dictionary</a>.</div>`;
    });
  }
  const errRows = () => (window.TWILIO_ERRORS ? window.TWILIO_ERRORS.rows : []);
  const complianceRes = ERROR_FILTERS.filter(f => f.re).map(f => f.re);
  function matchesFilter(e) {
    if (state.errFilter === 'all') return true;
    if (state.errFilter === 'compliance') return complianceRes.some(re => re.test(e.m));
    return ERROR_FILTERS.find(f => f.id === state.errFilter).re.test(e.m);
  }

  function renderErrorList() {
    const box = $('#err-results');
    if (!box || !window.TWILIO_ERRORS) return;
    const q = state.errQuery.trim().toLowerCase();
    let rows;
    if (q) {
      // Code-prefix hits first, then title hits, then description hits. Search ignores the filter
      // when the query is a code so "30034" always finds it.
      const isCode = /^\d+$/.test(q);
      const pool = isCode ? errRows() : errRows().filter(matchesFilter);
      const byCode = [], byTitle = [], byDesc = [];
      for (const e of pool) {
        if (String(e.c).startsWith(q)) byCode.push(e);
        else if (!isCode && e.m.toLowerCase().includes(q)) byTitle.push(e);
        else if (!isCode && q.length > 2 && (e.d || '').toLowerCase().includes(q)) byDesc.push(e);
      }
      rows = [...byCode, ...byTitle, ...byDesc];
    } else {
      rows = errRows().filter(matchesFilter);
    }
    const LIMIT = 60;
    box.innerHTML = `
      <div class="err-count">${rows.length.toLocaleString()} ${rows.length === 1 ? 'error' : 'errors'}${rows.length > LIMIT ? ` · showing first ${LIMIT}, refine your search` : ''}</div>
      ${rows.length ? `<ul class="err-list">${rows.slice(0, LIMIT).map(e => `
        <li><button data-code="${e.c}" class="${e.c === state.errCode ? 'sel' : ''}">
          <span class="ec">${e.c}</span><span class="em">${esc(e.m)}</span>${e.p ? `<span class="tag">${esc(e.p.split(',')[0])}</span>` : ''}
        </button></li>`).join('')}</ul>` : '<div class="empty-note">No matches. Try a shorter keyword or "All errors".</div>'}`;
    box.querySelectorAll('[data-code]').forEach(b => b.addEventListener('click', () => selectError(+b.dataset.code)));
  }

  function selectError(code) {
    state.errCode = code;
    history.replaceState(null, '', `${location.search}#errors/${code}`);
    document.querySelectorAll('#err-results [data-code]').forEach(b => b.classList.toggle('sel', +b.dataset.code === code));
    renderErrorDetail();
    if (window.matchMedia('(max-width: 900px)').matches) $('#error-detail')?.scrollIntoView({ behavior: 'smooth' });
  }

  function renderErrorDetail() {
    const el = $('#error-detail');
    if (!el) return;
    const body = el.querySelector('.rp-body');
    if (!window.TWILIO_ERRORS) { body.textContent = 'Loading…'; return loadErrors(renderErrorDetail); }
    const e = errRows().find(r => r.c === state.errCode);
    if (!e) { body.innerHTML = `<p>Error ${state.errCode} isn't in the snapshot. <a href="${SOURCES.errorDict.u}/${state.errCode}" ${ext}>Check Twilio's page →</a></p>`; return; }
    const block = (label, md) => md ? `<div class="err-sub">${label}</div>${mdToHtml(md)}` : '';
    body.innerHTML = `
      <div class="err-head"><span class="err-code">${e.c}</span>${e.l ? `<span class="st ${e.l === 'ERROR' ? 'pilot' : 'beta'}">${e.l}</span>` : ''}${e.p ? `<span class="st">${esc(e.p)}</span>` : ''}</div>
      <div class="err-title">${esc(e.m)}</div>
      ${e.d ? mdToHtml(e.d) : ''}
      ${block('Possible causes', e.ca)}
      ${block('How to fix', e.s)}
      <a class="rp-concept err-link" href="${SOURCES.errorDict.u}/${e.c}" ${ext}>📖 Official page for ${e.c} →</a>
      <div class="err-meta">Updated by Twilio ${e.u || 'n/a'} · Snapshot ${window.TWILIO_ERRORS.snapshot}</div>`;
  }

  // Minimal Markdown for Twilio's error text: bullets, links, `code`, **bold**.
  function mdToHtml(md) {
    const inline = (t) => esc(t)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, txt, url) =>
        `<a href="${url.startsWith('/') ? 'https://www.twilio.com' + url : url}" ${ext}>${txt}</a>`);
    const out = [];
    let list = null;
    for (const raw of md.split('\n')) {
      const line = raw.trim();
      const item = line.match(/^[*-]\s+(.*)/);
      if (item) { (list ||= []).push(`<li>${inline(item[1])}</li>`); continue; }
      if (list) { out.push(`<ul>${list.join('')}</ul>`); list = null; }
      if (line && !line.startsWith('#')) out.push(`<p>${inline(line)}</p>`);
    }
    if (list) out.push(`<ul>${list.join('')}</ul>`);
    return out.join('');
  }

  function esc(t) {
    return String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // ─── Sender recommendation logic ────────────────────────────────────────
  function recommend({ where, twoWay, volume }) {
    if (where === 'intl') {
      return twoWay === 'yes'
        ? { primary: 'intlLong', alt: ['whatsapp', 'rcs'], why: 'Local, two-way. Needs a regulatory bundle.' }
        : { primary: 'alpha', alt: ['intlLong', 'whatsapp'], why: 'Branded, one-way. Some countries need pre-registration.' };
    }
    if (volume === 'high') {
      return { primary: 'shortCode', alt: ['tollFree'], why: 'Built for volume. Apply early; use toll-free meanwhile.' };
    }
    if (where === 'ca') {
      return { primary: 'tollFree', alt: ['caLong'], why: 'Long codes are filtered in Canada. Toll-free covers US + CA.' };
    }
    return twoWay === 'yes'
      ? { primary: 'tenDlc', alt: ['tollFree'], why: 'Local and two-way. Register each customer.' }
      : { primary: 'tollFree', alt: ['tenDlc'], why: 'Fastest approval. Great for alerts and OTP.' };
  }
  const byId = (id) => SENDERS.find(s => s.id === id);

  function renderSenderDetail(scroll) {
    const el = $('#sender-detail');
    if (!el) return;
    const s = byId(state.sender || recommend(state.picker).primary);
    el.querySelector('.rp-body').innerHTML = `
      <div style="font-size:16px;font-weight:600;color:#fff;margin-bottom:6px">${s.icon} ${s.name}</div>
      ${s.detail}
      <div style="font-size:12.5px">Docs: ${s.src.map(id => `<a href="${SOURCES[id].u}" ${ext}>${SOURCES[id].t}</a>`).join(' · ')}</div>`;
    if (scroll && window.matchMedia('(max-width: 900px)').matches) el.scrollIntoView({ behavior: 'smooth' });
  }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 1800);
  }

  applyDepth();
  fromHash();
})();
