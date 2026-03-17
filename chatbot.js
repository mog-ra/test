// =============================================
// チャットボット ロジック
// =============================================
(function() {
    let chatIsOpen = false;
    let typingTimer = null;

    const FLOWS = {
        welcome: {
            msg: "こんにちは！カミウエ社会保険労務士事務所のAIアシスタントです😊\n\nどのようなことでお困りですか？下記からお選びください👇",
            options: [
                { label: "💰 助成金を活用したい",      next: "subsidy"    },
                { label: "📊 給与計算を外注したい",      next: "payroll"    },
                { label: "⚖️ 労務トラブルを防ぎたい",   next: "trouble"    },
                { label: "🏢 会社設立・創業サポート",    next: "startup"    },
                { label: "💻 クラウド勤怠DX支援",       next: "it"         },
                { label: "📝 その他・料金を知りたい",    next: "other"      },
            ]
        },
        subsidy: {
            msg: "助成金活用についてですね！\n\n当事務所では**累計100件以上**の助成金申請実績があります。\n主にどの施策をお考えですか？",
            options: [
                { label: "👤 正社員化・採用コストを下げたい（キャリアアップ助成金）", next: "subsidy_career" },
                { label: "🛠️ 設備投資と賃上げをセットで（業務改善助成金）",           next: "subsidy_kaizen" },
                { label: "📚 従業員研修に使いたい（人材開発支援助成金）",              next: "subsidy_train"  },
                { label: "どんな助成金が使えるか診断したい",                           next: "subsidy_diag"   },
            ]
        },
        subsidy_career: {
            msg: "キャリアアップ助成金（正社員化コース）は、有期雇用→正社員転換で**最大80万円/人**を受給できます。\n\n✅ 成功報酬型のため、受給できなければ費用なし\n✅ 申請書類の作成から提出まで全て代行\n✅ 審査対策まで丁寧にサポート",
            cta: true, diag: true
        },
        subsidy_kaizen: {
            msg: "業務改善助成金は、POSシステム・予約システム等の導入＋最低賃金引上げで**最大600万円**を受給できます！\n\n飲食・小売・サービス業に特に効果的です💡\n設備投資を検討中の方は今すぐご相談ください。",
            cta: true, diag: true
        },
        subsidy_train: {
            msg: "人材開発支援助成金は、社内研修・外部講習の費用を**最大75%**補助してもらえます。\n\nIT研修・技能講習・資格取得支援まで幅広く対応可能です📚",
            cta: true, diag: true
        },
        subsidy_diag: {
            msg: "まずは無料の助成金診断ツールをご利用ください！貴社が申請できる助成金を自動診断します。",
            special_btn: { label: "🔍 助成金診断ツールを使う", action: "subsidy-sim" },
            cta: true
        },
        payroll: {
            msg: "給与計算のアウトソーシングですね。\n\n毎月の**計算ミス・法改正対応**にお困りではありませんか？\n当事務所のフルサポート契約では：\n\n✅ 毎月の給与計算を完全代行\n✅ WEB給与明細システム込み\n✅ 年末調整まで一括対応\n✅ 法改正は自動で反映",
            options: [
                { label: "📋 料金・プランを詳しく見たい",   next: "payroll_price" },
                { label: "🧮 給与計算ツールで試算してみたい", next: "payroll_calc" },
                { label: "📅 無料相談を予約したい",          next: "cta_final"     },
            ]
        },
        payroll_price: {
            msg: "給与計算代行を含む**フルサポート契約**は**月額37,000円〜**（従業員数により変動）。\n\n顧問契約（25,000円〜）との組み合わせでコスト最適化も可能です。\n詳細はお気軽にご相談ください。",
            cta: true
        },
        payroll_calc: {
            msg: "簡易給与計算ツールで、社会保険料・手取り額を試算できます！",
            special_btn: { label: "🧮 給与計算ツールを使う", action: "salary-calc" },
            cta: true
        },
        trouble: {
            msg: "労務トラブル予防についてですね。\n\nトラブルは「起きてから対処」では手遅れです。\n当事務所は**予防的アプローチ**で貴社を守ります👇",
            options: [
                { label: "📄 就業規則を整備・見直したい",    next: "trouble_rule" },
                { label: "⏰ 残業代トラブルが不安",           next: "trouble_overtime" },
                { label: "🛡️ ハラスメント対策を強化したい",  next: "trouble_harassment" },
                { label: "✅ 労務リスク診断を受けたい",        next: "trouble_checkup" },
            ]
        },
        trouble_rule: {
            msg: "就業規則は会社を守る「盾」です。\n\n古い就業規則や未整備のままでは、従業員との紛争で不利になるリスクがあります。\n\n✅ 最新法令（働き方改革法対応）\n✅ 貴社の実態に合わせた内容\n✅ 労基署への届出・周知まで代行",
            cta: true
        },
        trouble_overtime: {
            msg: "残業代未払いは**過去2〜3年分**を遡って請求されるリスクがあります。\n\n固定残業代の誤運用・管理監督者の誤認定など、よくある問題を社労士がチェックします。\n\n📊 労務リスク診断（無料）で今すぐ確認できます！",
            special_btn: { label: "✅ 無料労務リスク診断を受ける", action: "checkup" },
            cta: true
        },
        trouble_harassment: {
            msg: "ハラスメント対策は2022年から中小企業も義務化されました。\n\n✅ ハラスメント防止規程の作成\n✅ 相談窓口の設置支援\n✅ 従業員研修（講師派遣可）\n✅ 相談があった際の対応アドバイス",
            cta: true
        },
        trouble_checkup: {
            msg: "20の質問で貴社の労務管理状況を無料診断できます！\n問題点が一目でわかります。",
            special_btn: { label: "✅ 労務リスク診断を開始する", action: "checkup" },
            cta: true
        },
        startup: {
            msg: "創業・会社設立サポートですね！\n\n創業期の労務手続きは複雑です。当事務所の**創業まるごとサポートパック（180,000円〜）**では：\n\n✅ 社会保険・労働保険の新規適用\n✅ 就業規則・雇用契約書の作成\n✅ 給与体系の設計\n✅ 創業時に使える助成金診断",
            options: [
                { label: "📋 サポートパックの詳細を見たい", next: "startup_detail" },
                { label: "💰 使える助成金を診断したい",    next: "subsidy_diag"   },
                { label: "📅 無料相談を予約したい",         next: "cta_final"      },
            ]
        },
        startup_detail: {
            msg: "創業・成長期まるごとサポートパックは、会社設立後1年目の企業様向けの特別プランです。\n\n初期費用込み・6ヶ月契約（180,000円〜）で、労務管理の土台を完全整備します。\n\n6ヶ月後は通常の顧問契約（月25,000円〜）に移行可能です。",
            cta: true
        },
        it: {
            msg: "クラウド勤怠・労務DXのご支援ですね！\n\nタイムカード集計に毎月何時間もかかっていませんか？\n\n**顧問契約特典：出退勤アプリを完全無料でご提供！**\n\n当事務所は以下のツール導入が得意です：",
            options: [
                { label: "📱 ジョブカン勤怠管理",              next: "it_jobcan"   },
                { label: "💻 マネーフォワード クラウド勤怠",   next: "it_mf"       },
                { label: "⏱️ KING OF TIME",                    next: "it_king"     },
                { label: "🔍 どのツールが良いか相談したい",    next: "cta_final"   },
            ]
        },
        it_jobcan: {
            msg: "ジョブカン勤怠管理は**月額200円/人〜**、無料プラン（10名まで）もあり中小企業に人気です。\n\nシフト管理が特に強く、飲食・小売・サービス業に最適。\n初期設定から従業員レクチャーまで丁寧にサポートします。",
            cta: true
        },
        it_mf: {
            msg: "マネーフォワード クラウド勤怠は給与計算・会計との連携が最強のツールです。\n\nITベンチャーやバックオフィス効率化を重視する企業様に特におすすめです。\n\n当事務所では**マネーフォワード給与計算との連携設定**も対応しています。",
            cta: true
        },
        it_king: {
            msg: "KING OF TIMEは**国内導入No.1**の実績を持つ、信頼性の高い勤怠管理ツールです。\n\n生体認証・ICカード打刻など多様な打刻方法に対応。\n製造業・建設業など現場系の企業様に特に適しています。",
            cta: true
        },
        other: {
            msg: "その他のご相談ですね。当事務所では以下のサービスを提供しています：\n\n📋 顧問契約（月25,000円〜）\n🚀 フルサポート契約（月37,000円〜）\n💼 スポット対応（就業規則作成等）\n📋 入退社手続きスポット依頼",
            options: [
                { label: "💼 サービス・料金を詳しく見る",   next: "services_page" },
                { label: "📋 入退社手続きを今すぐ依頼",     next: "spot_page"     },
                { label: "❓ よくある質問を見る",            next: "faq_page"      },
                { label: "📅 無料相談を予約する",            next: "cta_final"     },
            ]
        },
        services_page: { msg: "サービス・料金ページへ移動します。",    redirect: "services" },
        spot_page:     { msg: "スポット手続き依頼ページへ移動します。", redirect: "spot"     },
        faq_page:      { msg: "よくある質問ページへ移動します。",       redirect: "faq"      },
        cta_final: {
            msg: "初回60分の無料相談では、貴社の状況をじっくりヒアリングし、最適な解決策をご提案します。\n\nお気軽にどうぞ！",
            cta: true, final: true
        }
    };

    window.chatOpen = function() {
        chatIsOpen = !chatIsOpen;
        const win        = document.getElementById('chat-window');
        const iconBubble = document.getElementById('chat-icon-bubble');
        const iconClose  = document.getElementById('chat-icon-close');
        const badge      = document.getElementById('chat-unread-badge');

        if (chatIsOpen) {
            win.classList.remove('chat-window-hidden');
            win.classList.add('chat-window-visible');
            iconBubble.style.display = 'none';
            iconClose.style.display  = 'block';
            badge.style.display = 'none';
            if (document.getElementById('chat-messages').childElementCount === 0) {
                setTimeout(() => startFlow('welcome'), 200);
            }
        } else {
            chatClose();
        }
    };

    window.chatClose = function() {
        chatIsOpen = false;
        const win        = document.getElementById('chat-window');
        const iconBubble = document.getElementById('chat-icon-bubble');
        const iconClose  = document.getElementById('chat-icon-close');
        win.classList.remove('chat-window-visible');
        win.classList.add('chat-window-hidden');
        iconBubble.style.display = 'block';
        iconClose.style.display  = 'none';
    };

    // 3秒後に未読バッジを表示
    setTimeout(() => {
        if (!chatIsOpen) {
            document.getElementById('chat-unread-badge').style.display = 'flex';
        }
    }, 3000);

    function addMsg(type, content) {
        const area = document.getElementById('chat-messages');
        const wrap = document.createElement('div');
        wrap.className = 'chat-msg chat-msg-' + type;
        if (type === 'bot') {
            wrap.innerHTML = `
                <div class="chat-msg-avatar">
                    <svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                </div>
                <div class="chat-bubble chat-bubble-bot">${content.replace(/\n/g,'<br>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')}</div>
            `;
        } else {
            wrap.innerHTML = `<div class="chat-bubble chat-bubble-user">${content}</div>`;
        }
        area.appendChild(wrap);
        area.scrollTop = area.scrollHeight;
    }

    function addOptions(options) {
        const area = document.getElementById('chat-messages');
        const wrap = document.createElement('div');
        wrap.className = 'chat-options';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'chat-opt-btn';
            btn.innerHTML = opt.label;
            btn.onclick = function() {
                wrap.querySelectorAll('.chat-opt-btn').forEach(b => b.disabled = true);
                btn.style.background   = '#eff6ff';
                btn.style.borderColor  = '#3b82f6';
                addMsg('user', opt.label);
                setTimeout(() => handleFlow(opt.next), 400);
            };
            wrap.appendChild(btn);
        });
        area.appendChild(wrap);
        area.scrollTop = area.scrollHeight;
    }

    function addTyping() {
        const area = document.getElementById('chat-messages');
        const wrap = document.createElement('div');
        wrap.className = 'chat-typing';
        wrap.id = 'chat-typing-indicator';
        wrap.innerHTML = `
            <div class="chat-msg-avatar">
                <svg viewBox="0 0 24 24" fill="white" width="14" height="14"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            </div>
            <div class="chat-typing-dots">
                <span></span><span></span><span></span>
            </div>
        `;
        area.appendChild(wrap);
        area.scrollTop = area.scrollHeight;
    }

    function removeTyping() {
        const t = document.getElementById('chat-typing-indicator');
        if (t) t.remove();
    }

    function addCTA() {
        const area = document.getElementById('chat-messages');
        const wrap = document.createElement('div');
        wrap.style.paddingLeft = '36px';
        wrap.style.animation   = 'msgSlideIn 0.35s ease-out';
        wrap.innerHTML = `
            <div class="chat-highlight">💡 初回60分の相談は完全無料です</div>
            <button class="chat-cta-btn" onclick="chatGoContact()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                無料相談を申し込む
            </button>
            <div style="text-align:center;margin-top:6px;font-size:0.72rem;color:#94a3b8;">
                📞 070-1047-1625（平日9〜17時）
            </div>
        `;
        area.appendChild(wrap);
        area.scrollTop = area.scrollHeight;
    }

    function addSpecialBtn(btn) {
        const area = document.getElementById('chat-messages');
        const wrap = document.createElement('div');
        wrap.style.paddingLeft = '36px';
        wrap.style.animation   = 'msgSlideIn 0.35s ease-out';
        const b = document.createElement('button');
        b.className  = 'chat-cta-btn';
        b.style.background  = 'linear-gradient(135deg, #1e3a8a, #2563eb)';
        b.style.boxShadow   = '0 4px 16px rgba(30,58,138,0.35)';
        b.textContent = btn.label;
        b.onclick = function() {
            chatClose();
            showPage(btn.action);
        };
        wrap.appendChild(b);
        area.appendChild(wrap);
        area.scrollTop = area.scrollHeight;
    }

    window.chatGoContact = function() {
        chatClose();
        showPage('contact');
    };

    function startFlow(key) {
        addTyping();
        typingTimer = setTimeout(() => {
            removeTyping();
            const flow = FLOWS[key];
            if (!flow) return;
            addMsg('bot', flow.msg);
            setTimeout(() => {
                if (flow.redirect) {
                    setTimeout(() => { chatClose(); showPage(flow.redirect); }, 600);
                    return;
                }
                if (flow.special_btn) addSpecialBtn(flow.special_btn);
                if (flow.options)     addOptions(flow.options);
                if (flow.cta)        addCTA();
            }, 200);
        }, 800);
    }

    function handleFlow(key) {
        addTyping();
        typingTimer = setTimeout(() => {
            removeTyping();
            const flow = FLOWS[key];
            if (!flow) return;
            addMsg('bot', flow.msg);
            setTimeout(() => {
                if (flow.redirect) {
                    setTimeout(() => { chatClose(); showPage(flow.redirect); }, 600);
                    return;
                }
                if (flow.special_btn) addSpecialBtn(flow.special_btn);
                if (flow.options)     addOptions(flow.options);
                if (flow.cta)        addCTA();
            }, 200);
        }, 700 + Math.random() * 400);
    }

    window.chatSend = function() {
        const input = document.getElementById('chat-input');
        const text  = input.value.trim();
        if (!text) return;
        input.value = '';
        addMsg('user', text);
        const lower = text.toLowerCase();
        let nextKey = 'cta_final';
        if (/(助成金|補助金|給付金)/.test(text))                            nextKey = 'subsidy';
        else if (/(給与|給料|計算|外注|アウト)/.test(text))                  nextKey = 'payroll';
        else if (/(就業規則|残業|トラブル|解雇|ハラスメント)/.test(text))    nextKey = 'trouble';
        else if (/(創業|設立|スタートアップ|起業)/.test(text))               nextKey = 'startup';
        else if (/(勤怠|タイムカード|クラウド|システム|DX)/.test(text))      nextKey = 'it';
        else if (/(料金|費用|価格|いくら)/.test(text))                       nextKey = 'other';
        else if (/(相談|問い合わせ|連絡|電話)/.test(text))                   nextKey = 'cta_final';
        addTyping();
        setTimeout(() => {
            removeTyping();
            const flow = FLOWS[nextKey];
            addMsg('bot', flow.msg);
            setTimeout(() => {
                if (flow.special_btn) addSpecialBtn(flow.special_btn);
                if (flow.options)     addOptions(flow.options);
                if (flow.cta)        addCTA();
            }, 200);
        }, 800);
    };
})();
