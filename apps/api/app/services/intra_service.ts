import env from '#start/env'
import cache from '@adonisjs/cache/services/main'
import axios from 'axios'

const ACCESS_TOKEN_URL = 'https://api.intra.42.fr/oauth/token'

export class IntraService {
  private static token: string | null = null
  private static tokenExpiration: number | null = null

  public static async getAccessToken() {
    if (
      IntraService.token &&
      IntraService.tokenExpiration &&
      Date.now() < IntraService.tokenExpiration
    ) {
      return IntraService.token
    }

    return await axios
      .post(ACCESS_TOKEN_URL, {
        grant_type: 'client_credentials',
        client_id: env.get('INTRA_API_UID'),
        client_secret: env.get('INTRA_API_SECRET'),
      })
      .then((response) => {
        IntraService.token = response.data.access_token
        IntraService.tokenExpiration = Date.now() + response.data.expires_in * 1000
        return IntraService.token
      })
      .catch((error) => {
        console.log(error)
      })
  }

  public static async getClusters() {
    const cachedClusters = await cache.get({ key: 'clusters' })
    if (cachedClusters) {
      return cachedClusters
    }

    const token = await this.getAccessToken()
    if (!token) {
      throw new Error('Could not get access token')
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
        throw new Error('Could not get clusters')
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

    await cache.set({ key: 'clusters', value: clusterCounts, ttl: 5 * 60 })
    return clusterCounts
  }

  public static async getEvents() {
    const cachedEvents = await cache.get({ key: 'events' })
    if (cachedEvents) {
      return cachedEvents
    }

    const token = await this.getAccessToken()
    if (!token) {
      throw new Error('Could not get access token')
    }

    const startDate = new Date()
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 30)
    const startDateString = startDate.toISOString()
    const endDateString = endDate.toISOString()

    const [eventsRes, examsRes] = await Promise.all([
      axios.get(
        `https://api.intra.42.fr/v2/campus/41/events?sort=begin_at&range[begin_at]=${startDateString},${endDateString}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      axios.get(
        `https://api.intra.42.fr/v2/campus/41/exams?sort=begin_at&range[begin_at]=${startDateString},${endDateString}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    ])

    if (!eventsRes.data || !examsRes.data) {
      throw new Error('Could not get events or exams')
    }

    examsRes.data.forEach((exam: any) => (exam.kind = 'exam'))

    const events = [...eventsRes.data, ...examsRes.data].map((event: any) => {
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

    await cache.set({ key: 'events', value: events, ttl: 5 * 60 })
    return events
  }

  public static async getCoalitions() {
    const cachedCoalitions = await cache.get({ key: 'coalitions' })
    if (cachedCoalitions) {
      return cachedCoalitions
    }

    const token = await this.getAccessToken()
    if (!token) {
      throw new Error('Could not get access token')
    }

    const coalitionsRes = await axios.get(`https://api.intra.42.fr/v2/blocs/37`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (!coalitionsRes.data) {
      throw new Error('Could not get coalitions')
    }

    const coalitions: any[] = coalitionsRes.data.coalitions
    const userIds: { coalitionId: number; userId: number }[] = []

    for (const coalition of coalitions) {
      const response = await axios.get(
        `https://api.intra.42.fr/v2/coalitions/${coalition.id}/coalitions_users?sort=-this_year_score&page[size]=1`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      userIds.push({ coalitionId: coalition.id, userId: response.data[0]?.user_id })
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Wait for 1 second to avoid rate limit
    }

    const usersRes = await axios.get(
      `https://api.intra.42.fr/v2/users?filter[id]=${userIds.map((id) => id.userId).join(',')}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    )

    const result = coalitions.map((coalition: any) => {
      let topUser = usersRes.data.find(
        (user: any) => user.id === userIds.find((id) => id.coalitionId === coalition.id)?.userId
      )

      return {
        id: coalition.id,
        name: coalition.name,
        score: coalition.score,
        bg: coalition.cover_url,
        color: coalition.color,
        medal: coalition.medal,
        logo: coalition.image_url,
        topUser: topUser
          ? {
              login: topUser.login,
              image_url: topUser.image.versions.medium,
            }
          : null,
      }
    })

    await cache.set({ key: 'coalitions', value: result, ttl: 5 * 60 })
    return result
  }
}
