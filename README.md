# nooriazad.ir — personal portfolio

Static, bilingual (fa / en), dependency-free portfolio for **Hossein NooriAzad**.
Persian lives at `/` (RTL), English at `/en/`. No build step, no npm, no framework.

## Run locally

```bash
cd E:/Develop/Source/portfolio
python -m http.server 8088
# open http://127.0.0.1:8088/
```

## Structure

```
index.html              Persian (RTL) — site root
en/index.html           English (LTR)
404.html                custom not-found page
sitemap.xml, robots.txt
assets/css/style.css    all styling (design tokens at the top)
assets/js/main.js       theme toggle, mobile drawer, scroll reveal, scroll spy
assets/fonts/           Vazirmatn 400/500/600/700 (self-hosted woff2)
assets/img/             favicon.svg, og.png
assets/Hossein-NooriAzad-Resume.pdf
_tools/                 dev-only helpers (not needed at runtime)
```

## Editing content

- Persian content: `index.html` · English content: `en/index.html`.
  They are independent files — apply every content change to **both**.
- Colors / spacing: the `:root` and `html[data-theme='light']` blocks at the top of `style.css`.
- The résumé PDF is `assets/Hossein-NooriAzad-Resume.pdf` — replacing that file updates both download buttons.

## Deploy (Cloudflare Pages)

1. Push this folder to GitHub.
2. Cloudflare → Workers & Pages → Create → Pages → Connect to Git.
3. Framework preset `None`, **build command empty**, output directory `/`.
4. Custom domains: `nooriazad.ir` + `www.nooriazad.ir`; redirect `www` → apex.
5. Set the registrar's nameservers to the pair Cloudflare shows.

Any static host (Vercel, Netlify, cPanel) works the same way — there is nothing to compile.

## Regenerate the Open Graph image

```bash
"C:/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 \
  --screenshot="assets/img/og.png" "http://127.0.0.1:8088/_tools/og.html"
```

## Checks used

- `/` and `/en/` rendered at 1440 / 1024 / 768 / 390 / 320 px — zero horizontal overflow.
- Nav → drawer breakpoint, theme toggle + persistence, drawer open/close, all in-page anchors resolve.
- Fonts self-hosted and loaded (`document.fonts.check`), no broken images.
- `_tools/verify.html` and `_tools/probe.html` re-run these checks in a headless browser.
