import type { HttpContext } from '@adonisjs/core/http'
import { LinesService } from '#services/lines_service'

export default class LinesController {
  public async index({ response }: HttpContext) {
    try {
      const lines = await LinesService.getLines()
      return response.json(lines)
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }
}
