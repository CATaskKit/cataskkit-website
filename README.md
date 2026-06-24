# CATaskKit — marketing site (www.cataskkit.in)

The public landing site for **CATaskKit** and its flagship product **Attendly**.
This is a plain, dependency-free **static site** (HTML + CSS + a little vanilla
JS) so it deploys anywhere and loads instantly.

```
website/
  index.html        # www.cataskkit.in — corporate landing + Attendly showcase
  attendly.html     # /attendly.html — Attendly product detail page
  css/styles.css    # all styles (theme matched to the Attendly app)
  js/main.js        # nav, mobile drawer, scroll reveals
  assets/           # logo / favicon
  CNAME             # custom domain for GitHub Pages
  .nojekyll         # serve files as-is on GitHub Pages
```

## Two domains, two deployments

| Domain | What lives there | Source |
|--------|------------------|--------|
| **www.cataskkit.in** | This marketing site | this `website/` folder |
| **attendly.cataskkit.in** | The actual Attendly app | the `attendly/` React app |

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

## Deploy to GitHub Pages (www.cataskkit.in)

1. Put this `website/` folder in its own repo (or a `gh-pages`-served subdir).
2. In **Settings → Pages**, choose the branch/folder to deploy.
3. The included `CNAME` sets the custom domain to `www.cataskkit.in`.
4. At your DNS provider, add:
   - `www`  → `CNAME` → `<user>.github.io`
   - `attendly` → `CNAME` → wherever the Attendly app is hosted
   - apex `cataskkit.in` → the four GitHub Pages `A` records (or an ALIAS/`www` redirect)

> Hosting on Vercel/Netlify instead? Just set the project root to this folder and
> add `www.cataskkit.in` as a custom domain — no build step needed.

## Theme

Colors and typography are carried over from the Attendly app for a seamless
hand-off into the product:

- All-blue palette: primary `#1573e6`, sky `#2ba3f0`, indigo `#4f5bd5`, blue gradient
- Font: **Plus Jakarta Sans** (with **IBM Plex Mono** for code/URLs)
