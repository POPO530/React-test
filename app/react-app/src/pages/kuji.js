import React, { useState, useEffect } from 'react';

function Kuji() {
  const [box, setBox] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [drawResult, setDrawResult] = useState([]);
  const [remainingTickets, setRemainingTickets] = useState(80);
  const [prizeCounts, setPrizeCounts] = useState({
    A: 1, B: 1, C: 1, D: 1, E: 1, F: 5, G: 5, H: 15, I: 20, J: 20
  });

  useEffect(() => {
    const initialBox = [];
    const frequencies = {
      "A": 1, "B": 1, "C": 1, "D": 1, "E": 1, "F": 5, "G": 5, "H": 15, "I": 20, "J": 20
    };
  
    Object.entries(frequencies).forEach(([char, count]) => {
      for (let i = 0; i < count; i++) {
        initialBox.push(char);
      }
    });
  
    const shuffledBox = shuffle(initialBox);
    setBox(shuffledBox);
    setRemainingTickets(shuffledBox.length);
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
    const result = [];
    for (let i = 0; i < selectedCount; i++) {
      if (updatedBox.length > 0) {
        const ticket = updatedBox.pop();
        result.push(ticket);
        setRemainingTickets(prevRemainingTickets => prevRemainingTickets - 1);
        setPrizeCounts(prevCounts => ({ ...prevCounts, [ticket]: prevCounts[ticket] - 1 }));
      }
    }
    setDrawResult(result);
    setBox(updatedBox);
  };

  const resetGame = () => {
    const initialBox = [];
    const frequencies = {
      "A": 1, "B": 1, "C": 1, "D": 1, "E": 1, "F": 5, "G": 5, "H": 15, "I": 20, "J": 20
    };

    Object.entries(frequencies).forEach(([char, count]) => {
      for (let i = 0; i < count; i++) {
        initialBox.push(char);
      }
    });

    setBox(shuffle(initialBox));
    setSelectedCount(0);
    setDrawResult([]);
    setRemainingTickets(initialBox.length);
    setPrizeCounts({ ...frequencies });
  };

  const DrawButton = () => {
    if (selectedCount === 0) return null;
    return <button onClick={drawTickets}>くじを引く</button>;
  };

  const RemainingTickets = () => {
    return (
      <div>
        <h2>残りのくじの枚数</h2>
        <p>{remainingTickets} 枚</p>
      </div>
    );
  };

  const DrawResult = () => {
    if (drawResult.length === 0) return null;
    return (
      <div>
        {drawResult.map((result, index) => (
          <div key={index}>
            {result !== null && (
              <p>当選内容：<span>{result}</span></p>
            )}
          </div>
        ))}
      </div>
    );
  };

  const ResetButton = () => {
    return (
      <button onClick={resetGame}>リセット</button>
    );
  };

  const PrizeCounts = () => {
    return (
      <div>
        <h2>賞の残り数</h2>
        <ul>
          {Object.keys(prizeCounts).map((prize) => (
            <li key={prize}>{prize}: {prizeCounts[prize]}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div>
      <h1>一番くじアプリ</h1>
      <RemainingTickets />
      <p>引く枚数を選択してください（1から10枚まで）:</p>
      <input
        type="number"
        min="1"
        max="10"
        value={selectedCount}
        onChange={(e) => setSelectedCount(parseInt(e.target.value))}
      />
      <ResetButton />
      <DrawButton />
      <DrawResult />
      <PrizeCounts />
    </div>
  );
}

export default Kuji;