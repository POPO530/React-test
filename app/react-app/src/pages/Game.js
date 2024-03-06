import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import PacMan from './PacMan';
import Enemy from './Enemy';
import GameUI from './GameUI';

const Game = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCleared, setGameCleared] = useState(false);
  const [remainingItems, setRemainingItems] = useState(30);
  const [pacManPosition, setPacManPosition] = useState([0, 0, 0]);

  const startGame = () => {
    setGameStarted(true);
    setGameCleared(false);
    setRemainingItems(30);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameCleared(false);
    setRemainingItems(30);
    setPacManPosition([0, 0, 0]);
  };

  return (
    <div className="game-container">
      <Canvas style={{ width: '70%', height: '70vh' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        {gameStarted && (
          <>
            <PacMan setRemainingItems={setRemainingItems} setGameCleared={setGameCleared} setPacManPosition={setPacManPosition} />
            <Enemy pacManPosition={pacManPosition} />
          </>
        )}
      </Canvas>
      {!gameStarted && <button className="game-button" onClick={startGame}>ゲーム開始</button>}
      {gameCleared && <button className="game-button" onClick={resetGame}>リセット</button>}
      <GameUI remainingItems={remainingItems} gameCleared={gameCleared} />
    </div>
  );
};

export default Game;