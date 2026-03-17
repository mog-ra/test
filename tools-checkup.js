// =============================================
// 労務リスク診断
// =============================================
window.checkupQuestions = [
    { q: "就業規則を作成し、労働基準監督署に届出していますか？",                            cat: "規則" },
    { q: "就業規則を従業員に周知していますか？",                                            cat: "規則" },
    { q: "36協定（時間外労働・休日労働に関する協定）を締結し、届出していますか？",          cat: "労使協定" },
    { q: "36協定は毎年更新していますか？",                                                  cat: "労使協定" },
    { q: "過半数代表者を適切な方法で選出していますか？",                                    cat: "労使協定" },
    { q: "時間外労働の上限規制（月45時間・年360時間）を遵守していますか？",                 cat: "労働時間" },
    { q: "労働時間を適切に管理（記録）していますか？",                                      cat: "労働時間" },
    { q: "残業代を正確に計算し、支払っていますか？",                                        cat: "賃金" },
    { q: "固定残業代制度を採用している場合、適切に運用していますか？",                      cat: "賃金" },
    { q: "最低賃金を遵守していますか？",                                                    cat: "賃金" },
    { q: "有給休暇を年5日取得させていますか？",                                             cat: "休暇" },
    { q: "有給休暇の管理簿を作成していますか？",                                            cat: "休暇" },
    { q: "雇用契約書（労働条件通知書）を全従業員と締結していますか？",                      cat: "契約" },
    { q: "社会保険（健康保険・厚生年金）に加入していますか？",                              cat: "保険" },
    { q: "雇用保険・労災保険に加入していますか？",                                          cat: "保険" },
    { q: "ハラスメント防止措置を講じていますか？",                                          cat: "ハラスメント" },
    { q: "育児・介護休業規程を整備していますか？",                                          cat: "両立支援" },
    { q: "定期健康診断を実施していますか？",                                                cat: "安全衛生" },
    { q: "労働者名簿を作成していますか？",                                                  cat: "帳簿" },
    { q: "賃金台帳を作成していますか？",                                                    cat: "帳簿" }
];

