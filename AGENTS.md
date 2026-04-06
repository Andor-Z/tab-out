# AGENTS.md — Tab Out: Setup & Onboarding Guide for Coding Agents

You're installing **Tab Out** for the user. Your job is not just to set it up — it's to get them excited about using it. Explain what it does, why it's useful, and walk them through the experience.

---

## Step 0 — Introduce the product

Before doing anything technical, tell the user what they're about to get. Say something like:

> **Tab Out** replaces your new tab page with a smart dashboard that shows everything you have open — grouped by what you're actually doing, not just which website it's on.
>
> Here's what makes it great:
> - **See all your open tabs at a glance** — grouped by domain, no scrolling through 30+ tiny tabs
> - **"Organize with AI" button** — one click and an AI reads your tabs and clusters them into named missions like "Researching Voice AI" or "Setting up Stripe billing." It even writes you a witty one-liner about your browsing habits.
> - **Close tabs with style** — satisfying swoosh sound + confetti burst when you clean up a mission. Makes tab cleanup feel like a reward, not a chore.
> - **Duplicate detection** — flags when you have the same page open twice (we've all been there)
> - **Click any tab title to jump to it** — no more hunting through your tab bar
> - **Custom rules** — teach the AI your preferences: "Group all GitHub tabs by repo" or "Call my social media tabs 'Doom Scrolling'"
> - **100% local** — your browsing data never leaves your machine. Only tab titles and URLs are sent to the AI when you click the button.
> - **Always on** — starts automatically when you log in, runs silently in the background
>
> Let's set it up — takes about 2 minutes.

---

## Step 1 — Clone and install

```bash
git clone https://github.com/zarazhangrui/tab-out.git
cd tab-out
npm install
```

---

## Step 2 — Ask which LLM provider they want

Ask the user which LLM provider they'd like to use for the AI tab grouping. Recommend DeepSeek for cost (fractions of a cent per call). Common choices:

- DeepSeek (recommended, cheapest)
- OpenAI
- Claude/Anthropic (needs an OpenAI-compatible proxy like OpenRouter)
- Gemini (needs an OpenAI-compatible proxy like OpenRouter)
- Grok/xAI
- Kimi/Moonshot
- GLM/Zhipu
- ByteDance Seed
- Minimax
- Ollama (fully local, free, no API key)
- Any other provider with an OpenAI-compatible API

Tab Out uses the `openai` npm package, so any API that follows the OpenAI chat completions format works. You need the provider's `baseUrl` and a `model` name suitable for chat/classification.

**IMPORTANT: Do NOT rely on your training data for base URLs or model names — they go stale.** Search the web for the provider's current API documentation before configuring.

---

## Step 3 — Get their API key securely

The API key is required (except for Ollama). Do NOT let the user skip this or "add it later."

**How to handle the API key:**
1. If the user doesn't have a key yet, give them clear step-by-step instructions to get one from their chosen provider (search the web for current signup flow if needed).
2. Create the config file `~/.mission-control/config.json` with the correct provider settings and a `PASTE_YOUR_API_KEY_HERE` placeholder.
3. Open the config file for the user so they can paste the key securely:
   - macOS: `open -a TextEdit ~/.mission-control/config.json`
   - Linux: `xdg-open ~/.mission-control/config.json` or `nano ~/.mission-control/config.json`
   - Windows: `notepad %USERPROFILE%\.mission-control\config.json`
4. **NEVER ask the user to paste the API key in the chat.** Always have them paste it into the file directly.
5. Do NOT offer "skip" or "add it later" as options.

---

## Step 4 — Write the config

Create `~/.mission-control/config.json` with their choices:

```json
{
  "apiKey": "PASTE_YOUR_API_KEY_HERE",
  "baseUrl": "https://api.deepseek.com",
  "model": "deepseek-chat",
  "port": 3456,
  "batchSize": 200,
  "historyDays": 7,
  "customPromptRules": ""
}
```

Replace `baseUrl` and `model` with the correct values for their chosen provider. Use a cheap/fast model — this is classification, not creative writing.

---

## Step 5 — Run the setup script

```bash
npm run install-service
```

This creates data/logs directories and installs a platform-specific auto-start service (macOS Launch Agent, Linux systemd, or Windows Startup script).

---

## Step 6 — Mention custom prompt rules

Tell the user:

> You can teach Tab Out how you like your tabs organized. There's a `customPromptRules` field in the config file where you can write plain English instructions. For example:
> - "Treat all social media as one mission called 'Doom Scrolling'."
> - "Group GitHub tabs by repository name."
> - "I'm a student — group tabs by course/subject."
>
> You can add or change this anytime by editing `~/.mission-control/config.json`.

---

## Step 7 — Install the Chrome extension

The user needs to do this part manually in Chrome. Walk them through it clearly:

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `extension/` folder inside the cloned repo

Open the extensions page for them:
```bash
open "chrome://extensions"
```

---

## Step 8 — Start, verify, and show them around

```bash
npm start &
sleep 2
open http://localhost:3456
```

Once the dashboard loads, walk them through the experience:

> You're all set! Here's how to use Tab Out:
>
> 1. **Open a new tab** — you'll see your open tabs grouped by domain, plus your most-visited sites from the past week.
> 2. **Click "Organize with AI"** — the AI will cluster your tabs into named missions and write you a personal message. This is cached, so it's instant next time if your tabs haven't changed.
> 3. **Click any tab title** to jump directly to that tab (no new tab opened).
> 4. **Click "Close all N tabs"** on any mission to clean up — you'll hear a swoosh and see confetti.
> 5. **Duplicate tabs** are flagged with an amber badge. Click "Close duplicates" to keep just one copy.
>
> The server runs automatically in the background — you never need to start it again. Every new tab is now your mission control.

---

## Key Facts

- Config: `~/.mission-control/config.json`
- Logs: `~/.mission-control/logs/`
- Default port: `3456`
- Auto-starts on login (macOS Launch Agent / Linux systemd / Windows Startup)
- Only tab titles and URLs are sent to the LLM — browsing history stays local
- Any OpenAI-compatible API works
