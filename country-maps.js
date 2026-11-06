/**
 * CountryMaps - 다국가 인터랙티브 벡터 지도 및 거점 도시 데이터
 * 한국(KR), 일본(JP), 미국(US), 유럽(EU), 아시아/대양주(ASIA)
 */

const MAP_REGIONS = {
  kr: {
    id: 'kr',
    name: '대한민국',
    flag: '🇰🇷',
    viewBox: '0 0 500 620',
    svgPath: `
      <!-- 한반도 남한 본토 지형 패스 -->
      <path class="korea-land map-land-shape" d="M 125,50 
        C 165,48 200,52 235,58 
        C 265,65 305,75 340,95 
        C 365,110 395,145 405,185 
        C 410,215 412,250 415,290 
        C 418,330 422,350 435,370 
        C 442,382 445,395 435,410 
        C 425,425 410,430 400,445 
        C 390,460 380,480 365,490 
        C 350,500 330,505 315,500 
        C 300,495 285,505 270,510 
        C 255,515 240,510 230,500 
        C 220,490 205,505 190,505 
        C 175,505 160,490 150,470 
        C 140,450 145,435 155,420 
        C 165,405 168,390 160,375 
        C 150,360 135,365 125,350 
        C 115,335 120,315 130,300 
        C 140,285 135,270 120,260 
        C 105,250 95,235 105,215 
        C 115,195 130,190 135,175 
        C 140,160 130,140 120,125 
        C 110,110 108,85 115,65 Z" />
      <path class="korea-border map-border-line" d="M 170,120 Q 230,135 280,115" />
      <path class="korea-border map-border-line" d="M 280,115 Q 310,190 320,270" />
      <path class="korea-border map-border-line" d="M 140,230 Q 220,240 270,225" />
      <path class="korea-border map-border-line" d="M 130,315 Q 230,325 320,270" />
      <path class="korea-border map-border-line" d="M 160,380 Q 250,390 330,380" />
      <path class="korea-border map-border-line" d="M 260,385 Q 285,440 295,505" />
      <ellipse class="korea-island map-land-shape" cx="160" cy="565" rx="38" ry="20" />
      <circle class="korea-island map-land-shape" cx="445" cy="155" r="8" />
      <circle class="korea-island map-land-shape" cx="475" cy="165" r="5" />
    `,
    cities: [
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
    ]
  },

  jp: {
    id: 'jp',
    name: '일본',
    flag: '🇯🇵',
    viewBox: '0 0 500 580',
    svgPath: `
      <!-- 홋카이도 섬 -->
      <path class="map-land-shape" d="M 330,60 
        C 370,45 420,65 440,90 
        C 455,115 440,140 405,150 
        C 380,160 350,175 330,160 
        C 310,145 320,120 305,100 
        C 300,80 315,65 330,60 Z" />
      
      <!-- 혼슈 본토 (활 모양의 거대한 본섬) -->
      <path class="map-land-shape" d="M 335,185 
        C 365,220 380,260 365,300 
        C 350,335 340,360 320,380 
        C 290,400 240,405 200,415 
        C 160,425 140,430 120,410 
        C 140,395 180,385 220,370 
        C 260,355 285,330 300,290 
        C 310,250 315,210 335,185 Z" />

      <!-- 시코쿠 섬 -->
      <path class="map-land-shape" d="M 160,430 
        C 195,420 220,435 210,460 
        C 185,475 160,465 145,450 
        C 145,435 150,430 160,430 Z" />

      <!-- 큐슈 섬 -->
      <path class="map-land-shape" d="M 90,420 
        C 115,415 130,440 125,470 
        C 115,505 90,520 75,490 
        C 65,460 75,430 90,420 Z" />

      <!-- 오키나와 군도 -->
      <ellipse class="map-land-shape" cx="75" cy="550" rx="20" ry="7" transform="rotate(-30 75 550)" />
      <circle class="map-land-shape" cx="50" cy="565" r="4" />
    `,
    cities: [
      { name: '삿포로', lat: 43.0618, lon: 141.3545, x: 74, y: 19 },
      { name: '센다이', lat: 38.2682, lon: 140.8694, x: 72, y: 44 },
      { name: '도쿄', lat: 35.6762, lon: 139.6503, x: 67, y: 57 },
      { name: '나고야', lat: 35.1815, lon: 136.9066, x: 53, y: 62 },
      { name: '교토', lat: 35.0116, lon: 135.7681, x: 44, y: 60 },
      { name: '오사카', lat: 34.6937, lon: 135.5023, x: 43, y: 68 },
      { name: '히로시마', lat: 34.3853, lon: 132.4553, x: 31, y: 67 },
      { name: '후쿠오카', lat: 33.5904, lon: 130.4017, x: 19, y: 70 },
      { name: '오키나와(나하)', lat: 26.2124, lon: 127.6809, x: 16, y: 92 }
    ]
  },

  us: {
    id: 'us',
    name: '미국',
    flag: '🇺🇸',
    viewBox: '0 0 540 420',
    svgPath: `
      <!-- 미국 본토 (Lower 48) 실루엣 -->
      <path class="map-land-shape" d="M 60,70 
        C 120,65 180,68 250,70 
        C 320,72 380,65 420,80 
        C 460,95 490,90 510,110 
        C 495,140 480,180 470,210 
        C 460,240 465,280 450,320 
        C 440,340 420,330 405,290 
        C 370,295 340,310 300,325 
        C 260,340 230,345 220,305 
        C 180,300 140,305 100,285 
        C 80,265 75,230 65,190 
        C 55,150 45,110 60,70 Z" />

      <!-- 하와이 섬군 -->
      <circle class="map-land-shape" cx="100" cy="365" r="7" />
      <circle class="map-land-shape" cx="120" cy="372" r="5" />
      <circle class="map-land-shape" cx="138" cy="378" r="4" />
    `,
    cities: [
      { name: '시애틀', lat: 47.6062, lon: -122.3321, x: 16, y: 18 },
      { name: '샌프란시스코', lat: 37.7749, lon: -122.4194, x: 12, y: 44 },
      { name: '로스앤젤레스', lat: 34.0522, lon: -118.2437, x: 16, y: 58 },
      { name: '라스베이거스', lat: 36.1699, lon: -115.1398, x: 25, y: 52 },
      { name: '덴버', lat: 39.7392, lon: -104.9903, x: 41, y: 44 },
      { name: '댈러스', lat: 32.7767, lon: -96.7970, x: 50, y: 69 },
      { name: '시카고', lat: 41.8781, lon: -87.6298, x: 65, y: 35 },
      { name: '워싱턴 DC', lat: 38.9072, lon: -77.0369, x: 82, y: 42 },
      { name: '뉴욕', lat: 40.7128, lon: -74.0060, x: 88, y: 32 },
      { name: '보스턴', lat: 42.3601, lon: -71.0589, x: 92, y: 23 },
      { name: '마이애미', lat: 25.7617, lon: -80.1918, x: 84, y: 81 },
      { name: '하와이(호놀룰루)', lat: 21.3069, lon: -157.8583, x: 23, y: 88 }
    ]
  },

  eu: {
    id: 'eu',
    name: '유럽',
    flag: '🇪🇺',
    viewBox: '0 0 540 540',
    svgPath: `
      <!-- 영국 & 아일랜드 섬 -->
      <path class="map-land-shape" d="M 130,110 
        C 150,90 170,120 160,150 
        C 175,175 190,210 170,230 
        C 150,240 135,210 140,180 
        C 125,170 120,135 130,110 Z" />
      <ellipse class="map-land-shape" cx="105" cy="180" rx="18" ry="28" />

      <!-- 유럽 본토 (프랑스, 스페인, 이탈리아, 독일, 중유럽) -->
      <path class="map-land-shape" d="M 180,240 
        C 220,230 280,225 340,230 
        C 380,240 430,260 450,300 
        C 430,340 380,350 350,380 
        C 340,410 330,460 310,480 
        C 295,490 285,465 295,430 
        C 290,400 270,390 240,400 
        C 210,410 170,470 120,480 
        C 80,470 75,410 110,380 
        C 135,360 160,330 165,290 
        C 170,260 175,245 180,240 Z" />
    `,
    cities: [
      { name: '에든버러', lat: 55.9533, lon: -3.1883, x: 27, y: 22 },
      { name: '런던', lat: 51.5074, lon: -0.1278, x: 31, y: 39 },
      { name: '파리', lat: 48.8566, lon: 2.3522, x: 37, y: 52 },
      { name: '베를린', lat: 52.5200, lon: 13.4050, x: 61, y: 37 },
      { name: '프랑크푸르트', lat: 50.1109, lon: 8.6821, x: 51, y: 46 },
      { name: '뮌헨', lat: 48.1351, lon: 11.5820, x: 57, y: 54 },
      { name: '취리히', lat: 47.3769, lon: 8.5417, x: 49, y: 60 },
      { name: '비엔나', lat: 48.2082, lon: 16.3738, x: 72, y: 51 },
      { name: '프라하', lat: 50.0755, lon: 14.4378, x: 65, y: 46 },
      { name: '밀라노', lat: 45.4642, lon: 9.1900, x: 52, y: 67 },
      { name: '니스', lat: 43.7102, lon: 7.2620, x: 44, y: 70 },
      { name: '로마', lat: 41.9028, lon: 12.4964, x: 59, y: 79 },
      { name: '바르셀로나', lat: 41.3879, lon: 2.1699, x: 34, y: 76 },
      { name: '마드리드', lat: 40.4168, lon: -3.7038, x: 21, y: 78 }
    ]
  },

  asia: {
    id: 'asia',
    name: '아시아 & 대양주',
    flag: '🌏',
    viewBox: '0 0 520 540',
    svgPath: `
      <!-- 동아시아 및 동남아 본토 실루엣 -->
      <path class="map-land-shape" d="M 120,80 
        C 180,70 240,85 280,110 
        C 290,140 270,180 250,210 
        C 240,250 220,290 190,320 
        C 160,340 140,320 150,280 
        C 130,260 110,210 95,160 
        C 90,120 100,90 120,80 Z" />

      <!-- 말레이 & 인도네시아 열도 -->
      <ellipse class="map-land-shape" cx="170" cy="380" rx="35" ry="12" transform="rotate(-15 170 380)" />
      <ellipse class="map-land-shape" cx="240" cy="420" rx="40" ry="14" transform="rotate(5 240 420)" />

      <!-- 호주 대륙 -->
      <path class="map-land-shape" d="M 330,360 
        C 390,340 440,360 470,390 
        C 480,440 460,490 410,500 
        C 360,505 320,470 310,430 
        C 305,395 315,370 330,360 Z" />
      
      <!-- 대만 섬 -->
      <ellipse class="map-land-shape" cx="295" cy="245" rx="9" ry="16" transform="rotate(15 295 245)" />
    `,
    cities: [
      { name: '베이징', lat: 39.9042, lon: 116.4074, x: 38, y: 19 },
      { name: '상하이', lat: 31.2304, lon: 121.4737, x: 47, y: 31 },
      { name: '타이베이', lat: 25.0330, lon: 121.5654, x: 56, y: 44 },
      { name: '홍콩', lat: 22.3193, lon: 114.1694, x: 41, y: 45 },
      { name: '방콕', lat: 13.7563, lon: 100.5018, x: 26, y: 55 },
      { name: '다낭', lat: 16.0544, lon: 108.2022, x: 36, y: 56 },
      { name: '싱가포르', lat: 1.3521, lon: 103.8198, x: 31, y: 70 },
      { name: '발리(덴파사르)', lat: -8.6705, lon: 115.2126, x: 46, y: 78 },
      { name: '괌', lat: 13.4443, lon: 144.7937, x: 80, y: 55 },
      { name: '시드니', lat: -33.8688, lon: 151.2093, x: 84, y: 88 }
    ]
  }
};

