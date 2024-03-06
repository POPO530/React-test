import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Enemy = ({ pacManPosition, bulletPosition }) => {
  const enemyRef = useRef(null);
  const [isAlive, setIsAlive] = useState(true);

  useEffect(() => {
    // 敵キャラクターの Mesh を作成
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 'purple' });
    enemyRef.current = new THREE.Mesh(geometry, material);

    // パックマンの位置から少し離れた位置にエネミーを配置する
    enemyRef.current.position.x = pacManPosition[0] + 3; // X軸に3ユニット離れる
    enemyRef.current.position.y = pacManPosition[1] + 3; // Y軸に3ユニット離れる
  }, []); // 依存配列を空にしてマウント時のみ実行

  useFrame(() => {
    if (!enemyRef.current || !isAlive) return;
    
    const pacManPosVec = new THREE.Vector3(...pacManPosition);
    const enemyPos = enemyRef.current.position;
    const direction = new THREE.Vector3().subVectors(pacManPosVec, enemyPos).normalize();
    
    // スピードをさらに遅くする
    const speed = 0.01;
    enemyPos.add(direction.multiplyScalar(speed));

    // 弾との衝突検出
    if (bulletPosition) {
      const enemyPos = enemyRef.current.position;
      const bulletPosVec = new THREE.Vector3(...bulletPosition);
      if (bulletPosVec.distanceTo(enemyPos) < 0.5) { // 衝突判定の範囲を設定
        setIsAlive(false); // 敵を消滅させる
        enemyRef.current.visible = false; // 敵を非表示にする
      }
    }
  });

  if (!isAlive || !enemyRef.current) {
    // enemyRef.currentが未定義の場合は何もレンダリングしない
    return null;
  }

  // enemyRef.currentが有効ならレンダリングする
  return <primitive object={enemyRef.current} />;
};

export default Enemy;