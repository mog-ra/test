// =============================================
// 料金シミュレーター JS
// =============================================
(function() {
    const ADV_PLANS = {
        standard: { name: '顧問契約（スタンダード）', base: 25000, per_emp: 600,  included: 5, unit: '/月' },
        full:     { name: 'フルサポート契約',         base: 37000, per_emp: 1400, included: 5, unit: '/月' },
        startup:  { name: '創業パックプラン',         base: 180000,per_emp: 4000, included: 3, unit: '/6か月', isLump: true },
    };
    const ADV_OPTIONS = {
        payroll:    { name: '給与計算代行',             base: 12000, per_emp: 800,  included: 5  },
        yearend:    { name: '年末調整代行',             base: 15000, per_emp: 500,  included: 5, isAnnual: true },
        rules:      { name: '就業規則 作成・見直し',    fixed: 80000 },
        subsidy:    { name: '助成金申請代行',           fixed: 0, note: '成功報酬20%' },
        attendance: { name: 'クラウド勤怠導入支援',     fixed: 50000 },
        evaluation: { name: '人事評価制度設計',         fixed: 150000 },
        audit:      { name: '労務監査',                 fixed: 80000 },
    };
    const SPOT_ITEMS = {
        rules_new:       { name: '就業規則 新規作成',                small:80000,  mid:110000, large:150000 },
        rules_rev:       { name: '就業規則 改定・見直し',            small:40000,  mid:60000,  large:80000  },
        contract:        { name: '雇用契約書・労働条件通知書 作成',  small:25000,  mid:35000,  large:45000  },
        agreement36:     { name: '36協定 作成・届出',                small:15000,  mid:20000,  large:25000  },
        si_new:          { name: '社会保険 新規適用手続き',          small:30000,  mid:40000,  large:55000  },
        si_entry:        { name: '入退社手続き代行（スポット）',     small:8000,   mid:11000,  large:15000  },
        si_count:        { name: '算定基礎届・月額変更届',           small:20000,  mid:28000,  large:38000  },
        payroll_spot:    { name: '給与計算代行（単月スポット）',     small:15000,  mid:20000,  large:28000  },
        yearend_spot:    { name: '年末調整代行（スポット）',         small:15000,  mid:20000,  large:30000  },
        subsidy_app:     { name: '助成金申請代行',                   fixed: '着手金20,000円＋成功報酬20%' },
        labor_audit:     { name: '労務監査・リスク診断',             small:80000,  mid:100000, large:130000 },
        attendance_impl: { name: 'クラウド勤怠システム導入支援',     small:50000,  mid:65000,  large:85000  },
        training:        { name: '従業員研修',                       small:45000,  mid:55000,  large:70000  },
    };

    let spotScale = 'small';
    const fmt = n => n.toLocaleString('ja-JP');

    function updateSliderColor() {
        const sl = document.getElementById('adv-emp-slider');
        if (!sl) return;
        const pct = ((sl.value - sl.min) / (sl.max - sl.min)) * 100;
        sl.style.background = `linear-gradient(to right, #1e3a8a 0%, #1e3a8a ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`;
    }

    window.simCalc = function() {
        const empEl = document.getElementById('adv-emp-slider');
        if (!empEl) return;
        const emp = parseInt(empEl.value);
        document.getElementById('adv-emp-display').textContent = emp;
        document.getElementById('adv-emp-badge').textContent   = emp + '名';
        updateSliderColor();
        updateEmpChips(emp);

        const planKey  = document.querySelector('input[name="adv-base"]:checked')?.value || 'standard';
        const plan     = ADV_PLANS[planKey];
        const extraEmp = Math.max(0, emp - plan.included);
        const baseAmt  = plan.base + extraEmp * plan.per_emp;

        const PLAN_INCLUDED_OPTS = {
            standard: [],
            full:     ['payroll'],
            startup:  ['payroll'],
        };
        const includedOpts = PLAN_INCLUDED_OPTS[planKey] || [];

        document.querySelectorAll('#adv-options .sim-opt-card').forEach(card => {
            const cb  = card.querySelector('input[type="checkbox"]');
            if (!cb) return;
            const key        = cb.value;
            const isIncluded = includedOpts.includes(key);
            if (isIncluded) {
                cb.checked  = true;
                cb.disabled = true;
                card.style.opacity     = '0.7';
                card.style.cursor      = 'default';
                card.style.background  = '#f0fdf4';
                card.style.borderColor = '#bbf7d0';
                if (!card.querySelector('.plan-included-badge')) {
                    const badge = document.createElement('span');
                    badge.className   = 'plan-included-badge text-xs font-black px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-300 ml-1 flex-shrink-0';
                    badge.textContent = 'プランに含む';
                    const labelEl = card.querySelector('.font-bold.text-gray-800');
                    if (labelEl) labelEl.parentNode.insertBefore(badge, labelEl.nextSibling);
                }
            } else {
                cb.disabled            = false;
                card.style.opacity     = '';
                card.style.cursor      = 'pointer';
                if (!cb.checked) { card.style.background = ''; card.style.borderColor = ''; }
                const badge = card.querySelector('.plan-included-badge');
                if (badge) badge.remove();
            }
        });

        Object.keys(ADV_PLANS).forEach(k => {
            const p   = ADV_PLANS[k];
            const ea  = Math.max(0, emp - p.included);
            const amt = p.base + ea * p.per_emp;
            const el  = document.getElementById('adv-' + (k === 'standard' ? 'std' : k) + '-price');
            if (el) el.textContent = fmt(amt) + (k === 'startup' ? '円〜/6か月' : '円〜/月');
        });

        let monthlyOptions = 0, annualOptions = 0, fixedOptions = 0;
        const breakdown = [];
        breakdown.push({ label: plan.name, amount: baseAmt, unit: plan.isLump ? '/6か月' : '/月' });

        const optPayroll = document.querySelector('#adv-options input[value="payroll"]');
        if (optPayroll?.checked) {
            if (includedOpts.includes('payroll')) {
                breakdown.push({ label: ADV_OPTIONS.payroll.name, amount: null, note: 'プランに含む', noteColor: '#86efac' });
                const el = document.getElementById('opt-payroll-price');
                if (el) { el.textContent = 'プランに含む'; el.style.color = '#16a34a'; }
            } else {
                const p = ADV_OPTIONS.payroll;
                const a = p.base + Math.max(0, emp - p.included) * p.per_emp;
                monthlyOptions += a;
                breakdown.push({ label: p.name, amount: a, unit: '/月' });
                const el = document.getElementById('opt-payroll-price');
                if (el) { el.textContent = '+' + fmt(a) + '円〜/月'; el.style.color = ''; }
            }
        }
        const optYearend = document.querySelector('#adv-options input[value="yearend"]');
        if (optYearend?.checked) {
            if (includedOpts.includes('yearend')) {
                breakdown.push({ label: ADV_OPTIONS.yearend.name, amount: null, note: 'プランに含む', noteColor: '#86efac' });
                const el = document.getElementById('opt-yearend-price');
                if (el) { el.textContent = 'プランに含む'; el.style.color = '#16a34a'; }
            } else {
                const p = ADV_OPTIONS.yearend;
                const a = p.base + Math.max(0, emp - p.included) * p.per_emp;
                annualOptions += a;
                breakdown.push({ label: p.name, amount: a, unit: '/年' });
                const el = document.getElementById('opt-yearend-price');
                if (el) { el.textContent = '+' + fmt(a) + '円〜/回'; el.style.color = ''; }
            }
        }
        const optRules = document.querySelector('#adv-options input[value="rules"]');
        if (optRules?.checked) { fixedOptions += 100000; breakdown.push({ label: ADV_OPTIONS.rules.name, amount: 100000, unit: '/回' }); }
        const optSubsidy = document.querySelector('#adv-options input[value="subsidy"]');
        if (optSubsidy?.checked) { breakdown.push({ label: ADV_OPTIONS.subsidy.name, amount: null, note: '成功報酬20%' }); }
        const optAttend = document.querySelector('#adv-options input[value="attendance"]');
        if (optAttend?.checked) { fixedOptions += 50000; breakdown.push({ label: ADV_OPTIONS.attendance.name, amount: 50000, unit: '/回' }); }
        const optEval = document.querySelector('#adv-options input[value="evaluation"]');
        if (optEval?.checked) { fixedOptions += 200000; breakdown.push({ label: ADV_OPTIONS.evaluation.name, amount: 200000, unit: '/回' }); }
        const optAudit = document.querySelector('#adv-options input[value="audit"]');
        if (optAudit?.checked) { fixedOptions += 80000; breakdown.push({ label: ADV_OPTIONS.audit.name, amount: 80000, unit: '/回' }); }

        const isStartup    = planKey === 'startup';
        const monthlyBase  = isStartup ? 0 : baseAmt;
        const monthlyTotal = monthlyBase + monthlyOptions;
        const annualTotal  = isStartup
            ? baseAmt + monthlyOptions * 6 + annualOptions + fixedOptions
            : monthlyTotal * 12 + annualOptions + fixedOptions;

        const mainEl = document.getElementById('adv-total-monthly');
        const unitEl = document.getElementById('adv-total-unit');
        if (isStartup) {
            mainEl.textContent = '¥' + fmt(baseAmt);
            unitEl.textContent = '/6か月（税抜）';
            document.getElementById('adv-startup-note').classList.remove('hidden');
        } else {
            mainEl.textContent = '¥' + fmt(monthlyTotal);
            unitEl.textContent = '/月（税抜）';
            document.getElementById('adv-startup-note').classList.add('hidden');
        }
        document.getElementById('adv-monthly-total-sub').textContent = '¥' + fmt(isStartup ? baseAmt : monthlyTotal) + '〜';
        document.getElementById('adv-annual-cost').textContent       = '¥' + fmt(annualTotal) + '〜';

        const bdEl = document.getElementById('adv-breakdown');
        bdEl.innerHTML = breakdown.map(r => {
            const noteColor = r.noteColor || '#86efac';
            const amtStr    = r.amount != null
                ? '<span class="amount">¥' + fmt(r.amount) + (r.unit || '') + '</span>'
                : '<span class="amount" style="color:' + noteColor + '">' + (r.note || '') + '</span>';
            return '<div class="sim-breakdown-row"><span class="label">' + r.label + '</span>' + amtStr + '</div>';
        }).join('');
    };

    function updateEmpChips(emp) {
        const thresholds = [5, 10, 20, 30];
        document.querySelectorAll('#adv-emp-chips .sim-chip').forEach((btn, i) => {
            btn.classList.toggle('active', emp <= thresholds[i] && (i === 0 || emp > thresholds[i - 1]));
        });
    }

    window.simSetEmp = function(n) {
        const sl = document.getElementById('adv-emp-slider');
        if (sl) { sl.value = n; simCalc(); }
    };

    window.simSwitchTab = function(tab) {
        const tabAdv  = document.getElementById('sim-tab-advisor');
        const tabSpot = document.getElementById('sim-tab-spot');
        const panAdv  = document.getElementById('sim-panel-advisor');
        const panSpot = document.getElementById('sim-panel-spot');
        if (!tabAdv) return;
        if (tab === 'advisor') {
            tabAdv.classList.add('sim-tab-active');    tabAdv.classList.remove('text-gray-400');
            tabSpot.classList.remove('sim-tab-active'); tabSpot.classList.add('text-gray-400');
            panAdv.classList.remove('hidden'); panSpot.classList.add('hidden');
        } else {
            tabSpot.classList.add('sim-tab-active');  tabSpot.classList.remove('text-gray-400');
            tabAdv.classList.remove('sim-tab-active'); tabAdv.classList.add('text-gray-400');
            panSpot.classList.remove('hidden'); panAdv.classList.add('hidden');
        }
    };

    window.simSpotSetScale = function(scale) {
        spotScale = scale;
        ['small','mid','large'].forEach(s => {
            const btn = document.getElementById('spot-sc-' + s);
            if (btn) btn.classList.toggle('active', s === scale);
        });
        document.querySelectorAll('.spot-price').forEach(el => {
            const amt = parseInt(el.dataset[scale]);
            if (amt) el.textContent = fmt(amt) + '円〜';
        });
        const labels = { small:'〜10名', mid:'11〜30名', large:'31名以上' };
        const badge  = document.getElementById('spot-scale-badge');
        if (badge) badge.textContent = labels[scale];
        simSpotCalc();
    };

    window.simSpotCalc = function() {
        let total = 0;
        const breakdown = [];
        let count = 0;
        document.querySelectorAll('#sim-panel-spot input[type="checkbox"]').forEach(cb => {
            if (!cb.checked) return;
            const key  = cb.value;
            const item = SPOT_ITEMS[key];
            if (!item) return;
            count++;
            if (item.fixed && typeof item.fixed === 'string') {
                breakdown.push({ label: item.name, note: item.fixed });
            } else {
                const amt = item.fixed || item[spotScale] || 0;
                total += amt;
                breakdown.push({ label: item.name, amount: amt });
            }
        });
        document.getElementById('spot-total-price').textContent = '¥' + fmt(total);
        document.getElementById('spot-count-badge').textContent = count + '件';
        const bdEl = document.getElementById('spot-breakdown');
        if (count === 0) {
            bdEl.innerHTML = '<p class="text-orange-200 text-xs text-center">手続きを選択してください</p>';
        } else {
            bdEl.innerHTML = breakdown.map(r => {
                const amtStr = r.amount != null
                    ? '<span class="amount">¥' + fmt(r.amount) + '〜</span>'
                    : '<span class="amount" style="color:#fcd34d;font-size:0.7rem">' + (r.note || '') + '</span>';
                return '<div class="sim-breakdown-row"><span class="label">' + r.label + '</span>' + amtStr + '</div>';
            }).join('');
        }
    };

    window.simOpenContact = function(type) {
        let summary = '';
        if (type === 'advisor') {
            const empEl   = document.getElementById('adv-emp-slider');
            const emp     = empEl ? empEl.value : '?';
            const planKey = document.querySelector('input[name="adv-base"]:checked')?.value || 'standard';
            const plan    = ADV_PLANS[planKey];
            const total   = document.getElementById('adv-total-monthly')?.textContent || '';
            const opts    = [];
            document.querySelectorAll('#adv-options input[type="checkbox"]:checked').forEach(cb => {
                const o = ADV_OPTIONS[cb.value];
                if (o) opts.push(o.name);
            });
            summary = `【料金シミュレーター 見積内容】\n契約種別: 顧問契約\nプラン: ${plan.name}\n従業員数: ${emp}名\n月額概算: ${total}${plan.isLump?'（6か月分）':'/月（税抜）'}`;
            if (opts.length) summary += `\nオプション: ${opts.join('、')}`;
        } else {
            const total = document.getElementById('spot-total-price')?.textContent || '¥0';
            const items = [];
            document.querySelectorAll('#sim-panel-spot input[type="checkbox"]:checked').forEach(cb => {
                const item = SPOT_ITEMS[cb.value];
                if (item) items.push(item.name);
            });
            const scaleLabel = { small:'〜10名', mid:'11〜30名', large:'31名以上' };
            summary = `【料金シミュレーター 見積内容】\n契約種別: スポット手続き\n従業員規模: ${scaleLabel[spotScale]}\n合計概算: ${total}〜（税抜）`;
            if (items.length) summary += `\n依頼内容: ${items.join('、')}`;
        }
        window._simContactNote = summary;
        showPage('contact');
        setTimeout(function() {
            const ta = document.querySelector('#page-contact textarea, #contact-message, textarea[name="message"]');
            if (ta) ta.value = ta.value ? summary + '\n\n' + ta.value : summary;
        }, 300);
    };

    window.simPrint = function(type) {
        let content = '';
        const now   = new Date().toLocaleDateString('ja-JP', {year:'numeric',month:'long',day:'numeric'});
        if (type === 'advisor') {
            const empEl    = document.getElementById('adv-emp-slider');
            const emp      = empEl ? empEl.value : '?';
            const planKey  = document.querySelector('input[name="adv-base"]:checked')?.value || 'standard';
            const plan     = ADV_PLANS[planKey];
            const total    = document.getElementById('adv-total-monthly')?.textContent || '';
            const annual   = document.getElementById('adv-annual-cost')?.textContent || '';
            const opts     = [];
            document.querySelectorAll('#adv-options input[type="checkbox"]:checked').forEach(cb => {
                const o = ADV_OPTIONS[cb.value];
                if (o) opts.push(o.name);
            });
            content = `
            <h2 style="font-size:1.4rem;font-weight:900;color:#1e3a8a;margin-bottom:0.5rem">顧問契約 概算見積もり</h2>
            <p style="color:#6b7280;font-size:0.85rem;margin-bottom:1.5rem">作成日: ${now}　※概算です。正式見積りは無料相談にてご提示いたします。</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:1rem">
              <tr style="background:#eff6ff"><td style="padding:8px 12px;font-weight:700;width:40%">プラン</td><td style="padding:8px 12px">${plan.name}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:700;background:#f9fafb">従業員数</td><td style="padding:8px 12px">${emp}名</td></tr>
              <tr style="background:#eff6ff"><td style="padding:8px 12px;font-weight:700">月額概算</td><td style="padding:8px 12px;font-weight:900;color:#1e3a8a;font-size:1.2rem">${total}${plan.isLump?'（6か月分）':'/月（税抜）'}</td></tr>
              <tr><td style="padding:8px 12px;font-weight:700;background:#f9fafb">年間概算コスト</td><td style="padding:8px 12px;font-weight:900;color:#1e3a8a">${annual}〜（税抜）</td></tr>
              ${opts.length ? `<tr style="background:#eff6ff"><td style="padding:8px 12px;font-weight:700">追加オプション</td><td style="padding:8px 12px">${opts.join('<br>')}</td></tr>` : ''}
            </table>`;
        } else {
            const total      = document.getElementById('spot-total-price')?.textContent || '¥0';
            const scaleLabel = { small:'〜10名', mid:'11〜30名', large:'31名以上' };
            const rows       = [];
            document.querySelectorAll('#sim-panel-spot input[type="checkbox"]:checked').forEach(cb => {
                const item = SPOT_ITEMS[cb.value];
                if (!item) return;
                if (item.fixed && typeof item.fixed === 'string') {
                    rows.push(`<tr><td style="padding:8px 12px">${item.name}</td><td style="padding:8px 12px">${item.fixed}</td></tr>`);
                } else {
                    const amt = item.fixed || item[spotScale] || 0;
                    rows.push(`<tr><td style="padding:8px 12px">${item.name}</td><td style="padding:8px 12px;font-weight:700">¥${fmt(amt)}〜</td></tr>`);
                }
            });
            content = `
            <h2 style="font-size:1.4rem;font-weight:900;color:#ea580c;margin-bottom:0.5rem">スポット手続き 概算見積もり</h2>
            <p style="color:#6b7280;font-size:0.85rem;margin-bottom:1.5rem">作成日: ${now}　※概算です。正式見積りは無料相談にてご提示いたします。</p>
            <table style="width:100%;border-collapse:collapse;margin-bottom:1rem">
              <tr style="background:#fff7ed"><td style="padding:8px 12px;font-weight:700;width:40%">従業員規模</td><td style="padding:8px 12px">${scaleLabel[spotScale]}</td></tr>
              <tr><th style="padding:8px 12px;background:#f9fafb;text-align:left">手続き内容</th><th style="padding:8px 12px;background:#f9fafb;text-align:left">概算費用（税抜）</th></tr>
              ${rows.join('')}
              <tr style="background:#fff7ed"><td style="padding:8px 12px;font-weight:900">合計概算</td><td style="padding:8px 12px;font-weight:900;color:#ea580c;font-size:1.2rem">${total}〜（税抜）</td></tr>
            </table>`;
        }
        const w = window.open('', '_blank', 'width=700,height=800');
        w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>料金見積もり - カミウエ社会保険労務士事務所</title>
        <style>body{font-family:'Hiragino Sans','Meiryo',sans-serif;padding:2rem;color:#1f2937;}table{border:1px solid #e5e7eb;}td,th{border:1px solid #e5e7eb;}
        .footer{margin-top:2rem;padding-top:1rem;border-top:1px solid #e5e7eb;font-size:0.8rem;color:#9ca3af;}</style></head>
        <body>${content}
        <div class="footer">カミウエ社会保険労務士事務所　〒983-0005 宮城県仙台市宮城野区福室字田中東二番25-6　TEL: 070-1047-1625　sr.kamiue@gmail.com</div>
        <script>window.print();<\/script></body></html>`);
        w.document.close();
    };

    document.addEventListener('DOMContentLoaded', function() {
        simCalc();
        simSpotCalc();
        updateSliderColor();
    });
})();
