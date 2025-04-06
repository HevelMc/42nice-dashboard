import axios, { type Canceler } from 'axios';
import { auth, logout } from './auth';
import { PUBLIC_API_URL } from '$env/static/public';
import { get } from 'svelte/store';
import { toast } from 'svelte-sonner';
import { goto } from '$app/navigation';
import { Transmit } from '@adonisjs/transmit-client';
import { v4 as uuid } from 'uuid';

let transmit: Transmit;

export const getTransmit = () => {
  if (transmit) return transmit;
  transmit = new Transmit({
    baseUrl: PUBLIC_API_URL,
    uidGenerator: uuid,
    beforeSubscribe: (req) => {
      if (auth === undefined) return;
      const token = 'Bearer ' + get(auth)?.token.toString();
      // @ts-expect-error - append is not defined in types
      if (token) req.headers!.append('Authorization', token);
    }
  });
  return transmit;
};

export const api = axios.create({
  baseURL: PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'App-Version': 'web:latest'
  },
  withCredentials: true
});

export function initializeInterceptors() {
  // Adds the token to the request headers
  api.interceptors.request.use(
    (config) => {
      if (auth === undefined) return config;
      const token = get(auth)?.token;
      if (token) config.headers.Authorization = 'Bearer ' + token;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handles the response errors
  api.interceptors.response.use(
    (response) => Promise.resolve(response),
    (error) => {
      if (error?.code == 'ERR_NETWORK') {
        toast.error('Impossible de se connecter au serveur', {
          description: 'Vérifiez votre connexion internet et réessayez.'
        });
        return Promise.reject(error);
      }

      if (error.response) {
        // Handle deconnection
        if (error.response.status === 401) {
          if (get(auth)) {
            toast.error('Vous avez été déconnecté', {
              description: 'Votre session a expiré, veuillez vous reconnecter.'
            });
          }
          logout();
          goto('/login');
          return Promise.reject(error);
        }

        const data = error.response?.data;

        if (data?.errors) {
          for (const key in data.errors) toast.error(data.errors[key].message);
          return Promise.reject(error);
        } else {
          toast.error(`Erreur ${error.config.url}`, {
            description: error.message
          });
        }
      }
      return Promise.reject(error);
    }
  );
}
