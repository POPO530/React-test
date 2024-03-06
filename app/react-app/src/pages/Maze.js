// Maze.js
import * as THREE from 'three';

// 迷路の壁の位置とサイズを定義する関数
const createWall = (width, height, depth, position, scene, wallMaterial) => {
  const wallGeometry = new THREE.BoxGeometry(width, height, depth);
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.set(...position);
  scene.add(wall);
  return wall;
};

// 迷路の壁を作成してsceneに追加する関数
export const createMazeWalls = (scene) => {
  const wallMaterial = new THREE.MeshBasicMaterial({ color: 'blue' });
  const walls = [];

  // 壁のデータ（変更なし）
  const wallData = [
    // 現在の壁データをそのまま使用
    { w: 10, h: 1, d: 1, pos: [-3, 4, 0] },  // 上部左の水平壁
    { w: 10, h: 1, d: 1, pos: [3, 4, 0] },   // 上部右の水平壁
    { w: 1, h: 10, d: 1, pos: [-7, 0, 0] },  // 左上の垂直壁
    { w: 1, h: 10, d: 1, pos: [7, 0, 0] },   // 右上の垂直壁
    { w: 10, h: 1, d: 1, pos: [-3, -4, 0] }, // 左下の垂直壁
    { w: 10, h: 1, d: 1, pos: [3, -4, 0] },  // 右下の垂直壁
  ];

  // 定義したデータに基づいて壁を作成
  wallData.forEach(({ w, h, d, pos }) => {
    walls.push(createWall(w, h, d, pos, scene, wallMaterial));
  });

  return walls;
};

// 壁との衝突を検出する関数
export const detectCollision = (newPos, walls) => {
  const pacManRadius = 0.5; // パックマンの半径
  // 衝突判定ロジックの修正
  return walls.some(wall => {
    const wallBounds = {
      min: {
        x: wall.position.x - wall.geometry.parameters.width / 2,
        y: wall.position.y - wall.geometry.parameters.height / 2
      },
      max: {
        x: wall.position.x + wall.geometry.parameters.width / 2,
        y: wall.position.y + wall.geometry.parameters.height / 2
      }
    };

    const pacManBounds = {
      min: {
        x: newPos[0] - pacManRadius,
        y: newPos[1] - pacManRadius
      },
      max: {
        x: newPos[0] + pacManRadius,
        y: newPos[1] + pacManRadius
      }
    };

    // 3D空間のz軸判定を削除し、2Dのx軸とy軸でのみ衝突判定を行う
    return (pacManBounds.min.x <= wallBounds.max.x && pacManBounds.max.x >= wallBounds.min.x) &&
           (pacManBounds.min.y <= wallBounds.max.y && pacManBounds.max.y >= wallBounds.min.y);
  });
};