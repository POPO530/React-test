import React from 'react';

// ゲームUIコンポーネントの定義
const GameUI = ({ remainingItems, gameCleared }) => {
  // JSX を返してゲームUIコンポーネントをレンダリング
  return (
    <div>
      {/* 残りのアイテム数を表示 */}
      <div>残りのアイテム数: {remainingItems}</div>
      {/* ゲームがクリアされた場合、クリアメッセージを表示 */}
      {gameCleared && <div>ゲームクリア！おめでとうございます！</div>}
    </div>
  );
};

// ゲームUIコンポーネントをエクスポート
export default GameUI;