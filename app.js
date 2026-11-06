/**
 * WeatherNow - 날씨 애플리케이션 핵심 스크립트
 * Open-Meteo 공개 API (무료, API Key 불필요) 연동
 */

// 전역 상태
const state = {
  unit: localStorage.getItem('weather_unit') || 'C', // 'C' | 'F'
  currentLocation: {
    name: '서울',
    country: '대한민국',
    lat: 37.5665,
    lon: 126.9780
  },
  weatherData: null,
  searchDebounceTimer: null
};

// 자주 찾는 국내 및 전 세계 주요 도시 사전 (빠른 한글 자동완성 지원)
const POPULAR_CITIES = [
  { name: '서울', country: '대한민국', lat: 37.5665, lon: 126.9780, en: 'Seoul' },
  { name: '부산', country: '대한민국', lat: 35.1796, lon: 129.0756, en: 'Busan' },
  { name: '인천', country: '대한민국', lat: 37.4563, lon: 126.7052, en: 'Incheon' },
  { name: '대구', country: '대한민국', lat: 35.8714, lon: 128.6014, en: 'Daegu' },
  { name: '대전', country: '대한민국', lat: 36.3504, lon: 127.3845, en: 'Daejeon' },
  { name: '광주', country: '대한민국', lat: 35.1595, lon: 126.8526, en: 'Gwangju' },
  { name: '울산', country: '대한민국', lat: 35.5384, lon: 129.3114, en: 'Ulsan' },
  { name: '세종', country: '대한민국', lat: 36.4800, lon: 127.2890, en: 'Sejong' },
  { name: '수원', country: '대한민국', lat: 37.2636, lon: 127.0286, en: 'Suwon' },
  { name: '성남', country: '대한민국', lat: 37.4200, lon: 127.1265, en: 'Seongnam' },
  { name: '고양', country: '대한민국', lat: 37.6584, lon: 126.8320, en: 'Goyang' },
  { name: '용인', country: '대한민국', lat: 37.2411, lon: 127.1776, en: 'Yongin' },
  { name: '춘천', country: '대한민국', lat: 37.8813, lon: 127.7298, en: 'Chuncheon' },
  { name: '강릉', country: '대한민국', lat: 37.7519, lon: 128.8761, en: 'Gangneung' },
  { name: '원주', country: '대한민국', lat: 37.3422, lon: 127.9202, en: 'Wonju' },
  { name: '청주', country: '대한민국', lat: 36.6424, lon: 127.4890, en: 'Cheongju' },
  { name: '천안', country: '대한민국', lat: 36.8151, lon: 127.1139, en: 'Cheonan' },
  { name: '전주', country: '대한민국', lat: 35.8242, lon: 127.1480, en: 'Jeonju' },
  { name: '포항', country: '대한민국', lat: 36.0190, lon: 129.3435, en: 'Pohang' },
  { name: '창원', country: '대한민국', lat: 35.2280, lon: 128.6811, en: 'Changwon' },
  { name: '제주', country: '대한민국', lat: 33.4996, lon: 126.5312, en: 'Jeju' },
  { name: '서귀포', country: '대한민국', lat: 33.2541, lon: 126.5601, en: 'Seogwipo' },
  { name: '도쿄', country: '일본', lat: 35.6762, lon: 139.6503, en: 'Tokyo' },
  { name: '오사카', country: '일본', lat: 34.6937, lon: 135.5023, en: 'Osaka' },
  { name: '후쿠오카', country: '일본', lat: 33.5904, lon: 130.4017, en: 'Fukuoka' },
  { name: '삿포로', country: '일본', lat: 43.0618, lon: 141.3545, en: 'Sapporo' },
  { name: '베이징', country: '중국', lat: 39.9042, lon: 116.4074, en: 'Beijing' },
  { name: '상하이', country: '중국', lat: 31.2304, lon: 121.4737, en: 'Shanghai' },
  { name: '홍콩', country: '홍콩', lat: 22.3193, lon: 114.1694, en: 'Hong Kong' },
  { name: '타이베이', country: '대만', lat: 25.0330, lon: 121.5654, en: 'Taipei' },
  { name: '방콕', country: '태국', lat: 13.7563, lon: 100.5018, en: 'Bangkok' },
  { name: '싱가포르', country: '싱가포르', lat: 1.3521, lon: 103.8198, en: 'Singapore' },
  { name: '런던', country: '영국', lat: 51.5074, lon: -0.1278, en: 'London' },
  { name: '파리', country: '프랑스', lat: 48.8566, lon: 2.3522, en: 'Paris' },
  { name: '베를린', country: '독일', lat: 52.5200, lon: 13.4050, en: 'Berlin' },
  { name: '로마', country: '이탈리아', lat: 41.9028, lon: 12.4964, en: 'Rome' },
  { name: '뉴욕', country: '미국', lat: 40.7128, lon: -74.0060, en: 'New York' },
  { name: '로스앤젤레스', country: '미국', lat: 34.0522, lon: -118.2437, en: 'Los Angeles' },
  { name: '샌프란시스코', country: '미국', lat: 37.7749, lon: -122.4194, en: 'San Francisco' },
  { name: '시드니', country: '호주', lat: -33.8688, lon: 151.2093, en: 'Sydney' }
];

