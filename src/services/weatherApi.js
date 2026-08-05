import axios from 'axios'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
const GEO_URL = 'https://api.openweathermap.org/geo/1.0/direct'

// 도시 이름(영문)으로 위경도 조회 후, 좌표로 날씨 조회
export async function fetchWeatherByCity(cityNameEn) {
  // 1단계: 지오코딩으로 좌표 얻기
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

  const { lat, lon } = geoResponse.data[0]

  // 2단계: 좌표로 날씨 조회
  const response = await axios.get(BASE_URL, {
    params: {
      lat,
      lon,
      appid: API_KEY,
      units: 'metric', // 섭씨로 응답받기
      lang: 'kr', // 날씨 설명을 한글로 받기
    },
  })
  return response.data
}

// 한글 도시명 -> OpenWeatherMap 조회용 영문 쿼리 매핑
export const koreanCityMap = {
  서울: 'Seoul,KR',
  부산: 'Busan,KR',
  대구: 'Daegu,KR',
  인천: 'Incheon,KR',
  광주: 'Gwangju,KR',
  대전: 'Daejeon,KR',
  울산: 'Ulsan,KR',
  수원: 'Suwon,KR',
  창원: 'Changwon,KR',
  고양: 'Goyang,KR',
  용인: 'Yongin,KR',
  성남: 'Seongnam,KR',
  청주: 'Cheongju,KR',
  전주: 'Jeonju,KR',
  천안: 'Cheonan,KR',
  제주: 'Jeju,KR',
  춘천: 'Chuncheon,KR',
  포항: 'Pohang,KR',
  평택: 'Pyeongtaek,KR',
  양평: 'Yangpyeong,KR',
}

// 검색어를 API가 이해할 수 있는 쿼리로 변환
export function resolveCityQuery(inputName) {
  const trimmed = inputName.trim()
  return koreanCityMap[trimmed] || trimmed
}

// 여러 도시를 한 번에 병렬로 조회하는 함수
export async function fetchWeatherForCities(cityList) {
  const requests = cityList.map((city) => fetchWeatherByCity(city.nameEn))
  return Promise.all(requests)
}
