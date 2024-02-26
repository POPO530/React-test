// ReactライブラリからReactオブジェクトをインポート
import React from 'react';

// React Routerのリンク機能を使うために必要なLinkコンポーネントをimportします。
import { Link } from "react-router-dom";

// マス目を表示するボタンを生成するSquareコンポーネント
function Square(props) {
  // ボタン要素を返す。クリックされた時にprops.onClickを実行する。
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// マス目を表示するボードを生成するBoardコンポーネント
class Board extends React.Component {
    // マス目を描画するためのメソッド
    renderSquare(i) {
      // Squareコンポーネントを呼び出し、値とクリック時のイベントを渡す
      return (
        <Square
          value={this.props.squares[i]} // マス目の値を渡す
          onClick={() => this.props.onClick(i)} // マス目がクリックされた時のイベントを渡す
        />
      );
    }
  
    // ボード全体を描画するためのメソッド
    render() {
      return (
        <div>
          {/* 3つの行を描画 */}
          <div className="board-row">
            {this.renderSquare(0)} {/* 1行目のマス目 */}
            {this.renderSquare(1)} {/* 1行目のマス目 */}
            {this.renderSquare(2)} {/* 1行目のマス目 */}
          </div>
          <div className="board-row">
            {this.renderSquare(3)} {/* 2行目のマス目 */}
            {this.renderSquare(4)} {/* 2行目のマス目 */}
            {this.renderSquare(5)} {/* 2行目のマス目 */}
          </div>
          <div className="board-row">
            {this.renderSquare(6)} {/* 3行目のマス目 */}
            {this.renderSquare(7)} {/* 3行目のマス目 */}
            {this.renderSquare(8)} {/* 3行目のマス目 */}
          </div>
        </div>
      );
    }
  }

// Tic-Tac-Toeゲーム全体を管理するGameコンポーネント
class Game extends React.Component {
    // コンストラクター。初期状態を設定する
    constructor(props) {
      super(props);
      this.state = {
        // ゲームの履歴。各ステップの盤面を記録する
        history: [
          {
            squares: Array(9).fill(null) // 9つのマス目をnullで初期化
          }
        ],
        // 現在のステップ番号
        stepNumber: 0,
        // 現在のプレイヤー（XまたはO）
        xIsNext: true
      };
      // メソッドのthisをバインドする
      this.togglePlayer = this.togglePlayer.bind(this);
    }
  
    // マス目がクリックされた時の処理
    handleClick(i) {
      // 現在の履歴を取得
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      // 盤面をコピー
      const squares = current.squares.slice();
      // 勝者が決まっている場合や既にマス目が埋まっている場合は何もしない
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      // マス目にプレイヤーの記号を設定し、次のプレイヤーに切り替える
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        // 新しい履歴を追加
        history: history.concat([
          {
            squares: squares
          }
        ]),
        // ステップ番号を更新
        stepNumber: history.length,
        // プレイヤーを切り替え
        xIsNext: !this.state.xIsNext
      });
    }
  
    // ステップをジャンプするメソッド
    jumpTo(step) {
      this.setState({
        // ステップ番号を更新
        stepNumber: step,
        // 現在のプレイヤーを更新
        xIsNext: (step % 2) === 0
      });
    }
  
    // プレイヤーを切り替えるメソッド
    togglePlayer() {
      this.setState(prevState => ({
        // 現在のプレイヤーを反転させる
        xIsNext: !prevState.xIsNext
      }));
    }
  
    // コンポーネントの描画メソッド
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      // 勝者を計算する
      const winner = calculateWinner(current.squares);
  
      // 現在のプレイヤー
      const currentPlayer = this.state.xIsNext ? "X" : "O";
      let status;
      // 勝者がいる場合は勝者を表示、そうでない場合は次のプレイヤーを表示
      if (winner) {
        status = "Winner: " + winner;
      } else {
        status = "Next player: " + currentPlayer;
      }
  
      // 各ステップへのジャンプボタンを描画
      const moves = history.map((step, move) => {
        const desc = move ?
          'Go to move #' + move :
          'Go to game start';
        return (
          <li key={move}>
            <button className="jump-button" onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
  
      // ボードとゲーム情報を表示
      return (
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div className="player-name">{status}</div>
            {/* プレイヤーを切り替えるボタン */}
            <button className="toggle-button" onClick={this.togglePlayer}>Toggle Player</button>
            {/* ジャンプボタンのリスト */}
            <ol>{moves}</ol>
            <Link to="/" className="link-button">トップページへ戻る</Link>
          </div>
        </div>
      );
    }
  }
  
  // Gameコンポーネントを他のファイルからインポートできるようにする
  export default Game;

// 勝者を計算する関数
function calculateWinner(squares) {
    // 勝利の可能性のあるすべての行の組み合わせ
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    // 各行の組み合わせをチェックし、勝者がいるかどうかを確認
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        // 勝者がいる場合は勝者の記号（'X'または'O'）を返す
        return squares[a];
      }
    }
    // 勝者がいない場合はnullを返す
    return null;
  }