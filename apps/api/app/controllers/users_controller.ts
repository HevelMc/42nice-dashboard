import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  public async index({ response }: HttpContext) {
    const users = await User.all()
    return response.json(users)
  }

  public async show({ request, response }: HttpContext) {
    const id = request.param('id')
    const user = await User.findOrFail(id)
    return response.json(user)
  }

  public async store({ request, response }: HttpContext) {
    const payload = request.only(['email', 'password', 'fullName'])
    if (await User.findBy('email', payload.email)) {
      return response.status(400).json({ message: 'User already exists' })
    }
    const user = await User.create(payload)
    return response.json(user)
  }

  public async update({ request, response }: HttpContext) {
    const id = request.param('id')
    const payload = request.only(['email', 'password', 'fullName'])
    const user = await User.findOrFail(id)
    await user.merge(payload).save()
    return response.json(user)
  }

  public async destroy({ request, response }: HttpContext) {
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
