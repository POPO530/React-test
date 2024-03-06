import * as THREE from 'three';

const itemCount = 30;
const minDistance = 1; // パックマンの初期位置からの最小距離
const itemSize = 0.2; // アイテムのサイズ

// アイテムのBoundingBoxを計算する関数
const getItemBox = (position) => {
  const itemHalfSize = itemSize / 2;
  const min = new THREE.Vector3(position.x - itemHalfSize, position.y - itemHalfSize, position.z - itemHalfSize);
  const max = new THREE.Vector3(position.x + itemHalfSize, position.y + itemHalfSize, position.z + itemHalfSize);
  return new THREE.Box3(min, max);
};

// 壁のBoundingBoxを計算する関数
const getWallBox = (wall) => {
  const wallHalfSizeX = wall.geometry.parameters.width / 2;
  const wallHalfSizeY = wall.geometry.parameters.height / 2;
  const min = new THREE.Vector3(wall.position.x - wallHalfSizeX, wall.position.y - wallHalfSizeY, wall.position.z);
  const max = new THREE.Vector3(wall.position.x + wallHalfSizeX, wall.position.y + wallHalfSizeY, wall.position.z);
  return new THREE.Box3(min, max);
};

const createItem = (scene, walls, pacManPosition) => {
  const itemGeometry = new THREE.BoxGeometry(itemSize, itemSize, itemSize);
  const itemMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
  let items = []; // 修正：items配列を関数の最初で宣言

  while (items.length < itemCount) {
    const randomPosition = new THREE.Vector3(
      THREE.MathUtils.randFloatSpread(20),
      THREE.MathUtils.randFloatSpread(20),
      0
    );

    const distanceToPacMan = randomPosition.distanceTo(new THREE.Vector3(...pacManPosition));
    if (distanceToPacMan < minDistance) continue;

    const itemBox = getItemBox(randomPosition);
    const isInsideAnyWall = walls.some(wall => {
      const wallBox = getWallBox(wall);
      return itemBox.intersectsBox(wallBox);
    });

    if (!isInsideAnyWall) {
      const itemMesh = new THREE.Mesh(itemGeometry, itemMaterial);
      itemMesh.position.copy(randomPosition);
      scene.add(itemMesh);
      items.push(itemMesh); // 修正：生成されたアイテムを配列に追加
    }
  }

  return items; // 修正：生成されたアイテムの配列を返す
};

export default createItem;