import * as THREE from 'three';

const getItemBox = (position, itemSize = 0.2) => {
  const itemHalfSize = itemSize / 2;
  const min = new THREE.Vector3(position.x - itemHalfSize, position.y - itemHalfSize, position.z - itemHalfSize);
  const max = new THREE.Vector3(position.x + itemHalfSize, position.y + itemHalfSize, position.z + itemHalfSize);
  return new THREE.Box3(min, max);
};

const createItem = (scene, mazeBounds) => {
  const itemCount = 30;
  const itemSize = 0.2;
  const itemGeometry = new THREE.BoxGeometry(itemSize, itemSize, itemSize);
  const itemMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
  const items = [];

  while (items.length < itemCount) {
    const randomPosition = new THREE.Vector3(
      THREE.MathUtils.randFloat(mazeBounds.min.x + itemSize, mazeBounds.max.x - itemSize),
      THREE.MathUtils.randFloat(mazeBounds.min.y + itemSize, mazeBounds.max.y - itemSize),
      0
    );

    // アイテムが壁の中になければ、アイテムをシーンに追加します。
    const itemMesh = new THREE.Mesh(itemGeometry, itemMaterial);
    itemMesh.position.copy(randomPosition);
    scene.add(itemMesh);
    items.push(itemMesh);
  }

  return items;
};

export default createItem;