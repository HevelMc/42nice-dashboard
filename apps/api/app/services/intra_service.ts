import env from '#start/env'
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
}
