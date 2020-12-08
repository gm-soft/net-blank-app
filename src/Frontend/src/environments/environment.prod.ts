import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';

export const environment = {
  production: true,
  staging: false,
  type: 'prod',
  baseUrl: '',
  resourceApiURI: 'https://api.example.com',
  identityApiURI: 'https://identity.example.com',
  allowedDomainsRegex: /^.+@(gmail.com)$/,
  name: '',
  auth: {
    authority: 'https://identity.example.com',
    client_id: 'core_spa',
    redirect_uri: 'https://example.com/auth-callback',
    post_logout_redirect_uri: 'https://example.com/',
    response_type: 'id_token token',
    scope: 'openid profile email core.api',
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: 'https://example.com/silent-refresh.html'
  },
  googleAnalytics: {
    imports: [NgxGoogleAnalyticsModule.forRoot('G-Z23BGT8ZXP'), NgxGoogleAnalyticsRouterModule]
  }
};
