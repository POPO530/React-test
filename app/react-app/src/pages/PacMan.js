// ReactとそのHooks(useRef, useState, useEffect)を'react'からインポート
import React, { useRef, useState, useEffect } from 'react';
// '@react-three/fiber'からuseFrameとuseThreeフックをインポート
import { useFrame, useThree } from '@react-three/fiber';
// 'three'ライブラリ全体をTHREEとしてインポート
import * as THREE from 'three';
// './Maze'から迷路の壁を作成する関数と衝突検出関数をインポート
import { createMazeWalls, detectCollision } from './Maze';
// './Item'からアイテムを作成する関数をインポート
import createItem from './Item';

// PacManコンポーネントの定義。ゲームの状態を管理する関数をpropsとして受け取る
const PacMan = ({ setRemainingItems, setGameCleared, setPacManPosition }) => {
  // パックマンの参照を格納するためのrefを作成
  const pacManRef = useRef();
  // パックマンの位置を管理するための状態
  const [position, setPosition] = useState([0, 0, 0]);
  // 弾の位置を管理するための状態。初期値はnull（弾が存在しない状態）
  const [bulletPosition, setBulletPosition] = useState(null);
  // 弾の方向を管理するための状態。初期値はnull
  const [bulletDirection, setBulletDirection] = useState(null);
  // three.jsのsceneオブジェクトを取得
  const { scene } = useThree();
  // 壁オブジェクトを格納するためのref。初期値は空配列
  const walls = useRef([]);
  // ゲーム内のアイテムを管理するための状態
  const [items, setItems] = useState([]);

  // コンポーネントがマウントされた時に一度だけ実行されるuseEffectフック
  useEffect(() => {
    // 迷路の壁を作成し、walls.currentに格納
    walls.current = createMazeWalls(scene);
    // アイテムを作成し、初期アイテムとして設定
    const initialItems = createItem(scene, walls.current, position);
    setItems(initialItems);
    // 残りのアイテム数を設定
    setRemainingItems(initialItems.length);
  }, [scene, setRemainingItems]); // 依存配列にsceneとsetRemainingItemsを指定

  // positionが変更された時に実行されるuseEffectフック
  useEffect(() => {
    // キーボードが押された時のイベントハンドラ
    const handleKeyDown = (event) => {
      let newPos = [...position]; // 現在の位置をコピーして新しい位置変数を作成
      // 押されたキーに応じてパックマンの位置を更新
      switch (event.key) {
        case 'w': newPos[1] += 0.1; break; // 上に移動
        case 'a': newPos[0] -= 0.1; break; // 左に移動
        case 's': newPos[1] -= 0.1; break; // 下に移動
        case 'd': newPos[0] += 0.1; break; // 右に移動
        default: break;
      }
      // 新しい位置で壁との衝突がなければ、パックマンの位置を更新
      if (!detectCollision(newPos, walls.current)) {
        setPosition(newPos);
        setPacManPosition(newPos); // パックマンの位置を更新する関数を呼び出し
      }
    };
    // イベントリスナーを追加
    window.addEventListener('keydown', handleKeyDown);
    // コンポーネントのクリーンアップ時にイベントリスナーを削除
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position, setPacManPosition]); // 依存配列にpositionとsetPacManPositionを指定

  // 弾の発射を管理するuseEffectフック
  useEffect(() => {
    // キーボードが押された時のイベントハンドラ
    const handleKeyDown = (event) => {
      // 矢印キーが押された場合に弾を発射する処理
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        setBulletPosition([...position]); // 弾の初期位置をパックマンの現在位置に設定
        // 押された矢印キーに応じて弾の方向を設定
        switch (event.key) {
          case 'ArrowUp': setBulletDirection([0, 1, 0]); break; // 上向き
          case 'ArrowDown': setBulletDirection([0, -1, 0]); break; // 下向き
          case 'ArrowLeft': setBulletDirection([-1, 0, 0]); break; // 左向き
          case 'ArrowRight': setBulletDirection([1, 0, 0]); break; // 右向き
          default: break;
        }
      }
    };
    // イベントリスナーを追加
    window.addEventListener('keydown', handleKeyDown);
    // コンポーネントのクリーンアップ時にイベントリスナーを削除
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position]); // 依存配列にpositionを指定

  // フレームが更新されるたびに実行されるアニメーションの処理
  useFrame(() => {
    // パックマンの位置を更新
    pacManRef.current.position.set(...position);

    // 弾が存在する場合、弾の移動処理を行う
    if (bulletPosition) {
      const bulletSpeed = 0.2; // 弾の速度を設定
      // 弾の新しい位置を計算
      const newPos = bulletPosition.map((val, index) => val + bulletDirection[index] * bulletSpeed);
      setBulletPosition(newPos);

      // 新しい位置で壁との衝突を検出した場合、弾を消去
      if (detectCollision(newPos, walls.current)) {
        setBulletPosition(null); // 弾の位置をリセット
        setBulletDirection(null); // 弾の方向をリセット
      }
    }

    // アイテムとの衝突検出と収集の処理
    items.forEach((item, index) => {
      // アイテムが存在し、パックマンとの距離が0.5未満の場合、アイテムを収集
      if (item && pacManRef.current.position.distanceTo(item.position) < 0.5) {
        scene.remove(item); // アイテムをシーンから削除
        items[index] = null; // アイテム配列内でのアイテムをnullに設定
        setItems(currentItems => {
          const updatedItems = [...currentItems]; // 現在のアイテム配列のコピーを作成
          updatedItems[index] = null; // 収集されたアイテムをnullに更新
          return updatedItems; // 更新されたアイテム配列を返す
        });
        setRemainingItems(current => current - 1); // 残りのアイテム数を減少
      }
    });

    // 全てのアイテムが収集された場合、ゲームクリアと判定
    if (items.filter(Boolean).length === 0) {
      setGameCleared(true); // ゲームクリアの状態をtrueに設定
    }
  });

  // パックマンの形状を作成する関数
  const createPacMan = () => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32); // 球体ジオメトリの作成
    const material = new THREE.MeshBasicMaterial({ color: 'yellow' }); // 黄色い材料の作成
    return new THREE.Mesh(geometry, material); // メッシュオブジェクトを作成して返す
  };

  // パックマンと弾の形状を表示するJSXを返す
  return (
    <>
      <primitive object={createPacMan()} ref={pacManRef} position={position} /> // パックマンの形状を表示
      {bulletPosition && ( // 弾の位置が設定されている場合、弾を表示
        <mesh position={bulletPosition}>
          <sphereGeometry args={[0.1, 16, 16]} /> // 弾の形状
          <meshBasicMaterial color="red" /> // 弾の色
        </mesh>
      )}
    </>
  );
};

// PacManコンポーネントをエクスポート
export default PacMan;