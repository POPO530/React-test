import React, { useState, useEffect } from 'react'; // React、useState、useEffectをインポート
import { Link } from "react-router-dom"; // リンクを作成するためのインポート

function Setting({ setCityInfo, cityInfo }) {
  // 初期緯度と経度を設定。cityInfoが存在する場合はそれを使用し、そうでない場合はデフォルト値を使用
  const initialLatitude = cityInfo ? cityInfo.latitude : 35.6895;
  const initialLongitude = cityInfo ? cityInfo.longitude : 139.6917;
  // useStateフックを使用して緯度、経度、場所の名前を管理
  const [latitude, setLatitude] = useState(initialLatitude);
  const [longitude, setLongitude] = useState(initialLongitude);
  const [locationName, setLocationName] = useState("");

  // useEffectフックを使用して緯度と経度に基づいて場所の名前を取得
  useEffect(() => {
    const fetchLocationName = async () => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
        if (!response.ok) {
          throw new Error('Failed to fetch location data');
        }
        const data = await response.json();
        setLocationName(data.display_name);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    fetchLocationName();
  }, [latitude, longitude]); // 緯度と経度が変更されるたびに実行

  // ボタンクリック時に都市情報を設定する関数
  const handleClick = () => {
    setCityInfo({ ...cityInfo, latitude, longitude, locationName });
  };

  return (
    <div className="setting-screen">
      <h1>設定画面</h1>
      {/* トップページへのリンク */}
      <Link to="/" className="link-button">トップページへ戻る</Link>
      <div>
        <label htmlFor="latitude">緯度：</label>
        {/* 緯度入力フィールド */}
        <input
          type="number"
          id="latitude"
          value={latitude}
          onChange={(e) => setLatitude(parseFloat(e.target.value))}
          className="latitude-input"
        />
      </div>
      <div>
        <label htmlFor="longitude">経度：</label>
        {/* 経度入力フィールド */}
        <input
          type="number"
          id="longitude"
          value={longitude}
          onChange={(e) => setLongitude(parseFloat(e.target.value))}
          className="longitude-input"
        />
      </div>
      <div>
        <label>場所の名前：</label>
        {/* 場所の名前表示 */}
        <span className="location-name">{locationName}</span>
      </div>
      {/* 都市情報を設定するボタン */}
      <button onClick={handleClick} className="setting-button">都市情報を設定する</button>
    </div>
  );
}

export default Setting; // Settingコンポーネントをエクスポート