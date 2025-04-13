import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await User.firstOrCreate(
      { email: 'axel@cohort42.com' },
      {
        email: 'axel@cohort42.com',
        password: 'admin',
        login: 'alopez',
        role: 'dev',
      }
    )
  }
}
