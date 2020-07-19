export const environment = {
  production: false,
  staging: true,
  type: 'staging',
  baseUrl: '',
  resourceApiURI: 'https://example.api.com',
  identityApiURI: 'https://example.identity.com',
  allowedDomainsRegex: /^.+@(gmail.com)$/,
  name: 'staging',
  auth: {
    authority: 'https://example.identity.com',
    client_id: 'comapny_core_spa',
    redirect_uri: 'https://example.com/auth-callback',
    post_logout_redirect_uri: 'https://example.com/',
    response_type: 'id_token token',
    scope: 'openid profile email company.core.api',
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: 'https://example.com/silent-refresh.html'
  }
};
