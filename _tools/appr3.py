"""Finish pass: apple-touch-icon link + heroPhoto CSS for both pages."""
import io, pathlib

ROOT = pathlib.Path(r"E:/Develop/Source/portfolio")

def load(p): return io.open(ROOT / p, encoding="utf-8").read()
def save(p, t): io.open(ROOT / p, "w", encoding="utf-8", newline="").write(t)
def rep(txt, old, new, n=1):
    c = txt.count(old)
    assert c == n, f"EXPECT {n} GOT {c}: {old[:70]!r}"
    return txt.replace(old, new, n)

for p, pre in (("index.html", "assets/"), ("en/index.html", "../assets/")):
    t = load(p)
    # first icon link must point to the raster apple-touch-icon; keep root favicon.svg as the ico fallback
    t = rep(t, f'<link rel="icon" href="{pre}img/favicon.svg" type="image/svg+xml">',
                f'<link rel="icon" href="{pre}img/favicon.svg" type="image/svg+xml">\n<link rel="apple-touch-icon" href="{pre}img/apple-touch-icon.png">')
    save(p, t)
print("apple-touch-icon link ✔")

# heroPhoto + MSc spacing styles
p = "assets/css/style.css"
t = load(p)
t = rep(t, "/* ---------- Stats ---------- */", """/* ---------- Hero photo ---------- */
.heroPhoto {
  height: 68px;
  width: auto;
  margin-bottom: 14px;
  filter: drop-shadow(0 14px 30px rgba(7, 9, 14, .55));
}
html[data-theme='light'] .heroPhoto { filter: drop-shadow(0 14px 24px rgba(16, 28, 51, .25)); }

/* ---------- Stats ---------- */""", 1)
t = rep(t, ".edu__note { font-size: .84rem; color: var(--muted); margin-top: 12px; }", ".edu__note { font-size: .84rem; color: var(--muted); margin-top: 12px; }", 1)  # unchanged sanity check
save(p, t)
print("CSS ✔")
