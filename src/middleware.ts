export { auth as middleware } from '@/auth'

export const config = {
  // Match only internationalized pathnames
  matcher: ['/me/', '/me/:path*', '/checkout/', '/checkout/:path*']
}
