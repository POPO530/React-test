import * as THREE from 'three';

// アイテムの数
const itemCount = 30;
// アイテムのサイズ
const itemSize = 0.2;

// 壁の内側にアイテムを配置するための位置を計算する関数
const getRandomPositionInsideWalls = (walls) => {
  // 壁の内側のエリアを計算
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  walls.forEach(wall => {
    const wallX = wall.position.x;
    const wallY = wall.position.y;
    const width = wall.geometry.parameters.width;
    const height = wall.geometry.parameters.height;

    minX = Math.min(minX, wallX - width / 2);
    maxX = Math.max(maxX, wallX + width / 2);
    minY = Math.min(minY, wallY - height / 2);
    maxY = Math.max(maxY, wallY + height / 2);
  });

  // 壁の内側エリアからランダムな位置を選択
  const x = THREE.MathUtils.randFloat(minX + itemSize, maxX - itemSize);
  const y = THREE.MathUtils.randFloat(minY + itemSize, maxY - itemSize);
  return new THREE.Vector3(x, y, 0); // z軸はゲームフィールドに合わせて0
};

// アイテムを生成する関数
const createItem = (scene, walls, pacManPosition) => {
  // アイテムのジオメトリとマテリアルを作成
  const itemGeometry = new THREE.BoxGeometry(itemSize, itemSize, itemSize);
  const itemMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
  let items = [];

  // 指定された数のアイテムを生成
  while (items.length < itemCount) {
    // 壁の内側からランダムな位置を取得
    const randomPosition = getRandomPositionInsideWalls(walls);

    // パックマンの位置との距離が近すぎる場合は再試行
    if (randomPosition.distanceTo(new THREE.Vector3(...pacManPosition)) < 2) continue;

    // アイテムのメッシュを作成し、シーンに追加
    const itemMesh = new THREE.Mesh(itemGeometry, itemMaterial);
    itemMesh.position.copy(randomPosition);
    scene.add(itemMesh);
    items.push(itemMesh);
  }

  return items;
};

// createItem 関数をエクスポート
export default createItem;