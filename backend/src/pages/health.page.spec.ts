import { renderHealthPage } from './health.page';

describe('renderHealthPage', () => {
  it('renders the status summary, uptime, and documentation actions when Swagger is enabled', () => {
    const html = renderHealthPage({
      appName: 'Enterprise POS API',
      envName: 'development',
      status: 'ok',
      databaseStatus: 'up',
      uptimeSeconds: 7265,
      timestampISO: '2026-03-19T12:00:00.000Z',
      swaggerEnabled: true,
      swaggerPath: 'swagger',
    });

    expect(html).toContain('Enterprise POS API • development');
    expect(html).toContain('>OK<');
    expect(html).toContain('2026-03-19T12:00:00.000Z');
    expect(html).toContain('2h 1m');
    expect(html).toContain('>UP<');
    expect(html).toContain('href="/swagger"');
    expect(html).toContain('href="/health?format=json"');
  });

  it('renders a disabled hint instead of a documentation link when Swagger is off', () => {
    const html = renderHealthPage({
      appName: 'Enterprise POS API',
      envName: 'production',
      status: 'degraded',
      databaseStatus: 'down',
      uptimeSeconds: 120,
      timestampISO: '2026-03-19T12:00:00.000Z',
      swaggerEnabled: false,
      swaggerPath: 'docs',
    });

    expect(html).toContain('>DEGRADED<');
    expect(html).toContain('>DOWN<');
    expect(html).toContain('Swagger disabled');
    expect(html).not.toContain('href="/docs"');
  });
});
