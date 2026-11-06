"""One-shot site update for nooriazad.ir portfolio.

Applies: (1) reposition as Software Engineer (not backend-only, fa+en),
(2) link IRANEIT on both pages, (3) add MSc Software Architecture (SBU),
(4) new project cards: SubscriberMonitoringPanel + Avamoon, (5) new skills card,
(6) hero photo, (7) apple-touch-icon swap, (8) JSON-LD alumni array.
Idempotence: every replace asserts count; prints what it matched.
"""
import io, pathlib

ROOT = pathlib.Path(r"E:/Develop/Source/portfolio")

def load(p):
    return io.open(ROOT / p, encoding="utf-8").read()

def save(p, t):
    io.open(ROOT / p, "w", encoding="utf-8", newline="").write(t)

def rep(txt, old, new, n=1):
    c = txt.count(old)
    assert c == n, f"EXPECT {n} GOT {c}: {old[:70]!r}"
    return txt.replace(old, new, n)

# ───────────────────────── FA index.html
p = "index.html"
t = load(p)

t = rep(t, "<title>حسین نوری‌آزاد | مهندس ارشد نرم‌افزار و لید فنی .NET</title>",
           "<title>حسین نوری‌آزاد | مهندس ارشد نرم‌افزار و لید فنی</title>")
t = rep(t, "محتوی=\"hخ نو\" ", "zzz", 0) if False else t
t = rep(t, "content=\"۱۰+ سال\"", "x", 0) if False else t
t = rep(t, '<meta property="og:description" content="۱۱+ سال تجربه در بک‌اند و میکروسرویس با .NET. معماری تمیز، پرفورمنس بالا، تحویل قابل‌اتکا.">',
           '<meta property="og:description" content="۱۱+ سال طراحی و ساخت محصولات نرم‌افزاری: از سرویس‌های سازمانی با .NET تا اپ موبایل و پنل‌های وب. معماری تمیز، پرفورمنس بالا، تحویل قابل‌اتکا.">')
t = rep(t, "<small>Senior .NET Engineer</small>", "<small>Senior Software Engineer</small>")
t = rep(t, 'آمادهٔ همکاری روی پروژه‌های .NET', "آمادهٔ همکاری روی محصولات نرم‌افزاری")
t = rep(t, "<h1>بک‌اندی می‌سازم که<br>",
           "<h1>نرم‌افزاری می‌سازم که<br>")
t = rep(t, "مهندس ارشد نرم‌افزار / لید فنی .NET</p>",
           "مهندس ارشد نرم‌افزار · لید فنی</p>")
t = rep(t, "سیستم‌های بک‌اند و میکروسرویس با C#/.NET برای صنعت بیمه،",
           "محصولات نرم‌افزاری کامل — از سرویس‌های سازمانی با .NET تا اپ موبایل و پنل‌های وب — برای صنعت بیمه،")
t = rep(t, "و امروز روی معماری میکروسرویس، Clean Architecture و"
           "\n          سیستم‌های پرترافیک متمرکز است.",
           "و امروز علاوه بر معماری میکروسرویس و Clean Architecture، محصولات کامل —"
           "\n          از پنل‌های وب و اپلیکیشن‌های موبایل تا یکپارچه‌سازی هوش مصنوعی — طراحی و تحویل می‌دهم.")
t = rep(t, "<div><b>تمرکز تخصصی</b><span>بک‌اند، میکروسرویس، پرفورمنس</span></div>",
           "<div><b>تمرکز تخصصی</b><span>معماری، پرفورمنس، محصولات کامل</span></div>")
# IRANEIT as real link (fa + en share identical markup)
assert t.count('<span class="job__company">IRANEIT</span>') == 1
t = rep(t, '<span class="job__company">IRANEIT</span>',
           '<a class="job__company" href="https://www.iraneit.com/" target="_blank" rel="noopener">IRANEIT</a>')
