// React の基本機能と、useState および useEffect フックをインポートします。
import React, { useRef, useState, useEffect } from 'react';
// '@react-three/fiber' ライブラリから useFrame と useThree フックをインポートします。
import { useFrame, useThree } from '@react-three/fiber';
// three.js ライブラリ全体を THREE という名前でインポートします。
import * as THREE from 'three';
// 'Maze.js' から迷路の壁を作成し、衝突を検出する関数をインポートします。
import { createMazeWalls, detectCollision } from './Maze';
// 'Item.js' からアイテムを作成する関数をインポートします。
import createItem from './Item';

// 'PacMan' という名前の関数コンポーネントを定義します。
const PacMan = () => {
  // useRef フックを使用して、Pac-Man オブジェクトの参照を保持します。
  const pacManRef = useRef();
  // useState フックを使用して、Pac-Man の位置を状態として管理します。
  const [position, setPosition] = useState([0, 0, 0]);
  // useThree フックから scene オブジェクトを取得します。これにより、現在の3Dシーンにアクセスできます。
  const { scene } = useThree();
  // useRef フックを使用して、迷路の壁の参照を保持します。
  const walls = useRef([]);

  // useEffect フックを使用して、コンポーネントがマウントされたときに一度だけ実行される処理を定義します。
  useEffect(() => {
    // createMazeWalls 関数を呼び出して、シーンに迷路の壁を追加し、迷路の境界を取得します。
    const { walls, mazeBounds } = createMazeWalls(scene);
    walls.current = walls;

    // createItem 関数を呼び出して、シーンにアイテムを追加します。
    createItem(scene, walls.current, [0, 0, 0], mazeBounds);
  }, [scene]);

  // useEffect フックを使用して、キーボード入力に応じて Pac-Man の位置を更新するイベントリスナーを追加します。
  useEffect(() => {
    const handleKeyDown = (event) => {
      // 現在の位置のコピーを作成します。
      let newPos = [...position];
      // キー入力に応じて新しい位置を計算します。
      switch (event.key) {
        case 'ArrowLeft': newPos[0] -= 0.1; break;
        case 'ArrowRight': newPos[0] += 0.1; break;
        case 'ArrowUp': newPos[1] += 0.1; break;
        case 'ArrowDown': newPos[1] -= 0.1; break;
      }

      // 壁との衝突がなければ、Pac-Man の位置を更新します。
      if (!detectCollision(newPos, walls.current)) {
        setPosition(newPos);
      }
    };

    // ウィンドウオブジェクトに 'keydown' イベントリスナーを追加します。
    window.addEventListener('keydown', handleKeyDown);

    // コンポーネントのアンマウント時にイベントリスナーを削除します。
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position]);

  // useFrame フックを使用して、アニメーションフレームごとに Pac-Man の位置を更新します。
  useFrame(() => {
    pacManRef.current.position.set(...position);
  });

  // Pac-Man の形状（球体）を作成する関数を定義します。
  const createPacMan = () => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32); // 球体のジオメトリを作成します。
    const material = new THREE.MeshBasicMaterial({ color: 'yellow' }); // 黄色のマテリアルを作成します。
    return new THREE.Mesh(geometry, material); // メッシュオブジェクトを作成して返します。
  };

  // 'primitive' コンポーネントを使用して Pac-Man オブジェクトをシーンに追加します。これにより、Three.js のオブジェクトを直接 React で扱えるようになります。
  return (
    <primitive object={createPacMan()} ref={pacManRef} position={position} />
  );
};

// PacMan コンポーネントをエクスポートします。
export default PacMan;