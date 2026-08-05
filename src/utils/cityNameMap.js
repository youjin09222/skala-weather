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

// 홈 화면 "오늘의 여행지 추천" 후보 풀 - 좌표를 미리 저장해둬서
// 매번 지오코딩(도시명 -> 좌표 변환) API를 호출하지 않고 곧장 날씨만 조회 -> 로딩 속도 개선
export const cityPool = [
  { nameKr: '서울', lat: 37.5665, lon: 126.978 },
  { nameKr: '부산', lat: 35.1796, lon: 129.0756 },
  { nameKr: '대구', lat: 35.8714, lon: 128.6014 },
  { nameKr: '인천', lat: 37.4563, lon: 126.7052 },
  { nameKr: '광주', lat: 35.1595, lon: 126.8526 },
  { nameKr: '대전', lat: 36.3504, lon: 127.3845 },
  { nameKr: '울산', lat: 35.5384, lon: 129.3114 },
  { nameKr: '수원', lat: 37.2636, lon: 127.0286 },
  { nameKr: '창원', lat: 35.228, lon: 128.6811 },
  { nameKr: '고양', lat: 37.6584, lon: 126.832 },
  { nameKr: '용인', lat: 37.2411, lon: 127.1776 },
  { nameKr: '성남', lat: 37.4449, lon: 127.1388 },
  { nameKr: '청주', lat: 36.6424, lon: 127.489 },
  { nameKr: '전주', lat: 35.8242, lon: 127.148 },
  { nameKr: '천안', lat: 36.8151, lon: 127.1139 },
  { nameKr: '제주', lat: 33.4996, lon: 126.5312 },
  { nameKr: '춘천', lat: 37.8813, lon: 127.7298 },
  { nameKr: '포항', lat: 36.019, lon: 129.3435 },
  { nameKr: '평택', lat: 36.9921, lon: 127.1129 },
  { nameKr: '양평', lat: 37.4914, lon: 127.4874 },
]
