// =============================================
// 助成金診断
// =============================================
function initializeSubsidySimulator() {
    const form = document.getElementById('subsidy-diagnostic-form');
    if (form) form.addEventListener('submit', function(e) { e.preventDefault(); showSubsidyResult(); });
}

function showSubsidyResult() {
    const form     = document.getElementById('subsidy-diagnostic-form');
    const formData = new FormData(form);
    const plans    = formData.getAll('plan');
    const subsidies = [];

    if (plans.includes('regular'))
        subsidies.push({ name: 'キャリアアップ助成金（正社員化コース）', amount: '最大80万円/人', detail: '有期雇用労働者等を正規雇用労働者に転換した場合に助成', requirements: ['6ヶ月以上の有期契約労働者がいる','正社員化後6ヶ月の賃金が転換前より5%以上増額'], level: 'high' });
    if (plans.includes('wage') && plans.includes('equipment'))
        subsidies.push({ name: '業務改善助成金', amount: '最大600万円', detail: '事業場内最低賃金を引き上げ、設備投資等を行った場合に助成', requirements: ['事業場内最低賃金と地域別最低賃金の差額が50円以内','生産性向上に資する設備投資を実施'], level: 'high' });
    if (plans.includes('training'))
        subsidies.push({ name: '人材開発支援助成金', amount: '最大100万円', detail: '従業員の職業訓練を実施した場合の訓練経費や賃金を助成', requirements: ['訓練実施計画を作成し提出','10時間以上の訓練を実施'], level: 'medium' });
    if (plans.includes('worklife'))
        subsidies.push({ name: '両立支援等助成金（育児休業等支援コース）', amount: '最大72万円', detail: '育児休業の円滑な取得・職場復帰のための取組を実施した場合に助成', requirements: ['育児休業取得者がいる','育児休業復帰支援プランを作成'], level: 'medium' });
    if (plans.includes('hiring'))
        subsidies.push({ name: '特定求職者雇用開発助成金', amount: '最大240万円', detail: '高年齢者や障害者等の就職困難者を雇い入れた場合に助成', requirements: ['ハローワーク等の紹介により雇い入れ','60歳以上や障害者等を雇用'], level: 'medium' });
    if (subsidies.length === 0)
        subsidies.push({ name: '雇用調整助成金', amount: '変動', detail: '経済上の理由により事業活動の縮小を余儀なくされた場合の雇用維持を支援', requirements: ['売上高等が減少','休業を実施'], level: 'low' });

    const totalAmount = subsidies.reduce((sum, s) => {
        const match = s.amount.match(/(\d+)/);
        return sum + (match ? parseInt(match[1]) : 0);
    }, 0);

    const resultHtml = `
        <div class="text-center mb-8">
            <h3 class="text-3xl font-bold text-blue-900 mb-6">診断結果</h3>
            <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white mb-6">
                <p class="text-lg mb-4">申請可能な助成金</p>
                <div class="text-5xl font-black mb-4">${subsidies.length}件</div>
                <p class="text-xl">受給見込額 最大 <span class="font-bold">${totalAmount.toLocaleString()}万円</span></p>
            </div>
        </div>
        <div class="space-y-4 mb-8">
            ${subsidies.map(s => `<div class="border-2 ${s.level === 'high' ? 'border-orange-300 bg-orange-50' : s.level === 'medium' ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50'} rounded-2xl p-6"><div class="flex items-start justify-between mb-3"><h4 class="text-lg font-bold text-blue-900 flex-1">${s.name}</h4><span class="bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold ml-4">${s.amount}</span></div><p class="text-gray-700 mb-4">${s.detail}</p><div class="bg-white rounded-xl p-4"><p class="text-xs font-bold text-gray-600 mb-2">主な要件</p><ul class="space-y-1">${s.requirements.map(req => `<li class="text-sm text-gray-700 flex items-start gap-2"><span class="text-orange-600 mt-0.5">✓</span><span>${req}</span></li>`).join('')}</ul></div></div>`).join('')}
        </div>
        <div class="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-8 text-white text-center mb-6">
            <h4 class="text-2xl font-bold mb-4">助成金申請をサポートいたします</h4>
            <p class="mb-6 opacity-90">成功報酬型なので、受給できなければ費用は発生しません</p>
            <button onclick="showPage('contact')" class="bg-white text-blue-900 font-bold py-4 px-10 rounded-xl hover:bg-blue-50 transition shadow-lg">助成金申請サポートを依頼</button>
        </div>
        <div class="text-center"><button onclick="location.reload()" class="text-blue-600 hover:text-blue-800 font-medium">もう一度診断する</button></div>
    `;
    document.getElementById('subsidy-form').classList.add('hidden');
    document.getElementById('subsidy-result').innerHTML = resultHtml;
    document.getElementById('subsidy-result').classList.remove('hidden');
}
