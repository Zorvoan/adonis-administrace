import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * UsersController handles the users administration. Every action
 * is protected by the auth and admin middleware.
 */
export default class UsersController {
  /**
   * List all users
   */
  async index({ view }: HttpContext) {
    const users = await User.query().orderBy('id', 'asc')
    return view.render('pages/admin/users/index', { users })
  }

  /**
   * Display the form to create a new user
   */
  async create({ view }: HttpContext) {
    return view.render('pages/admin/users/create')
  }

  /**
   * Create a new user
   */
  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)
    const user = await User.create({ ...payload, fullName: payload.fullName || null })

    session.flash('success', `Uživatel ${user.email} byl vytvořen.`)
    return response.redirect().toRoute('admin.users.index')
  }

  /**
   * Display the form to edit an existing user
   */
  async edit({ params, view }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return view.render('pages/admin/users/edit', { user })
  }

  /**
   * Update an existing user. The password is changed only when filled in.
   * Admins cannot take away their own admin role.
   */
  async update({ params, request, response, session, auth }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const { password, ...payload } = await request.validateUsing(updateUserValidator, {
      meta: { userId: user.id },
    })

    if (user.id === auth.user!.id && payload.role !== 'admin') {
      session.flash('error', 'Sám sobě nemůžete odebrat roli administrátora.')
      return response.redirect().back()
    }

    user.merge({ ...payload, fullName: payload.fullName || null })
    if (password) {
      user.password = password
    }
    await user.save()

    session.flash('success', `Uživatel ${user.email} byl upraven.`)
    return response.redirect().toRoute('admin.users.index')
  }

  /**
   * Delete a user. Admins cannot delete their own account.
   */
  async destroy({ params, response, session, auth }: HttpContext) {
    const user = await User.findOrFail(params.id)

    if (user.id === auth.user!.id) {
      session.flash('error', 'Nemůžete smazat vlastní účet.')
      return response.redirect().back()
    }

    await user.delete()

    session.flash('success', `Uživatel ${user.email} byl smazán.`)
    return response.redirect().toRoute('admin.users.index')
  }
}
