import React, { useState, useEffect } from 'react'; // Reactとそのhooksをインポートします。

// Kujiコンポーネントを定義します。
function Kuji() {
  // box: くじの箱の状態を保持する配列
  const [box, setBox] = useState([]); 
  // selectedCount: ユーザーが選択したくじの枚数
  const [selectedCount, setSelectedCount] = useState(0); 
  // drawResult: 抽選結果を格納する配列
  const [drawResult, setDrawResult] = useState([]); 
  // revealed: くじが明かされたかの状態を保持する配列
  const [revealed, setRevealed] = useState([]); 
  // remainingTickets: 残りのくじの枚数
  const [remainingTickets, setRemainingTickets] = useState(80); 
  // prizeCounts: 各賞品の残り枚数をオブジェクトで管理
  const [prizeCounts, setPrizeCounts] = useState({ 
    A: 1, B: 1, C: 1, D: 1, E: 1, F: 15, G: 15, H: 15, I: 15, J: 15
  });

  // コンポーネントがマウントされた後に実行される副作用です。
  useEffect(() => {
    resetGame(); // コンポーネントの初期化時にゲームをリセットする関数を呼び出します。
  }, []); // 空の依存配列を渡すことで、コンポーネントのマウント時にのみ実行されます。

  // 配列をシャッフルする関数です。
  const shuffle = (array) => {
    for (let i = array.length - 1; i > 0; i--) { // 配列の末尾から開始して最初の要素に向かってループします。
      const j = Math.floor(Math.random() * (i + 1)); // 0からiまでのランダムなインデックスを選びます。
      [array[i], array[j]] = [array[j], array[i]]; // 現在の要素とランダムに選んだ要素の位置を交換します。
    }
    return array; // シャッフルされた配列を返します。
  };

  // くじを引く関数です。
  const drawTickets = () => {
    const updatedBox = [...box]; // 現在のくじ箱の状態をコピーします。
    const result = []; // 抽選結果を格納するための空配列を作成します。
    for (let i = 0; i < selectedCount; i++) { // 選択された回数分だけループします。
      if (updatedBox.length > 0) { // まだくじが箱にある場合にのみ処理を行います。
        const ticket = updatedBox.pop(); // くじ箱から一枚取り出します。
        result.push(ticket); // 取り出したくじを結果配列に追加します。
        // 賞品カウントを更新するための状態更新関数を呼び出します。
        setPrizeCounts(prevCounts => ({ ...prevCounts, [ticket]: prevCounts[ticket] - 1 })); 
      }
    }
    // 残りのくじの数を更新します。
    setRemainingTickets(prevRemainingTickets => prevRemainingTickets - selectedCount); 
    setDrawResult(result); // 抽選結果の状態を更新します。
    setBox(updatedBox); // くじ箱の状態を更新します。
    // 選択されたくじの数に応じた長さの配列を作成し、全ての要素をfalseで初期化します。
    setRevealed(new Array(selectedCount).fill(false)); 
  };

  // ゲームをリセットする関数です。
  const resetGame = () => {
    const initialBox = []; // 初期状態のくじ箱を表す空配列を作成します。
    // 各賞品の枚数を定義したオブジェクトです。
    const frequencies = {
      "A": 1, "B": 1, "C": 1, "D": 1, "E": 1, "F": 15, "G": 15, "H": 15, "I": 15, "J": 15
    };

    // frequenciesオブジェクトの各エントリについてループします。
    Object.entries(frequencies).forEach(([char, count]) => {
      for (let i = 0; i < count; i++) { // 各賞品の枚数分だけループします。
        initialBox.push(char); // くじ箱に賞品を表す文字を追加します。
      }
    });

    setBox(shuffle(initialBox)); // くじ箱をシャッフルして状態を更新します。
    setSelectedCount(0); // 選択されたくじの数を0にリセットします。
    setDrawResult([]); // 抽選結果の状態を空配列にリセットします。
    setRevealed([]); // くじのめくれた状態を空配列にリセットします。
    setRemainingTickets(initialBox.length); // 残りのくじの数を初期状態にリセットします。
    setPrizeCounts({ ...frequencies }); // 各賞品の数を初期状態にリセットします。
  };

  // くじをめくる処理をする関数です。
  const revealTicket = (index) => {
    // setRevealedを呼び出して、指定されたindexの位置のくじのみをめくるようにします。
    setRevealed(revealed.map((r, i) => i === index ? true : r));
  };

  // コンポーネントの描画部分です。
  return (
    <div>
      {/* アプリケーションのタイトルを表示します。 */}
      <h1>一番くじアプリ</h1>
      <div>
        {/* 残りのくじの枚数を表示します。 */}
        <h2>残りのくじの枚数: {remainingTickets}枚</h2>
      </div>
      <div>
        {/* くじを引く枚数を選択するための入力フィールドです。 */}
        <label htmlFor="ticketCount">引く枚数を選択してください（1から10枚まで）:</label>
        <input
          id="ticketCount"
          type="number"
          min="1"
          max="10"
          value={selectedCount}
          onChange={(e) => setSelectedCount(Math.min(parseInt(e.target.value, 10), remainingTickets))}
        />
      </div>
      <div>
        {/* くじを引くためのボタンです。選択した枚数が適切でない場合は無効化されます。 */}
        <button onClick={drawTickets} disabled={selectedCount < 1 || selectedCount > remainingTickets || remainingTickets === 0}>くじを引く</button>
        {/* ゲームをリセットするボタンです。 */}
        <button onClick={resetGame}>リセット</button>
      </div>
      <div className="tickets-container">
        {/* drawResult配列をマッピングして、くじの結果を表示するためのdivを生成します。 */}
        {drawResult.map((result, index) => (
          <div 
            key={index} // Reactのリストレンダリングのためのユニークなキー
            className={`ticket ${revealed[index] ? 'revealed' : ''}`} // くじがめくられたかどうかでクラスを切り替えます。
            onClick={() => revealTicket(index)} // クリックするとrevealTicket関数が呼ばれます。
          >
            {revealed[index] ? result : 'くじ'} {/* くじがめくられていれば結果を、そうでなければ'くじ'と表示します。 */}
          </div>
        ))}
      </div>
      <div>
        {/* 引いたくじの結果をリスト表示します。 */}
        <h2>引いたくじの結果</h2>
        {drawResult.map((result, index) => (
          <p key={index}>当選内容: <span>{result}</span></p> // 各くじの結果を表示します。
        ))}
      </div>
      <div>
        {/* 各賞品の残り枚数をリスト表示します。 */}
        <h2>賞の残り数</h2>
        <ul>
          {Object.entries(prizeCounts).map(([prize, count]) => (
            <li key={prize}>{prize}: {count}枚</li> // 賞品ごとの残り枚数を表示します。
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Kuji; // Kujiコンポーネントをエクスポートします。