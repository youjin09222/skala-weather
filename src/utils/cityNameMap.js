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
