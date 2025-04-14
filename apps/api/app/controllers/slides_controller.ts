import { paginatedTableQuery } from '#config/utils'
import Slide from '#models/slide'
import type { HttpContext } from '@adonisjs/core/http'

export default class SlidesController {
  public async index({ request }: HttpContext) {
    return paginatedTableQuery(Slide.query(), request, ['title', 'description'])
  }

  public async current({ response }: HttpContext) {
    const slide = await Slide.query()
      .orderBy('startDate', 'asc')
      .where('startDate', '<=', new Date().toISOString())
      .where('endDate', '>=', new Date().toISOString())
    return response.json(slide)
  }

  public async show({ request, response }: HttpContext) {
    const slide = await Slide.findOrFail(request.param('id'))
    return response.json(slide)
  }

  public async store({ request, response }: HttpContext) {
    const payload = request.only(['title', 'description', 'image', 'startDate', 'endDate'])
    const slide = await Slide.create(payload)
    return response.json(slide)
  }

  public async update({ request, response }: HttpContext) {
    const payload = request.only(['title', 'description', 'image', 'startDate', 'endDate'])
    const slide = await Slide.findOrFail(request.param('id'))
    const end = new Date(payload.endDate)
    end.setHours(23, 59, 59, 999)
    payload.endDate = end.toISOString()
    await slide?.merge(payload).save()
    return response.json(slide)
  }

  public async destroy({ request, response }: HttpContext) {
    const slide = await Slide.findOrFail(request.param('id'))
    await slide?.delete()
    return response.json({ message: 'Slide deleted' })
  }
}
