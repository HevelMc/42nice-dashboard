import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'

export default class WeatherController {
  public async index({ response }: HttpContext) {
    const coords = { lat: 43.6834834, lon: 7.1999391 }

    const weather = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code,is_day&timezone=auto&forecast_days=1`
    )

    const data = weather.data.current

    return response.json(data)
  }
}