// ========================================================
// 나라별 지원 도시 전체 카탈로그 데이터
// ========================================================
const WORLD_CITIES_CATALOG = [
  {
    country: '대한민국',
    flag: '🇰🇷',
    id: 'kr',
    cities: [
      { name: '서울', lat: 37.5665, lon: 126.9780 },
      { name: '부산', lat: 35.1796, lon: 129.0756 },
      { name: '제주', lat: 33.4996, lon: 126.5312 },
      { name: '서귀포', lat: 33.2541, lon: 126.5601 },
      { name: '인천', lat: 37.4563, lon: 126.7052 },
      { name: '대구', lat: 35.8714, lon: 128.6014 },
      { name: '대전', lat: 36.3504, lon: 127.3845 },
      { name: '광주', lat: 35.1595, lon: 126.8526 },
      { name: '울산', lat: 35.5384, lon: 129.3114 },
      { name: '세종', lat: 36.4800, lon: 127.2890 },
      { name: '수원', lat: 37.2636, lon: 127.0286 },
      { name: '성남', lat: 37.4200, lon: 127.1265 },
      { name: '고양', lat: 37.6584, lon: 126.8320 },
      { name: '용인', lat: 37.2411, lon: 127.1776 },
      { name: '춘천', lat: 37.8813, lon: 127.7298 },
      { name: '강릉', lat: 37.7519, lon: 128.8761 },
      { name: '원주', lat: 37.3422, lon: 127.9202 },
      { name: '청주', lat: 36.6424, lon: 127.4890 },
      { name: '천안', lat: 36.8151, lon: 127.1139 },
      { name: '전주', lat: 35.8242, lon: 127.1480 },
      { name: '군산', lat: 35.9676, lon: 126.7366 },
      { name: '여수', lat: 34.7604, lon: 127.6622 },
      { name: '순천', lat: 34.9506, lon: 127.4872 },
      { name: '포항', lat: 36.0190, lon: 129.3435 },
      { name: '창원', lat: 35.2280, lon: 128.6811 }
    ]
  },
  {
    country: '일본',
    flag: '🇯🇵',
    id: 'jp',
    cities: [
      { name: '도쿄', lat: 35.6762, lon: 139.6503 },
      { name: '오사카', lat: 34.6937, lon: 135.5023 },
      { name: '후쿠오카', lat: 33.5904, lon: 130.4017 },
      { name: '삿포로', lat: 43.0618, lon: 141.3545 },
      { name: '교토', lat: 35.0116, lon: 135.7681 },
      { name: '나고야', lat: 35.1815, lon: 136.9066 },
      { name: '오키나와(나하)', lat: 26.2124, lon: 127.6809 }
    ]
  },
  {
    country: '미국',
    flag: '🇺🇸',
    id: 'us',
    cities: [
      { name: '뉴욕', lat: 40.7128, lon: -74.0060 },
      { name: '로스앤젤레스', lat: 34.0522, lon: -118.2437 },
      { name: '샌프란시스코', lat: 37.7749, lon: -122.4194 },
      { name: '하와이(호놀룰루)', lat: 21.3069, lon: -157.8583 },
      { name: '시애틀', lat: 47.6062, lon: -122.3321 },
      { name: '시카고', lat: 41.8781, lon: -87.6298 },
      { name: '라스베이거스', lat: 36.1699, lon: -115.1398 },
      { name: '워싱턴 DC', lat: 38.9072, lon: -77.0369 },
      { name: '보스턴', lat: 42.3601, lon: -71.0589 }
    ]
  },
  {
    country: '영국 & 프랑스',
    flag: '🇬🇧🇫🇷',
    id: 'gb',
    cities: [
      { name: '런던', lat: 51.5074, lon: -0.1278 },
      { name: '맨체스터', lat: 53.4808, lon: -2.2426 },
      { name: '에든버러', lat: 55.9533, lon: -3.1883 },
      { name: '파리', lat: 48.8566, lon: 2.3522 },
      { name: '니스', lat: 43.7102, lon: 7.2620 },
      { name: '리옹', lat: 45.7640, lon: 4.8357 }
    ]
  },
  {
    country: '유럽 기타 (독일/이탈리아/스페인/스위스)',
    flag: '🇪🇺',
    id: 'etc',
    cities: [
      { name: '로마', lat: 41.9028, lon: 12.4964 },
      { name: '밀라노', lat: 45.4642, lon: 9.1900 },
      { name: '베네치아', lat: 45.4408, lon: 12.3155 },
      { name: '바르셀로나', lat: 41.3879, lon: 2.1699 },
      { name: '마드리드', lat: 40.4168, lon: -3.7038 },
      { name: '베를린', lat: 52.5200, lon: 13.4050 },
      { name: '뮌헨', lat: 48.1351, lon: 11.5820 },
      { name: '프랑크푸르트', lat: 50.1109, lon: 8.6821 },
      { name: '취리히', lat: 47.3769, lon: 8.5417 },
      { name: '프라하', lat: 50.0755, lon: 14.4378 },
      { name: '비엔나', lat: 48.2082, lon: 16.3738 }
    ]
  },
  {
    country: '아시아 & 대양주 (동남아/대만/호주 등)',
    flag: '🌏',
    id: 'etc',
    cities: [
      { name: '방콕', lat: 13.7563, lon: 100.5018 },
      { name: '다낭', lat: 16.0544, lon: 108.2022 },
      { name: '하노이', lat: 21.0285, lon: 105.8542 },
      { name: '호치민', lat: 10.8231, lon: 106.6297 },
      { name: '싱가포르', lat: 1.3521, lon: 103.8198 },
      { name: '타이베이', lat: 25.0330, lon: 121.5654 },
      { name: '발리(덴파사르)', lat: -8.6705, lon: 115.2126 },
      { name: '세부', lat: 10.3157, lon: 123.8854 },
      { name: '시드니', lat: -33.8688, lon: 151.2093 },
      { name: '멜버른', lat: -37.8136, lon: 144.9631 },
      { name: '괌', lat: 13.4443, lon: 144.7937 }
    ]
  }
];

