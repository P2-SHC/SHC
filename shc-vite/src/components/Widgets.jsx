import './Widgets.css';
import { useContext, useState, useEffect } from 'react';
import { LocationContext } from './LocationContext.jsx'
import weatherDescriptions from '../data/weatherDes.json';
/**
 * AirQualityWidget - 미세먼지 위젯 (Glassmorphism)
 */
let locationName = "";
export function AirQualityWidget() {
  const [microDustData, setMicroDustData] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiKey = import.meta.env.VITE_DUST_API_KEY;
  const url = `https://api.waqi.info/feed/here/?token=${apiKey}`;

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

  return (
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
  );
}

/**
 * WeatherWidget - 날씨 위젯 (Glassmorphism)
 */
export function WeatherWidget() {
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

  return (
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
  );
}
