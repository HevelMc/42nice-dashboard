import { IntraService } from '#services/intra_service'
import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'

export default class IntraController {
  public async clusters({ response }: HttpContext) {
    const token = await IntraService.getAccessToken().catch(() => null)

    if (!token) {
      return response.status(500).json({ error: 'Could not get access token' })
    }

    const clusterCounts: Record<string, number> = { c1: 0, c2: 0, c3: 0, c4: 0 }

    let page = 1
    let hasMoreLocations = true

    while (hasMoreLocations) {
      const res = await axios
        .get(
          `https://api.intra.42.fr/v2/campus/41/locations?filter[active]=true&page[size]=100&page[number]=${page}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .catch(() => null)

      if (!res) {
        return response.status(500).json({ error: 'Could not get clusters' })
      }

      const locations = res.data
      if (locations.length === 0) {
        hasMoreLocations = false
      } else {
        locations.forEach((location: any) => {
          Object.keys(clusterCounts).forEach((cluster) => {
            if (location.host.startsWith(cluster)) clusterCounts[cluster]++
          })
        })
        page++
      }
    }

    return response.json(clusterCounts)
  }

  public async events({ response }: HttpContext) {
    const token = await IntraService.getAccessToken().catch(() => null)

    if (!token) {
      return response.status(500).json({ error: 'Could not get access token' })
    }

    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30)
    const startDateString = startDate.toISOString()
    const endDateString = endDate.toISOString()

    const events = await axios.get(
      `https://api.intra.42.fr/v2/campus/41/events?sort=begin_at&range[begin_at]=${startDateString},${endDateString}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    const exams = await axios.get(
      `https://api.intra.42.fr/v2/campus/41/exams?sort=begin_at&range[begin_at]=${startDateString},${endDateString}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if (!events.data || !exams.data) {
      return response.status(500).json({ error: 'Could not get events or exams' })
    }

    exams.data.forEach((exam: any) => (exam.kind = 'exam'))

    return response.json(
      [...events.data, ...exams.data].map((event: any) => {
        const begin = new Date(event.begin_at)
        const end = new Date(event.end_at)
        const duration = Math.floor((end.getTime() - begin.getTime()) / 60000)
        return {
          id: event.id,
          name: event.name,
          begin: event.begin_at,
          type: event.kind,
          location: event.location,
          duration: duration,
          reserved: event.nbr_subscribers,
          max: event.max_people,
        }
      })
    )
  }
}
