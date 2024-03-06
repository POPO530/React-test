// ReactのuseRefとuseEffectフックをインポート
import React, { useRef, useEffect } from 'react';
// @react-three/fiberからuseFrameフックをインポート
import { useFrame } from '@react-three/fiber';
// three.jsライブラリを全てTHREEとしてインポート
import * as THREE from 'three';

// Enemyコンポーネントの定義。propsとしてpacManPositionを受け取る
const Enemy = ({ pacManPosition }) => {
  // enemyRefを用いて敵キャラクターの3Dオブジェクトを参照する
  const enemyRef = useRef(null);

  // コンポーネントがマウントされた時に一度だけ実行されるuseEffectフック
  useEffect(() => {
    // 敵キャラクターのMesh（形状と材料）を作成
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 'purple' });
    enemyRef.current = new THREE.Mesh(geometry, material);

    // パックマンの位置から少し離れた位置にエネミーを配置する
    enemyRef.current.position.x = pacManPosition[0] + 5; // X軸でパックマンから5ユニット離れる
    enemyRef.current.position.y = pacManPosition[1] + 5; // Y軸でパックマンから5ユニット離れる
  }, []); // 依存配列を空に設定してマウント時のみ実行

  // フレームが更新されるたびに実行されるuseFrameフック
  useFrame(() => {
    if (!enemyRef.current || !pacManPosition) return;
    
    // パックマンの位置と敵の位置から移動方向を計算
    const pacManPosVec = new THREE.Vector3(...pacManPosition);
    const enemyPos = enemyRef.current.position;
    const direction = new THREE.Vector3().subVectors(pacManPosVec, enemyPos).normalize();
    
    // 敵のスピードを設定して、計算した方向に移動させる
    const speed = 0.01; // スピードを遅く設定
    enemyPos.add(direction.multiplyScalar(speed));
  });

  if (!enemyRef.current) {
    // enemyRef.currentが未定義の場合、何もレンダリングしない
    return null;
  }

  // enemyRef.currentが有効なら、敵キャラクターをレンダリングする
  return <primitive object={enemyRef.current} />;
};

// Enemyコンポーネントをエクスポート
export default Enemy;