import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Enemy = ({ pacManPosition }) => {
  const enemyRef = useRef(null);

  useEffect(() => {
    // 敵キャラクターの Mesh を作成
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 'purple' });
    enemyRef.current = new THREE.Mesh(geometry, material);

    // パックマンの位置から少し離れた位置にエネミーを配置する
    enemyRef.current.position.x = pacManPosition[0] + 5; // X軸に5ユニット離れる
    enemyRef.current.position.y = pacManPosition[1] + 5; // Y軸に5ユニット離れる
  }, []); // 依存配列を空にしてマウント時のみ実行

  useFrame(() => {
    if (!enemyRef.current || !pacManPosition) return;
    
    const pacManPosVec = new THREE.Vector3(...pacManPosition);
    const enemyPos = enemyRef.current.position;
    const direction = new THREE.Vector3().subVectors(pacManPosVec, enemyPos).normalize();
    
    // スピードをさらに遅くする
    const speed = 0.01;
    enemyPos.add(direction.multiplyScalar(speed));
  });

  if (!enemyRef.current) {
    // enemyRef.currentが未定義の場合は何もレンダリングしない
    return null;
  }

  // enemyRef.currentが有効ならレンダリングする
  return <primitive object={enemyRef.current} />;
};

export default Enemy;