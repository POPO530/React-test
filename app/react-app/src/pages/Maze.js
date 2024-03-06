// three.jsライブラリをインポート
import * as THREE from 'three';

// 迷路の壁を作成する関数
const createWall = (width, height, depth, position, scene, wallMaterial) => {
  // BoxGeometryを用いて壁のジオメトリを作成
  const wallGeometry = new THREE.BoxGeometry(width, height, depth);
  // 作成したジオメトリとマテリアルからメッシュを作成
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  // メッシュの位置を設定
  wall.position.set(...position);
  // シーンにメッシュを追加
  scene.add(wall);
  // 作成した壁のメッシュを返す
  return wall;
};

// 迷路の壁を作成してsceneに追加する関数
export const createMazeWalls = (scene) => {
  // 壁のマテリアルを定義（色は青）
  const wallMaterial = new THREE.MeshBasicMaterial({ color: 'blue' });
  // すべての壁を保持する配列
  const walls = [];

  // 壁のデータ（位置とサイズ）
  const wallData = [
    { w: 10, h: 1, d: 1, pos: [-3, 4, 0] },  // 上部左の水平壁
    { w: 10, h: 1, d: 1, pos: [3, 4, 0] },   // 上部右の水平壁
    { w: 1, h: 10, d: 1, pos: [-7, 0, 0] },  // 左上の垂直壁
    { w: 1, h: 10, d: 1, pos: [7, 0, 0] },   // 右上の垂直壁
    { w: 10, h: 1, d: 1, pos: [-3, -4, 0] }, // 左下の垂直壁
    { w: 10, h: 1, d: 1, pos: [3, -4, 0] },  // 右下の垂直壁
  ];

  // 各壁データに基づき壁を作成し、walls配列に追加
  wallData.forEach(({ w, h, d, pos }) => {
    walls.push(createWall(w, h, d, pos, scene, wallMaterial));
  });

  // 作成したすべての壁を含む配列を返す
  return walls;
};

// 壁との衝突を検出する関数
export const detectCollision = (newPos, walls) => {
  // パックマンの半径
  const pacManRadius = 0.5;

  // 壁との衝突検出ロジック
  return walls.some(wall => {
    // 壁の境界を計算
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

    // パックマンの境界を計算
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

    // 2D平面での衝突判定を行い、壁とパックマンが交差しているかどうかを返す
    return (pacManBounds.min.x <= wallBounds.max.x && pacManBounds.max.x >= wallBounds.min.x) &&
           (pacManBounds.min.y <= wallBounds.max.y && pacManBounds.max.y >= wallBounds.min.y);
  });
};