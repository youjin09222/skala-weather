import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'

// 도시 이름으로 위경도 조회 후, 좌표로 날씨 조회 (검색 기능에서 사용)
export async function fetchWeatherByCity(cityNameEn) {
  const geoResponse = await axios.get(GEO_URL, {
    params: {
      q: cityNameEn,
      limit: 1,
      appid: API_KEY,
    },
  })

  if (!geoResponse.data || geoResponse.data.length === 0) {
    throw new Error(`"${cityNameEn}" 지역을 찾을 수 없습니다.`)
  }

  const { lat, lon, name, country, local_names } = geoResponse.data[0]

  const resolvedNameKo = local_names?.ko || name
  const resolvedNameEn = name

  const response = await axios.get(BASE_URL, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })

  return {
    ...response.data,
    resolvedNameKo,
    resolvedNameEn,
    resolvedCountry: country,
  }
}

// 좌표를 이미 알고 있을 때 곧장 날씨만 조회 (지오코딩 단계 생략 -> 응답 속도 개선)
// 홈 화면처럼 정해진 후보 도시 목록을 반복 조회하는 곳에서 사용
export async function fetchWeatherByCoords(lat, lon) {
  const response = await axios.get(BASE_URL, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })
  return response.data
}

// 여러 도시를 한 번에 병렬로 조회 (검색 기능에서 사용, 지오코딩 포함)
export async function fetchWeatherForCities(cityList) {
  const requests = cityList.map((city) => fetchWeatherByCity(city.nameEn))
  return Promise.all(requests)
}

// 좌표 목록을 병렬로 조회 (홈 화면 후보 도시처럼 좌표를 이미 아는 경우)
export async function fetchWeatherForCoordsList(cityList) {
  const requests = cityList.map((city) => fetchWeatherByCoords(city.lat, city.lon))
  return Promise.all(requests)
}
