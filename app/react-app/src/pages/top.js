import React, { useState, useEffect } from 'react'; // React、useState、useEffectをインポート
import axios from 'axios'; // axiosをインポート
import { Link } from "react-router-dom"; // リンクを作成するためのインポート

function Top({ cityInfo }) {
  const [weatherData, setWeatherData] = useState([]);
  const [locationName, setLocationName] = useState(cityInfo.locationName || "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${cityInfo.latitude}&longitude=${cityInfo.longitude}&hourly=weathercode&timezone=Asia%2FTokyo&forecast_days=1`);
        if (response.status !== 200) {
          throw new Error("Network response was not ok");
        }
        const data = response.data;

        const today = new Date();
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        let hour = today.getHours();
        month = month < 10 ? "0" + month : month;
        day = day < 10 ? "0" + day : day;
        hour = hour < 10 ? "0" + hour : hour;
        const todayDate = `${year}-${month}-${day}T${hour}:00`;

        const weatherMap = {
          "Unknown": "晴天",
          1: "晴れ", 2: "時々曇り", 3: "曇り",
          45: "霧", 48: "霧氷",
          51: "軽い霧雨", 53: "霧雨", 55: "濃い霧雨", 56: "氷結霧雨", 57: "濃い氷結霧雨",
          61: "小雨", 63: "雨", 65: "大雨", 66: "凍てつく雨", 67: "激しい凍てつく雨",
          71: "小雪", 73: "雪", 75: "大雪", 77: "ひょう",
          80: "軽いにわか雨", 81: "にわか雨", 82: "激しいにわか雨", 85: "降雪", 86: "激しい降雪",
          95: "雷雨", 96: "ひょうを伴う雷雨", 99: "ひょうを伴う激しい雷雨",
        };

        if (data.hourly && data.hourly.weathercode) {
          const weatherInfo = [];
          for (let i = 0; i < data.hourly.weathercode.length; i++) {
            const weatherCode = data.hourly.weathercode[i] || "Unknown";
            const weatherDate = data.hourly.time[i] || "Unknown";
            if (weatherDate === todayDate) {
              const weatherType = weatherMap[weatherCode] || "不明";
              weatherInfo.push({ city: cityInfo.name, type: weatherType, date: weatherDate });
            }
          }
          setWeatherData(weatherInfo);
        }
      } catch (error) {
        alert(`エラーが発生しました: ${error.message}`);
      }
    };

    const fetchLocationName = async () => {
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${cityInfo.latitude}&lon=${cityInfo.longitude}`);
        if (response.status !== 200) {
          throw new Error('Failed to fetch location data');
        }
        const data = response.data;
        setLocationName(data.display_name);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    if (cityInfo.latitude && cityInfo.longitude) {
      fetchData();
      fetchLocationName();
    }
  }, [cityInfo]);

  return (
    <div className="top-screen">
      <h1>トップ画面</h1>
      <div className="location-weather-info">
        <h2>場所の名前: {locationName}</h2>
        {weatherData.map((weather, index) => (
          <p key={index}>{weather.type} 日付・時刻: {weather.date}</p>
        ))}
      </div>
      <Link to="setting" className="link-button">setting画面へ</Link>
      <Link to="game" className="link-button">game画面へ</Link>
    </div>
  );
}

export default Top; // Topコンポーネントをエクスポート