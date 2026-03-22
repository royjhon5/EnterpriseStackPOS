type HealthUIParams = {
  appName: string;
  envName: string;
  status: 'ok' | 'degraded' | 'down';
  databaseStatus: 'up' | 'down';
  uptimeSeconds: number;
  timestampISO: string;
  swaggerEnabled: boolean;
  swaggerPath: string;
};

export function renderHealthPage({
  appName,
  envName,
  status,
  databaseStatus,
  uptimeSeconds,
  timestampISO,
  swaggerEnabled,
  swaggerPath,
}: HealthUIParams): string {
  const badge =
    status === 'ok'
      ? `<span class="badge ok">OK</span>`
      : status === 'degraded'
        ? `<span class="badge warn">DEGRADED</span>`
        : `<span class="badge bad">DOWN</span>`;

  const uptimeMin = Math.floor(uptimeSeconds / 60);
  const uptimeHr = Math.floor(uptimeMin / 60);
  const uptimeRemMin = uptimeMin % 60;

  const docsLink = swaggerEnabled
    ? `<a class="btn" href="/${swaggerPath}">Open Swagger</a>`
    : `<span class="hint">Swagger disabled</span>`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Health • ${appName}</title>
  <style>
    :root{
      --bg:#0b1220;--text:rgba(255,255,255,.92);--muted:rgba(255,255,255,.65);
      --border:rgba(255,255,255,.14);--card:rgba(255,255,255,.06);
      --ok:#22c55e;--warn:#f59e0b;--bad:#ef4444;
      --glow:rgba(99,102,241,.28);
    }
    *{box-sizing:border-box}
    body{
      margin:0;min-height:100vh;display:grid;place-items:center;padding:28px;color:var(--text);
      font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;
      background:
        radial-gradient(1000px 600px at 20% 0%, var(--glow), transparent 60%),
        var(--bg);
    }
    .wrap{width:100%;max-width:860px}
    .head{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:center;margin-bottom:14px}
    h1{margin:0;font-size:22px;letter-spacing:-.02em}
    .sub{margin:0;color:var(--muted);font-size:13px}
    .card{
      border:1px solid var(--border);background:linear-gradient(180deg,var(--card),rgba(255,255,255,.03));
      border-radius:18px;padding:18px;
    }
    .row{display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:space-between}
    .badge{
      display:inline-flex;align-items:center;gap:8px;border-radius:999px;padding:8px 12px;
      border:1px solid rgba(255,255,255,.14);font-weight:700;font-size:12px;letter-spacing:.08em;
    }
    .ok{background:rgba(34,197,94,.14);color:rgba(255,255,255,.92)}
    .warn{background:rgba(245,158,11,.16);color:rgba(255,255,255,.92)}
    .bad{background:rgba(239,68,68,.16);color:rgba(255,255,255,.92)}
    .grid{display:grid;grid-template-columns:repeat(12,1fr);gap:12px;margin-top:12px}
    .stat{grid-column:span 6;border:1px solid var(--border);border-radius:16px;padding:14px;background:rgba(255,255,255,.04)}
    .label{color:var(--muted);font-size:12px;margin-bottom:6px}
    .value{font-weight:700}
    .mono{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:12px}
    .actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:14px}
    .btn{
      text-decoration:none;color:rgba(255,255,255,.92);
      border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.06);
      padding:10px 12px;border-radius:14px;font-weight:600;font-size:13px;
    }
    .btn:hover{background:rgba(255,255,255,.09)}
    .hint{color:var(--muted);font-size:13px}
    @media (max-width:720px){.stat{grid-column:span 12}}
  </style>
</head>
<body>
  <div class="wrap">
    <div class="head">
      <div>
        <h1>Health</h1>
        <p class="sub">${appName} • ${envName}</p>
      </div>
      ${badge}
    </div>

    <div class="card">
      <div class="row">
        <div>
          <div class="label">Status</div>
          <div class="value">${status.toUpperCase()}</div>
        </div>
        <div>
          <div class="label">Server Time</div>
          <div class="value mono">${timestampISO}</div>
        </div>
      </div>

      <div class="grid">
        <div class="stat">
          <div class="label">Uptime</div>
          <div class="value">${uptimeHr}h ${uptimeRemMin}m</div>
        </div>
        <div class="stat">
          <div class="label">Database</div>
          <div class="value">${databaseStatus.toUpperCase()}</div>
        </div>
        <div class="stat">
          <div class="label">Endpoint</div>
          <div class="value mono">GET /health</div>
        </div>
      </div>

      <div class="actions">
        <a class="btn" href="/">Home</a>
        ${docsLink}
        <a class="btn" href="/health?format=json">View JSON</a>
      </div>
    </div>
  </div>
</body>
</html>`;
}
