// =============================================
// 給与計算ツール
// =============================================
const KENPO_RATES = {
    aomori:0.0497, iwate:0.0505, miyagi:0.0505, akita:0.0494,
    yamagata:0.0496, fukushima:0.0503, tokyo:0.0497, osaka:0.0532,
    aichi:0.0498, kanagawa:0.0499, saitama:0.0481, chiba:0.0487, other:0.0500
};
const KENPO_LABELS = {
    aomori:'青森 9.94%', iwate:'岩手 10.10%', miyagi:'宮城 10.10%', akita:'秋田 9.88%',
    yamagata:'山形 9.92%', fukushima:'福島 10.06%', tokyo:'東京 9.94%', osaka:'大阪 10.64%',
    aichi:'愛知 9.96%', kanagawa:'神奈川 9.98%', saitama:'埼玉 9.62%', chiba:'千葉 9.74%', other:'その他 10.00%'
};
const KOYO_EMP_RATE  = { general:6,   agriculture:7,  construction:7   };
const KOYO_EMP2_RATE = { general:9.5, agriculture:10.5, construction:11.5 };
const ROSAI_RATE     = { general:3,   agriculture:13, construction:9.5 };

function sCalcTax(taxBase, deps) {
    const adj = Math.max(0, taxBase - deps * 8333);
    if (adj <= 88000)  return 0;
    if (adj <= 89000)  return 130;
    if (adj <= 90000)  return 180;
    if (adj <= 91000)  return 230;
    if (adj <= 92000)  return 290;
    if (adj <= 94000)  return 390;
    if (adj <= 97000)  return 490;
    if (adj <= 100000) return 740;
    if (adj <= 105000) return 1370;
    if (adj <= 110000) return 2010;
    if (adj <= 115000) return 2650;
    if (adj <= 120000) return 3290;
    if (adj <= 125000) return 3930;
    if (adj <= 130000) return 4570;
    if (adj <= 140000) return 5850;
    if (adj <= 150000) return 7180;
    if (adj <= 160000) return 9030;
    if (adj <= 170000) return 10900;
    if (adj <= 180000) return 12780;
    if (adj <= 190000) return 14650;
    if (adj <= 200000) return 16520;
    if (adj <= 220000) return 20270;
    if (adj <= 240000) return 24020;
    if (adj <= 260000) return 27780;
    if (adj <= 280000) return 31530;
    if (adj <= 300000) return 35280;
    if (adj <= 320000) return 39580;
    if (adj <= 340000) return 44280;
    if (adj <= 360000) return 49380;
    if (adj <= 380000) return 54480;
    if (adj <= 400000) return 59980;
    if (adj <= 440000) return 71780;
    if (adj <= 480000) return 83980;
    if (adj <= 520000) return 100200;
    if (adj <= 560000) return 116800;
    if (adj <= 600000) return 133400;
    return Math.floor(adj * 0.33 - 65700);
}

let sCurTab = 'employee';

function sSwitchTab(tab) {
    sCurTab = tab;
    document.getElementById('stab-employee').className = 'salary-tab-btn ' + (tab === 'employee' ? 'active' : '') + ' flex-1';
    document.getElementById('stab-employer').className = 'salary-tab-btn ' + (tab === 'employer' ? 'active' : '') + ' flex-1';
    document.getElementById('sr-employer-card').style.display = tab === 'employer' ? 'block' : 'none';
    document.getElementById('s-dep-section').style.display    = tab === 'employee' ? 'block' : 'none';
    sCalc();
}

function sfmt(n) { return Math.floor(n).toLocaleString('ja-JP') + ' 円'; }

