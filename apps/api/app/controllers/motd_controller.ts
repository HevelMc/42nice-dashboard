import Motd from '#models/motd'
import type { HttpContext } from '@adonisjs/core/http'

export default class MotdController {
  public async index({ response }: HttpContext) {
    const motd = await Motd.find(1)
    return response.json({ content: motd?.content })
  }

  public async update({ request, response }: HttpContext) {
    const motd = await Motd.updateOrCreate({ id: 1 }, { content: request.input('content') })
    return response.json(motd)
  }
}
