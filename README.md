# カミウエ社会保険労務士事務所 — リファクタリング後ファイル構成

## 概要

元の `index.html`（3,076行）・`script.js`（1,427行）を機能別に分割しました。  
**コンテンツ・ロジックは一切変更していません。**  
`style.css` はそのまま維持しています。

---

## ディレクトリ構成

```
/
├── index.html              # エントリーポイント（ヘッダー・フッター・共通構造）
├── style.css               # スタイルシート（変更なし）
├── columns-data.js         # コラムデータ（既存・変更なし）
│
├── pages/                  # ページ別 HTML フラグメント
│   ├── page-home.html              ホームページ
│   ├── page-services.html          サービス・料金
│   ├── page-about.html             事務所紹介
│   ├── page-faq.html               よくある質問
│   ├── page-links.html             関連リンク
│   ├── page-contact.html           お問い合わせ
│   ├── page-blog.html              労務管理コラム（記事詳細含む）
│   ├── page-tools-diagnostic.html  労務リスク診断 + 助成金診断
│   ├── page-salary-calc.html       給与計算ツール
│   ├── page-download.html          無料資料ダウンロード（サンクスページ含む）
│   ├── page-price-sim.html         料金シミュレーター
│   ├── page-solutions.html         ソリューション詳細
│   └── page-spot.html              スポット手続き依頼
│
└── js/                     # JavaScript（機能別分割）
    ├── page-loader.js          ページ動的ロード（pages/ を fetch して注入）
    ├── nav.js                  ページ表示制御・ナビゲーション・ソリューションデータ
    ├── chatbot.js              チャットボット
    ├── hero.js                 ヒーロー画像クロスフェード
    ├── tools-download.js       無料資料ダウンロード機能
    ├── tools-price-sim.js      料金シミュレーター
    ├── tools-salary-calc.js    給与計算ツール
    ├── tools-checkup.js        労務リスク診断
    ├── tools-subsidy.js        助成金診断
    ├── tools-spot.js           スポット手続き依頼フォーム
    └── init.js                 初期化（pagesLoaded イベント後に実行）
```

---

## 動作の仕組み

```
ブラウザが index.html を読み込む
  └─ js/page-loader.js が pages/*.html を並列 fetch
       └─ 全ページ注入完了後に 'pagesLoaded' イベントを発火
            └─ js/init.js が初期化処理を実行（showPage('home') 等）
```

### JS 読み込み順序（index.html 末尾）

```html
<script src="./columns-data.js"></script>   ← コラムデータ（最初）
<script src="./js/nav.js"></script>         ← showPage() 定義
<script src="./js/page-loader.js"></script> ← ページ注入＋pagesLoaded発火
<script src="./js/chatbot.js"></script>
<script src="./js/hero.js"></script>
<script src="./js/tools-download.js"></script>
<script src="./js/tools-price-sim.js"></script>
<script src="./js/tools-salary-calc.js"></script>
<script src="./js/tools-checkup.js"></script>
<script src="./js/tools-subsidy.js"></script>
<script src="./js/tools-spot.js"></script>
<script src="./js/init.js"></script>        ← 初期化（最後）
```

> **⚠️ ローカルファイルでの直接開封について**  
> `page-loader.js` は `fetch()` を使用しているため、`file://` プロトコルでは動作しません。  
> 動作確認には必ず **ローカルサーバー**（`npx serve .` 等）を使用してください。

---

## ページを編集するには

| 編集したい内容 | 対象ファイル |
|---|---|
| ホームページのコピー・デザイン | `pages/page-home.html` |
| サービス・料金表 | `pages/page-services.html` |
| 代表挨拶・プロフィール | `pages/page-about.html` |
| よくある質問 | `pages/page-faq.html` |
| 関連リンク | `pages/page-links.html` |
| お問い合わせフォーム | `pages/page-contact.html` |
| コラム一覧・記事詳細 | `pages/page-blog.html` |
| 労務リスク診断・助成金診断 | `pages/page-tools-diagnostic.html` |
| 給与計算ツール | `pages/page-salary-calc.html` |
| 資料ダウンロード | `pages/page-download.html` |
| 料金シミュレーター | `pages/page-price-sim.html` |
| スポット手続き依頼フォーム | `pages/page-spot.html` |
| ヘッダー・フッター・ナビゲーション | `index.html` |
| チャットボットの返答内容 | `js/chatbot.js` |
| 給与計算ロジック・保険料率 | `js/tools-salary-calc.js` |
| 助成金診断ロジック | `js/tools-subsidy.js` |
| 料金シミュレーターロジック | `js/tools-price-sim.js` |
| コラムデータ | `columns-data.js`（既存） |

---

## 新しいページを追加するには

1. `pages/page-新ページ名.html` を作成（`<section id="page-新ページ名" class="hidden ...">` から始める）
2. `js/page-loader.js` の `PAGE_FILES` 配列に `'pages/page-新ページ名.html'` を追記
3. `js/nav.js` の `showPage()` 内 `pages` 配列に `'新ページ名'` を追記
4. `index.html` のヘッダーナビとフッターに `showPage('新ページ名')` のリンクを追加
