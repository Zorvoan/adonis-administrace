import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Admin middleware denies access to users without the admin role.
 * It must run after the auth middleware.
 */
export default class AdminMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    if (!auth.user?.isAdmin) {
      return response.forbidden('Do administrace uživatelů má přístup jen administrátor.')
    }

    return next()
  }
}
