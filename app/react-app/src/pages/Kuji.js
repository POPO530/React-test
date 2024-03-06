// ReactとuseState, useEffectフックをimportしています
import React, { useState, useEffect } from 'react';

// Kujiという名前のReactコンポーネントを定義しています
function Kuji() {
  // 状態管理のためにuseStateフックを使用しています。初期状態として様々な状態を設定しています。
  
  // boxは抽選箱を表し、初期状態は空の配列です
  const [box, setBox] = useState([]);
  // selectedCountは選択された回数を表し、初期状態は0です
  const [selectedCount, setSelectedCount] = useState(0);
  // drawResultは抽選結果を保存する配列で、初期状態は空の配列です
  const [drawResult, setDrawResult] = useState([]);
  // tempResultsは一時的な抽選結果を保存する配列で、初期状態は空の配列です
  const [tempResults, setTempResults] = useState([]);
  // revealedは公開された結果を保存する配列で、初期状態は空の配列です
  const [revealed, setRevealed] = useState([]);
  // remainingTicketsは残りのチケット数を表し、初期状態は80です
  const [remainingTickets, setRemainingTickets] = useState(80);
  // prizeCountsは賞の数を管理するオブジェクトで、各賞の初期値を設定しています
  const [prizeCounts, setPrizeCounts] = useState({
    A: 1, B: 1, C: 1, D: 1, E: 1, F: 15, G: 15, H: 15, I: 15, J: 15
  });

  // コンポーネントがマウントされた後に実行されるuseEffectフックを使用しています。
  // 空の依存配列を渡しているため、コンポーネントのマウント時にのみ実行されます。
  useEffect(() => {
    // ゲームをリセットする関数を呼び出しています
    resetGame();
  }, []);

  // 配列をシャッフルする関数です。引数に配列を取り、シャッフルされた配列を返します。
  const shuffle = (array) => {
    // 配列の最後の要素から開始し、0に到達するまで繰り返します
    for (let i = array.length - 1; i > 0; i--) {
      // ランダムに選ばれた要素のインデックスを計算します
      const j = Math.floor(Math.random() * (i + 1));
      // 選ばれた要素と現在の要素を交換します
      [array[i], array[j]] = [array[j], array[i]];
    }
    // シャッフルされた配列を返します
    return array;
  };

  // 抽選券を引くための関数です
  const drawTickets = () => {
    // 現在の抽選箱の状態をコピーして更新用の変数に格納します
    const updatedBox = [...box];
    // 引かれたチケットを格納するための空配列を用意します
    const results = [];
    // 選択された回数分だけ繰り返します
    for (let i = 0; i < selectedCount; i++) {
      // ランダムにチケットのインデックスを選びます
      const ticketIndex = Math.floor(Math.random() * updatedBox.length);
      // 選んだチケットを箱から取り出して変数に格納します
      const ticket = updatedBox.splice(ticketIndex, 1)[0];
      // 取り出したチケットを結果の配列に追加します
      results.push(ticket);
    }
    // 残りのチケット数を更新します。引かれたチケットの数だけ減らします
    setRemainingTickets(prevRemainingTickets => prevRemainingTickets - results.length);
    // 更新された箱の状態をセットします
    setBox(updatedBox);
    // 引かれたチケットの公開状態を管理する配列を更新します。すべて未公開(false)に設定します
    setRevealed(new Array(results.length).fill(false));
    // 一時的な抽選結果をセットします
    setTempResults(results);
    // 抽選結果の表示用の状態を更新します。すべて「未開封」に設定します
    setDrawResult(new Array(results.length).fill('未開封'));
  };

  // ゲームをリセットする関数です
  const resetGame = () => {
    // 賞の数を管理するオブジェクトです。各賞の数を設定しています
    const frequencies = {
      A: 1, B: 1, C: 1, D: 1, E: 1, F: 15, G: 15, H: 15, I: 15, J: 15
    };

    // 初期状態の抽選箱を用意するための空配列です
    let initialBox = [];
    // frequenciesオブジェクトの各要素に対して繰り返し処理を行い、
    // 対応する文字を指定された回数だけinitialBox配列に追加します
    Object.entries(frequencies).forEach(([char, count]) => {
      for (let i = 0; i < count; i++) {
        initialBox.push(char);
      }
    });

    // 抽選箱をシャッフルしてセットします
    setBox(shuffle(initialBox));
    // 選択された回数をリセットします
    setSelectedCount(0);
    // 抽選結果をリセットします
    setDrawResult([]);
    // 公開された結果をリセットします
    setRevealed([]);
    // 残りのチケット数を初期状態の箱の長さにリセットします
    setRemainingTickets(initialBox.length);
    // 賞の数を管理する状態をリセットします
    setPrizeCounts({ ...frequencies });
  };

  // チケットを公開する関数です
  const revealTicket = (index) => {
    // 既に公開されたチケットの状態をコピーして更新します
    const newRevealed = [...revealed];
    newRevealed[index] = true; // 指定されたインデックスのチケットを公開状態にします
    setRevealed(newRevealed); // 更新された公開状態をセットします

    // 抽選結果を更新するため、現在の抽選結果をコピーして更新します
    const newDrawResult = [...drawResult];
    newDrawResult[index] = tempResults[index]; // 指定されたインデックスの結果を一時結果から更新します
    setDrawResult(newDrawResult); // 更新された抽選結果をセットします

    // 賞品の残り数を更新します
    const newPrizeCounts = { ...prizeCounts }; // 現在の賞品数の状態をコピーして更新します
    newPrizeCounts[tempResults[index]] -= 1; // 指定された賞品の数を1減らします
    setPrizeCounts(newPrizeCounts); // 更新された賞品の数をセットします
  };

  // コンポーネントの戻り値としてUIを定義します
  return (
    <div>
      <h1>一番くじアプリ</h1> {/* アプリのタイトル */}
      <div>
        <h2>残りのくじの枚数: {remainingTickets}枚</h2> {/* 残りのくじの枚数を表示 */}
      </div>
      <div>
        <label htmlFor="ticketCount">引く枚数を選択してください（1から10枚まで）:</label>
        <input
          id="ticketCount"
          type="number"
          min="1"
          max="10"
          value={selectedCount} // 選択された枚数
          onChange={(e) => {
            // 入力された値を1から10の間に制限し、残りのチケット数を超えないようにします
            const val = Math.max(1, Math.min(10, parseInt(e.target.value, 10) || 0));
            setSelectedCount(Math.min(val, remainingTickets)); // 更新された選択枚数をセットします
          }}
        />
      </div>
      <div>
        <button onClick={drawTickets} disabled={selectedCount < 1 || selectedCount > remainingTickets || remainingTickets === 0}>くじを引く</button> {/* くじを引くためのボタン */}
        <button onClick={resetGame}>リセット</button> {/* ゲームをリセットするためのボタン */}
      </div>
      <div className="tickets-container">
        {drawResult.map((result, index) => (
          <div key={index} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', display: 'inline-block' }}>
            {revealed[index] ? result : <button onClick={() => revealTicket(index)}>くじをめくる</button>} {/* 各チケットを表示し、公開状態に応じて結果またはめくるボタンを表示 */}
          </div>
        ))}
      </div>
      <div>
        <h2>賞品の残り数:</h2> {/* 賞品の残り数を表示 */}
        <ul>
          {Object.entries(prizeCounts).map(([prize, count]) => (
            <li key={prize}>{`賞品${prize}: 残り${count}枚`}</li> // 各賞品の残り数をリストとして表示
          ))}
        </ul>
      </div>
    </div>
  );
}
// コンポーネントをエクスポートします
export default Kuji;