import * as THREE from 'three';

// アイテムを壁の内側に配置するためのランダムな位置を計算する関数
const getRandomPositionInsideWalls = (walls, detectCollision) => {
  // 壁の外側領域の最小値と最大値を初期化
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

  // 全ての壁オブジェクトに対してループ
  walls.forEach(wall => {
    // 壁の位置を取得
    const wallX = wall.position.x;
    const wallY = wall.position.y;
    // 壁の幅と高さを取得
    const width = wall.geometry.parameters.width;
    const height = wall.geometry.parameters.height;

    // 壁の範囲を基に最小値と最大値を更新
    minX = Math.min(minX, wallX - width / 2);
    maxX = Math.max(maxX, wallX + width / 2);
    minY = Math.min(minY, wallY - height / 2);
    maxY = Math.max(maxY, wallY + height / 2);
  });

  let position;
  const itemSize = 0.5; // アイテムのサイズを仮定
  do {
    // ランダムなX,Y座標を計算（アイテムが壁に収まるようにする）
    const x = THREE.MathUtils.randFloat(minX + itemSize, maxX - itemSize);
    const y = THREE.MathUtils.randFloat(minY + itemSize, maxY - itemSize);
    position = [x, y, 0]; // Z座標は0とする
  } while (detectCollision(position, walls)); // 計算された位置が壁と衝突しないことを確認

  return new THREE.Vector3(...position); // 3Dベクトルとして位置を返す
};

// アイテムを作成する関数
const createItem = (scene, walls, pacmanPosition, detectCollision) => {
  const items = []; // 生成されたアイテムを格納する配列
  const numItems = 10; // 生成するアイテムの数

  // 指定された数のアイテムを生成
  for (let i = 0; i < numItems; i++) {
    // アイテムの位置を計算
    const position = getRandomPositionInsideWalls(walls, detectCollision);
    
    // アイテム（球体）のジオメトリとマテリアルを作成
    const geometry = new THREE.SphereGeometry(0.2, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // 緑色で設定
    const item = new THREE.Mesh(geometry, material); // メッシュを作成
    item.position.set(position.x, position.y, position.z); // アイテムの位置を設定
    
    // アイテムをシーンに追加
    scene.add(item);
    items.push(item); // アイテム配列に追加
  }

  return items; // 生成されたアイテムの配列を返す
};

export default createItem;