window.startCheckup = function() {
    const intro     = document.getElementById('checkup-intro');
    const questions = document.getElementById('checkup-questions');
    if (intro) intro.style.display = 'none';
    let html = '<form id="checkup-form" class="space-y-4">';
    window.checkupQuestions.forEach((item, index) => {
        html += `<div class="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 transition"><div class="flex items-start gap-3"><span class="flex-shrink-0 w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center text-sm font-bold">${index + 1}</span><div class="flex-1"><p class="text-gray-800 font-medium mb-3">${item.q}</p><div class="flex gap-4 flex-wrap"><label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q${index}" value="yes" class="w-4 h-4" required><span class="text-sm text-green-600 font-medium">はい</span></label><label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q${index}" value="no" class="w-4 h-4"><span class="text-sm text-red-600 font-medium">いいえ</span></label><label class="flex items-center gap-2 cursor-pointer"><input type="radio" name="q${index}" value="unknown" class="w-4 h-4"><span class="text-sm text-gray-500 font-medium">わからない</span></label></div></div></div></div>`;
    });
    html += `<div class="text-center pt-8"><button type="submit" class="bg-gradient-to-r from-blue-900 to-blue-700 text-white font-bold py-5 px-12 rounded-xl hover:from-blue-800 hover:to-blue-600 transition shadow-lg text-lg">診断結果を見る</button></div></form>`;
    if (questions) {
        questions.innerHTML = html;
        questions.style.display = 'block';
        const form = document.getElementById('checkup-form');
        if (form) form.addEventListener('submit', function(e) { e.preventDefault(); window.showCheckupResult(); });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.showCheckupResult = function() {
    const form      = document.getElementById('checkup-form');
    const questions = document.getElementById('checkup-questions');
    const result    = document.getElementById('checkup-result');
    const formData  = new FormData(form);
    let yesCount = 0, noCount = 0, unknownCount = 0;
    const issues = [];
    window.checkupQuestions.forEach((item, index) => {
        const answer = formData.get(`q${index}`);
        if (answer === 'yes') yesCount++;
        else if (answer === 'no')      { noCount++;      issues.push({ q: item.q, cat: item.cat }); }
        else if (answer === 'unknown') { unknownCount++; issues.push({ q: item.q, cat: item.cat }); }
    });
    const score = Math.round((yesCount / window.checkupQuestions.length) * 100);
    let riskLevel, riskColor, riskBg, riskMessage;
    if      (score >= 90) { riskLevel = "優良";  riskColor = "text-green-600"; riskBg = "bg-green-50"; riskMessage = "労務管理が非常に良好です。引き続き、法改正への対応を継続してください。"; }
    else if (score >= 70) { riskLevel = "良好";  riskColor = "text-blue-600";  riskBg = "bg-blue-50";  riskMessage = "基本的な労務管理はできていますが、いくつか改善の余地があります。"; }
    else if (score >= 50) { riskLevel = "要注意";riskColor = "text-orange-600";riskBg = "bg-orange-50";riskMessage = "労務リスクがあります。早めの対策をおすすめします。"; }
    else                  { riskLevel = "危険";  riskColor = "text-red-600";   riskBg = "bg-red-50";   riskMessage = "重大な労務リスクがあります。至急、専門家にご相談ください。"; }

    const resultHtml = `
        <div class="text-center mb-8">
            <h3 class="text-3xl font-bold text-blue-900 mb-6">診断結果</h3>
            <div class="${riskBg} rounded-2xl p-8 mb-6">
                <p class="text-lg text-gray-600 mb-4">労務管理レベル</p>
                <div class="text-6xl font-black ${riskColor} mb-4">${score}点</div>
                <p class="text-2xl font-bold ${riskColor}">${riskLevel}</p>
            </div>
            <p class="text-gray-700 leading-relaxed">${riskMessage}</p>
        </div>
        <div class="mb-8">
            <h4 class="text-xl font-bold text-blue-900 mb-4">診断内訳</h4>
            <div class="grid grid-cols-3 gap-4">
                <div class="bg-green-50 rounded-xl p-4 text-center"><p class="text-sm text-gray-600 mb-2">遵守できている</p><p class="text-3xl font-bold text-green-600">${yesCount}</p></div>
                <div class="bg-red-50 rounded-xl p-4 text-center"><p class="text-sm text-gray-600 mb-2">未対応</p><p class="text-3xl font-bold text-red-600">${noCount}</p></div>
                <div class="bg-gray-50 rounded-xl p-4 text-center"><p class="text-sm text-gray-600 mb-2">不明</p><p class="text-3xl font-bold text-gray-600">${unknownCount}</p></div>
            </div>
        </div>
        ${issues.length > 0 ? `<div class="mb-8"><h4 class="text-xl font-bold text-blue-900 mb-4">改善が必要な項目</h4><div class="space-y-3">${issues.map(issue => `<div class="flex items-start gap-3 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded"><svg class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg><div class="flex-1"><span class="text-xs font-bold text-yellow-700">[${issue.cat}]</span><p class="text-sm text-gray-700">${issue.q}</p></div></div>`).join('')}</div></div>` : ''}
        <div class="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl p-8 text-white text-center">
            <h4 class="text-2xl font-bold mb-4">専門家による無料相談を承ります</h4>
            <p class="mb-6 opacity-90">診断結果を基に、貴社に最適な改善プランをご提案いたします</p>
            <button onclick="showPage('contact')" class="bg-white text-blue-900 font-bold py-4 px-10 rounded-xl hover:bg-blue-50 transition shadow-lg">今すぐ無料相談を申し込む</button>
        </div>
        <div class="text-center mt-8"><button onclick="window.resetCheckup()" class="text-blue-600 hover:text-blue-800 font-medium underline">もう一度診断する</button></div>
    `;
    if (questions) questions.style.display = 'none';
    if (result)    { result.innerHTML = resultHtml; result.style.display = 'block'; }
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.resetCheckup = function() {
    const intro     = document.getElementById('checkup-intro');
    const questions = document.getElementById('checkup-questions');
    const result    = document.getElementById('checkup-result');
    if (questions) { questions.innerHTML = ''; questions.style.display = 'none'; }
    if (result)    { result.innerHTML = '';    result.style.display = 'none'; }
    if (intro)     intro.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
};
