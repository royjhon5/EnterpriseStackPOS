type LandingParams = {
  appName: string;
  envName: string;
  swaggerEnabled: boolean;
  swaggerPath: string;
  envPrefixLabel: string; // e.g. DEV_ / PROD_
};

export function renderLandingPage({
  appName,
  envName,
  swaggerEnabled,
  swaggerPath,
  envPrefixLabel,
}: LandingParams): string {
  const swaggerCards = swaggerEnabled
    ? `
      <a class="card" href="/${swaggerPath}">
        <div class="title">📚 API Docs</div>
        <div class="desc">Open Swagger UI</div>
        <div class="meta">/${swaggerPath}</div>
      </a>
      <a class="card" href="/${swaggerPath}-json">
        <div class="title">📄 OpenAPI JSON</div>
        <div class="desc">View the API specification</div>
        <div class="meta">/${swaggerPath}-json</div>
      </a>
    `
    : `
      <div class="card muted">
        <div class="title">📚 API Docs</div>
        <div class="desc">Swagger is disabled</div>
        <div class="meta">Set ${envPrefixLabel}ENABLE_SWAGGER=true</div>
      </div>
    `;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${appName}</title>
  <style>
    :root{
      --bg:#0b1220;--text:rgba(255,255,255,.92);--muted:rgba(255,255,255,.65);
      --border:rgba(255,255,255,.14);--card:rgba(255,255,255,.06);--card2:rgba(255,255,255,.09);
      --glow:rgba(99,102,241,.35);--ok:rgba(34,197,94,.95);
    }
    *{box-sizing:border-box}
    body{
      margin:0;min-height:100vh;display:grid;place-items:center;padding:28px;color:var(--text);
      font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
      background:
        radial-gradient(1200px 800px at 20% 0%, rgba(99,102,241,.22), transparent 60%),
        radial-gradient(900px 600px at 80% 20%, rgba(34,197,94,.18), transparent 55%),
        var(--bg);
    }
    .wrap{width:100%;max-width:980px}
    .top{display:flex;justify-content:space-between;gap:18px;align-items:flex-start;flex-wrap:wrap;margin-bottom:18px}
    h1{margin:0;font-size:28px;letter-spacing:-.02em;line-height:1.15}
    .sub{margin:0;color:var(--muted);font-size:14px}
    .pill{
      display:inline-flex;align-items:center;gap:8px;padding:10px 12px;border-radius:999px;
      border:1px solid var(--border);background:rgba(255,255,255,.06);color:var(--muted);font-size:13px;
      backdrop-filter: blur(10px);
    }
    .dot{width:9px;height:9px;border-radius:50%;background:var(--ok);box-shadow:0 0 0 6px rgba(34,197,94,.12)}
    .grid{display:grid;grid-template-columns:repeat(12,1fr);gap:14px;margin-top:14px}
    .card{
      grid-column:span 6;text-decoration:none;color:inherit;border:1px solid var(--border);
      background:linear-gradient(180deg,var(--card),rgba(255,255,255,.03));
      border-radius:18px;padding:16px;position:relative;overflow:hidden;
      transition:transform .15s ease, background .15s ease, border-color .15s ease;
    }
    .card:hover{transform:translateY(-2px);border-color:rgba(255,255,255,.22);
      background:linear-gradient(180deg,var(--card2),rgba(255,255,255,.04))}
    .card::after{
      content:"";position:absolute;inset:-120px;background:radial-gradient(300px 180px at 20% 0%, var(--glow), transparent 60%);
      opacity:.65;pointer-events:none;
    }
    .title{font-weight:700;font-size:16px;margin-bottom:6px;position:relative}
    .desc{color:var(--muted);font-size:14px;margin-bottom:10px;position:relative}
    .meta{
      position:relative;display:inline-block;padding:6px 10px;border-radius:12px;
      font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
      font-size:12px;color:rgba(255,255,255,.78);
      border:1px solid rgba(255,255,255,.14);background:rgba(0,0,0,.18);
    }
    .muted{opacity:.75}
    @media (max-width:720px){.card{grid-column:span 12}h1{font-size:24px}}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="top">
      <div>
        <h1>${appName}</h1>
        <p class="sub">Backend is running. Use the links below.</p>
      </div>
      <div class="pill"><span class="dot"></span>Environment: <strong style="color:rgba(255,255,255,.9)">${envName}</strong></div>
    </div>

    <div class="grid">
      ${swaggerCards}
      <a class="card" href="/health">
        <div class="title">✅ Health</div>
        <div class="desc">Service status and checks</div>
        <div class="meta">/health</div>
      </a>
      <div class="card muted">
        <div class="title">ℹ️ Tip</div>
        <div class="desc">Protect Swagger in production using SWAGGER_USER / SWAGGER_PASS.</div>
        <div class="meta">${envPrefixLabel}SWAGGER_USER</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
