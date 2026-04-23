# Deploying the Discord Bot to Railway

This bot is part of a pnpm monorepo. The repo root contains a `Dockerfile`
that builds and runs **only** `discord-bot/` (no api-server, no mockup
sandbox), so deploys are small and fast.

## 1. Push the repo to GitHub

```bash
git push origin main
```

## 2. Create the Railway service

1. Go to https://railway.app → **New Project** → **Deploy from GitHub repo**
2. Pick this repo. Railway will auto-detect the `Dockerfile` and `railway.json`.
3. Wait for the first build (≈2-3 min).

## 3. Add environment variables

In the Railway service → **Variables** tab, add:

### Required

| Variable | Value |
|---|---|
| `DISCORD_BOT_TOKEN` | From discord.com/developers/applications → Bot → Reset Token |
| `DISCORD_CLIENT_ID` | From discord.com/developers/applications → General Information → Application ID |
| `OPENAI_API_KEY` | From https://platform.openai.com/api-keys (paid) |
| `GEMINI_API_KEY` | From https://aistudio.google.com/apikey (free tier available) |

### Optional

| Variable | Value |
|---|---|
| `GROK_API_KEY` | From https://console.x.ai (enables `/imagine-grok`) |
| `GROK_BASE_URL` | Defaults to `https://api.x.ai/v1` |
| `OPENAI_BASE_URL` | Only if proxying through another endpoint |
| `GEMINI_BASE_URL` | Only if proxying through another endpoint |

> **Note:** The Replit-only vars (`AI_INTEGRATIONS_OPENAI_*`,
> `AI_INTEGRATIONS_GEMINI_*`) are **not** available on Railway. You must
> use your own OpenAI and Gemini keys there.

## 4. Register the slash commands (one-time)

After the first successful deploy, register the commands so Discord knows
about them. From your local machine (with `DISCORD_BOT_TOKEN` and
`DISCORD_CLIENT_ID` exported):

```bash
pnpm --filter @workspace/discord-bot run register
```

Re-run this only when you add or change command definitions.

## 5. Verify

In Railway → service → **Deployments** → latest → **View Logs**, you should
see:

```
Bot online como YourBot#1234
```

Invite the bot to a server (if you haven't already):

1. discord.com/developers/applications → your app → **OAuth2 → URL Generator**
2. Scopes: `bot`, `applications.commands`
3. Bot permissions: `Send Messages`, `Embed Links`, `Attach Files`, `Use Slash Commands`
4. Open the generated URL → pick your server.

## Disable the Replit workflow (optional)

If you only want the bot running on Railway, stop/remove the **Discord Bot**
workflow in the Replit workflows panel — running both will cause Discord to
respond from whichever instance picks up the interaction first, which can
look like duplicated/random replies.
