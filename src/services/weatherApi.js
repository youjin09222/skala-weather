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

  // 구조분해 할당(Destructuring) -> 필요한 필드만 바로 꺼내 씀
  const { lat, lon, name, country, local_names } = geoResponse.data[0]

  // 옵셔널 체이닝(?.) -> local_names가 없거나 ko 속성이 없어도 에러 없이 안전하게 처리
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

  // 전개 연산자(...) -> 기존 응답 데이터에 새 필드들 합쳐서 반환
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
