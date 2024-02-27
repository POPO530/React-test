import React, { useState, useEffect } from 'react';

function Kuji() {
  const [box, setBox] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [drawResult, setDrawResult] = useState([]);
  const [tempResults, setTempResults] = useState([]);
  const [revealed, setRevealed] = useState([]);
  const [remainingTickets, setRemainingTickets] = useState(80);
  const [prizeCounts, setPrizeCounts] = useState({
    A: 1, B: 1, C: 1, D: 1, E: 1, F: 15, G: 15, H: 15, I: 15, J: 15
  });

  useEffect(() => {
    resetGame();
  }, []);

  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const drawTickets = () => {
    const updatedBox = [...box];
    const results = [];
    for (let i = 0; i < Math.min(selectedCount, updatedBox.length); i++) {
        const ticketIndex = Math.floor(Math.random() * updatedBox.length);
        const ticket = updatedBox.splice(ticketIndex, 1)[0];
        results.push(ticket);
    }
    setRemainingTickets(prevRemainingTickets => prevRemainingTickets - results.length);
    setBox(updatedBox);
    setRevealed(new Array(results.length).fill(false));
    setTempResults(results);
    setDrawResult(new Array(results.length).fill('未開封'));
  };

  const resetGame = () => {
    const frequencies = {
      A: 1, B: 1, C: 1, D: 1, E: 1, F: 15, G: 15, H: 15, I: 15, J: 15
    };

    let initialBox = [];
    Object.entries(frequencies).forEach(([char, count]) => {
      for (let i = 0; i < count; i++) {
        initialBox.push(char);
      }
    });

    setBox(shuffle(initialBox));
    setSelectedCount(0);
    setDrawResult([]);
    setRevealed([]);
    setRemainingTickets(initialBox.length);
    setPrizeCounts({ ...frequencies });
  };

  const revealTicket = (index) => {
    const newRevealed = [...revealed];
    newRevealed[index] = true;
    setRevealed(newRevealed);

    const newDrawResult = [...drawResult];
    newDrawResult[index] = tempResults[index];
    setDrawResult(newDrawResult);

    // 賞品の残り数を更新
    const newPrizeCounts = { ...prizeCounts };
    newPrizeCounts[tempResults[index]] -= 1;
    setPrizeCounts(newPrizeCounts);
  };

  return (
    <div>
      <h1>一番くじアプリ</h1>
      <div>
        <h2>残りのくじの枚数: {remainingTickets}枚</h2>
      </div>
      <div>
        <label htmlFor="ticketCount">引く枚数を選択してください（1から10枚まで）:</label>
        <input
          id="ticketCount"
          type="number"
          min="1"
          max="10"
          value={selectedCount}
          onChange={(e) => {
            const val = Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 0));
            setSelectedCount(Math.min(val, remainingTickets));
          }}
        />
      </div>
      <div>
        <button onClick={drawTickets} disabled={selectedCount < 1 || selectedCount > remainingTickets || remainingTickets === 0}>くじを引く</button>
        <button onClick={resetGame}>リセット</button>
      </div>
      <div className="tickets-container">
        {drawResult.map((result, index) => (
          <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', display: 'inline-block' }}>
            {revealed[index] ? result : <button onClick={() => revealTicket(index)}>くじをめくる</button>}
          </div>
        ))}
      </div>
      <div>
        <h2>賞品の残り数:</h2>
        <ul>
          {Object.entries(prizeCounts).map(([prize, count]) => (
            <li key={prize}>{`賞品${prize}: 残り${count}枚`}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Kuji;