import { AuthMode } from './common.types'

export const PROD_URL_NO_HTTPS = 'dendrologic-web.stencukpage.com'

export const IS_IN_PRODUCTION_ENVIRONMENT = false;

// if you want to test social auth on your native device, set the API server to be your local IP address (so instead of http://localhost:3001, it would be  http://000.000.0.0:3001)
export const FRONTEND_URL = !IS_IN_PRODUCTION_ENVIRONMENT
  ? 'http://localhost:3000'
  : `https://${PROD_URL_NO_HTTPS}`

// Make sure to change this to your own unique URL
export const APP_BUNDLE_URL = `next.dendrologic-web.stencukpage.com` // used to create the deep link

export const REDIRECT_URL = !IS_IN_PRODUCTION_ENVIRONMENT
  ? FRONTEND_URL
  : 'https://dendrologic-web.stencukpage.com'

export const AUTH_MODE: AuthMode = 'emailpassword'
