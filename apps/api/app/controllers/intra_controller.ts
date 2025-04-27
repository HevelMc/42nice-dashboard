import { IntraService } from '#services/intra_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class IntraController {
  public async clusters({ response }: HttpContext) {
    try {
      const clusters = await IntraService.getClusters()
      return response.json(clusters)
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }

  public async events({ response }: HttpContext) {
    try {
      const events = await IntraService.getEvents()
      return response.json(events)
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }

  public async coalitions({ response }: HttpContext) {
    try {
      const coalitions = await IntraService.getCoalitions()
      return response.json(coalitions)
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }
}