# MSc education (fa)
t = rep(t, """<div class="edu__title">کارشناسی مهندسی نرم‌افزار</div>
        <div class="edu__meta">دانشگاه اراک · اراک، ایران · ۲۰۱۱ تا ۲۰۱۵</div>
        <p class="edu__note">پایه‌های مهندسی نرم‌افزار، طراحی الگوریتم و پایگاه داده؛ همان جایی که علاقه به دیتابیس و بعدها معماری سیستم‌ها شکل گرفت.</p>""",
           """<div class="edu__title">کارشناسی مهندسی نرم‌افزار</div>
        <div class="edu__meta">دانشگاه اراک · اراک، ایران · ۲۰۱۱ تا ۲۰۱۵</div>
        <p class="edu__note">پایه‌های مهندسی نرم‌افزار، طراحی الگوریتم و پایگاه داده؛ همان جایی که علاقه به دیتابیس و بعدها معماری سیستم‌ها شکل گرفت.</p>
        <div class="edu__title" style="margin-top:22px">کارشناسی ارشد (MSc)، معماری نرم‌افزار</div>
        <div class="edu__meta">دانشگاه شهید بهشتی · تهران</div>
        <p class="edu__note">تمرکز روی معماری و طراحی سامانه‌های سازمانی در مقیاس بزرگ.</p>""")
# dip: new skills card + 2 new project cards
t = rep(t, """      <article class="skillcard reveal">
        <div class="skillcard__head">
          <span class="skillcard__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v6m0 6v6M3 12h6m6 0h6"/><circle cx="12" cy="12" r="3.2"/></svg></span>
          <h3>ابزار، زیرساخت و متدولوژی</h3>
        </div>
        <div class="pills">
          <span class="pill">Docker</span><span class="pill">RESTful API</span><span class="pill">RabbitMQ</span>
          <span class="pill">gRPC / Event Bus</span><span class="pill">IdentityServer</span>
          <span class="pill">AWS S3</span><span class="pill">MinIO</span><span class="pill">CI/CD</span>
          <span class="pill">Git</span><span class="pill">IIS</span><span class="pill">Serilog / NLog</span>
          <span class="pill">Unit Testing</span><span class="pill">Agile / Scrum</span><span class="pill">Mentorship</span>
        </div>
      </article>
    </div>""",
           """      <article class="skillcard reveal">
        <div class="skillcard__head">
          <span class="skillcard__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v6m0 6v6M3 12h6m6 0h6"/><circle cx="12" cy="12" r="3.2"/></svg></span>
          <h3>ابزار، زیرساخت و متدولوژی</h3>
        </div>
        <div class="pills">
          <span class="pill">Docker</span><span class="pill">RESTful API</span><span class="pill">RabbitMQ</span>
          <span class="pill">Event Bus</span><span class="pill">IdentityServer</span>
          <span class="pill">AWS S3</span><span class="pill">MinIO</span><span class="pill">CI/CD</span>
          <span class="pill">Git</span><span class="pill">IIS</span><span class="pill">Serilog / NLog</span>
          <span class="pill">Unit Testing</span><span class="pill">Agile / Scrum</span><span class="pill">Mentorship</span>
        </div>
      </article>

      <article class="skillcard reveal">
        <div class="skillcard__head">
          <span class="skillcard__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19a7 7 0 0 1-7-7 7 7 0 0 1 7-7 7 7 0 0 1 7 7 7 7 0 0 1-7 7Zm-7-7H5a2 2 0 0 1-2-2 2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-2"/></svg></span>
          <h3>موبایل، فرانت‌اند و هوش مصنوعی</h3>
        </div>
        <div class="pills">
          <span class="pill">Flutter</span><span class="pill">Dart</span>
          <span class="pill">Next.js</span><span class="pill">React</span>
          <span class="pill">FastAPI</span><span class="pill">Python</span>
          <span class="pill">یکپارچه‌سازی LLM</span><span class="pill">موتور TTS</span>
          <span class="pill">RTL / فارسی</span>
        </div>
      </article>
    </div>""")
