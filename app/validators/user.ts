import vine from '@vinejs/vine'

/**
 * Shared rules for email and password.
 */
const email = () => vine.string().email().maxLength(254)
const password = () => vine.string().minLength(8).maxLength(32)

/**
 * Roles a user can have
 */
export const roles = ['admin', 'user'] as const

/**
 * Validator to use when performing self-signup
 */
export const signupValidator = vine.create({
  fullName: vine.string().nullable(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
  passwordConfirmation: password().sameAs('password'),
})

/**
 * Validator to use before validating user credentials
 * during login
 */
export const loginValidator = vine.create({
  email: email(),
  password: vine.string(),
})

/**
 * Validator to use when an admin creates a new user
 */
export const createUserValidator = vine.create({
  fullName: vine.string().trim().maxLength(255).nullable(),
  email: email().unique({ table: 'users', column: 'email' }),
  password: password(),
  role: vine.enum(roles),
})

/**
 * Validator to use when an admin updates an existing user. The
 * password is optional and only changed when filled in.
 */
export const updateUserValidator = vine.withMetaData<{ userId: number }>().create({
  fullName: vine.string().trim().maxLength(255).nullable(),
  email: email().unique({
    table: 'users',
    column: 'email',
    filter: (db, _, field) => {
      db.whereNot('id', field.meta.userId)
    },
  }),
  password: password().optional(),
  role: vine.enum(roles),
})
