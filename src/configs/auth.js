export default {
  meEndpoint: '/api/users/me',
  loginEndpoint: '/api/auth/local',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}
