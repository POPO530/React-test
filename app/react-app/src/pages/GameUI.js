// Reactをインポート
import React from 'react';

// GameUIコンポーネントの定義。propsから残りのアイテム数(remainingItems)とゲームクリアの状態(gameCleared)を受け取る
const GameUI = ({ remainingItems, gameCleared }) => {
  // コンポーネントがレンダリングするJSXを返す
  return (
    <div>
      {/* 残りのアイテム数を表示。remainingItems変数の値を動的に埋め込む */}
      <div>残りのアイテム数: {remainingItems}</div>
      {/* gameClearedがtrueの場合、つまりゲームがクリアされた場合に表示されるメッセージ */}
      {gameCleared && <div>ゲームクリア！おめでとうございます！</div>}
    </div>
  );
};

// GameUIコンポーネントをエクスポートすることで、他のファイルからimportして使えるようにする
export default GameUI;