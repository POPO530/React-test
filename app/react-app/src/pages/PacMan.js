import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createMazeWalls, detectCollision } from './Maze'; // Maze.jsから関数をインポート
import createItem from './Item'; // Item.jsからcreateItemをインポート

const PacMan = () => {
  const pacManRef = useRef();
  const [position, setPosition] = useState([0, 0, 0]); // パックマンの初期位置
  const { scene } = useThree();
  const walls = useRef([]);

  useEffect(() => {
    // 迷路の壁を生成し、refに保持
    const createdWalls = createMazeWalls(scene);
    walls.current = createdWalls;
  
    // アイテムを迷路に配置（パックマンの初期位置を渡す）
    createItem(scene, createdWalls, [0, 0, 0]); // ここでパックマンの初期位置を渡す
  }, [scene]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      let newPos = [...position];
      switch (event.key) {
        case 'ArrowLeft': newPos[0] -= 0.1; break;
        case 'ArrowRight': newPos[0] += 0.1; break;
        case 'ArrowUp': newPos[1] += 0.1; break;
        case 'ArrowDown': newPos[1] -= 0.1; break;
      }

      // 壁との衝突がなければ位置を更新
      if (!detectCollision(newPos, walls.current)) {
        setPosition(newPos);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position]);

  useFrame(() => {
    pacManRef.current.position.set(...position);
  });

  // パックマンの形状を作成
  const createPacMan = () => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 'yellow' });
    return new THREE.Mesh(geometry, material);
  };

  return (
    <primitive object={createPacMan()} ref={pacManRef} position={position} />
  );
};

export default PacMan;