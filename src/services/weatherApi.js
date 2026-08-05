import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'

// 도시 이름(영문)으로 위경도 조회 후, 좌표로 날씨 조회
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

  const { lat, lon, name, country } = geoResponse.data[0]
  // 지오코딩이 인식한 지명을 항상 영문으로 통일 표시
  const resolvedName = name

  // 좌표로 날씨 조회
  const response = await axios.get(BASE_URL, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric', // 섭씨로 응답받기
      lang: 'kr', // 날씨 설명을 한글로 받기
    },
  })

  // 지오코딩이 실제로 인식한 지명 정보를 함께 반환
  return {
    ...response.data,
    resolvedName,
    resolvedCountry: country,
  }
}

// 여러 도시를 한 번에 병렬로 조회하는 함수
export async function fetchWeatherForCities(cityList) {
  const requests = cityList.map((city) => fetchWeatherByCity(city.nameEn))
  return Promise.all(requests)
}