// ========================================================
// 대한민국 인터랙티브 날씨 지도 거점 도시 목록 & 좌표 (%)
// ========================================================
const KOREA_MAP_CITIES = [
  { name: '춘천', lat: 37.8813, lon: 127.7298, x: 52, y: 16 },
  { name: '서울', lat: 37.5665, lon: 126.9780, x: 34, y: 20 },
  { name: '인천', lat: 37.4563, lon: 126.7052, x: 22, y: 22 },
  { name: '강릉', lat: 37.7519, lon: 128.8761, x: 74, y: 19 },
  { name: '울릉/독도', lat: 37.4842, lon: 130.9057, x: 89, y: 24 },
  { name: '수원', lat: 37.2636, lon: 127.0286, x: 35, y: 27 },
  { name: '청주', lat: 36.6424, lon: 127.4890, x: 45, y: 35 },
  { name: '안동', lat: 36.5684, lon: 128.7294, x: 66, y: 36 },
  { name: '대전', lat: 36.3504, lon: 127.3845, x: 39, y: 42 },
  { name: '포항', lat: 36.0190, lon: 129.3435, x: 81, y: 47 },
  { name: '대구', lat: 35.8714, lon: 128.6014, x: 65, y: 49 },
  { name: '전주', lat: 35.8242, lon: 127.1480, x: 34, y: 51 },
  { name: '울산', lat: 35.5384, lon: 129.3114, x: 82, y: 57 },
  { name: '창원', lat: 35.2280, lon: 128.6811, x: 63, y: 62 },
  { name: '부산', lat: 35.1796, lon: 129.0756, x: 76, y: 64 },
  { name: '광주', lat: 35.1595, lon: 126.8526, x: 28, y: 63 },
  { name: '여수', lat: 34.7604, lon: 127.6622, x: 45, y: 71 },
  { name: '목포', lat: 34.8118, lon: 126.3922, x: 19, y: 70 },
  { name: '제주', lat: 33.4996, lon: 126.5312, x: 32, y: 90 }
];

let koreaMapWeatherData = {}; // 지도 거점 날씨 캐시

// DOM 요소 캐싱
const DOM = {
  wallpaperBg: document.getElementById('wallpaper-bg'),
  searchInput: document.getElementById('search-input'),
  searchForm: document.getElementById('search-form'),
  searchResults: document.getElementById('search-results'),
  clearSearchBtn: document.getElementById('clear-search-btn'),
  geoBtn: document.getElementById('geo-btn'),
  unitToggleBtn: document.getElementById('unit-toggle-btn'),
  unitDisplay: document.getElementById('unit-display'),
  mapMarkersLayer: document.getElementById('map-markers-layer'),
  
  // 현재 날씨 UI
  currentCity: document.getElementById('current-city'),
  currentCountry: document.getElementById('current-country'),
  updateTime: document.getElementById('update-time'),
  mainWeatherIcon: document.getElementById('main-weather-icon'),
  weatherDesc: document.getElementById('weather-desc'),
  currentTemp: document.getElementById('current-temp'),
  tempMin: document.getElementById('temp-min'),
  tempMax: document.getElementById('temp-max'),
  apparentTemp: document.getElementById('apparent-temp'),
  
  // 세부 지표 UI
  humidityVal: document.getElementById('humidity-val'),
  windVal: document.getElementById('wind-val'),
  precipVal: document.getElementById('precip-val'),
  uvVal: document.getElementById('uv-val'),
  pressureVal: document.getElementById('pressure-val'),
  sunTimesVal: document.getElementById('sun-times-val'),
  
  // 예보 UI
  hourlyForecast: document.getElementById('hourly-forecast'),
  dailyForecast: document.getElementById('daily-forecast'),
  
  // 토스트
  toast: document.getElementById('toast'),
  toastMessage: document.getElementById('toast-message'),

  // 도시 목록 모달 UI
  cityCatalogBtn: document.getElementById('city-catalog-btn'),
  cityModalOverlay: document.getElementById('city-modal-overlay'),
  closeModalBtn: document.getElementById('close-modal-btn'),
  modalCatalogContent: document.getElementById('modal-catalog-content')
};

