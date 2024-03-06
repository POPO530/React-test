import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createMazeWalls, detectCollision } from './Maze';
import createItem from './Item';

const PacMan = ({ setRemainingItems, setGameCleared }) => {
  const pacManRef = useRef();
  const [position, setPosition] = useState([0, 0, 0]);
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
    items.forEach((item, index) => {
      if (item && pacManRef.current.position.distanceTo(item.position) < 0.5) {
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

  // パックマンの形状を作成
  const createPacMan = () => {
    const geometry = new THREE.SphereGeometry(0.5, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 'yellow' });
    return new THREE.Mesh(geometry, material);
  };

  return <primitive object={createPacMan()} ref={pacManRef} position={position} />;
};

export default PacMan;