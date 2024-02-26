import React, { useState } from 'react';

const initialBox = Array(80).fill(null); // 初期状態のくじボックス

function Kuji() {
  const [box, setBox] = useState(initialBox); // くじボックス
  const [selectedCount, setSelectedCount] = useState(0); // 選択されたくじの枚数
  const [drawCount, setDrawCount] = useState(0); // 引かれたくじの枚数
  const [drawResult, setDrawResult] = useState([]); // 引かれたくじの結果
  const [remainingTickets, setRemainingTickets] = useState(80); // 残りのくじの枚数
  const [prizeCounts, setPrizeCounts] = useState({
    A: 1, B: 1, C: 1, D: 1, E: 1, F: 5, G: 5, H: 5, I: 5, J: 5
  }); // 各賞の出た回数
  const [drawnPrizeCounts, setDrawnPrizeCounts] = useState({}); // 出た賞の数

  // くじを引く処理
  const drawTickets = () => {
    const selectedTickets = box.slice(0, selectedCount); // 選択された枚数のくじを取得
    const result = selectedTickets.map(() => {
      const availablePrizes = Object.keys(prizeCounts).filter(prize => prizeCounts[prize] > 0);
      const randomNumber = Math.floor(Math.random() * availablePrizes.length); // 利用可能な賞のインデックス
      const selectedPrize = availablePrizes[randomNumber]; // ランダムに選択された賞
      setPrizeCounts(prevCounts => ({ ...prevCounts, [selectedPrize]: prevCounts[selectedPrize] - 1 }));
      return selectedPrize;
    });
    setBox(box.filter((_, index) => !selectedTickets.includes(index))); // 引かれたくじをボックスから削除
    setDrawResult(result); // 引かれたくじの結果をセット
    setDrawCount(selectedCount); // 引かれたくじの枚数をセット

    // 残りのくじの枚数を更新
    setRemainingTickets(prevRemainingTickets => prevRemainingTickets - selectedCount);

    // 出た賞の数を記録
    const drawnPrizes = result.reduce((counts, prize) => {
      counts[prize] = (counts[prize] || 0) + 1;
      return counts;
    }, {});
    setDrawnPrizeCounts(drawnPrizes);
  };

  // リセット処理
  const resetGame = () => {
    setBox(initialBox);
    setSelectedCount(0);
    setDrawCount(0);
    setDrawResult([]);
    setRemainingTickets(80); // 残りのくじの枚数を初期化
    setPrizeCounts({
      A: 1, B: 1, C: 1, D: 1, E: 1, F: 5, G: 5, H: 5, I: 5, J: 5
    }); // 賞のカウントも初期化
    setDrawnPrizeCounts({}); // 出た賞の数も初期化
  };

  // くじを引くボタン
  const DrawButton = () => {
    if (selectedCount === 0) return null; // 引く回数が0の場合は表示しない
    return <button onClick={drawTickets}>くじを引く</button>;
  };

  // くじをめくる処理
  const flipTickets = (flippedTicket) => {
    // 当選内容を表示する
    alert(`当選内容：${flippedTicket}`);
    // 出た賞の数を更新
    const newDrawnPrizeCounts = { ...drawnPrizeCounts };
    newDrawnPrizeCounts[flippedTicket] = (newDrawnPrizeCounts[flippedTicket] || 0) + 1;
    setDrawnPrizeCounts(newDrawnPrizeCounts);
  };

  // 結果表示コンポーネント
  const DrawResult = () => {
    if (drawResult.length === 0) return null;
    return (
      <div>
        {drawResult.map((result, index) => (
          <div key={index}>
            {result !== null && <button onClick={() => flipTickets(result)}>くじをめくる</button>}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1>一番くじアプリ</h1>
      <p>現在のくじの数: {remainingTickets}</p>
      <p>引く枚数を選択してください（1から10枚まで）:</p>
      <input
        type="number"
        min="1"
        max="10"
        value={selectedCount}
        onChange={(e) => setSelectedCount(parseInt(e.target.value))}
      />
      <button onClick={resetGame}>リセット</button>
      <DrawButton />
      <DrawResult />
    </div>
  );
}

export default Kuji;