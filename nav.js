// =============================================
// 外部ライブラリ読み込み
// ※ HTMLの <head> または <body> 末尾に以下を記述してください
// <script src="https://cdn.tailwindcss.com"></script>
// =============================================


// =============================================
// ページ切り替え・ソリューション表示
// =============================================
const solutions = {
    'subsidy':    { icon: '💰', title: '助成金を活用したい',           description: '国や自治体の助成金制度を活用することで、採用コスト削減や職場環境改善を実質負担ゼロで実現できます。', steps: [{title:'助成金診断',desc:'貴社の状況に合致する助成金を洗い出し、受給可能性を診断します。'},{title:'計画書作成',desc:'申請に必要な計画書や添付書類を社労士が作成・準備します。'},{title:'申請代行',desc:'労働局やハローワークへの申請手続きを全て代行いたします。'},{title:'フォローアップ',desc:'受給後の報告書作成や、次回申請に向けたアドバイスも行います。'}], point: '助成金は「成功報酬型」なので、受給できなければ費用は発生しません。まずはお気軽にご相談ください。' },
    'payroll':    { icon: '📊', title: '給与計算を外注したい',           description: '複雑化する給与計算業務。法改正対応や年末調整まで、全てお任せいただけます。', steps: [{title:'勤怠データ受領',desc:'タイムカードやクラウド勤怠データをお預かりします。'},{title:'給与計算実施',desc:'社会保険料、税金、各種手当を正確に計算いたします。'},{title:'明細発行',desc:'WEB給与明細システムで従業員様へ直接配信します。'},{title:'振込データ作成',desc:'金融機関への振込データも作成し、お渡しいたします。'}], point: '給与計算のアウトソーシングで、経営者様の時間を本業に集中していただけます。' },
    'trouble':    { icon: '⚖️', title: '従業員とのトラブルを防ぎたい', description: '労務トラブルは事前の対策が最も重要です。就業規則の整備や相談体制の構築をサポートします。', steps: [{title:'就業規則見直し',desc:'最新の法令に適合した就業規則を作成・改定します。'},{title:'労使協定整備',desc:'36協定など必要な労使協定を漏れなく整備します。'},{title:'相談窓口設置',desc:'従業員からの相談を受け付ける体制を構築します。'},{title:'研修実施',desc:'ハラスメント防止研修など、予防的な取り組みを支援します。'}], point: 'トラブルが起きてからでは遅いのです。予防的な労務管理が、企業を守ります。' },
    'startup':    { icon: '🏢', title: '会社を設立したばかり',           description: '創業期の労務手続きは複雑です。社会保険の加入から就業規則作成まで、ワンストップでサポートします。', steps: [{title:'社会保険新規適用',desc:'法人設立後の社会保険・労働保険の加入手続きを代行します。'},{title:'就業規則作成',desc:'10名未満でも作成をお勧めします。トラブル予防の要です。'},{title:'雇用契約書整備',desc:'労働条件通知書や雇用契約書のひな形を作成します。'},{title:'給与体系設計',desc:'採用活動に活かせる、競争力のある給与体系を設計します。'}], point: '創業期こそ、労務の「仕組み化」が重要です。後から修正するのは大変です。' },
    'it':         { icon: '💻', title: 'クラウド勤怠・労務管理を導入したい', description: 'タイムカードでの管理は集計ミスの温床です。ITの力で効率化し、法改正にも対応しやすい体制を構築しましょう。', steps: [{title:'ツール選定',desc:'マネーフォワード、ジョブカン等から、貴社に最適なツールを選定します。'},{title:'初期設定',desc:'複雑な就業設定、休日設定などを社労士の視点で正確に設定します。'},{title:'運用レクチャー',desc:'従業員への説明や、管理者画面の使い方を丁寧にサポートします。'},{title:'データ連携',desc:'勤怠データと給与計算をスムーズに連携させ、手入力を最小限にします。'}], point: 'ITに詳しくない経営者様でも安心してください。設定から運用まで、私たちが伴走します。' },
    'employment': { icon: '📝', title: '就業規則を整備したい',           description: '就業規則は会社のルールブックであり、労務トラブルを防ぐ最重要文書です。法令に適合した就業規則を整備しましょう。', steps: [{title:'現状分析',desc:'現在の就業規則（ある場合）と実態を確認し、課題を洗い出します。'},{title:'法令適合チェック',desc:'最新の労働基準法、働き方改革関連法に適合しているか確認します。'},{title:'規則作成・改定',desc:'貴社の実情に合わせた、実用的な就業規則を作成・改定します。'},{title:'届出・周知',desc:'労働基準監督署への届出、従業員への周知まで完全サポートします。'}], point: '就業規則は「作って終わり」ではありません。法改正に応じて定期的な見直しが必要です。' }
};

