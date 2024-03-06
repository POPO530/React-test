import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createMazeWalls, detectCollision } from './Maze';
import createItem from './Item';

const PacMan = () => {
  const pacManRef = useRef();
  const [position, setPosition] = useState([0, 0, 0]);
  const { scene } = useThree();
  const walls = useRef([]);
  const [collectedItems, setCollectedItems] = useState([]);
  const itemsRef = useRef([]);

  useEffect(() => {
    walls.current = createMazeWalls(scene);
    itemsRef.current = createItem(scene, walls.current, position);
  }, [scene]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      let newPos = [...position];
      switch (event.key) {
        case 'ArrowLeft': newPos[0] -= 0.1; break;
        case 'ArrowRight': newPos[0] += 0.1; break;
        case 'ArrowUp': newPos[1] += 0.1; break;
        case 'ArrowDown': newPos[1] -= 0.1; break;
        default: break;
      }

      if (!detectCollision(newPos, walls.current)) {
        setPosition(newPos);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position]);

  useFrame(() => {
    pacManRef.current.position.set(...position);

    // アイテムとの衝突を検出して収集
    itemsRef.current.forEach((item, index) => {
      if (item && pacManRef.current.position.distanceTo(item.position) < 0.5) {
        scene.remove(item); // アイテムをシーンから削除
        itemsRef.current[index] = null; // 参照をnullに設定
        setCollectedItems(prev => [...prev, item]); // 収集済みアイテムに追加
      }
    });
  });

  useEffect(() => {
    if (collectedItems.length === 30) {
      // すべてのアイテムを収集したらアラートを表示
      alert("ゲームクリア！");
    }
  }, [collectedItems]);

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