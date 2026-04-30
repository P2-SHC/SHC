import './Widgets.css';
import { useContext, useState, useEffect } from 'react';
import { LocationContext } from './LocationContext.jsx'
import weatherDescriptions from '../../public/data/weatherDes.json';
import products from '../../public/data/product.json'
/**
 * AirQualityWidget - 미세먼지 위젯 (Glassmorphism)
 */
/**
 * 도시 이름을 깔끔하게 반환하는 헬퍼 함수
 */
const getCleanCityName = (city) => {
  if (!city) return "알 수 없음";

  const cityMap = {
    "Seoul": "서울시",
    "Seongnam-si": "성남시",
    "Gyeonggi-do": "경기도",
    "Incheon": "인천시",
    "Busan": "부산시",
    "Daegu": "대구시",
    "Daejeon": "대전시",
    "Gwangju": "광주시",
    "Suwon-si": "수원시",
    "Yongin-si": "용인시",
    "Goyang-si": "고양시"
  };

  return cityMap[city] || city.replace('-si', '').replace('-do', '');
};

const getWeatherKeyword = (icon) => {
  if (!icon) return '환절기';
  const code = icon.slice(0, 2);
  if (code === '01') return '자외선';
  if (['09', '10', '11'].includes(code)) return '비';
  if (code === '13') return '눈';
  return '환절기';
};

export function AirQualityWidget({ navigate, isDark, weatherIcon, className = "" }) {
  const { locationData, loading: locationLoading } = useContext(LocationContext);
  const [microDustData, setMicroDustData] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiKey = import.meta.env.VITE_DUST_API_KEY;

  useEffect(() => {
    if (locationData) {
      const { lat, lng } = locationData.location;
      const url = `https://api.waqi.info/feed/geo:${lat};${lng}/?token=${apiKey}`;

      const fetchMicroDust = async () => {
        try {
          const res = await fetch(url);
          const json = await res.json();
          if (json.status === "ok") {
            setMicroDustData(json.data);
          }
          setLoading(false);
        } catch (error) {
          console.error("Micro dust fetch error:", error);
          setLoading(false);
        }
      };
      fetchMicroDust();
    }
  }, [locationData, apiKey]);

  const displayCity = getCleanCityName(locationData?.location?.city);

  // AQI 수치에 따른 정보 반환 함수
  const getAqiInfo = (aqi) => {
    if (aqi <= 50) return { class: "aqi-good", label: "좋음", icon: "😊" };
    if (aqi <= 100) return { class: "aqi-moderate", label: "보통", icon: "😐" };
    if (aqi <= 150) return { class: "aqi-unhealthy-sensitive", label: "민감군영향", icon: "😷" };
    if (aqi <= 200) return { class: "aqi-unhealthy", label: "나쁨", icon: "🤢" };
    if (aqi <= 300) return { class: "aqi-very-unhealthy", label: "매우나쁨", icon: "👿" };
    return { class: "aqi-hazardous", label: "위험", icon: "💀" };
  };

  if (locationLoading || loading || !microDustData) {
    return <div className="widget widget--green">미세먼지 정보 로딩 중...</div>;
  }

  const aqiInfo = getAqiInfo(microDustData.aqi);

  // 미세먼지 상품 1개 (없으면 랜덤)
  const microDustPool = products.filter(p => p.keyword.includes('미세먼지'));
  const microDustProduct = microDustPool.length > 0
    ? microDustPool[Math.floor(Math.random() * microDustPool.length)]
    : products[Math.floor(Math.random() * products.length)];

  // 날씨 관련 상품 2개 (부족하면 랜덤으로 보충)
  const weatherKeyword = getWeatherKeyword(weatherIcon);
  const weatherPool = products
    .filter(p => p.keyword.includes(weatherKeyword) && p.id !== microDustProduct?.id)
    .sort(() => 0.5 - Math.random());

  const fallbackPool = products
    .filter(p => !p.keyword.includes(weatherKeyword) && p.id !== microDustProduct?.id)
    .sort(() => 0.5 - Math.random());

  const weatherProducts = [...weatherPool, ...fallbackPool].slice(0, 2);

  const recommendedProducts = [microDustProduct, ...weatherProducts].filter(Boolean);

  return (
    <div className={`widget-container ${className}`}>
      <div className={`widget ${aqiInfo.class}`}>
        <div className="widget__title">미세먼지 현황 · {displayCity}</div>
        <div className="widget__main-row">
          <div className="widget__value">{aqiInfo.label} ({microDustData.aqi})</div>
          <span className="widget__icon">{aqiInfo.icon}</span>
        </div>
        <div className="widget__grid">
          <div className="widget__cell">
            <div className="widget__cell-label">PM2.5</div>
            <div className="widget__cell-value">
              {microDustData.iaqi.pm25?.v || '-'}<span className="widget__unit">㎍/㎥</span>
            </div>
          </div>
          <div className="widget__cell">
            <div className="widget__cell-label">PM10</div>
            <div className="widget__cell-value">
              {microDustData.iaqi.pm10?.v || '-'}<span className="widget__unit">㎍/㎥</span>
            </div>
          </div>
        </div>
      </div>
      <div className="widget__product-section">
        <div className={`widget__product-title${isDark ? ' text-white' : ''}`}>추천 건강상품</div>
        <div className="widget__product-list">
          {recommendedProducts.map((p) => <MiniProductCard key={p.id} navigate={navigate} product={p} />)}
        </div>
      </div>
    </div>
  );
}

