import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Enemy = ({ pacManPosition }) => {
  const enemyRef = useRef();

  useFrame(() => {
    if (!enemyRef.current || !pacManPosition) return;
    
    // パックマンの位置ベクトル
    const pacManPosVec = new THREE.Vector3(...pacManPosition);
    // エネミーの現在位置
    const enemyPos = enemyRef.current.position;
    // パックマンへの方向を計算
    const direction = new THREE.Vector3().subVectors(pacManPosVec, enemyPos).normalize();
    // エネミーの速度
    const speed = 0.02;
    // エネミーをパックマンの方向に移動
    enemyPos.add(direction.multiplyScalar(speed));
  });

  // 敵キャラクターの Mesh を作成
  const enemyMesh = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshBasicMaterial({ color: 'purple' })
  );

  return <primitive object={enemyMesh} ref={enemyRef} position={[2, 2, 0]} />;
};

export default Enemy;