export const environment = {
  production: false,
  staging: true,
  type: 'staging',
  baseUrl: '',
  resourceApiURI: 'https://qa.api.example.com',
  identityApiURI: 'https://qa.identity.example.com',
  allowedDomainsRegex: /^.+@(gmail.com)$/,
  name: 'staging',
  auth: {
    authority: 'https://qa.identity.example.com',
    client_id: 'core_spa',
    redirect_uri: 'https://qa.example.com/auth-callback',
    post_logout_redirect_uri: 'https://qa.example.com/',
    response_type: 'id_token token',
    scope: 'openid profile email core.api',
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: 'https://qa.example.com/silent-refresh.html'
  },
  googleAnalytics: {
    imports: []
  }
};