// ========================================================
// 유틸리티 함수
// ========================================================

/**
 * 온도를 현재 선택된 단위(C / F)에 맞게 포맷팅합니다.
 * @param {number} celsius - 섭씨 온도
 * @returns {string} 변환된 온도 문자열 (정수)
 */
function formatTemp(celsius) {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--';
  if (state.unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32).toString();
  }
  return Math.round(celsius).toString();
}

/**
 * ISO 시간 문자열에서 시:분 형식을 추출합니다.
 * @param {string} isoString - e.g. "2026-11-06T06:45"
 * @returns {string} e.g. "06:45"
 */
function formatTime(isoString) {
  if (!isoString) return '--:--';
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * 요일 이름을 반환합니다.
 * @param {string} dateString - e.g. "2026-11-06"
 * @param {number} index - 0이면 오늘
 * @returns {string} e.g. "오늘", "토", "일"...
 */
function formatDayName(dateString, index) {
  if (index === 0) return '오늘';
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const date = new Date(dateString);
  return `${days[date.getDay()]}요일`;
}

/**
 * 에러 토스트 메시지를 표시합니다.
 * @param {string} message 
 */
function showToast(message) {
  DOM.toastMessage.textContent = message;
  DOM.toast.classList.remove('hidden');
  if (window.lucide) lucide.createIcons();

  setTimeout(() => {
    DOM.toast.classList.add('hidden');
  }, 3500);
}

// ========================================================
// API 통신 함수 (Open-Meteo & BigDataCloud Reverse Geo)
// ========================================================

/**
 * Open-Meteo API를 호출하여 날씨 데이터를 가져옵니다.
 * (무료, API Key 불필요)
 */
async function fetchWeatherData(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m` +
    `&hourly=temperature_2m,weather_code,precipitation_probability` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max` +
    `&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`날씨 정보를 불러오지 못했습니다. (상태 코드: ${response.status})`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('날씨 데이터 조회 오류:', error);
    showToast('날씨 정보를 불러오는 중 문제가 발생했습니다.');
    return null;
  }
}

/**
 * 도시명 검색: 사전 매칭 -> OpenStreetMap Nominatim -> Open-Meteo Geocoding 순으로 검색
 */
async function searchCity(query) {
  if (!query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();

  // 1. 내장 사전에서 한글명 및 영문명 부분 일치 검색
  const dictionaryMatches = POPULAR_CITIES.filter(city => 
    city.name.toLowerCase().includes(q) || 
    city.en.toLowerCase().includes(q)
  ).map(item => ({
    name: item.name,
    country: item.country,
    latitude: item.lat,
    longitude: item.lon,
    admin1: ''
  }));

  // 사전에서 완전 일치 또는 2개 이상의 매칭이 있으면 우선 반환
  if (dictionaryMatches.length >= 2 || (dictionaryMatches.length === 1 && dictionaryMatches[0].name.toLowerCase() === q)) {
    return dictionaryMatches.slice(0, 5);
  }

  // 2. OpenStreetMap Nominatim API (한국어 지명 및 전세계 행정구역 지원)
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&accept-language=ko`;
    const res = await fetch(nominatimUrl, {
      headers: { 'Accept-Language': 'ko' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        const nominatimResults = data.map(item => {
          const parts = (item.display_name || '').split(',').map(p => p.trim());
          const shortName = parts[0] || item.name;
          const countryPart = parts[parts.length - 1] || '';
          return {
            name: shortName,
            country: countryPart,
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon),
            admin1: parts.length > 2 ? parts[parts.length - 2] : ''
          };
        });

        // 사전 매칭 결과와 합치고 중복 제거
        const combined = [...dictionaryMatches];
        nominatimResults.forEach(nr => {
          if (!combined.some(c => Math.abs(c.latitude - nr.latitude) < 0.05 && Math.abs(c.longitude - nr.longitude) < 0.05)) {
            combined.push(nr);
          }
        });
        return combined.slice(0, 5);
      }
    }
  } catch (nomErr) {
    console.warn('Nominatim 검색 중 예외:', nomErr);
  }

  // 3. Open-Meteo Geocoding API (영문명 기반 fallback)
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=ko&format=json`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return [...dictionaryMatches, ...data.results].slice(0, 5);
      }
    }
  } catch (error) {
    console.error('Open-Meteo 검색 오류:', error);
  }

  return dictionaryMatches;
}

/**
 * 위도/경도를 기반으로 지명을 역조회합니다. (무료 오픈 API)
 */
async function reverseGeocode(lat, lon) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=ko`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const city = data.city || data.locality || data.principalSubdivision || '현재 위치';
      const country = data.countryName || '대한민국';
      return { city, country };
    }
  } catch (e) {
    console.warn('역지오코딩 실패, 기본 명칭을 사용합니다.', e);
  }
  return { city: '내 위치', country: '대한민국' };
}

