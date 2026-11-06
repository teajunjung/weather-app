/**
 * WMO (세계기상기구) 날씨 해석 코드 매핑 테이블
 * 고화질 실사 배경화면 URL 및 라이브 애니메이션 이펙트 모드 정의
 */

const WALLPAPERS = {
  clearDay: 'https://images.unsplash.com/photo-1601297183305-6df142704ea2?auto=format&fit=crop&w=1920&q=80',
  clearNight: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1920&q=80',
  cloudsDay: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1920&q=80',
  cloudsNight: 'https://images.unsplash.com/photo-1532978379173-523e16f371f2?auto=format&fit=crop&w=1920&q=80',
  rain: 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?auto=format&fit=crop&w=1920&q=80',
  snow: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=1920&q=80',
  thunder: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=1920&q=80',
  fog: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=1920&q=80'
};

const WEATHER_CODES = {
  0: {
    label: '맑음',
    iconDay: 'sun',
    iconNight: 'moon',
    theme: 'clear',
    effectDay: 'clear-day',
    effectNight: 'clear-night',
    bgDay: WALLPAPERS.clearDay,
    bgNight: WALLPAPERS.clearNight
  },
  1: {
    label: '대체로 맑음',
    iconDay: 'cloud-sun',
    iconNight: 'cloud-moon',
    theme: 'clear',
    effectDay: 'clear-day',
    effectNight: 'clear-night',
    bgDay: WALLPAPERS.clearDay,
    bgNight: WALLPAPERS.clearNight
  },
  2: {
    label: '구름 조금',
    iconDay: 'cloud-sun',
    iconNight: 'cloud-moon',
    theme: 'partly-cloudy',
    effectDay: 'clear-day',
    effectNight: 'clear-night',
    bgDay: WALLPAPERS.cloudsDay,
    bgNight: WALLPAPERS.cloudsNight
  },
  3: {
    label: '흐림',
    iconDay: 'cloud',
    iconNight: 'cloud',
    theme: 'overcast',
    effectDay: 'clouds',
    effectNight: 'clouds',
    bgDay: WALLPAPERS.cloudsDay,
    bgNight: WALLPAPERS.cloudsNight
  },
  45: {
    label: '안개',
    iconDay: 'cloud-fog',
    iconNight: 'cloud-fog',
    theme: 'fog',
    effectDay: 'fog',
    effectNight: 'fog',
    bgDay: WALLPAPERS.fog,
    bgNight: WALLPAPERS.fog
  },
  48: {
    label: '짙은 서리 안개',
    iconDay: 'cloud-fog',
    iconNight: 'cloud-fog',
    theme: 'fog',
    effectDay: 'fog',
    effectNight: 'fog',
    bgDay: WALLPAPERS.fog,
    bgNight: WALLPAPERS.fog
  },
  51: {
    label: '약한 이슬비',
    iconDay: 'cloud-drizzle',
    iconNight: 'cloud-drizzle',
    theme: 'rain',
    effectDay: 'rain',
    effectNight: 'rain',
    bgDay: WALLPAPERS.rain,
    bgNight: WALLPAPERS.rain
  },
  53: {
    label: '이슬비',
    iconDay: 'cloud-drizzle',
    iconNight: 'cloud-drizzle',
    theme: 'rain',
    effectDay: 'rain',
    effectNight: 'rain',
    bgDay: WALLPAPERS.rain,
    bgNight: WALLPAPERS.rain
  },
  55: {
    label: '강한 이슬비',
    iconDay: 'cloud-drizzle',
    iconNight: 'cloud-drizzle',
    theme: 'rain',
    effectDay: 'rain',
    effectNight: 'rain',
    bgDay: WALLPAPERS.rain,
    bgNight: WALLPAPERS.rain
  },
  56: {
    label: '어는 약한 이슬비',
    iconDay: 'cloud-snow',
    iconNight: 'cloud-snow',
    theme: 'snow',
    effectDay: 'snow',
    effectNight: 'snow',
    bgDay: WALLPAPERS.snow,
    bgNight: WALLPAPERS.snow
  },
  57: {
    label: '어는 강한 이슬비',
    iconDay: 'cloud-snow',
    iconNight: 'cloud-snow',
    theme: 'snow',
    effectDay: 'snow',
    effectNight: 'snow',
    bgDay: WALLPAPERS.snow,
    bgNight: WALLPAPERS.snow
  },
  61: {
    label: '약한 비',
    iconDay: 'cloud-rain',
    iconNight: 'cloud-rain',
    theme: 'rain',
    effectDay: 'rain',
    effectNight: 'rain',
    bgDay: WALLPAPERS.rain,
    bgNight: WALLPAPERS.rain
  },
  63: {
    label: '보통 비',
    iconDay: 'cloud-rain',
    iconNight: 'cloud-rain',
    theme: 'rain',
    effectDay: 'rain',
    effectNight: 'rain',
    bgDay: WALLPAPERS.rain,
    bgNight: WALLPAPERS.rain
  },
  65: {
    label: '강한 비',
    iconDay: 'cloud-rain',
    iconNight: 'cloud-rain',
    theme: 'rain',
    effectDay: 'rain',
    effectNight: 'rain',
    bgDay: WALLPAPERS.rain,
    bgNight: WALLPAPERS.rain
  },
  66: {
    label: '어는 약한 비',
    iconDay: 'cloud-snow',
    iconNight: 'cloud-snow',
    theme: 'snow',
    effectDay: 'snow',
    effectNight: 'snow',
    bgDay: WALLPAPERS.snow,
    bgNight: WALLPAPERS.snow
  },
  67: {
    label: '어는 강한 비',
    iconDay: 'cloud-snow',
    iconNight: 'cloud-snow',
    theme: 'snow',
    effectDay: 'snow',
    effectNight: 'snow',
    bgDay: WALLPAPERS.snow,
    bgNight: WALLPAPERS.snow
  },
  71: {
    label: '약한 눈',
    iconDay: 'snowflake',
    iconNight: 'snowflake',
    theme: 'snow',
    effectDay: 'snow',
    effectNight: 'snow',
    bgDay: WALLPAPERS.snow,
    bgNight: WALLPAPERS.snow
  },
  73: {
    label: '보통 눈',
    iconDay: 'snowflake',
    iconNight: 'snowflake',
    theme: 'snow',
    effectDay: 'snow',
    effectNight: 'snow',
    bgDay: WALLPAPERS.snow,
    bgNight: WALLPAPERS.snow
  },
  75: {
    label: '강한 눈',
    iconDay: 'snowflake',
    iconNight: 'snowflake',
    theme: 'snow',
    effectDay: 'snow',
    effectNight: 'snow',
    bgDay: WALLPAPERS.snow,
    bgNight: WALLPAPERS.snow
  },
  77: {
    label: '싸락눈',
    iconDay: 'snowflake',
    iconNight: 'snowflake',
    theme: 'snow',
    effectDay: 'snow',
    effectNight: 'snow',
    bgDay: WALLPAPERS.snow,
    bgNight: WALLPAPERS.snow
  },
  80: {
    label: '약한 소나기',
    iconDay: 'cloud-rain',
    iconNight: 'cloud-rain',
    theme: 'rain',
    effectDay: 'rain',
    effectNight: 'rain',
    bgDay: WALLPAPERS.rain,
    bgNight: WALLPAPERS.rain
  },
  81: {
    label: '보통 소나기',
    iconDay: 'cloud-rain',
    iconNight: 'cloud-rain',
    theme: 'rain',
    effectDay: 'rain',
    effectNight: 'rain',
    bgDay: WALLPAPERS.rain,
    bgNight: WALLPAPERS.rain
  },
  82: {
    label: '폭우 / 강한 소나기',
    iconDay: 'cloud-lightning',
    iconNight: 'cloud-lightning',
    theme: 'rain',
    effectDay: 'rain',
    effectNight: 'rain',
    bgDay: WALLPAPERS.rain,
    bgNight: WALLPAPERS.rain
  },
  85: {
    label: '약한 눈 소나기',
    iconDay: 'cloud-snow',
    iconNight: 'cloud-snow',
    theme: 'snow',
    effectDay: 'snow',
    effectNight: 'snow',
    bgDay: WALLPAPERS.snow,
    bgNight: WALLPAPERS.snow
  },
  86: {
    label: '강한 눈 소나기',
    iconDay: 'cloud-snow',
    iconNight: 'cloud-snow',
    theme: 'snow',
    effectDay: 'snow',
    effectNight: 'snow',
    bgDay: WALLPAPERS.snow,
    bgNight: WALLPAPERS.snow
  },
  95: {
    label: '천둥번개',
    iconDay: 'cloud-lightning',
    iconNight: 'cloud-lightning',
    theme: 'thunder',
    effectDay: 'thunder',
    effectNight: 'thunder',
    bgDay: WALLPAPERS.thunder,
    bgNight: WALLPAPERS.thunder
  },
  96: {
    label: '우박을 동반한 뇌우',
    iconDay: 'cloud-lightning',
    iconNight: 'cloud-lightning',
    theme: 'thunder',
    effectDay: 'thunder',
    effectNight: 'thunder',
    bgDay: WALLPAPERS.thunder,
    bgNight: WALLPAPERS.thunder
  },
  99: {
    label: '강한 우박을 동반한 뇌우',
    iconDay: 'cloud-lightning',
    iconNight: 'cloud-lightning',
    theme: 'thunder',
    effectDay: 'thunder',
    effectNight: 'thunder',
    bgDay: WALLPAPERS.thunder,
    bgNight: WALLPAPERS.thunder
  }
};

/**
 * WMO 코드를 바탕으로 날씨 정보, 실사 배경 URL, 애니메이션 이펙트 모드를 반환합니다.
 * @param {number} code - WMO 날씨 코드
 * @param {boolean} isDay - 낮인지 여부 (1이면 낮, 0이면 밤)
 * @returns {object} { label, icon, theme, wallpaper, effectMode, isDay }
 */
function getWeatherInfo(code, isDay = 1) {
  const match = WEATHER_CODES[code] || {
    label: '맑음',
    iconDay: 'sun',
    iconNight: 'moon',
    theme: 'clear',
    effectDay: 'clear-day',
    effectNight: 'clear-night',
    bgDay: WALLPAPERS.clearDay,
    bgNight: WALLPAPERS.clearNight
  };

  const isNight = isDay === 0 || isDay === false;

  return {
    label: match.label,
    icon: isNight ? match.iconNight : match.iconDay,
    theme: match.theme,
    wallpaper: isNight ? match.bgNight : match.bgDay,
    effectMode: isNight ? match.effectNight : match.effectDay,
    isDay: !isNight
  };
}
