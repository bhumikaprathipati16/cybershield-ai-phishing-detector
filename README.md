 # PhishGuard AI — Phishing & Spam Detector

An AI-powered web application that analyzes messages for phishing attacks, spam, and social engineering tactics using the Anthropic Claude API.

![PhishGuard AI Screenshot](assets/screenshot.png)

## Features

- **Risk scoring** — 0–100 score with levels: Safe, Low, Medium, High, Critical
- **Threat indicators** — Color-coded findings for specific tactics detected
- **Recommended actions** — Actionable next steps based on threat level
- **Example messages** — Built-in phishing, scam, and legitimate message examples
- **Privacy-first** — Messages are never stored; API key stays in your browser session only
- **Responsive** — Works on desktop and mobile

## Threat Tactics Detected

- Urgency / fear pressure
- Credential harvesting
- Suspicious or misleading URLs
- Spoofed sender identity
- Prize / lottery / advance-fee scams
- Fake delivery notifications
- Impersonation of banks, authorities, or brands
- Requests for personal or financial data
- Unusual payment requests

## Getting Started

### Prerequisites

- An [Anthropic API key](https://console.anthropic.com) (free tier available)
- Any modern web browser (no build step required)

### Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/phishing-detector.git
cd phishing-detector
```

Then open `index.html` in your browser — or serve it with any static server:

```bash
# Python
python -m http.server 8080

# Node.js (npx)
npx serve .
```

Visit `http://localhost:8080`

### Usage

1. Open the app in your browser
2. Enter your Anthropic API key when prompted (stored only in session storage)
3. Paste any suspicious message into the text area
4. Click **Analyze message** (or press `Ctrl+Enter` / `Cmd+Enter`)
5. Review the risk score, threat indicators, and recommendations

## Project Structure

```
phishing-detector/
├── index.html          # Main HTML
├── css/
│   └── style.css       # All styles
├── js/
│   ├── app.js          # Core logic, API calls, rendering
│   └── examples.js     # Example message data
└── assets/
    └── favicon.svg
```

## Tech Stack

- **Vanilla HTML/CSS/JS** — Zero dependencies, no build step
- **Anthropic Claude API** — `claude-sonnet-4-20250514` model for threat analysis
- Structured JSON prompting for reliable, parseable AI output

## Security & Privacy

- Your API key is stored only in `sessionStorage` (cleared when you close the tab)
- Message content is sent directly to Anthropic's API and is not logged by this app
- No backend, no database, no tracking

## Customization

To use a different model, edit the `model` field in `js/app.js`:

```js
model: 'claude-opus-4-20250514',  // More powerful, slower
model: 'claude-haiku-4-5-20251001', // Faster, lower cost
```

## Contributing

Pull requests are welcome! Ideas for improvement:

- [ ] URL reputation checking
- [ ] Email header analysis
- [ ] History of analyzed messages (local storage)
- [ ] Dark/light mode toggle
- [ ] Export report as PDF

## License

MIT — see [LICENSE](LICENSE)