function showSolution(key) {
    const data = solutions[key];
    const html = `
        <div class="flex items-center gap-4 mb-8">
            <div class="text-5xl md:text-6xl">${data.icon}</div>
            <h2 class="text-2xl md:text-4xl font-bold text-blue-900">${data.title}</h2>
        </div>
        <p class="text-lg text-gray-700 mb-12 leading-relaxed">${data.description}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
            ${data.steps.map((step, i) => `
                <div class="flex gap-4 p-6 md:p-8 bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm">
                    <div class="flex-shrink-0 w-10 h-10 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-lg">${i + 1}</div>
                    <div>
                        <h4 class="font-bold text-blue-900 mb-2 text-lg">${step.title}</h4>
                        <p class="text-sm text-gray-600 leading-relaxed">${step.desc}</p>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="bg-gradient-to-r from-blue-50 to-orange-50 border-l-4 border-blue-900 p-8 md:p-10 rounded-r-2xl">
            <h4 class="font-bold text-blue-900 mb-3 flex items-center gap-2 text-lg"><span>💡</span> 神植からのアドバイス</h4>
            <p class="text-gray-700 leading-relaxed">${data.point}</p>
        </div>
    `;
    document.getElementById('solution-content').innerHTML = html;
    showPage('solutions');
}

// =============================================
// ページ表示制御
// =============================================
function showPage(pageId) {
    if (pageId === 'price-sim') {
        setTimeout(function() {
            if (typeof simCalc === 'function') simCalc();
            if (typeof simSpotCalc === 'function') simSpotCalc();
            if (typeof updateSliderColor === 'function') updateSliderColor();
        }, 50);
    }
    const pages = ['home','services','about','links','faq','contact','solutions','blog','checkup','subsidy-sim','salary-calc','download','dl-thankyou','price-sim','spot','article-detail'];
    pages.forEach(id => {
        const section = document.getElementById('page-' + id);
        if (section) section.classList.add('hidden');
        const navBtn = document.getElementById('nav-' + id);
        if (navBtn) navBtn.classList.remove('active-tab');
    });
    const activeSection = document.getElementById('page-' + pageId);
    if (activeSection) activeSection.classList.remove('hidden');
    const activeNav = document.getElementById('nav-' + pageId);
    if (activeNav) activeNav.classList.add('active-tab');
    const hideCTAOn = ['contact', 'solutions'];
    const ctaElement = document.getElementById('common-cta');
    if (ctaElement) {
        if (hideCTAOn.includes(pageId)) ctaElement.classList.add('hidden');
        else ctaElement.classList.remove('hidden');
    }
    document.getElementById('mobile-menu').classList.add('hidden');
    window.scrollTo(0, 0);

    // コラム関連ページの再描画
    if (pageId === 'blog') {
        if (typeof renderBlogGrid === 'function') {
            renderBlogGrid('all');
            document.querySelectorAll('.blog-filter-btn').forEach(btn => {
                btn.classList.toggle('active-filter', btn.dataset.cat === 'all');
            });
        }
    }
    if (pageId === 'home') {
        if (typeof renderHomeColumns === 'function') renderHomeColumns();
    }
}

function toggleMobileMenu() {
    document.getElementById('mobile-menu').classList.toggle('hidden');
}
