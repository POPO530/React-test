// three.js ライブラリ全体を THREE という名前でインポートします。
import * as THREE from 'three';

// アイテムのバウンディングボックス（衝突判定ボックス）を取得する関数。
const getItemBox = (position, itemSize = 0.2) => {
  // アイテムサイズの半分を計算します。
  const itemHalfSize = itemSize / 2;
  // バウンディングボックスの最小座標を計算します。
  const min = new THREE.Vector3(position.x - itemHalfSize, position.y - itemHalfSize, position.z - itemHalfSize);
  // バウンディングボックスの最大座標を計算します。
  const max = new THREE.Vector3(position.x + itemHalfSize, position.y + itemHalfSize, position.z + itemHalfSize);
  // 計算した最小座標と最大座標を使用して、THREE.Box3 オブジェクトを作成し返します。
  return new THREE.Box3(min, max);
};

// シーンにアイテムを作成し追加する関数。
const createItem = (scene, walls, pacManPosition, mazeBounds) => {
  // 作成するアイテムの総数を定義します。
  const itemCount = 30;
  // アイテムとPac-Manの間の最小距離を定義します。
  const minDistance = 1;
  // アイテムのサイズを定義します。
  const itemSize = 0.2;
  // アイテムのジオメトリ（形状）を作成します。
  const itemGeometry = new THREE.BoxGeometry(itemSize, itemSize, itemSize);
  // アイテムのマテリアル（材質）を作成します。ここでは赤色を指定しています。
  const itemMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
  // 作成されたアイテムを格納する配列を初期化します。
  const items = [];

  // itemCount の数だけアイテムを作成するまでループします。
  while (items.length < itemCount) {
    // 迷路の境界内でランダムな位置を生成します。
    const randomPosition = new THREE.Vector3(
      THREE.MathUtils.randFloat(mazeBounds.min.x + itemSize, mazeBounds.max.x - itemSize),
      THREE.MathUtils.randFloat(mazeBounds.min.y + itemSize, mazeBounds.max.y - itemSize),
      0
    );

    // 生成された位置とPac-Manとの距離を計算します。
    const distanceToPacMan = randomPosition.distanceTo(new THREE.Vector3(...pacManPosition));
    // この距離が最小距離より小さい場合、次のループへスキップします。
    if (distanceToPacMan < minDistance) continue;

    // アイテムのバウンディングボックスを取得します。
    const itemBox = getItemBox(randomPosition, itemSize);
    // アイテムがどの壁の中にも存在しないかをチェックします。
    const isInsideAnyWall = walls.some(wall => {
      const wallBox = getItemBox(wall.position, wall.geometry.parameters.width / 2);
      return itemBox.intersectsBox(wallBox);
    });

    // アイテムが壁の中になければ、アイテムをシーンに追加します。
    if (!isInsideAnyWall) {
      const itemMesh = new THREE.Mesh(itemGeometry, itemMaterial);
      itemMesh.position.copy(randomPosition);
      scene.add(itemMesh);
      items.push(itemMesh);
    }
  }

  // 作成されたアイテムの配列を返します。
  return items;
};

// createItem 関数をデフォルトエクスポートします。
export default createItem;