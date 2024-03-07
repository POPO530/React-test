// 必要なモジュールと関数をインポート
import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createMazeWalls, detectCollision } from './Maze';
import createItem from './Item';

// PacManコンポーネントの定義。ゲーム状態を更新する関数をpropsから受け取る
const PacMan = ({ setRemainingItems, setGameCleared, setPacManPosition, resetGame }) => {
  const pacManRef = useRef(); // パックマンの3Dオブジェクトへの参照
  const [position, setPosition] = useState([0, 0, 0]); // パックマンの位置
  const [bulletPosition, setBulletPosition] = useState(null); // 弾の位置（初期状態では発射されていない）
  const [bulletDirection, setBulletDirection] = useState(null); // 弾の方向
  const { scene } = useThree(); // Three.jsのシーンオブジェクト
  const walls = useRef([]); // 迷路の壁のデータを保持する配列
  const [items, setItems] = useState([]); // ゲーム内のアイテム

  // ゲームの初期化処理
  useEffect(() => {
    // createMazeWalls関数を使用して迷路の壁を作成し、walls.currentに格納
    walls.current = createMazeWalls(scene);
    // createItem関数を使用してアイテムを初期位置に配置し、その結果をinitialItemsに格納
    const initialItems = createItem(scene, walls.current, position, detectCollision);
    // setItemsを使用してアイテムの状態を更新
    setItems(initialItems);
    // setRemainingItemsを使用して残りのアイテム数を更新
    setRemainingItems(initialItems.length);
  }, [scene, setRemainingItems]); // 依存配列にsceneとsetRemainingItemsを指定して、これらの値が変更された場合のみ処理を実行

  // キーボード入力によるパックマンの移動制御
  useEffect(() => {
    // キーボードが押されたときのイベントハンドラ
    const handleKeyDown = (event) => {
      let newPos = [...position]; // 現在のパックマンの位置をコピー
      // 押されたキーに応じてパックマンの位置を更新
      switch (event.key) {
        case 'w': newPos[1] += 0.1; break; // 上に移動
        case 'a': newPos[0] -= 0.1; break; // 左に移動
        case 's': newPos[1] -= 0.1; break; // 下に移動
        case 'd': newPos[0] += 0.1; break; // 右に移動
        default: break;
      }
      // detectCollision関数で壁との衝突を検出していない場合、パックマンの位置を更新
      if (!detectCollision(newPos, walls.current)) {
        setPosition(newPos);
        setPacManPosition(newPos);
      }
    };
    // イベントリスナーを追加
    window.addEventListener('keydown', handleKeyDown);
    // コンポーネントのクリーンアップ時にイベントリスナーを削除
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position, setPacManPosition]); // 依存配列にpositionとsetPacManPositionを指定

  // 弾の発射制御
  useEffect(() => {
    // キーボードが押されたときのイベントハンドラ
    const handleKeyDown = (event) => {
      // 矢印キーが押された場合の処理
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        setBulletPosition([...position]); // 弾の位置をパックマンの現在位置に設定
        // 押されたキーに応じて弾の方向を設定
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
  }, [position]); // 依存配列にpositionを指定して、positionが変更された場合のみ処理を実行

  useFrame(() => {
    // パックマンの位置を更新
    pacManRef.current.position.set(...position);

    // 弾が存在する場合の処理
    if (bulletPosition) {
      // 弾の速度を定義
      const bulletSpeed = 0.2;
      // 弾の新しい位置を計算
      const newPos = bulletPosition.map((val, index) => val + bulletDirection[index] * bulletSpeed);
      // 弾の位置を更新
      setBulletPosition(newPos);

      // 弾が壁に衝突した場合の処理
      if (detectCollision(newPos, walls.current)) {
        // 弾の位置と方向をリセット
        setBulletPosition(null);
        setBulletDirection(null);
      }
    }

    // アイテムの収集処理
    items.forEach((item, index) => {
      // アイテムが存在し、パックマンの位置との距離が0.5未満の場合
      if (item && pacManRef.current.position.distanceTo(item.position) < 0.5) {
        // アイテムをシーンから削除
        scene.remove(item);
        // アイテム配列内の該当アイテムをnullに設定
        items[index] = null;
        // アイテムの状態を更新
        setItems(currentItems => {
          const updatedItems = [...currentItems];
          updatedItems[index] = null;
          return updatedItems;
        });
        // 残りのアイテム数を減少
        setRemainingItems(current => current - 1);
      }
    });

    // ゲームクリアの判定（全てのアイテムが収集された場合）
    if (items.filter(Boolean).length === 0 && items.length > 0) { // アイテムが0で、初期状態ではない場合
      console.log("ゲームクリア！全てのアイテムが収集されました。"); // デバッグ情報を出力
      setGameCleared(true);
      resetGame(); // ゲームクリア時にリセット処理を自動で実行
    } else {
      // ゲーム進行中の状態をデバッグ出力
      console.log(`残りのアイテム数: ${items.filter(Boolean).length}`);
    }
  });

  const createPacMan = () => {
    // パックマンの形状（球体）を生成
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    // パックマンの材質（黄色）を設定
    const material = new THREE.MeshBasicMaterial({ color: 'yellow' });
    // パックマンの3Dオブジェクト（メッシュ）を生成して返却
    return new THREE.Mesh(geometry, material);
  };

  return (
    <>
      {/* パックマンの3Dオブジェクトをレンダリング */}
      <primitive object={createPacMan()} ref={pacManRef} position={position} />
      {/* 弾が存在する場合、弾の3Dオブジェクトもレンダリング */}
      {bulletPosition && (
        <mesh position={bulletPosition}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="red" />
        </mesh>
      )}
    </>
  );
};

// PacManコンポーネントをエクスポート
export default PacMan;