/**
 * 도시명이 속한 국가/지역 ID ('kr', 'jp', 'us', 'eu', 'asia')를 판정합니다.
 * 한글 및 영문 지명, 국가명을 모두 정밀 지원합니다.
 */
function getRegionIdByCityName(cityName = '', countryName = '') {
  const q = String(cityName).toLowerCase().trim();
  const c = String(countryName).toLowerCase().trim();

  // 일본 도시
  if (['도쿄', 'tokyo', '오사카', 'osaka', '후쿠오카', 'fukuoka', '삿포로', 'sapporo', '교토', 'kyoto', '나고야', 'nagoya', '오키나와', 'okinawa', '센다이', 'sendai', '히로시마', 'hiroshima'].some(k => q.includes(k)) || c.includes('일본') || c.includes('japan')) {
    return 'jp';
  }

  // 미국 도시
  if (['뉴욕', 'new york', '로스앤젤레스', 'los angeles', 'la', '샌프란시스코', 'san francisco', '하와이', 'hawaii', '호놀룰루', 'honolulu', '시애틀', 'seattle', '시카고', 'chicago', '라스베이거스', 'las vegas', '워싱턴', 'washington', '보스턴', 'boston', '마이애미', 'miami', '댈러스', 'dallas', '덴버', 'denver'].some(k => q.includes(k)) || c.includes('미국') || c.includes('united states') || c.includes('usa')) {
    return 'us';
  }

  // 유럽 도시
  if (['런던', 'london', '에든버러', 'edinburgh', '맨체스터', 'manchester', '파리', 'paris', '니스', 'nice', '리옹', 'lyon', '베를린', 'berlin', '프랑크푸르트', 'frankfurt', '뮌헨', 'munich', '취리히', 'zurich', '비엔나', 'vienna', '빈', '프라하', 'prague', '밀라노', 'milan', '로마', 'rome', '베네치아', 'venice', '바르셀로나', 'barcelona', '마드리드', 'madrid'].some(k => q.includes(k)) || ['영국', '프랑스', '독일', '이탈리아', '스페인', '스위스', '오스트리아', '체코', 'uk', 'france', 'germany', 'italy', 'spain', 'europe'].some(k => c.includes(k))) {
    return 'eu';
  }

  // 아시아/대양주 도시
  if (['베이징', 'beijing', '상하이', 'shanghai', '홍콩', 'hong kong', '타이베이', 'taipei', '방콕', 'bangkok', '다낭', 'danang', '하노이', 'hanoi', '호치민', 'ho chi minh', '싱가포르', 'singapore', '발리', 'bali', '세부', 'cebu', '괌', 'guam', '시드니', 'sydney', '멜버른', 'melbourne'].some(k => q.includes(k)) || ['태국', '베트남', '대만', '중국', '싱가포르', '호주', '필리핀', 'china', 'thailand', 'vietnam', 'taiwan', 'australia'].some(k => c.includes(k))) {
    return 'asia';
  }

  // 기본값: 대한민국
  return 'kr';
}

// 브라우저 전역 객체 바인딩 (안전한 스크립트 간 공유)
if (typeof window !== 'undefined') {
  window.MAP_REGIONS = MAP_REGIONS;
  window.getRegionIdByCityName = getRegionIdByCityName;
}
