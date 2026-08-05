import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'

// 도시 이름으로 위경도 조회 후, 좌표로 날씨 조회
export async function fetchWeatherByCity(cityNameEn) {
  // 지오코딩으로 좌표 얻기
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
  // 한글/영문 지명 둘 다 준비
  const resolvedNameKo = local_names?.ko || name
  const resolvedNameEn = name

  // 좌표로 날씨 조회
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

export async function fetchWeatherForCities(cityList) {
  const requests = cityList.map((city) => fetchWeatherByCity(city.nameEn))
  return Promise.all(requests)
}
