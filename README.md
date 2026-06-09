# Solfege Ear Trainer

Browser-based movable-do ear training for practicing scale degrees in major keys. The app plays a cadence and a target note, then asks the user to identify Do, Re, Mi, Fa, Sol, La, or Ti.

## Features

- Movable-do practice with browser-generated audio
- Beginner and practice modes
- Fixed-key or random-key sessions
- SEO landing pages for related solfege searches
- Pro waitlist form powered by Web3Forms
- Public visit counter with Today and Total counts on Cloudflare Pages

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Cloudflare Pages static export
- Cloudflare Pages Functions + Workers KV for visit counting

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

Useful commands:

```bash
npm run typecheck
npm run test
npm run build
```

## Environment Variables

Optional public variables:

```txt
NEXT_PUBLIC_SITE_URL=https://solfege-ear-training.pages.dev
NEXT_PUBLIC_WEB3FORMS_KEY=your-web3forms-key
```

For Cloudflare Pages static export, set:

```txt
CF_PAGES=1
```

The visit counter also needs this Cloudflare Pages Function binding:

```txt
VISIT_COUNTER=your-workers-kv-namespace
```

## Cloudflare Pages Deployment

Create a Cloudflare Pages project connected to this repository.

Build settings:

```txt
Framework preset: Next.js (Static HTML Export)
Build command: npm run build
Build output directory: out
Root directory: leave blank
```

Environment variables:

```txt
CF_PAGES=1
NEXT_PUBLIC_SITE_URL=https://solfege-ear-training.pages.dev
```

If the framework preset is not available, choose `None` and keep the same build command and output directory.

## Visit Counter Setup

The footer visit counter calls `/api/visits`, implemented by `functions/api/visits.js`.

Create a Workers KV namespace, for example:

```txt
solfege_visits
```

Bind it to the Pages project:

```txt
Settings -> Functions -> KV namespace bindings
Variable name: VISIT_COUNTER
KV namespace: solfege_visits
```

The counter stores:

```txt
site:visits:total
site:visits:daily:YYYY-MM-DD
```

Daily counts use the Asia/Shanghai day boundary. The browser uses session storage so a refresh in the same browser session does not increment the count again.

## Notes

- `functions/api/visits.js` runs on Cloudflare Pages, not in plain `next dev`.
- Static builds are generated into `out/` when `CF_PAGES=1`.
- Generated folders such as `.next/`, `out/`, `logs/`, and `node_modules/` are intentionally ignored.