// ========================================================
// UI 렌더링 함수
// ========================================================

/**
 * 현재 날씨 섹션을 업데이트합니다.
 */
function renderCurrentWeather(data) {
  const current = data.current;
  const daily = data.daily;
  const isDay = current.is_day === 1;
  const weatherInfo = getWeatherInfo(current.weather_code, isDay);

  // 실사 배경화면 이미지 적용
  if (DOM.wallpaperBg && weatherInfo.wallpaper) {
    DOM.wallpaperBg.style.backgroundImage = `url("${weatherInfo.wallpaper}")`;
  }

  // 날씨 라이브 애니메이션(비, 눈, 햇살, 별빛, 번개 등) 모드 적용
  if (window.weatherEffects && weatherInfo.effectMode) {
    window.weatherEffects.setMode(weatherInfo.effectMode);
  }

  // 지역 정보
  DOM.currentCity.textContent = state.currentLocation.name;
  DOM.currentCountry.textContent = state.currentLocation.country;

  // 업데이트 시간
  const now = new Date();
  DOM.updateTime.textContent = `업데이트 ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  // 날씨 아이콘 및 상태 텍스트
  DOM.weatherDesc.textContent = weatherInfo.label;
  
  // Lucide 아이콘 변경
  const iconWrapper = document.getElementById('weather-icon-wrapper');
  iconWrapper.innerHTML = `<i data-lucide="${weatherInfo.icon}" class="main-weather-icon"></i>`;

  // 기온
  DOM.currentTemp.textContent = formatTemp(current.temperature_2m);
  DOM.apparentTemp.textContent = `${formatTemp(current.apparent_temperature)}°`;

  // 금일 최고/최저 기온
  if (daily && daily.temperature_2m_min && daily.temperature_2m_max) {
    DOM.tempMin.textContent = `${formatTemp(daily.temperature_2m_min[0])}°`;
    DOM.tempMax.textContent = `${formatTemp(daily.temperature_2m_max[0])}°`;
  }

  // 지표들
  DOM.humidityVal.textContent = `${current.relative_humidity_2m}%`;
  DOM.windVal.textContent = `${current.wind_speed_10m} m/s`;
  
  // 강수 확률 (hourly 중 현재 시간의 강수확률 매핑)
  const currentHourIndex = new Date().getHours();
  const currentPrecip = (data.hourly && data.hourly.precipitation_probability) 
    ? data.hourly.precipitation_probability[currentHourIndex] || current.precipitation || 0
    : 0;
  DOM.precipVal.textContent = `${currentPrecip}%`;

  // UV 지수
  const uvMax = daily && daily.uv_index_max ? daily.uv_index_max[0] : '-';
  let uvText = uvMax;
  if (typeof uvMax === 'number') {
    if (uvMax <= 2) uvText = `${uvMax} (낮음)`;
    else if (uvMax <= 5) uvText = `${uvMax} (보통)`;
    else if (uvMax <= 7) uvText = `${uvMax} (높음)`;
    else uvText = `${uvMax} (매우높음)`;
  }
  DOM.uvVal.textContent = uvText;

  // 기압
  DOM.pressureVal.textContent = `${Math.round(current.surface_pressure)} hPa`;

  // 일출 / 일몰
  if (daily && daily.sunrise && daily.sunset) {
    const sunrise = formatTime(daily.sunrise[0]);
    const sunset = formatTime(daily.sunset[0]);
    DOM.sunTimesVal.textContent = `${sunrise} / ${sunset}`;
  }
}

/**
 * 24시간 시간별 예보를 간편하고 단순하게 렌더링합니다. (24개 시간 전체 한눈에 보기)
 */
function renderHourlyForecast(data) {
  const hourly = data.hourly;
  if (!hourly || !hourly.time) return;

  const currentHour = new Date().getHours();
  let html = '';

  // 현재 시간부터 다음 24시간 동안의 데이터 표시 (스크롤 없이 24시간 전체 일렬 배치)
  for (let i = currentHour; i < currentHour + 24 && i < hourly.time.length; i++) {
    const timeStr = hourly.time[i];
    const isNow = i === currentHour;
    const hourNum = new Date(timeStr).getHours();
    
    // 시간 라벨: 지금은 '지금', 자정은 '0시', 나머지는 '숫자' (심플하게)
    let hourLabel = `${hourNum}`;
    if (isNow) {
      hourLabel = '지금';
    } else if (hourNum === 0) {
      hourLabel = '0시';
    }

    const temp = formatTemp(hourly.temperature_2m[i]);
    const code = hourly.weather_code[i];
    const precip = hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0;
    
    // 해당 시각의 주/야 판정 (06시~19시 낮)
    const isDayHour = hourNum >= 6 && hourNum < 19;
    const info = getWeatherInfo(code, isDayHour);

    // 강수확률은 0%일 때는 표시하지 않고, 10% 이상일 때만 깔끔하게 노출
    const precipHtml = precip > 0 
      ? `<span class="col-precip" title="강수확률 ${precip}%">${precip}%</span>`
      : `<span class="col-precip empty"></span>`;

    html += `
      <div class="hourly-col ${isNow ? 'now' : ''} ${hourNum === 0 ? 'midnight' : ''}" 
           title="${hourNum}시: ${info.label}, 기온 ${temp}°, 강수확률 ${precip}%">
        <span class="col-time">${hourLabel}</span>
        <div class="col-icon">
          <i data-lucide="${info.icon}"></i>
        </div>
        <span class="col-temp">${temp}°</span>
        ${precipHtml}
      </div>
    `;
  }

  DOM.hourlyForecast.innerHTML = html;
}

/**
 * 7일간의 주간 예보를 렌더링합니다.
 */
function renderDailyForecast(data) {
  const daily = data.daily;
  if (!daily || !daily.time) return;

  let html = '';
  
  // 전체 주간 최소/최대값 계산 (바 게이지 정규화용)
  const allMins = daily.temperature_2m_min.slice(0, 7);
  const allMaxs = daily.temperature_2m_max.slice(0, 7);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const range = globalMax - globalMin || 1;

  for (let i = 0; i < 7 && i < daily.time.length; i++) {
    const dayLabel = formatDayName(daily.time[i], i);
    const code = daily.weather_code[i];
    const min = daily.temperature_2m_min[i];
    const max = daily.temperature_2m_max[i];
    const info = getWeatherInfo(code, true);

    // 바 게이지 위치 계산 (%)
    const leftPercent = Math.max(0, ((min - globalMin) / range) * 100);
    const widthPercent = Math.max(8, (((max - min) / range) * 100));

    html += `
      <div class="daily-item">
        <span class="daily-day ${i === 0 ? 'today' : ''}">${dayLabel}</span>
        <div class="daily-condition">
          <i data-lucide="${info.icon}"></i>
          <span class="daily-desc">${info.label}</span>
        </div>
        <div class="daily-bar-container">
          <span class="temp-min-val">${formatTemp(min)}°</span>
          <div class="daily-temp-bar">
            <div class="daily-temp-fill" style="left: ${leftPercent}%; width: ${widthPercent}%;"></div>
          </div>
          <span class="temp-max-val">${formatTemp(max)}°</span>
        </div>
      </div>
    `;
  }

  DOM.dailyForecast.innerHTML = html;
}

/**
 * 날씨 데이터 전체 렌더링 및 아이콘 재생성
 */
function renderAll() {
  if (!state.weatherData) return;
  renderCurrentWeather(state.weatherData);
  renderHourlyForecast(state.weatherData);
  renderDailyForecast(state.weatherData);

  // Lucide Icons SVG 동적 치환
  if (window.lucide) {
    lucide.createIcons();
  }
}

/**
 * 특정 위도/경도로 날씨를 로드하고 UI에 반영합니다.
 */
async function loadWeather(lat, lon, name = null, country = null) {
  if (name) state.currentLocation.name = name;
  if (country) state.currentLocation.country = country;
  state.currentLocation.lat = lat;
  state.currentLocation.lon = lon;

  const data = await fetchWeatherData(lat, lon);
  if (data) {
    state.weatherData = data;
    renderAll();
    updateActiveMapMarker(state.currentLocation.name);
  }
}

// ========================================================
// 대한민국 인터랙티브 날씨 지도 로직
// ========================================================

/**
 * 대한민국 지도 위의 거점 도시 마커들을 렌더링합니다.
 */
function renderKoreaMapMarkers() {
  if (!DOM.mapMarkersLayer) return;

  const html = KOREA_MAP_CITIES.map(city => {
    const isActive = state.currentLocation.name === city.name;
    const weather = koreaMapWeatherData[city.name];
    const tempText = weather ? `${formatTemp(weather.temp)}°` : '--°';
    const weatherInfo = weather ? getWeatherInfo(weather.code, 1) : { icon: 'sun', label: '맑음' };

    return `
      <button type="button" 
              class="map-marker ${isActive ? 'active' : ''}" 
              style="left: ${city.x}%; top: ${city.y}%;" 
              data-name="${city.name}" 
              data-lat="${city.lat}" 
              data-lon="${city.lon}"
              title="${city.name} (${tempText}, ${weatherInfo.label}) 클릭하여 날씨 보기">
        <span class="marker-name">${city.name}</span>
        <div class="marker-icon"><i data-lucide="${weatherInfo.icon}"></i></div>
        <span class="marker-temp">${tempText}</span>
      </button>
    `;
  }).join('');

  DOM.mapMarkersLayer.innerHTML = html;
  if (window.lucide) {
    lucide.createIcons();
  }
}

/**
 * 지도 위 활성화된 도시 마커 하이라이트 동기화
 */
function updateActiveMapMarker(cityName) {
  if (!DOM.mapMarkersLayer) return;
  document.querySelectorAll('.map-marker').forEach(marker => {
    marker.classList.toggle('active', marker.dataset.name === cityName);
  });
}

/**
 * 전국 19개 거점 도시의 실시간 날씨를 한 번에 일괄 조회하여 지도에 반영
 */
async function fetchKoreaMapWeatherData() {
  const lats = KOREA_MAP_CITIES.map(c => c.lat).join(',');
  const lons = KOREA_MAP_CITIES.map(c => c.lon).join(',');
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,weather_code`;

  try {
    const res = await fetch(url);
    if (!res.ok) return;
    const dataList = await res.json();
    
    if (Array.isArray(dataList)) {
      dataList.forEach((data, index) => {
        const city = KOREA_MAP_CITIES[index];
        if (city && data.current) {
          koreaMapWeatherData[city.name] = {
            temp: data.current.temperature_2m,
            code: data.current.weather_code
          };
        }
      });
      renderKoreaMapMarkers();
    }
  } catch (err) {
    console.warn('전국 지도 날씨 일괄 로드 실패:', err);
  }
}