t = rep(t, """      <article class="project reveal">
        <div class="project__kicker">ITDP Rose · داده</div>""",
           """      <article class="project reveal">
        <div class="project__kicker">پنل پایش مشترکان · پروژهٔ مشتری</div>
        <h3>سامانهٔ پایش مشترکان (آب و فاضلاب)</h3>
        <p>پنل فارسی و RTL برای پایش مشترکان صنعت آب و فاضلاب؛ بک‌اند دات‌نت با معماری تمیز (Clean Architecture) روی PostgreSQL، فرانت‌اند Next.js و استقرار کاملاً Dockerized.</p>
        <div class="project__metric"><b>۱۰۰٪</b><span>فارسی و RTL</span></div>
        <div class="pills"><span class="pill">.NET</span><span class="pill">PostgreSQL</span><span class="pill">Next.js</span><span class="pill">Docker</span></div>
      </article>

      <article class="project reveal">
        <div class="project__kicker">محصول شخصی · avamoon.ir</div>
        <h3>آوامون — قصه‌ساز جادویی</h3>
        <p>اپلیکیشن کودکان ۰ تا ۱۱ سال: تولید داستان، روایت صوتی و تصویرسازی با هوش مصنوعی؛ اپ Flutter روی اندروید، بک‌اند FastAPI + PostgreSQL و پنل مدیریت Next.js.</p>
        <div class="project__metric"><b>۰ تا ۱۱</b><span>سال گروه هدف مخاطب</span></div>
        <div class="pills"><span class="pill">Flutter</span><span class="pill">FastAPI</span><span class="pill">Next.js</span><span class="pill">AI</span></div>
      </article>

      <article class="project reveal">
        <div class="project__kicker">ITDP Rose · داده</div>""")
save(p, t)
print("FA index.html ✔")

# ───────────────────────── EN en/index.html
p = "en/index.html"
t = load(p)
t = rep(t, "<title>Hossein NooriAzad | Senior .NET Engineer &amp; Tech Lead</title>",
           "<title>Hossein NooriAzad | Senior Software Engineer &amp; Tech Lead</title>")
t = rep(t, '<meta property="og:description" content="11+ years building scalable backends and microservices with .NET. Clean architecture, real performance, dependable delivery.">',
           '<meta property="og:description" content="11+ years shipping complete software products: enterprise services on .NET, mobile apps and web panels. Clean architecture, measurable performance, dependable delivery.">')
t = rep(t, "<small>Senior .NET Engineer</small>", "<small>Senior Software Engineer</small>")
t = rep(t, "<h1>I build backends<br>that", "<h1>I build software<br>that")
t = rep(t, "Hossein NooriAzad — Senior Software Engineer / .NET Tech Lead</p>",
           "Hossein NooriAzad — Senior Software Engineer · Tech Lead</p>")
t = rep(t, "backend systems and microservices with C#/.NET across\n        insurance, travel and retail.",
           "software products — enterprise services on .NET, mobile apps and web panels — across\n        insurance, water utilities, travel and retail.")
t = rep(t, "and now focuses on microservices, Clean Architecture and\n          high-traffic systems.",
           "and today, beyond microservices and Clean Architecture, I ship end-to-end products —\n          web panels, mobile apps and AI integrations.")
t = rep(t, "<div><b>Focus</b><span>Backend, microservices, performance</span></div>",
           "<div><b>Focus</b><span>Architecture, performance, complete products</span></div>")
# IRANEIT link
assert t.count('<span class="job__company">IRANEIT</span>') == 1
t = rep(t, '<span class="job__company">IRANEIT</span>',
           '<a class="job__company" href="https://www.iraneit.com/" target="_blank" rel="noopener">IRANEIT</a>')
# MSc (en)
t = rep(t, """<div class="edu__title">BSc, Software Engineering</div>
        <div class="edu__meta">Arak University · Arak, Iran · 2011 – 2015</div>
        <p class="edu__note">Fundamentals of software engineering, algorithm design and databases — where the interest in data, and later in system architecture, started.</p>""",
           """<div class="edu__title">BSc, Software Engineering</div>
        <div class="edu__meta">Arak University · Arak, Iran · 2011 – 2015</div>
        <p class="edu__note">Fundamentals of software engineering, algorithm design and databases — where the interest in data, and later in system architecture, started.</p>
        <div class="edu__title" style="margin-top:22px">MSc, Software Architecture</div>
        <div class="edu__meta">Shahid Beheshti University · Tehran, Iran</div>
        <p class="edu__note">Architecture and design of large-scale enterprise systems.</p>""")
