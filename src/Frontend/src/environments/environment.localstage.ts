export const environment = {
  production: false,
  staging: false,
  type: 'local-to-staging',
  baseUrl: '',
  resourceApiURI: 'https://qa.api.example.com',
  identityApiURI: 'https://qa.identity.example.com',
  allowedDomainsRegex: /^.+@(gmail.com)$/,
  name: 'local-to-staging',
  auth: {
    authority: 'https://qa.identity.example.com',
    client_id: 'frontend_local',
    redirect_uri: 'http://localhost:4200/auth-callback',
    post_logout_redirect_uri: 'http://localhost:4200/',
    response_type: 'id_token token',
    scope: 'openid profile email core.api',
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: 'http://localhost:4200/silent-refresh.html'
  },
  googleAnalytics: {
    imports: []
  }
};