// 지도 마커 클릭 이벤트 (클릭 시 해당 도시의 날씨 및 실사 배경 로드)
if (DOM.mapMarkersLayer) {
  DOM.mapMarkersLayer.addEventListener('click', (e) => {
    const marker = e.target.closest('.map-marker');
    if (!marker) return;

    const { name, lat, lon } = marker.dataset;
    updateActiveMapMarker(name);
    loadWeather(parseFloat(lat), parseFloat(lon), name, '대한민국');
  });
}

// ========================================================
// 검색 & 인터랙션 이벤트 핸들러
// ========================================================

/**
 * 도시 검색 입력 디바운스 처리
 */
DOM.searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim();

  if (query.length > 0) {
    DOM.clearSearchBtn.classList.remove('hidden');
  } else {
    DOM.clearSearchBtn.classList.add('hidden');
    DOM.searchResults.classList.add('hidden');
    return;
  }

  clearTimeout(state.searchDebounceTimer);
  state.searchDebounceTimer = setTimeout(async () => {
    const results = await searchCity(query);
    displaySearchResults(results);
  }, 280);
});

/**
 * 검색 결과 드롭다운 표시
 */
function displaySearchResults(results) {
  if (!results || results.length === 0) {
    DOM.searchResults.innerHTML = `<li class="search-result-item" style="cursor: default; color: rgba(255,255,255,0.6);">검색 결과가 없습니다.</li>`;
    DOM.searchResults.classList.remove('hidden');
    return;
  }

  const items = results.map(item => {
    const cityName = item.name;
    const admin = item.admin1 ? `${item.admin1}, ` : '';
    const country = item.country || '';
    const fullLoc = `${admin}${country}`;

    return `
      <li class="search-result-item" data-lat="${item.latitude}" data-lon="${item.longitude}" data-name="${cityName}" data-country="${country}">
        <span class="item-main">${cityName}</span>
        <span class="item-sub">${fullLoc}</span>
      </li>
    `;
  }).join('');

  DOM.searchResults.innerHTML = items;
  DOM.searchResults.classList.remove('hidden');
}

