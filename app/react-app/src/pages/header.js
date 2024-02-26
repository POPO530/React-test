import React from "react";

function Header() {
  return (
    <header className="app-header">
      <nav>
        <ul className="nav-list">
          <li><a href="/" className="nav-link">ホーム</a></li>
          <li><a href="/setting" className="nav-link">設定</a></li>
          <li><a href="/game" className="nav-link">ゲーム</a></li>
          <li><a href="/1kuji" className="nav-link">1番くじ</a></li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;