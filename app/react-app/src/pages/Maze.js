// three.js ライブラリ全体を THREE という名前でインポートします。
import * as THREE from 'three';

// 壁を作成する関数。壁のサイズ、位置、シーン、壁のマテリアルを引数に取ります。
const createWall = (width, height, depth, position, scene, wallMaterial) => {
  // THREE.BoxGeometry を使用して、壁のジオメトリ（形状）を作成します。
  const wallGeometry = new THREE.BoxGeometry(width, height, depth);
  // ジオメトリとマテリアルから、壁のメッシュ（実体）を作成します。
  const wall = new THREE.Mesh(wallGeometry, wallMaterial);
  // 壁の位置を設定します。
  wall.position.set(...position);
  // 作成した壁をシーンに追加します。
  scene.add(wall);
  // 作成した壁を戻り値として返します。
  return wall;
};

// 迷路の壁を作成し、迷路の境界を定義する関数をエクスポートします。
export const createMazeWalls = (scene) => {
  // 壁のマテリアルを作成します。ここでは青色を指定しています。
  const wallMaterial = new THREE.MeshBasicMaterial({ color: 'blue' });
  // 壁の配列を初期化します。
  const walls = [];

  // 壁のデータを配列で定義します。各壁は幅（w）、高さ（h）、奥行き（d）、位置（pos）を持ちます。
  const wallData = [
    { w: 10, h: 1, d: 1, pos: [-3, 4, 0] },
    { w: 10, h: 1, d: 1, pos: [3, 4, 0] },
    { w: 1, h: 10, d: 1, pos: [-7, 0, 0] },
    { w: 1, h: 10, d: 1, pos: [7, 0, 0] },
    { w: 10, h: 1, d: 1, pos: [-3, -4, 0] },
    { w: 10, h: 1, d: 1, pos: [3, -4, 0] },
  ];

  // 定義した壁のデータに基づき、壁を作成し、walls 配列に追加します。
  wallData.forEach(({ w, h, d, pos }) => {
    walls.push(createWall(w, h, d, pos, scene, wallMaterial));
  });

  // 迷路の境界を計算し、定義します。これは後で衝突検出などに使用されます。
  const mazeBounds = {
    min: { x: -7, y: -4 },
    max: { x: 7, y: 4 }
  };

  // 作成した壁の配列と迷路の境界を含むオブジェクトを戻り値として返します。
  return { walls, mazeBounds };
};

// プレイヤーキャラクター（Pac-Man）と壁との衝突を検出する関数をエクスポートします。
export const detectCollision = (newPos, walls) => {
  // Pac-Man の半径を定義します。これは衝突検出に使用されます。
  const pacManRadius = 0.5;
  // 壁のいずれかとの衝突を検出するために、配列の some メソッドを使用します。
  return walls.some(wall => {
    // 壁の境界を計算します。
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

    // Pac-Man の境界を計算します。
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

    // 壁と Pac-Man の境界が重なっているかどうかをチェックし、重なっていれば true（衝突している）を返します。
    // このロジックは、z軸を無視した2Dのx軸とy軸でのみ衝突判定を行います。
    return (pacManBounds.min.x <= wallBounds.max.x && pacManBounds.max.x >= wallBounds.min.x) &&
           (pacManBounds.min.y <= wallBounds.max.y && pacManBounds.max.y >= wallBounds.min.y);
  });
};