/**
 * 검색 결과 항목 클릭 시 이동
 */
DOM.searchResults.addEventListener('click', (e) => {
  const item = e.target.closest('.search-result-item');
  if (!item || !item.dataset.lat) return;

  const { lat, lon, name, country } = item.dataset;
  selectLocation(parseFloat(lat), parseFloat(lon), name, country);
});

/**
 * 검색 폼 제출 (엔터 키)
 */
DOM.searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = DOM.searchInput.value.trim();
  if (!query) return;

  const results = await searchCity(query);
  if (results && results.length > 0) {
    const first = results[0];
    selectLocation(first.latitude, first.longitude, first.name, first.country || '');
  } else {
    showToast(`'${query}'에 대한 검색 결과를 찾을 수 없습니다.`);
  }
});

function selectLocation(lat, lon, name, country) {
  DOM.searchInput.value = '';
  DOM.clearSearchBtn.classList.add('hidden');
  DOM.searchResults.classList.add('hidden');

  // 활성 칩 해제
  document.querySelectorAll('.city-chip').forEach(c => c.classList.remove('active'));

  loadWeather(lat, lon, name, country);
}

/**
 * 검색어 지우기 버튼
 */
DOM.clearSearchBtn.addEventListener('click', () => {
  DOM.searchInput.value = '';
  DOM.clearSearchBtn.classList.add('hidden');
  DOM.searchResults.classList.add('hidden');
  DOM.searchInput.focus();
});

/**
 * 외부 클릭 시 검색 드롭다운 닫기
 */
