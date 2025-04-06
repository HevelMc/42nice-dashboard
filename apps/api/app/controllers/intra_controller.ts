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
}
