import React, { useState } from 'react'; // ReactとuseStateフックをインポート
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // ブラウザルーター、ルート、およびルートのインポート
import Header from './pages/Header'; // Headerページのコンポーネントをインポート
import Footer from './pages/Footer'; // Footerページのコンポーネントをインポート
import Top from './pages/Top'; // Topページのコンポーネントをインポート
import Setting from './pages/Setting'; // Settingページのコンポーネントをインポート
import Game from './pages/Game'; // Gameページのコンポーネントをインポート
import Kuji from './pages/Kuji'; // Kujiページのコンポーネントをインポート
import './css/app.css'; // アプリケーションのCSSスタイルをインポート

function App() {
  // useStateフックを使用して、cityInfoステートとその更新関数を定義し、初期値を設定
  const [cityInfo, setCityInfo] = useState({ latitude: 35.6895, longitude: 139.6917, locationName: "" });

  return (
    <div className="app-container">
      <Header />
      <BrowserRouter> {/* ブラウザルーターのコンテキストを提供 */}
        <Routes> {/* ルーティングを管理するためのルートコンテナ */}
          {/* パスが"/"の場合、TopコンポーネントにcityInfoプロパティを渡して要素をレンダリング */}
          <Route path="/" element={<Top cityInfo={cityInfo} />} />
          {/* パスが"setting"の場合、SettingコンポーネントにsetCityInfo関数とcityInfoプロパティを渡して要素をレンダリング */}
          <Route path="setting" element={<Setting setCityInfo={setCityInfo} cityInfo={cityInfo} />} />
          {/* パスが"game"の場合、Gameコンポーネントを要素としてレンダリング */}
          <Route path="game" element={<Game />} />
          {/* パスが"1kuji"の場合、Kujiコンポーネントを要素としてレンダリング */}
          <Route path="1kuji" element={<Kuji />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App; // Appコンポーネントをエクスポート