document.addEventListener('click', (e) => {
  if (!DOM.searchForm.contains(e.target) && !DOM.searchResults.contains(e.target)) {
    DOM.searchResults.classList.add('hidden');
  }
});

/**
 * 온도 단위 변경 토글 (°C <-> °F)
 */
DOM.unitToggleBtn.addEventListener('click', () => {
  state.unit = state.unit === 'C' ? 'F' : 'C';
  localStorage.setItem('weather_unit', state.unit);
  DOM.unitDisplay.textContent = `°${state.unit}`;
  renderAll();
  renderKoreaMapMarkers();
});

/**
 * 내 위치 (HTML5 Geolocation) 버튼 클릭
 */
DOM.geoBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    showToast('이 브라우저는 위치 정보 조회를 지원하지 않습니다.');
    return;
  }

  DOM.geoBtn.classList.add('loading');

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      DOM.geoBtn.classList.remove('loading');
      const { latitude, longitude } = position.coords;
      
      // 역지오코딩으로 지명 조회
      const geoInfo = await reverseGeocode(latitude, longitude);
      
      // 빠른 도시 칩 선택 해제
      document.querySelectorAll('.city-chip').forEach(c => c.classList.remove('active'));

      loadWeather(latitude, longitude, geoInfo.city, geoInfo.country);
    },
    (error) => {
      DOM.geoBtn.classList.remove('loading');
      console.warn('위치 권한 오류:', error);
      let errMsg = '위치 정보를 가져올 수 없습니다.';
      if (error.code === error.PERMISSION_DENIED) {
        errMsg = '위치 정보 접근 권한이 거부되었습니다.';
      }
      showToast(errMsg);
    },
    { timeout: 10000, enableHighAccuracy: true }
  );
});

// ========================================================
// 나라별 도시 전체 카탈로그 모달 로직
// ========================================================

/**
 * 나라별 도시 전체 카탈로그 모달 렌더링
 */
function renderWorldCitiesCatalog() {
  if (!DOM.modalCatalogContent) return;

  const html = WORLD_CITIES_CATALOG.map(section => {
    const cityButtons = section.cities.map(c => `
      <button class="catalog-city-chip" 
              data-name="${c.name}" 
              data-country="${section.country}"
              data-country-id="${section.id}"
              data-lat="${c.lat}" 
              data-lon="${c.lon}">
        ${c.name}
      </button>
    `).join('');

    return `
      <div class="country-catalog-card">
        <div class="country-card-header">
          <div class="country-card-title">
            <span class="country-flag">${section.flag}</span>
            <span>${section.country}</span>
          </div>
          <span class="city-count-badge">${section.cities.length}개 도시</span>
        </div>
        <div class="country-cities-grid">
          ${cityButtons}
        </div>
      </div>
    `;
  }).join('');

  DOM.modalCatalogContent.innerHTML = html;
}

/**
 * 모달 열기
 */
function openCitiesModal() {
  renderWorldCitiesCatalog();
  DOM.cityModalOverlay.classList.remove('hidden');
  if (window.lucide) {
    lucide.createIcons();
  }
}

/**
 * 모달 닫기
 */
function closeCitiesModal() {
  DOM.cityModalOverlay.classList.add('hidden');
}

// 모달 트리거 및 닫기 이벤트 리스너 바인딩
if (DOM.cityCatalogBtn) {
  DOM.cityCatalogBtn.addEventListener('click', openCitiesModal);
}
if (DOM.closeModalBtn) {
  DOM.closeModalBtn.addEventListener('click', closeCitiesModal);
}
if (DOM.cityModalOverlay) {
  DOM.cityModalOverlay.addEventListener('click', (e) => {
    if (e.target === DOM.cityModalOverlay) closeCitiesModal();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && DOM.cityModalOverlay && !DOM.cityModalOverlay.classList.contains('hidden')) {
    closeCitiesModal();
  }
});

// 모달 내 도시 칩 클릭 시 해당 도시 날씨로 즉시 이동
if (DOM.modalCatalogContent) {
  DOM.modalCatalogContent.addEventListener('click', (e) => {
    const chip = e.target.closest('.catalog-city-chip');
    if (!chip) return;

    const { lat, lon, name, country } = chip.dataset;
    closeCitiesModal();
    loadWeather(parseFloat(lat), parseFloat(lon), name, country);
  });
}

// ========================================================
// 초기화 실행
// ========================================================
async function initApp() {
  DOM.unitDisplay.textContent = `°${state.unit}`;
  
  // Lucide 초기 아이콘 렌더링
  if (window.lucide) {
    lucide.createIcons();
  }

  // 대한민국 지도 거점 마커 초기 렌더링 & 전국 날씨 일괄 로드
  renderKoreaMapMarkers();
  fetchKoreaMapWeatherData();

  // 기본 도시(서울) 데이터 로드
  await loadWeather(
    state.currentLocation.lat,
    state.currentLocation.lon,
    state.currentLocation.name,
    state.currentLocation.country
  );
}

// DOM 준비 완료 시 시작
window.addEventListener('DOMContentLoaded', initApp);
