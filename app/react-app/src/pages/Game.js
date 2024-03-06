import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import PacMan from './PacMan';
import GameUI from './GameUI';

// ゲームコンポーネントの定義
const Game = () => {
  // ゲームの開始状態、クリア状態、および残りのアイテム数を追跡する状態変数を宣言
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCleared, setGameCleared] = useState(false);
  const [remainingItems, setRemainingItems] = useState(30);

  // ゲームを開始する関数
  const startGame = () => {
    setGameStarted(true);
    setGameCleared(false);
    setRemainingItems(30);
  };

  // ゲームをリセットする関数
  const resetGame = () => {
    setGameStarted(false);
    setGameCleared(false);
    setRemainingItems(30);
  };

  // JSX を返してゲームコンポーネントをレンダリング
  return (
    <div className="game-container">
      <Canvas style={{ width: '70%', height: '70vh' }}>
        {/* 光源を設置 */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {/* ゲームが開始された場合、PacMan コンポーネントを表示 */}
        {gameStarted && <PacMan setRemainingItems={setRemainingItems} setGameCleared={setGameCleared} />}
      </Canvas>
      {/* ゲームが開始されていない場合、ゲーム開始ボタンを表示 */}
      {!gameStarted && <button className="game-button" onClick={startGame}>ゲーム開始</button>}
      {/* ゲームがクリアされた場合、リセットボタンを表示 */}
      {gameCleared && <button className="game-button" onClick={resetGame}>リセット</button>}
      {/* ゲームUIコンポーネントを表示 */}
      <GameUI remainingItems={remainingItems} gameCleared={gameCleared} />
    </div>
  );
};

// ゲームコンポーネントをエクスポート
export default Game;