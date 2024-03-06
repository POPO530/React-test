import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createMazeWalls, detectCollision } from './Maze';
import createItem from './Item';

// PacMan コンポーネントの定義
const PacMan = ({ setRemainingItems, setGameCleared }) => {
  // useRef フックを使用してパックマンの参照を作成
  const pacManRef = useRef();
  // パックマンの位置を追跡するための状態変数 position を宣言
  const [position, setPosition] = useState([0, 0, 0]);
  // パックマンの弾の位置を追跡するための状態変数 bulletPosition を宣言
  const [bulletPosition, setBulletPosition] = useState(null);
  // パックマンの弾の方向を追跡するための状態変数 bulletDirection を宣言
  const [bulletDirection, setBulletDirection] = useState(null);
  // useThree フックを使用してシーンを取得
  const { scene } = useThree();
  // useRef フックを使用して壁を追跡するための参照を作成
  const walls = useRef([]);
  // アイテムを追跡するための状態変数 items を宣言
  const [items, setItems] = useState([]);

  // シーンのロード時に壁とアイテムを生成
  useEffect(() => {
    // Maze モジュールから壁を生成し、壁の参照を更新
    walls.current = createMazeWalls(scene);
    // アイテムを生成し、アイテムの初期配置を設定
    const initialItems = createItem(scene, walls.current, position);
    // アイテムの状態を更新し、残りのアイテム数を設定
    setItems(initialItems);
    setRemainingItems(initialItems.length);
  }, [scene, setRemainingItems]);

  // キー入力を監視してパックマンの移動を処理
  useEffect(() => {
    const handleKeyDown = (event) => {
      // 現在の位置をコピーして新しい位置を計算
      let newPos = [...position];
      switch (event.key) {
        case 'w':
          newPos[1] += 0.1;
          break;
        case 'a':
          newPos[0] -= 0.1;
          break;
        case 's':
          newPos[1] -= 0.1;
          break;
        case 'd':
          newPos[0] += 0.1;
          break;
        default:
          break;
      }
  
      // 新しい位置が壁と衝突しない場合、位置を更新
      if (!detectCollision(newPos, walls.current)) {
        setPosition(newPos);
      }
    };

    // キー入力イベントリスナーを追加し、クリーンアップ関数を返す
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position]);

  // キー入力を監視して弾を発射する処理
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        setBulletPosition([...position]);
        switch (event.key) {
          case 'ArrowUp':
            setBulletDirection([0, 1, 0]); // 上向きに弾を発射
            break;
          case 'ArrowDown':
            setBulletDirection([0, -1, 0]); // 下向きに弾を発射
            break;
          case 'ArrowLeft':
            setBulletDirection([-1, 0, 0]); // 左向きに弾を発射
            break;
          case 'ArrowRight':
            setBulletDirection([1, 0, 0]); // 右向きに弾を発射
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position]);

  // フレームごとに実行されるアニメーション処理
  useFrame(() => {
    // パックマンの位置を更新
    pacManRef.current.position.set(...position);

    // 弾の移動
    if (bulletPosition) {
      const bulletSpeed = 0.2; // 弾の速度
      const newPos = bulletPosition.map((val, index) => val + bulletDirection[index] * bulletSpeed);
      setBulletPosition(newPos);

      // 壁との衝突チェック
      if (detectCollision(newPos, walls.current)) {
        setBulletPosition(null);
        setBulletDirection(null);
      }
    }

    // アイテムとの衝突を検出して収集
    items.forEach((item, index) => {
      if (item && pacManRef.current.position.distanceTo(item.position) < 0.5) {
        // アイテムを削除し、状態を更新してアイテム数を減らす
        scene.remove(item);
        items[index] = null;
        setItems(currentItems => {
          const updatedItems = [...currentItems];
          updatedItems[index] = null;
          return updatedItems;
        });
        setRemainingItems(current => current - 1);
      }
    });

    // ゲームクリアのチェック
    if (items.filter(Boolean).length === 0) {
      setGameCleared(true);
    }
  });

  // パックマンの形状を作成する関数
  const createPacMan = () => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 'yellow' });
    return new THREE.Mesh(geometry, material);
  };

  // パックマンの形状を表示する JSX を返す
  return (
    <>
      <primitive object={createPacMan()} ref={pacManRef} position={position} />
      {bulletPosition && (
        <mesh position={bulletPosition}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="red" />
        </mesh>
      )}
    </>
  );
};

// PacMan コンポーネントをエクポート
export default PacMan;