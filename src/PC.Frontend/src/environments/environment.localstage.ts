export const environment = {
  production: false,
  staging: false,
  type: 'local-to-staging',
  baseUrl: '',
  resourceApiURI: 'https://qa.api.intranet.petrelai.kz',
  identityApiURI: 'https://qa.identity.intranet.petrelai.kz',
  allowedDomainsRegex: /^.+@(petrel.ai|hipo.kz)$/,
  name: 'local-to-staging',
  auth: {
    authority: 'https://qa.identity.intranet.petrelai.kz',
    client_id: 'frontend_local',
    redirect_uri: 'http://localhost:4200/auth-callback',
    post_logout_redirect_uri: 'http://localhost:4200/',
    response_type: 'id_token token',
    scope: 'openid profile email core.api',
    filterProtocolClaims: true,
    loadUserInfo: true,
    automaticSilentRenew: true,
    silent_redirect_uri: 'http://localhost:4200/silent-refresh.html'
  }
};
