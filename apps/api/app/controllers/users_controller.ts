import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import { paginatedTableQuery } from '#config/utils'

export default class UsersController {
  public async index({ request }: HttpContext) {
    return paginatedTableQuery(User.query(), request, ['fullName', 'email'])
  }

  public async show({ request, response }: HttpContext) {
    const id = request.param('id')
    const user = await User.findOrFail(id)
    return response.json(user)
  }

  public async store({ auth, request, response }: HttpContext) {
    if (auth.user?.role !== 'dev' && auth.user?.role !== 'staff') {
      return response.status(403).json({ message: 'Unauthorized' })
    }
    const payload = request.only(['email', 'password', 'fullName', 'role'])
    if (await User.findBy('email', payload.email)) {
      return response.status(400).json({ message: 'User already exists' })
    }
    const user = await User.create(payload)
    return response.json(user)
  }

  public async update({ auth, request, response }: HttpContext) {
    if (auth.user?.role !== 'dev' && auth.user?.role !== 'staff') {
      return response.status(403).json({ message: 'Unauthorized' })
    }
    const id = request.param('id')
    const payload = request.only(['email', 'password', 'fullName', 'role'])
    const user = await User.findOrFail(id)
    await user.merge(payload).save()
    return response.json(user)
  }

  public async destroy({ auth, request, response }: HttpContext) {
    if (auth.user?.role !== 'dev' && auth.user?.role !== 'staff') {
      return response.status(403).json({ message: 'Unauthorized' })
    }
    const id = request.param('id')
    const user = await User.findOrFail(id)
    await user?.delete()
    return response.json({ message: 'User deleted' })
  }

  public async login({ request, response }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])
    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user, ['*'], {
      expiresIn: '30 days',
    })
    return response.json({ user, token: token.toJSON().token })
  }
}
