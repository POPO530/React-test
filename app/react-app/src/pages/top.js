import React, { useState, useEffect } from 'react'; // React、useState、useEffectをインポート
import axios from 'axios'; // axiosをインポート
import { Link } from "react-router-dom"; // リンクを作成するためのインポート

function Top({ cityInfo }) { // Topコンポーネントを定義し、cityInfoをpropsとして受け取る
  const [weatherData, setWeatherData] = useState([]); // 天気データを格納するstate
  const [locationName, setLocationName] = useState(cityInfo.locationName || ""); // 場所の名前を格納するstate

  useEffect(() => {
    const fetchData = async () => { // 天気データを取得する非同期関数
      try {
        const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${cityInfo.latitude}&longitude=${cityInfo.longitude}&hourly=weathercode&timezone=Asia%2FTokyo&forecast_days=1`); // Open MeteoのAPIを使用して天気データを取得
        if (response.status !== 200) { // エラーハンドリング
          throw new Error("Network response was not ok"); // エラーを投げる
        }
        const data = response.data; // データを取得

        const today = new Date(); // 現在の日付と時刻を取得
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        let hour = today.getHours();
        month = month < 10 ? "0" + month : month; // 月と日が1桁の場合は0を追加
        day = day < 10 ? "0" + day : day;
        hour = hour < 10 ? "0" + hour : hour;
        const todayDate = `${year}-${month}-${day}T${hour}:00`; // yyyy-mm-ddThh:00 形式の現在の日付と時刻

        const weatherMap = { // 天気コードに対応する日本語の天気のマップ
          "Unknown": "晴天",
          1: "晴れ", 2: "時々曇り", 3: "曇り",
          45: "霧", 48: "霧氷",
          51: "軽い霧雨", 53: "霧雨", 55: "濃い霧雨", 56: "氷結霧雨", 57: "濃い氷結霧雨",
          61: "小雨", 63: "雨", 65: "大雨", 66: "凍てつく雨", 67: "激しい凍てつく雨",
          71: "小雪", 73: "雪", 75: "大雪", 77: "ひょう",
          80: "軽いにわか雨", 81: "にわか雨", 82: "激しいにわか雨", 85: "降雪", 86: "激しい降雪",
          95: "雷雨", 96: "ひょうを伴う雷雨", 99: "ひょうを伴う激しい雷雨",
        };

        if (data.hourly && data.hourly.weathercode) { // データがある場合
          const weatherInfo = [];
          for (let i = 0; i < data.hourly.weathercode.length; i++) {
            const weatherCode = data.hourly.weathercode[i] || "Unknown"; // 天気コードを取得
            const weatherDate = data.hourly.time[i] || "Unknown"; // 天気の日付と時刻を取得
            if (weatherDate === todayDate) { // 現在の日付と時刻のデータだけを使用
              const weatherType = weatherMap[weatherCode] || "不明"; // 天気の種類をマップから取得
              weatherInfo.push({ city: cityInfo.name, type: weatherType, date: weatherDate }); // 天気情報を配列に追加
            }
          }
          setWeatherData(weatherInfo); // 天気データをセット
        }
      } catch (error) { // エラーハンドリング
        alert(`エラーが発生しました: ${error.message}`); // エラーメッセージをアラートで表示
      }
    };

    const fetchLocationName = async () => { // 場所の名前を取得する非同期関数
      try {
        const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${cityInfo.latitude}&lon=${cityInfo.longitude}`); // OpenStreetMapのAPIを使用して場所の名前を取得
        if (response.status !== 200) { // エラーハンドリング
          throw new Error('Failed to fetch location data'); // エラーを投げる
        }
        const data = response.data; // データを取得
        setLocationName(data.display_name); // 場所の名前をセット
      } catch (error) { // エラーハンドリング
        console.error('Error fetching location data:', error); // エラーメッセージをコンソールに出力
      }
    };

    if (cityInfo.latitude && cityInfo.longitude) { // cityInfoの緯度と経度がある場合
      fetchData(); // 天気データを取得する関数を呼び出す
      fetchLocationName(); // 場所の名前を取得する関数を呼び出す
    }
  }, [cityInfo]); // cityInfoが変更されたときに再レンダリング

  return (
    <div className="top-screen">
      <h1>トップ画面</h1> {/* トップ画面のタイトル */}
      <div className="location-weather-info">
        <h2>場所の名前: {locationName}</h2> {/* 場所の名前の表示 */}
        {weatherData.map((weather, index) => ( // 天気データの表示
          <p key={index}>{weather.type} 日付・時刻: {weather.date}</p>
        ))}
      </div>
      <Link to="setting" className="link-button">setting画面へ</Link> {/* 設定画面へのリンク */}
      <Link to="game" className="link-button">game画面へ</Link> {/* ゲーム画面へのリンク */}
      <Link to="1kuji" className="link-button">1番くじ画面へ</Link> {/* 1番くじ画面へのリンク */}
    </div>
  );
}

export default Top; // Topコンポーネントをエクスポート