import { renderLandingPage } from './landing.page';

describe('renderLandingPage', () => {
  it('shows the application name, environment, and available links when Swagger is enabled', () => {
    const html = renderLandingPage({
      appName: 'Enterprise POS API',
      envName: 'development',
      swaggerEnabled: true,
      swaggerPath: 'swagger',
      envPrefixLabel: 'DEV_',
    });

    expect(html).toContain('Enterprise POS API');
    expect(html).toContain('Environment: <strong');
    expect(html).toContain('development');
    expect(html).toContain('href="/swagger"');
    expect(html).toContain('href="/swagger-json"');
    expect(html).toContain('href="/health"');
    expect(html).toContain('DEV_SWAGGER_USER');
  });

  it('explains how to re-enable documentation when Swagger is disabled', () => {
    const html = renderLandingPage({
      appName: 'Enterprise POS API',
      envName: 'production',
      swaggerEnabled: false,
      swaggerPath: 'docs',
      envPrefixLabel: 'PROD_',
    });

    expect(html).toContain('Swagger is disabled');
    expect(html).toContain('Set PROD_ENABLE_SWAGGER=true');
    expect(html).not.toContain('href="/docs"');
    expect(html).not.toContain('href="/docs-json"');
  });
});
