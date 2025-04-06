import type { HttpContext } from '@adonisjs/core/http'
import axios from 'axios'

export default class LinesController {
  public async index({ response }: HttpContext) {
    const resLines = await axios
      .get('https://api.rla2.cityway.fr/media/api/transport/linesByLogicalStops?StopId=3533')
      .catch(() => null)

    const resTimes = await axios
      .get(
        'https://api.rla2.cityway.fr/media/api/v1/fr/Schedules/LogicalStop/3533/NextDeparture?lineId=&direction='
      )
      .catch(() => null)

    if (!resLines || !resTimes) {
      return response.status(500).json({ error: 'Could not get lines or times' })
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
          const destination = time.destination.name
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

    return response.json(groupedLines)
  }
}
