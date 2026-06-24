# CATaskKit — marketing site (www.cataskkit.in)

The public landing site for **CATaskKit** and its flagship product **Attendly**.
This is a plain, dependency-free **static site** (HTML + CSS + a little vanilla
JS) so it deploys anywhere and loads instantly.

```
website/
  index.html        # www.cataskkit.in — corporate landing + Attendly showcase
  attendly.html     # Attendly product detail page
  terms.html        # legal — Terms & Conditions
  privacy.html      # legal — Privacy Policy
  refund.html       # legal — Refund & Cancellation Policy
  shipping.html     # legal — Service Delivery (Shipping) Policy
  contact.html      # legal — Contact Us
  css/styles.css    # all styles (theme matched to the Attendly app)
  js/main.js        # nav, mobile drawer, scroll reveals, billing calculator
  assets/           # logo / favicon
  .nojekyll         # legacy GitHub Pages marker — harmless, ignored by Vercel
```

## Two domains, two deployments

| Domain | What lives there | Hosting |
|--------|------------------|---------|
| **www.cataskkit.in** | This marketing site | Vercel · repo `CATaskKit/cataskkit-website` |
| **attendly.cataskkit.in** | The actual Attendly app | Vercel · repo `CATaskKit/attendly` |

Every **"Create a workspace"** / **"Sign in"** button on this site points to
`https://attendly.cataskkit.in/` — the marketing site never handles auth itself.
That keeps the brand site fast and static while the product app stays separate.

- `Create a workspace` → `https://attendly.cataskkit.in/?signup=1`
- `Sign in`            → `https://attendly.cataskkit.in/`
- `Join your team`     → `https://attendly.cataskkit.in/?join=1`

> The `?signup=1` / `?join=1` query params are read by the Attendly login screen
> so the visitor lands directly on the right form. (Plain `https://attendly.cataskkit.in/`
> still works — it just opens the sign-in form.)

## Run it locally

It's static — open `index.html` directly, or serve the folder:

```bash
# any static server works, e.g.
npx serve .
# or
python -m http.server 5173
```

## Hosting & deploy (Vercel)

The site is hosted on **Vercel**, deployed from the GitHub repo
**`CATaskKit/cataskkit-website`**. It's a pure static site, so there is **no build
step** — Vercel serves the files from the repo root:

- **Framework Preset:** Other
- **Build Command:** _(none)_
- **Output Directory:** _(repo root)_

Push to `main` → Vercel auto-deploys. Vercel provisions and renews the TLS
certificate automatically (no manual cert step).

### DNS (managed at Wix — `ns8.wixdns.net`)

| Type | Host | Value |
|------|------|-------|
| CNAME | `www` | `cname.vercel-dns.com` |
| A | `@` (apex) | Vercel's apex IP (shown in the Vercel **Domains** panel) |
| CNAME | `attendly` | the Attendly app's Vercel target |

In the Vercel project's **Settings → Domains**, add `www.cataskkit.in`, and add
`cataskkit.in` set to **redirect → `www.cataskkit.in`**.

> **History:** this site was originally on GitHub Pages, but its TLS certificate
> would not provision for the custom domain, so it was moved to Vercel (matching
> the Attendly app). The GitHub Pages site has been disabled and the old `CNAME`
> file removed.

## Theme

Colors and typography are carried over from the Attendly app for a seamless
hand-off into the product:

- All-blue palette: primary `#1573e6`, sky `#2ba3f0`, indigo `#4f5bd5`, blue gradient
- Font: **Plus Jakarta Sans** (with **IBM Plex Mono** for code/URLs)
