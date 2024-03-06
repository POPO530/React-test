// three.jsライブラリをインポート
import * as THREE from 'three';

// アイテムの総数を定義
const itemCount = 30;
// 各アイテムのサイズを定義
const itemSize = 0.2;

// 壁の内側にアイテムを配置するためのランダムな位置を計算する関数
const getRandomPositionInsideWalls = (walls) => {
  // 壁に囲まれたエリアの最小および最大のX,Y座標を初期化
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  // 各壁オブジェクトに対して処理を行い、エリアのサイズを計算
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

  // 計算されたエリア内でランダムな位置を生成
  const x = THREE.MathUtils.randFloat(minX + itemSize, maxX - itemSize);
  const y = THREE.MathUtils.randFloat(minY + itemSize, maxY - itemSize);
  // 生成した位置情報をもとに3D空間上の位置ベクトルを返す（Z座標は0とする）
  return new THREE.Vector3(x, y, 0);
};

// シーンにアイテムを生成して配置する関数
const createItem = (scene, walls, pacManPosition) => {
  // アイテムの形状(ジオメトリ)と材質(マテリアル)を定義
  const itemGeometry = new THREE.BoxGeometry(itemSize, itemSize, itemSize);
  const itemMaterial = new THREE.MeshBasicMaterial({ color: 'red' });
  let items = [];

  // itemCountの数だけアイテムを生成する
  while (items.length < itemCount) {
    // 壁の内側にあるランダムな位置を取得
    const randomPosition = getRandomPositionInsideWalls(walls);

    // 生成した位置がパックマンの初期位置から一定距離以上離れているか確認
    if (randomPosition.distanceTo(new THREE.Vector3(...pacManPosition)) < 2) continue;

    // 条件を満たした場合、アイテムのメッシュ(3Dオブジェクト)を生成し、シーンに追加
    const itemMesh = new THREE.Mesh(itemGeometry, itemMaterial);
    itemMesh.position.copy(randomPosition);
    scene.add(itemMesh);
    // アイテムリストに追加
    items.push(itemMesh);
  }

  // 生成された全アイテムのリストを返す
  return items;
};

// createItem関数をエクスポート
export default createItem;