/**
 * WeatherWidget - 날씨 위젯 (Glassmorphism)
 */
export function WeatherWidget({ navigate, onWeatherLoad, onIconClick, className = "" }) {
  //geoIpify에서 가져온 위도 경도를 사용하여 openWeatherMap에서 날씨 정보를 가져옵니다.
  const { locationData, loading } = useContext(LocationContext);
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    // 위치 데이터가 로드된 후에만 날씨를 가져옵니다.
    if (locationData) {
      const latitude = locationData.location.lat; //위도
      const longitude = locationData.location.lng; //경도
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

      const fetchWeather = async () => {
        try {
          const res = await fetch(url);
          const data = await res.json();
          setWeatherData(data);
          console.log(data);
          // weatherDes.json에서 id에 해당하는 아이콘 코드를 찾아서 전달
          const weatherInfo = weatherDescriptions.find(w => w.id === data.weather[0].id);
          const iconCode = weatherInfo ? weatherInfo.icon : data.weather[0].icon;
          onWeatherLoad?.(iconCode);
        } catch (error) {
          console.error("Weather fetch error:", error);
        }
      };
      fetchWeather();
    }
  }, [locationData]); // locationData가 변경될 때마다 실행

  // 데이터가 없거나 로딩 중일 때 안전하게 처리
  if (loading || !weatherData) {
    return <div className="widget widget--blue">날씨 정보를 불러오는 중...</div>;
  }

  // weatherDes.json에서 현재 날씨 ID와 일치하는 한국어 설명을 찾습니다.
  const weatherInfo = weatherDescriptions.find(item => item.id === weatherData.weather[0].id);
  const description = weatherInfo ? weatherInfo.description : weatherData.weather[0].description;
  const displayCity = getCleanCityName(locationData?.location?.city);

  return (
    <div className={`widget-container ${className}`}>
      <div className="widget widget--blue">
        <div className="widget__title">현재 날씨 · {displayCity}</div>
        <div className="widget__main-row">
          {/* main.temp로 온도 접근 */}
          <div className="widget__temp">{Math.round(weatherData.main.temp)}°</div>
          <span className="widget__icon widget__icon--lg">
            {/* 날씨 아이콘 동적 처리 (선택사항) */}
            <img
              src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt="Weather icon"
              onClick={onIconClick}
              style={{ cursor: onIconClick ? 'pointer' : 'default' }}
            />
          </span>
        </div>
        <div className="widget__condition">{description}</div>
        <div className="widget__grid">
          <div className="widget__cell">
            <div className="widget__cell-label">체감온도</div>
            <div className="widget__cell-value">{Math.round(weatherData.main.feels_like)}°</div>
          </div>
          <div className="widget__cell">
            <div className="widget__cell-label">습도</div>
            <div className="widget__cell-value">{weatherData.main.humidity}%</div>
          </div>
        </div>
      </div>
      <button className="ai-recommend-card" onClick={() => navigate('HealthRecommendPage')}>
        <div className="ai-recommend-card__icon">💊</div>
        <div className="ai-recommend-card__body">
          <div className="ai-recommend-card__title">AI 건강 맞춤 추천</div>
          <div className="ai-recommend-card__desc">건강 상태를 알려주시면 딱 맞는 상품과 건강 정보를 추천해드려요</div>
        </div>
        <div className="ai-recommend-card__arrow">›</div>
      </button>
    </div>
  );
}

/* MiniProductCard - 위젯에 들어가는 상품 추천 카드*/
function MiniProductCard({ navigate, product }) {
  return (
    <button className="mini-product-card" onClick={() => { navigate("ProductDetailPage", { productId: product.id, from: "MainPage" }) }}>
      <div className="mini-product-card__img">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="mini-product-card__info">
        <div className="mini-product-card__name">{product.title}</div>
        <div className="mini-product-card__price">{product.price.toLocaleString()}원</div>
      </div>
    </button>
  );
}