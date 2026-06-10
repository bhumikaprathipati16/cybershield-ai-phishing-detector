/* ─── API Key Management ─────────────────────────────────── */
(function initApiKey() {
  const saved = sessionStorage.getItem('pg_api_key');
  if (saved) showApiSaved();
})();

function saveApiKey() {
  const val = document.getElementById('api-key-input').value.trim();
  if (!val.startsWith('sk-ant')) {
    alert('Please enter a valid Anthropic API key (starts with sk-ant-)');
    return;
  }
  sessionStorage.setItem('pg_api_key', val);
  showApiSaved();
}

function showApiSaved() {
  document.getElementById('api-setup').classList.add('hidden');
  document.getElementById('api-saved').classList.remove('hidden');
}

function clearApiKey() {
  sessionStorage.removeItem('pg_api_key');
  document.getElementById('api-setup').classList.remove('hidden');
  document.getElementById('api-saved').classList.add('hidden');
  document.getElementById('api-key-input').value = '';
}

function getApiKey() {
  return sessionStorage.getItem('pg_api_key') || '';
}

/* ─── Character Counter ──────────────────────────────────── */
document.getElementById('msg-input').addEventListener('input', function () {
  const n = this.value.length;
  document.getElementById('char-count').textContent =
    n.toLocaleString() + ' character' + (n !== 1 ? 's' : '');
});

/* ─── Main Analysis ──────────────────────────────────────── */
async function analyze() {
  const apiKey = getApiKey();
  if (!apiKey) {
    document.getElementById('api-setup').classList.remove('hidden');
    document.getElementById('api-key-input').focus();
    return;
  }

  const msg = document.getElementById('msg-input').value.trim();
  if (!msg) {
    document.getElementById('msg-input').focus();
    return;
  }

  const btn = document.getElementById('scan-btn');
  btn.disabled = true;
  btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
      style="animation: spin 1s linear infinite" aria-hidden="true">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
    Analyzing…`;

  const resultArea = document.getElementById('result-area');
  const loading = document.getElementById('result-loading');
  const content = document.getElementById('result-content');

  resultArea.classList.remove('hidden');
  loading.classList.remove('hidden');
  content.classList.add('hidden');
  resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  const systemPrompt = `You are a cybersecurity expert specializing in phishing, spam, and social engineering detection.

Analyze the provided message and return ONLY a valid JSON object — no markdown, no backticks, no preamble.

Required JSON structure:
{
  "riskScore": <integer 0–100>,
  "riskLevel": <"Safe" | "Low" | "Medium" | "High" | "Critical">,
  "summary": "<2–3 sentence plain-language analysis>",
  "indicators": [
    { "type": <"danger" | "warning" | "safe">, "text": "<specific finding>" }
  ],
  "recommendations": ["<action 1>", "<action 2>", "<action 3>"]
}

Risk level mapping: 0–15 = Safe, 16–35 = Low, 36–60 = Medium, 61–80 = High, 81–100 = Critical.

Threat tactics to look for: urgency/fear pressure, credential harvesting, suspicious or misleading URLs, spoofed sender identity, prize/lottery/advance-fee scams, fake delivery notifications, impersonation of authorities or brands, requests for personal/financial data, unusual payment requests, grammar/spelling as deception signals, mismatched branding.

For safe messages, note what makes them trustworthy. Be specific and actionable.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Analyze this message:\n\n${msg}` }]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${res.status}`);
    }

    const data = await res.json();
    const raw = (data.content || []).map(b => b.text || '').join('');
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    renderResult(parsed);
  } catch (err) {
    loading.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <span style="color: var(--clr-text-muted)">${err.message || 'Analysis failed. Check your API key and try again.'}</span>`;
  }

  btn.disabled = false;
  btn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
    Analyze message`;
}

/* ─── Render Results ─────────────────────────────────────── */
function renderResult(data) {
  const loading = document.getElementById('result-loading');
  const content = document.getElementById('result-content');

  const score = Math.max(0, Math.min(100, Math.round(data.riskScore || 0)));
  const level = data.riskLevel || 'Unknown';

  const levelClass = {
    Safe: 'risk-safe', Low: 'risk-low', Medium: 'risk-medium',
    High: 'risk-high', Critical: 'risk-critical'
  }[level] || 'risk-low';

  const barColor = {
    Safe: '#10b981', Low: '#34d399', Medium: '#fbbf24',
    High: '#f59e0b', Critical: '#ef4444'
  }[level] || '#8a99b8';

  // Badge & score
  const badge = document.getElementById('risk-badge');
  badge.textContent = level;
  badge.className = 'risk-badge ' + levelClass;

  const scoreEl = document.getElementById('score-num');
  scoreEl.textContent = score;
  scoreEl.style.color = barColor;

  // Progressbar
  const pb = document.getElementById('score-progressbar');
  pb.setAttribute('aria-valuenow', score);
  pb.setAttribute('aria-label', `Risk score: ${score} out of 100, level: ${level}`);

  const bar = document.getElementById('score-bar');
  bar.style.background = barColor;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => { bar.style.width = score + '%'; });
  });

  // Summary
  document.getElementById('result-summary').textContent = data.summary || '';

  // Indicators
  const indList = document.getElementById('indicators-list');
  indList.innerHTML = '';
  (data.indicators || []).forEach(ind => {
    const dotClass = ind.type === 'danger' ? 'dot-danger'
      : ind.type === 'warning' ? 'dot-warning' : 'dot-safe';
    const li = document.createElement('li');
    li.className = 'indicator-item';
    li.innerHTML = `<span class="indicator-dot ${dotClass}" aria-hidden="true"></span><span>${escapeHTML(ind.text)}</span>`;
    indList.appendChild(li);
  });

  // Recommendations
  const recList = document.getElementById('rec-list');
  recList.innerHTML = '';
  (data.recommendations || []).forEach((rec, i) => {
    const li = document.createElement('li');
    li.className = 'rec-item';
    li.innerHTML = `<span class="rec-num" aria-hidden="true">${i + 1}</span><span>${escapeHTML(rec)}</span>`;
    recList.appendChild(li);
  });

  loading.classList.add('hidden');
  content.classList.remove('hidden');
}

function resetForm() {
  document.getElementById('msg-input').value = '';
  document.getElementById('char-count').textContent = '0 characters';
  document.getElementById('result-area').classList.add('hidden');
  document.getElementById('result-loading').classList.remove('hidden');
  document.getElementById('result-content').classList.add('hidden');
  document.getElementById('msg-input').focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ─── Spin keyframe (injected for loader icon) ───────────── */
const style = document.createElement('style');
style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(style);

/* ─── Enter key submit ───────────────────────────────────── */
document.getElementById('msg-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) analyze();
});
