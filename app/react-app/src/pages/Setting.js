import React, { useEffect, useRef } from 'react';  // ReactとuseEffect、useRefをReactからインポート
import { Link } from "react-router-dom";  // Linkをreact-router-domからインポート

function Setting({ setCityInfo, cityInfo }) {  // Settingコンポーネントを定義し、setCityInfoとcityInfoをpropsとして受け取る
  // 初期の緯度をcityInfoから取得するか、デフォルトで35.6895に設定する
  const initialLatitude = useRef(cityInfo ? cityInfo.latitude : 35.6895);
  // 初期の経度をcityInfoから取得するか、デフォルトで139.6917に設定する
  const initialLongitude = useRef(cityInfo ? cityInfo.longitude : 139.6917);
  // 場所の名前を参照するためのrefを作成
  const locationNameRef = useRef("");

  // 場所の名前が変更されたときの処理
  const handleLocationNameChange = async (e) => {
    const name = e.target.value;  // 入力された値を取得
    locationNameRef.current = name;  // 入力された値をrefにセット
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${name}`);  // OpenStreetMapのAPIを使用して場所のデータを取得
      if (!response.ok) {  // エラーハンドリング
        throw new Error('Failed to fetch location data');  // エラーを投げる
      }
      const data = await response.json();  // レスポンスをJSONに変換
      if (data.length > 0) {  // データがある場合
        initialLatitude.current = parseFloat(data[0].lat);  // 緯度を更新
        initialLongitude.current = parseFloat(data[0].lon);  // 経度を更新
        setCityInfo({  // setCityInfo関数を呼び出してcityInfoを更新
          latitude: initialLatitude.current,  // 更新された緯度
          longitude: initialLongitude.current,  // 更新された経度
          locationName: name  // 新しい場所の名前
        });
      }
    } catch (error) {  // エラーハンドリング
      console.error('Error fetching location data:', error);  // エラーをコンソールに出力
    }
  };

  // 設定画面の表示
  return (
    <div className="setting-screen">
      <h1>設定画面</h1>  {/* 設定画面のタイトル */}
      <Link to="/" className="link-button">トップページへ戻る</Link>  {/* トップページへのリンク */}
      <div>
        <label htmlFor="locationName">場所の名前：</label>  {/* 場所の名前の入力フィールド */}
        <input
          type="text"
          id="locationName"
          value={cityInfo ? cityInfo.locationName : ""}
          onChange={handleLocationNameChange}  // 入力が変更されたときに呼び出される関数
          className="location-name-input"
        />
      </div>
      <div>
        <label htmlFor="latitude">緯度：</label>  {/* 緯度の表示フィールド */}
        <input
          type="number"
          id="latitude"
          value={initialLatitude.current}
          readOnly  // 読み取り専用
          className="latitude-input"
        />
      </div>
      <div>
        <label htmlFor="longitude">経度：</label>  {/* 経度の表示フィールド */}
        <input
          type="number"
          id="longitude"
          value={initialLongitude.current}
          readOnly  // 読み取り専用
          className="longitude-input"
        />
      </div>
    </div>
  );
}

export default Setting;  // Settingコンポーネントをエクスポート