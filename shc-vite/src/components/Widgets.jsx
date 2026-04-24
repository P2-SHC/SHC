import './Widgets.css';
import { useContext, useState, useEffect } from 'react';
import { LocationContext } from './LocationContext.jsx'
import weatherDescriptions from '../data/weatherDes.json';
import products from '../data/product.json'
/**
 * AirQualityWidget - 미세먼지 위젯 (Glassmorphism)
 */
let locationName = "";
export function AirQualityWidget({ navigate }) {
  const [microDustData, setMicroDustData] = useState(null);
  const [loading, setLoading] = useState(true);
  const url = "https://api.waqi.info/feed/here/?token=db453069f29558ae9cda83a9b12c672fb737bdee";

  useEffect(() => {
    const fetchMicroDust = async () => {
      try {
        const res = await fetch(url);
        const json = await res.json();
        if (json.status === "ok") {
          setMicroDustData(json.data);
          locationName = json.data.city.name.split('-')[0];
        }
        setLoading(false);
      } catch (error) {
        console.error("Micro dust fetch error:", error);
        setLoading(false);
      }
    };
    fetchMicroDust();
  }, []);

  // AQI 수치에 따른 정보 반환 함수
  const getAqiInfo = (aqi) => {
    if (aqi <= 50) return { class: "aqi-good", label: "좋음", icon: "😊" };
    if (aqi <= 100) return { class: "aqi-moderate", label: "보통", icon: "😐" };
    if (aqi <= 150) return { class: "aqi-unhealthy-sensitive", label: "민감군영향", icon: "😷" };
    if (aqi <= 200) return { class: "aqi-unhealthy", label: "나쁨", icon: "🤢" };
    if (aqi <= 300) return { class: "aqi-very-unhealthy", label: "매우나쁨", icon: "👿" };
    return { class: "aqi-hazardous", label: "위험", icon: "💀" };
  };

  if (loading || !microDustData) {
    return <div className="widget widget--green">미세먼지 정보 로딩 중...</div>;
  }

  const aqiInfo = getAqiInfo(microDustData.aqi);

  // 미세먼지 나쁨 지수일때는 미세먼지 관련 상품 추천, 아닐경우 랜덤 추천
  let recommendedProducts = [];
  if (microDustData.aqi > 150) {
    recommendedProducts = products.filter((product) => { return product.keyword.includes("미세먼지") }).slice(0, 3);
  } else {
    recommendedProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 3);
  }

  return (
    <div className="widget-container">
      <div className={`widget ${aqiInfo.class}`}>
        <div className="widget__title">미세먼지 현황 · {microDustData.city.name}</div>
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
        <div className="widget__product-title">추천 건강상품</div>
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
export function WeatherWidget({ navigate }) {
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
          console.log(data.main.temp);
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

  // 날씨 기반 상품 추천 로직
  const mainWeather = weatherData.weather[0].main;
  const temp = weatherData.main.temp;
  let weatherKeyword = "";

  // 1. 날씨 상태에 따른 키워드 매핑
  if (["Rain", "Drizzle", "Thunderstorm"].includes(mainWeather)) {
    weatherKeyword = "비";
  } else if (mainWeather === "Snow") {
    weatherKeyword = "눈";
  } else if (mainWeather === "Clear") {
    weatherKeyword = "자외선";
  } else if (mainWeather === "Clouds") {
    weatherKeyword = "흐림";
  } else {
    weatherKeyword = "환절기";
  }

  // 2. 온도에 따른 키워드 보정 (한파/폭염)
  if (temp <= 5) {
    weatherKeyword = "한파";
  } else if (temp >= 30) {
    weatherKeyword = "폭염";
  }

  // 3. 상품 필터링
  let recommendedProducts = products.filter((product) =>
    product.keyword.includes(weatherKeyword)
  );

  // 만약 검색된 상품이 없거나 부족하면 환절기 키워드나 랜덤으로 보충
  if (recommendedProducts.length < 3) {
    const fallbackProducts = products.filter((product) =>
      product.keyword.includes("환절기") && !recommendedProducts.includes(product)
    );
    recommendedProducts = [...recommendedProducts, ...fallbackProducts].slice(0, 3);
  }

  // 최종적으로도 부족하면 랜덤 추천
  if (recommendedProducts.length < 3) {
    const randomProducts = [...products]
      .sort(() => 0.5 - Math.random())
      .filter(p => !recommendedProducts.includes(p))
      .slice(0, 3 - recommendedProducts.length);
    recommendedProducts = [...recommendedProducts, ...randomProducts];
  } else {
    recommendedProducts = recommendedProducts.slice(0, 3);
  }


  return (
    <div className="widget-container">
      <div className="widget widget--blue">
        <div className="widget__title">현재 날씨 · {locationName}</div>
        <div className="widget__main-row">
          {/* main.temp로 온도 접근 */}
          <div className="widget__temp">{Math.round(weatherData.main.temp)}°</div>
          <span className="widget__icon widget__icon--lg">
            {/* 날씨 아이콘 동적 처리 (선택사항) */}
            <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="Weather icon" />
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
      <div className="widget__product-section">
        <div className="widget__product-title">추천 건강상품</div>
        <div className="widget__product-list">
          {recommendedProducts.map((p) => <MiniProductCard key={p.id} navigate={navigate} product={p} />)}
        </div>
      </div>
    </div>
  );
}

/* MiniProductCard - 위젯에 들어가는 상품 추천 카드*/
function MiniProductCard({ navigate, product }) {
  return (
    <button className="mini-product-card" onClick={() => { navigate("ProductDetailPage", { productId: product.id }) }}>
      <div className="mini-product-card__img">
        💊
      </div>
      <div className="mini-product-card__info">
        <div className="mini-product-card__name">{product.title}</div>
        <div className="mini-product-card__price">{product.price.toLocaleString()}원</div>
      </div>
    </button>
  );
}