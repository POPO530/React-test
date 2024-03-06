import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createMazeWalls, detectCollision } from './Maze';
import createItem from './Item';

const PacMan = ({ setRemainingItems, setGameCleared, setPacManPosition }) => {
  const pacManRef = useRef();
  const [position, setPosition] = useState([0, 0, 0]);
  const [bulletPosition, setBulletPosition] = useState(null);
  const [bulletDirection, setBulletDirection] = useState(null);
  const { scene } = useThree();
  const walls = useRef([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    walls.current = createMazeWalls(scene);
    const initialItems = createItem(scene, walls.current, position);
    setItems(initialItems);
    setRemainingItems(initialItems.length);
  }, [scene, setRemainingItems]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      let newPos = [...position];
      switch (event.key) {
        case 'w': newPos[1] += 0.1; break;
        case 'a': newPos[0] -= 0.1; break;
        case 's': newPos[1] -= 0.1; break;
        case 'd': newPos[0] += 0.1; break;
        default: break;
      }
      if (!detectCollision(newPos, walls.current)) {
        setPosition(newPos);
        setPacManPosition(newPos); // パックマンの位置を更新
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position, setPacManPosition]);

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