export const environment = {
  production: true,
  version: require('../../package.json').version + '-homolog',
  timeStamp: '02/09/2024 03:36',
  configFile: 'assets/config/config.homolog.json',
  autenticacao: 'https://autenticacao-h.campogrande.ms.gov.br/auth/js/keycloak.js',
  accountKeycloak: 'https://autenticacao-h.campogrande.ms.gov.br/auth/realms/campograndems/account/',
  resetPasswordKeycloak: 'https://autenticacao-h.campogrande.ms.gov.br/auth/realms/campograndems/protocol/openid-connect/forgot-credentials?client_id=web_app&response_mode=fragment&response_type=code&scope=openid&redirect_uri=',
  keycloakConfig: {
    url: 'https://autenticacao-h.campogrande.ms.gov.br/auth',
    realm: 'campograndems',
    clientId: 'web_app',
  },
  birt: 'http://172.17.0.53:8060/birt4.5/frameset?__report=reports/profac/certificado_Sejuv.rptdesign&__format=pdf&',
  ambiente: 'https://apl04-h.campogrande.ms.gov.br/profac/api/',
};
