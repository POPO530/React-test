// three.js ライブラリ全体を THREE という名前でインポートします。これにより、3D シーンの作成に必要な機能にアクセスできます。
import * as THREE from 'three';

// 'getItemBox' 関数を定義します。この関数は、特定の位置にあるアイテムの境界ボックス（Box3）を生成します。
const getItemBox = (position, itemSize = 0.2) => {
  // アイテムの半分のサイズを計算します。
  const itemHalfSize = itemSize / 2;
  // アイテムの最小角を表す Vector3 を生成します。
  const min = new THREE.Vector3(position.x - itemHalfSize, position.y - itemHalfSize, position.z - itemHalfSize);
  // アイテムの最大角を表す Vector3 を生成します。
  const max = new THREE.Vector3(position.x + itemHalfSize, position.y + itemHalfSize, position.z + itemHalfSize);
  // 最小角と最大角を使用して Box3（境界ボックス）を生成し、返します。
  return new THREE.Box3(min, max);
};

// 'createItem' 関数を定義します。この関数は、指定されたシーンにアイテムを生成して追加します。
const createItem = (scene, mazeBounds) => {
  // 生成するアイテムの数を定義します。
  const itemCount = 30;
  // アイテムのサイズを定義します。
  const itemSize = 0.2;
  // アイテムの形状（ジオメトリ）を BoxGeometry を使用して生成します。
  const itemGeometry = new THREE.BoxGeometry(itemSize, itemSize, itemSize);
  // アイテムのマテリアル（材質）を MeshBasicMaterial を使用して生成します。色は赤に設定します。
  const itemMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
  // 生成されたアイテムを格納する配列を初期化します。
  const items = [];

  // アイテムの数だけ繰り返して各アイテムを生成します。
  while (items.length < itemCount) {
    // アイテムを配置するランダムな位置を生成します。位置は迷路の境界内に制限されます。
    const randomPosition = new THREE.Vector3(
      THREE.MathUtils.randFloat(mazeBounds.min.x + itemSize, mazeBounds.max.x - itemSize),
      THREE.MathUtils.randFloat(mazeBounds.min.y + itemSize, mazeBounds.max.y - itemSize),
      0
    );

    // アイテムのメッシュ（形状と材質の組み合わせ）を生成します。
    const itemMesh = new THREE.Mesh(itemGeometry, itemMaterial);
    // 生成したメッシュの位置を設定します。
    itemMesh.position.copy(randomPosition);
    // メッシュをシーンに追加します。
    scene.add(itemMesh);
    // 生成したメッシュをアイテム配列に追加します。
    items.push(itemMesh);
  }

  // 生成したアイテムの配列を返します。
  return items;
};

// createItem 関数をデフォルトでエクスポートします。これにより、他のファイルからこの関数をインポートして使用できます。
export default createItem;