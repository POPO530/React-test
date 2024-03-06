import * as THREE from 'three';

// 迷路の壁の位置とサイズを定義する関数
const createWall = (width, height, depth, position, scene, wallMaterial) => {
  // ボックスジオメトリを使用して壁を作成
  const wallGeometry = new THREE.BoxGeometry(width, height, depth);
  // メッシュを作成し、位置を設定してシーンに追加
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  wall.position.set(...position);
  scene.add(wall);
  return wall;
};

// 迷路の壁を作成してsceneに追加する関数
export const createMazeWalls = (scene) => {
  // 壁のマテリアルを定義
  const wallMaterial = new THREE.MeshBasicMaterial({ color: 'blue' });
  const walls = [];

  // 壁のデータ
  const wallData = [
    { w: 10, h: 1, d: 1, pos: [-3, 4, 0] },  // 上部左の水平壁
    { w: 10, h: 1, d: 1, pos: [3, 4, 0] },   // 上部右の水平壁
    { w: 1, h: 10, d: 1, pos: [-7, 0, 0] },  // 左上の垂直壁
    { w: 1, h: 10, d: 1, pos: [7, 0, 0] },   // 右上の垂直壁
    { w: 10, h: 1, d: 1, pos: [-3, -4, 0] }, // 左下の垂直壁
    { w: 10, h: 1, d: 1, pos: [3, -4, 0] },  // 右下の垂直壁
  ];

  // 壁データに基づいて壁を作成し、walls配列に追加
  wallData.forEach(({ w, h, d, pos }) => {
    walls.push(createWall(w, h, d, pos, scene, wallMaterial));
  });

  return walls;
};

// 壁との衝突を検出する関数
export const detectCollision = (newPos, walls) => {
  // パックマンの半径
  const pacManRadius = 0.5;

  // 壁との衝突を検出するロジック
  return walls.some(wall => {
    // 壁の範囲を計算
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

    // パックマンの範囲を計算
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

    // 2Dでの衝突判定を行う
    return (pacManBounds.min.x <= wallBounds.max.x && pacManBounds.max.x >= wallBounds.min.x) &&
           (pacManBounds.min.y <= wallBounds.max.y && pacManBounds.max.y >= wallBounds.min.y);
  });
};