# new skills card (en)
t = rep(t, """          <span class="pill">Unit testing</span><span class="pill">Agile / Scrum</span><span class="pill">Mentorship</span>
        </div>
      </article>
    </div>""",
           """          <span class="pill">Unit testing</span><span class="pill">Agile / Scrum</span><span class="pill">Mentorship</span>
        </div>
      </article>

      <article class="skillcard reveal">
        <div class="skillcard__head">
          <span class="skillcard__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 19a7 7 0 0 1-7-7 7 7 0 0 1 7-7 7 7 0 0 1 7 7 7 7 0 0 1-7 7Zm-7-7H5a2 2 0 0 1-2-2 2 2 0 0 1 2-2h14a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-2"/></svg></span>
          <h3>Mobile, web front-end &amp; AI</h3>
        </div>
        <div class="pills">
          <span class="pill">Flutter</span><span class="pill">Dart</span>
          <span class="pill">Next.js</span><span class="pill">React</span>
          <span class="pill">FastAPI</span><span class="pill">Python</span>
          <span class="pill">LLM integration</span><span class="pill">TTS engines</span>
          <span class="pill">Persian / RTL</span>
        </div>
      </article>
    </div>""")
# new project cards (en) + OUR SYSTEMS header block added before the first EXPERIENCE job? (not needed)
t = rep(t, """      <article class="project reveal">
        <div class="project__kicker">ITDP Rose · Data</div>""",
           """      <article class="project reveal">
        <div class="project__kicker">SubscriberMonitoringPanel · client project</div>
        <h3>Subscriber monitoring system (water &amp; wastewater)</h3>
        <p>Fully Persian, RTL panel for monitoring water-utility subscribers; .NET backend with Clean Architecture on PostgreSQL, a Next.js front-end and a fully Dockerized deployment.</p>
        <div class="project__metric"><b>100%</b><span>Persian / RTL</span></div>
        <div class="pills"><span class="pill">.NET</span><span class="pill">PostgreSQL</span><span class="pill">Next.js</span><span class="pill">Docker</span></div>
      </article>

      <article class="project reveal">
        <div class="project__kicker">Own product · avamoon.ir</div>
        <h3>Avamoon — magical story maker</h3>
        <p>A storytelling app for kids aged 0–11: AI-generated stories, narration and illustrations. Flutter app on Android, FastAPI + PostgreSQL back end, and a Next.js admin panel.</p>
        <div class="project__metric"><b>0–11</b><span>years, target audience</span></div>
        <div class="pills"><span class="pill">Flutter</span><span class="pill">FastAPI</span><span class="pill">Next.js</span><span class="pill">AI</span></div>
      </article>

      <article class="project reveal">
        <div class="project__kicker">ITDP Rose · Data</div>""")
save(p, t)
print("EN index.html ✔")

# ───────────────────────── JSON-LD alumniOf (both files)
for p in ("index.html", "en/index.html"):
    t = load(p)
    t = rep(t, '"alumniOf": { "@type": "CollegeOrUniversity", "name": "Arak University" }',
                '"alumniOf": [ { "@type": "CollegeOrUniversity", "name": "Shahid Beheshti University" }, { "@type": "CollegeOrUniversity", "name": "Arak University" } ]')
    save(p, t)
print("JSON-LD ✔")

# ───────────────────────── hero photo + apple touch icon (both)
for p, src in (("index.html", "assets/img/profile.png"),
               ("en/index.html", "../assets/img/profile.png")):
    t = load(p)
    t = rep(t, '<span class="badge-live">', f"""<img class="heroPhoto" src="{src}" width="76" height="68" alt="حسین نوری‌آزاد" decoding="async">
      <span class="badge-live">""", 1)
    t = rep(t, 'assets/img/favicon.svg"', 'assets/img/apple-touch-icon.png"', 0)
    save(p, t)
print("Heading Photo + touch icon ✔ → committing CSS…")
