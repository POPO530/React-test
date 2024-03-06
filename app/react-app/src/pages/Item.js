import * as THREE from 'three';

const itemCount = 30;
const itemSize = 0.2; // アイテムのサイズ

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

  // ランダムな位置を壁の内側エリアから選択
  const x = THREE.MathUtils.randFloat(minX + itemSize, maxX - itemSize);
  const y = THREE.MathUtils.randFloat(minY + itemSize, maxY - itemSize);
  return new THREE.Vector3(x, y, 0); // z軸はゲームフィールドに合わせて0
};

const createItem = (scene, walls, pacManPosition) => {
  const itemGeometry = new THREE.BoxGeometry(itemSize, itemSize, itemSize);
  const itemMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
  let items = [];

  while (items.length < itemCount) {
    const randomPosition = getRandomPositionInsideWalls(walls);

    // パックマンの位置との距離を確認して、近すぎる場合は再試行
    if (randomPosition.distanceTo(new THREE.Vector3(...pacManPosition)) < 2) continue;

    const itemMesh = new THREE.Mesh(itemGeometry, itemMaterial);
    itemMesh.position.copy(randomPosition);
    scene.add(itemMesh);
    items.push(itemMesh);
  }

  return items;
};

export default createItem;