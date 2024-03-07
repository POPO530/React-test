// ReactからuseStateフックをインポート
import React, { useState } from 'react';
// '@react-three/fiber'からCanvasをインポート
import { Canvas } from '@react-three/fiber';
// 同じディレクトリ内のPacManコンポーネントをインポート
import PacMan from './PacMan';
// 同じディレクトリ内のEnemyコンポーネントをインポート
import Enemy from './Enemy';
// 同じディレクトリ内のGameUIコンポーネントをインポート
import GameUI from './GameUI';

// Gameコンポーネントの定義
const Game = () => {
  // ゲームが開始されたかどうかを管理する状態
  const [gameStarted, setGameStarted] = useState(false);
  // ゲームがクリアされたかどうかを管理する状態
  const [gameCleared, setGameCleared] = useState(false);
  // 残りのアイテム数を管理する状態
  const [remainingItems, setRemainingItems] = useState(10);
  // パックマンの位置を管理する状態
  const [pacManPosition, setPacManPosition] = useState([0, 0, 0]);

  // ゲームを開始する関数
  const startGame = () => {
    setGameStarted(true);
    setGameCleared(false);
    setRemainingItems(10);
  };

  // ゲームをリセットする関数
  const resetGame = () => {
    setGameStarted(false);
    setGameCleared(false);
    setRemainingItems(10);
    setPacManPosition([0, 0, 0]);
  };

  // ゲームのUIをレンダリング
  return (
    <div className="game-container">
      {/* Canvasコンポーネントを使用して3Dシーンを作成 */}
      <Canvas style={{ width: '70%', height: '70vh' }}>
        {/* 環境光源を追加 */}
        <ambientLight intensity={0.5} />
        {/* 点光源を追加 */}
        <pointLight position={[10, 10, 10]} />
        {/* ゲームが開始されている場合、PacManとEnemyコンポーネントをレンダリング */}
        {gameStarted && (
          <>
            <PacMan setRemainingItems={setRemainingItems} setGameCleared={setGameCleared} setPacManPosition={setPacManPosition} resetGame={resetGame} />
            <Enemy pacManPosition={pacManPosition} />
          </>
        )}
      </Canvas>
      {/* ゲームが開始されていない場合、ゲーム開始ボタンを表示 */}
      {!gameStarted && <button className="game-button" onClick={startGame}>ゲーム開始</button>}
      {/* GameUIコンポーネントをレンダリングし、残りのアイテム数とゲームクリアの状態を渡す */}
      <GameUI remainingItems={remainingItems} gameCleared={gameCleared} />
    </div>
  );
};

// Gameコンポーネントをエクスポート
export default Game;