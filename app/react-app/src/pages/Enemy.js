import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Enemy = ({ pacManPosition, bulletPosition }) => {
  const [isVisible, setIsVisible] = useState(true);
  const enemyRef = useRef();

  useEffect(() => {
    // 敵キャラクターの Mesh を作成して ref に割り当て
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 'purple' });
    enemyRef.current = new THREE.Mesh(geometry, material);

    // ここでは enemyRef.current を直接シーンに追加しないでください。
    // この操作は <primitive> コンポーネント内で行われます。
  }, []); // 依存配列を空にしてマウント時のみ実行

  useFrame(({ scene }) => {
    // enemyRef.current が存在するかをチェック
    if (!enemyRef.current || !isVisible) return;

    // パックマンの位置を THREE.Vector3 で表現
    const pacManPosVec = new THREE.Vector3(...pacManPosition);
    const enemyPos = enemyRef.current.position;
    const direction = new THREE.Vector3().subVectors(pacManPosVec, enemyPos).normalize();

    // スピードを調整
    const speed = 0.01;
    enemyPos.add(direction.multiplyScalar(speed));

    // 弾との衝突判定
    if (bulletPosition && isVisible) {
      const bulletPosVec = new THREE.Vector3(...bulletPosition);
      if (bulletPosVec.distanceTo(enemyPos) < 0.5) {
        setIsVisible(false); // 敵を非表示にする
        // ここで、必要に応じて enemyRef.current をシーンから削除することもできます
        // scene.remove(enemyRef.current);
      }
    }
  });

  // isVisible 状態に基づいて enemyRef.current を条件付きでレンダリング
  return isVisible && enemyRef.current ? <primitive object={enemyRef.current} /> : null;
};

export default Enemy;