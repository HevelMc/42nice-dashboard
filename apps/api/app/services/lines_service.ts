import cache from '@adonisjs/cache/services/main'
import axios from 'axios'

export class LinesService {
  private static readonly STOP_ID = '3533'
  private static readonly LINES_URL = `https://api.rla2.cityway.fr/media/api/transport/linesByLogicalStops?StopId=${LinesService.STOP_ID}`
  private static readonly TIMES_URL = `https://api.rla2.cityway.fr/media/api/v1/fr/Schedules/LogicalStop/${LinesService.STOP_ID}/NextDeparture?lineId=&direction=`

  private static _formatLineNames(name: string): string {
    if (name.includes('Saint-Isidore')) return 'St-Isidore'
    if (name.includes('Port Lympia')) return 'Port Lympia'
    if (name.includes('STAPS')) return 'STAPS'
    if (name.includes('CADAM')) return 'CADAM'
    return name
  }

  public static async getLines() {
    const cachedLines = await cache.get({ key: 'lines' })
    if (cachedLines) {
      return cachedLines
    }

    const [resLines, resTimes] = await Promise.all([
      axios.get(LinesService.LINES_URL).catch(() => null),
      axios.get(LinesService.TIMES_URL).catch(() => null),
    ])

    if (!resLines || !resTimes) {
      throw new Error('Could not get lines or times')
    }

    const linesData = resLines.data ?? []
    const timesData = resTimes.data ?? []

    const groupedLines = linesData.flatMap((item: any) =>
      item.Lines.map((line: any) => {
        const times = timesData
          .flatMap((t: any) => t.lines)
          .filter((t: any) => t.line.id === line.Id)
          .map((t: any) => t.times)
          .flat()

        const groupedTimes = times.reduce((acc: any, time: any) => {
          const destination = LinesService._formatLineNames(time.destination.name)
          if (!acc[destination]) {
            acc[destination] = []
          }
          acc[destination].push({
            eta: time.timeDifference,
            eta_hour: new Date(time.dateTime).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            realtime: time.realDateTime != null,
          })
          return acc
        }, {})

        return {
          number: line.Number,
          transportMode: item.TransportMode,
          color: line.Color,
          times: groupedTimes,
        }
      })
    )

    await cache.set({ key: 'lines', value: groupedLines, ttl: '1m' })
    return groupedLines
  }
}
