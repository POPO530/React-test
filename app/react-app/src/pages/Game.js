// React ライブラリをインポートします。これにより、React の機能をこのファイル内で使用できるようになります。
import React from 'react';
// '@react-three/fiber' ライブラリから Canvas コンポーネントをインポートします。これは、3D シーンをレンダリングするためのコンテナとして機能します。
import { Canvas } from '@react-three/fiber';
// 同じディレクトリ内の 'PacMan' コンポーネントをインポートします。これは、ゲーム内の Pac-Man キャラクターを表すコンポーネントです。
import PacMan from './PacMan';

// 'Game' という名前の関数コンポーネントを定義します。このコンポーネントは、ゲームのメインシーンを構築します。
const Game = () => {
  // コンポーネントがレンダリングする JSX を return 文を通じて返します。
  return (
    // 'game-container' というクラス名を持つ div 要素を作成します。これにより、CSS スタイルを適用するためのフックが提供されます。
    <div className="game-container">
      {/* Canvas コンポーネントをレンダリングします。これは、3D シーンを描画するための領域を提供します。 */}
      <Canvas>
        {/* ambientLight コンポーネントを使用して、シーンに全方向から均等に光を当てる環境光を追加します。intensity 属性で光の強度を設定します。 */}
        <ambientLight intensity={0.5} />
        {/* pointLight コンポーネントを使用して、特定の位置から光を放つ点光源をシーンに追加します。position 属性で光源の位置を設定します。 */}
        <pointLight position={[10, 10, 10]} />
        {/* PacMan コンポーネントをレンダリングします。これは、ゲーム内の Pac-Man キャラクターを表現します。 */}
        <PacMan />
      </Canvas>
    </div>
  );
};

// Game コンポーネントをエクスポートします。これにより、他のファイルからこのコンポーネントをインポートして使用することが可能になります。
export default Game;