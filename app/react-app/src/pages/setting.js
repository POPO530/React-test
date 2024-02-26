import React, { useEffect, useRef } from 'react'; // React、useEffect、useRefをインポート
import { Link } from "react-router-dom"; // リンクを作成するためのインポート

function Setting({ setCityInfo, cityInfo }) {
  const initialLatitude = useRef(cityInfo ? cityInfo.latitude : 35.6895);
  const initialLongitude = useRef(cityInfo ? cityInfo.longitude : 139.6917);
  const locationNameRef = useRef("");

  const handleLocationNameChange = async (e) => {
    const name = e.target.value;
    locationNameRef.current = name;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${name}`);
      if (!response.ok) {
        throw new Error('Failed to fetch location data');
      }
      const data = await response.json();
      if (data.length > 0) {
        initialLatitude.current = parseFloat(data[0].lat);
        initialLongitude.current = parseFloat(data[0].lon);
        // locationNameの値を更新する
        setCityInfo({
          latitude: initialLatitude.current,
          longitude: initialLongitude.current,
          locationName: name
        });
      }
    } catch (error) {
      console.error('Error fetching location data:', error);
    }
  };

  const handleClick = () => {
    setCityInfo({
      latitude: initialLatitude.current,
      longitude: initialLongitude.current,
      locationName: locationNameRef.current
    });
  };

  return (
    <div className="setting-screen">
      <h1>設定画面</h1>
      <Link to="/" className="link-button">トップページへ戻る</Link>
      <div>
        <label htmlFor="locationName">場所の名前：</label>
        <input
          type="text"
          id="locationName"
          defaultValue={cityInfo ? cityInfo.locationName : ""}
          onBlur={handleLocationNameChange}
          className="location-name-input"
        />
      </div>
      <div>
        <label htmlFor="latitude">緯度：</label>
        <input
          type="number"
          id="latitude"
          value={initialLatitude.current}
          readOnly
          className="latitude-input"
        />
      </div>
      <div>
        <label htmlFor="longitude">経度：</label>
        <input
          type="number"
          id="longitude"
          value={initialLongitude.current}
          readOnly
          className="longitude-input"
        />
      </div>
      <button onClick={handleClick} className="setting-button">都市情報を設定する</button>
    </div>
  );
}

export default Setting;