import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

/**
 * Creates the default admin account and a few sample users.
 * Safe to run repeatedly.
 */
export default class extends BaseSeeder {
  async run() {
    await User.updateOrCreate(
      { email: 'admin@example.com' },
      { fullName: 'Admin', password: 'admin1234', role: 'admin' }
    )

    await User.firstOrCreate(
      { email: 'jan.novak@example.com' },
      { fullName: 'Jan Novák', password: 'heslo1234' }
    )
    await User.firstOrCreate(
      { email: 'petra.svobodova@example.com' },
      { fullName: 'Petra Svobodová', password: 'heslo1234' }
    )
  }
}
