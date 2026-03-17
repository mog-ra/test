// =============================================
// スポット手続き依頼フォーム
// =============================================
function updateRikokuhyoFee() {
    const val = document.querySelector('input[name="rikokuhyo"]:checked')?.value;
    const el  = document.getElementById('rikokuhyo-fee');
    if (el) el.textContent = val === 'ari' ? '10,000円〜' : '5,000円〜';
}

function spotSwitchTab(idx) {
    for (let i = 0; i < 4; i++) {
        const tab  = document.getElementById('spot-tab-' + i);
        const form = document.getElementById('spot-form-' + i);
        if (i === idx) {
            tab.classList.add('active');
            tab.style.borderBottomColor = '#1e40af';
            tab.style.color             = '#1e40af';
            tab.style.backgroundColor  = '#eff6ff';
            form.classList.remove('hidden');
        } else {
            tab.classList.remove('active');
            tab.style.borderBottomColor = 'transparent';
            tab.style.color             = '#6b7280';
            tab.style.backgroundColor  = '';
            form.classList.add('hidden');
        }
    }
    document.getElementById('spot-success').classList.add('hidden');
}

function spotReset() {
    for (let i = 0; i < 4; i++) {
        const form = document.getElementById('spot-form-data-' + i);
        if (form) form.reset();
    }
    document.getElementById('spot-success').classList.add('hidden');
    spotSwitchTab(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function spotSubmitForm(formIdx) {
    const form = document.getElementById('spot-form-data-' + formIdx);
    if (!form) return;
    if (!form.checkValidity()) { form.reportValidity(); return; }

    const data      = new FormData(form);
    const formNames = [
        '雇用保険被保険者資格取得届',
        '雇用保険被保険者資格喪失届・離職票',
        '健康保険・厚生年金保険被保険者資格取得届',
        '健康保険・厚生年金保険被保険者資格喪失届'
    ];
    let subject = encodeURIComponent('【スポット手続き依頼】' + formNames[formIdx]);
    let body    = '【依頼手続き種別】\n' + formNames[formIdx] + '\n\n【入力内容】\n';
    for (let [key, value] of data.entries()) {
        if (value && value.toString().trim()) body += key + '：' + value + '\n';
    }
    body += '\n\n※このメールはカミウエ社会保険労務士事務所のWebサイトより自動生成されました。';

    window.location.href = 'mailto:sr.kamiue@gmail.com?subject=' + subject + '&body=' + encodeURIComponent(body);

    setTimeout(function() {
        for (let i = 0; i < 4; i++) {
            document.getElementById('spot-form-' + i).classList.add('hidden');
        }
        document.getElementById('spot-success').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500);
}



