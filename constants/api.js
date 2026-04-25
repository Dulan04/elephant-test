// constants/api.js
export const BASE_URL = 'http://192.168.208.231:8080/api'; // Change this to your Render/local URL

export const ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  SIGNUP: `${BASE_URL}/auth/signup`,
  GOOGLE_LOGIN: `${BASE_URL}/auth/google`,
  SIGHTINGS: `${BASE_URL}/sightings`,

};