function sCalc() {
    const salary   = parseInt(document.getElementById('s-salary').value) || 0;
    const pref     = document.getElementById('s-pref').value;
    const kaigo    = document.getElementById('s-kaigo').checked;
    const deps     = parseInt(document.getElementById('s-deps').value) || 0;
    const industry = document.getElementById('s-industry').value;
    const isBonus  = document.querySelector('input[name="s-mode"]:checked').value === 'bonus';

    const kenpoRate  = KENPO_RATES[pref] || 0.0500;
    const kaigoRate  = 0.009;
    const kouseiRate = 0.0915;
    const KENPO_MAX  = 1390000;
    const KOUSEI_MAX = 650000;

    const kenpoBase  = Math.min(salary, KENPO_MAX);
    const kouseiBase = Math.min(salary, KOUSEI_MAX);

    const kenpo  = Math.floor(kenpoBase  * kenpoRate);
    const kaigoP = kaigo ? Math.floor(kenpoBase * kaigoRate) : 0;
    const kousei = Math.floor(kouseiBase * kouseiRate);
    const koyo   = Math.floor(salary * KOYO_EMP_RATE[industry] / 1000);
    const socTot = kenpo + kaigoP + kousei + koyo;

    let tax = 0;
    if (!isBonus) {
        tax = sCalcTax(Math.max(0, salary - socTot), deps);
    } else {
        tax = Math.floor(Math.max(0, salary - socTot) * 0.06);
    }

    const deduction = socTot + tax;
    const takehome  = salary - deduction;
    const dedPct    = salary > 0 ? (deduction / salary * 100).toFixed(1) : 0;
    const thPct     = salary > 0 ? (takehome  / salary * 100).toFixed(1) : 0;

    const kenpoEmp  = Math.floor(kenpoBase  * kenpoRate);
    const kaigoEmp  = kaigo ? Math.floor(kenpoBase * kaigoRate) : 0;
    const kouseiEmp = Math.floor(kouseiBase * kouseiRate);
    const koyoEmp   = Math.floor(salary * KOYO_EMP2_RATE[industry] / 1000);
    const rosaiEmp  = Math.floor(salary * ROSAI_RATE[industry] / 1000);
    const empTot    = kenpoEmp + kaigoEmp + kouseiEmp + koyoEmp + rosaiEmp;
    const totalCost = salary + empTot;

    document.getElementById('sr-gross').textContent         = sfmt(salary);
    document.getElementById('sr-kenpo-rate').textContent    = '（' + (KENPO_LABELS[pref] || '') + '）';
    document.getElementById('sr-kenpo').textContent         = sfmt(kenpo);
    document.getElementById('sr-kaigo').textContent         = sfmt(kaigoP);
    document.getElementById('sr-row-kaigo').style.display   = kaigo ? 'flex' : 'none';
    document.getElementById('sr-kousei').textContent        = sfmt(kousei);
    document.getElementById('sr-koyo-rate').textContent     = '（' + KOYO_EMP_RATE[industry] + '/1000）';
    document.getElementById('sr-koyo').textContent          = sfmt(koyo);
    document.getElementById('sr-social-total').textContent  = sfmt(socTot);
    document.getElementById('sr-tax').textContent           = sfmt(tax);
    document.getElementById('sr-deduction').textContent     = sfmt(deduction);
    document.getElementById('sr-deduction-bar').style.width = Math.min(100, dedPct) + '%';
    document.getElementById('sr-deduction-pct').textContent = '給与に対する控除率: ' + dedPct + '%';
    document.getElementById('sr-takehome').textContent      = sfmt(takehome);
    document.getElementById('sr-takehome-rate').textContent = '手取り率: ' + thPct + '%';

    document.getElementById('sr-kenpo-emp').textContent       = sfmt(kenpoEmp);
    document.getElementById('sr-kaigo-emp').textContent       = sfmt(kaigoEmp);
    document.getElementById('sr-row-kaigo-emp').style.display = kaigo ? 'flex' : 'none';
    document.getElementById('sr-kousei-emp').textContent      = sfmt(kouseiEmp);
    document.getElementById('sr-koyo-emp').textContent        = sfmt(koyoEmp);
    document.getElementById('sr-rosai-rate').textContent      = '（' + ROSAI_RATE[industry] + '/1000）';
    document.getElementById('sr-rosai-emp').textContent       = sfmt(rosaiEmp);
    document.getElementById('sr-emp-total').textContent       = sfmt(empTot);
    document.getElementById('sr-total-cost').textContent      = sfmt(totalCost);

    document.querySelectorAll('#s-result-panel .result-card').forEach(el => {
        el.classList.add('result-animate');
        setTimeout(() => el.classList.remove('result-animate'), 400);
    });
}

function sReset() {
    document.getElementById('s-salary').value   = '300000';
    document.getElementById('s-pref').value     = 'miyagi';
    document.getElementById('s-kaigo').checked  = false;
    document.getElementById('s-deps').value     = '0';
    document.getElementById('s-industry').value = 'general';
    document.querySelector('input[name="s-mode"][value="monthly"]').checked = true;
    sCurTab = 'employee';
    sSwitchTab('employee');
    sCalc();
}
