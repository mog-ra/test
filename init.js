// =============================================
// 初期化（DOMContentLoaded）
// ページHTMLはindex.htmlに直接埋め込まれているため
// DOMContentLoaded で即座に初期化できます。
// =============================================
document.addEventListener('DOMContentLoaded', function () {

    // コラム描画
    if (typeof renderHomeColumns === 'function') renderHomeColumns();
    if (typeof renderBlogGrid   === 'function') renderBlogGrid('all');

    // 初期ページ表示
    showPage('home');

    // 助成金診断フォームの初期化
    if (typeof initializeSubsidySimulator === 'function') initializeSubsidySimulator();

    // 給与計算の初期計算
    if (typeof sCalc === 'function') sCalc();

    // スポットフォームの submit イベントをバインド
    for (var i = 0; i < 4; i++) {
        (function (idx) {
            var form = document.getElementById('spot-form-data-' + idx);
            if (form) {
                form.addEventListener('submit', function (e) {
                    e.preventDefault();
                    spotSubmitForm(idx);
                });
            }
        })(i);
    }
});


// =============================================
// 労務コラム機能スクリプト（分離）
//
// コラムデータ・描画関数はすべて columns-data.js に移動しました。
//
// ■ 読み込み順序（index.html に記述）
//   <script src="./columns-data.js"></script>  ← このファイルより先に読む
//   <script src="./js/nav.js"></script>
//   ... （各ツールJS）...
//   <script src="./js/init.js"></script>        ← 最後
//
// ■ columns-data.js が提供する関数
//   - renderHomeColumns()   トップページ最新コラム描画
//   - renderBlogGrid(cat)   コラム一覧グリッド描画
//   - showArticle(id)       記事詳細表示
//   - filterBlog(cat)       カテゴリーフィルター
// =============================================
