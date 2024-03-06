import React from 'react';

const GameUI = ({ remainingItems, gameCleared }) => {
  return (
    <div>
      <div>残りのアイテム数: {remainingItems}</div>
      {gameCleared && <div>ゲームクリア！おめでとうございます！</div>}
    </div>
  );
};

export default GameUI;