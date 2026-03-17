// =============================================
// ページローダー
// pages/ 以下の各 HTML ファイルを fetch して
// #content コンテナに注入します。
//
// ■ ページファイルとページID の対応
//   page-home.html          → page-home
//   page-services.html      → page-services
//   page-about.html         → page-about
//   page-faq.html           → page-faq
//   page-links.html         → page-links
//   page-contact.html       → page-contact
//   page-blog.html          → page-blog, page-article-detail
//   page-tools-diagnostic.html → page-checkup, page-subsidy-sim
//   page-salary-calc.html   → page-salary-calc
//   page-download.html      → page-download, page-dl-thankyou
//   page-price-sim.html     → page-price-sim
//   page-solutions.html     → page-solutions
//   page-spot.html          → page-spot
// =============================================

(function () {

    // ロードするページファイルのリスト（読み込み順）
    const PAGE_FILES = [
        'pages/page-home.html',
        'pages/page-services.html',
        'pages/page-about.html',
        'pages/page-faq.html',
        'pages/page-links.html',
        'pages/page-contact.html',
        'pages/page-blog.html',
        'pages/page-tools-diagnostic.html',
        'pages/page-salary-calc.html',
        'pages/page-download.html',
        'pages/page-price-sim.html',
        'pages/page-solutions.html',
        'pages/page-spot.html',
    ];

    /**
     * すべてのページHTMLを並列 fetch して #content に注入する。
     * 注入完了後に DOMContentLoaded 相当のコールバックを発火する。
     */
    function loadAllPages() {
        const content = document.getElementById('content');

        const fetches = PAGE_FILES.map(function (file) {
            return fetch(file)
                .then(function (res) {
                    if (!res.ok) throw new Error('Failed to load: ' + file);
                    return res.text();
                })
                .catch(function (err) {
                    console.warn('[page-loader]', err.message);
                    return ''; // ファイルが存在しない場合は空文字で継続
                });
        });

        Promise.all(fetches).then(function (htmlFragments) {
            // ローディング表示を削除
            const loadingEl = document.getElementById('page-loading');
            if (loadingEl) loadingEl.remove();

            // 各フラグメントを順番に挿入
            htmlFragments.forEach(function (html) {
                if (!html) return;
                const wrapper = document.createElement('div');
                wrapper.innerHTML = html;
                // wrapper の子要素を直接 content に移す
                while (wrapper.firstChild) {
                    content.appendChild(wrapper.firstChild);
                }
            });

            // ページロード完了イベントを発火（init.js はこれを待つ）
            document.dispatchEvent(new Event('pagesLoaded'));
        });
    }

    // DOM準備完了後にロード開始
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllPages);
    } else {
        loadAllPages();
    }

})();
