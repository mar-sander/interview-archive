/* ================================================================
   INTERVIEW PRACTICE DECK / QUICK REVIEW
   1問1答の直後、10〜20秒で問いの意図を返すための実戦レイヤー。
   既存の詳細レビューは変更せず、その上に即時レビューを追加する。
   ================================================================ */

(() => {
  const quickReviews = {
    E01: {
      intent: "数ある会社・職種の中で、なぜ『ここ』を選んだのか。本人の経験や価値観と結びついた選択かを見る。",
      retention: "会社・職種を自分で選んだ理由に具体性があるか。",
      growth: "入社後に何をしたいか、どう伸びたいかまで考えているか。",
      talk: "今の質問は、会社の良いところを聞いているだけじゃない。『数ある会社の中で、なぜあなたはここを選んだの？』を見てる。だから定着性が強い。入社後どうしたいまで話せると、活躍性も見えてくる。"
    },
    E02: {
      intent: "会社見学で見た現実をもとに、本当にこの会社を理解して選んでいるか、自分なりに考えられているかを見る。",
      retention: "実際の現場を見たうえで志望しているか。",
      growth: "観察したことから自分なりの意味や考えを持てるか。",
      talk: "今の質問は、見学の感想文を聞いているわけじゃない。『実際に見たうえで、それでもここを選んでる？』『見たことから何を考えた？』を見てる。定着性と、そこから考える活躍性の両方だね。"
    },
    E03: {
      intent: "高校生活の実例から、何を大切にし、どう考えて動き、何を学ぶ人なのかを見る。",
      retention: "物事に継続して向き合う姿勢があるか。",
      growth: "工夫・主体性・改善・学びが見えるか。",
      talk: "今の質問は、『すごい実績ある？』を聞いてるんじゃない。何に力を入れて、そのときどう考えて動いた人なのかを見てる。だから活躍性がかなり強い質問。"
    },
    E04: {
      intent: "課題研究という実践経験の中で、あなた自身が何を考え、何を担当し、どう工夫・修正したかを見る。",
      retention: "役割や課題に継続して向き合ったか。",
      growth: "考える・試す・失敗から直す・協働する力が見えるか。",
      talk: "今の質問は、作品紹介を聞きたいだけじゃない。『その中であなた自身は何を考えて、何をしたの？』を見てる。これは活躍性がかなり見えやすい質問だね。"
    },
    E05: {
      intent: "うまくいかなかった後に、原因を考え、相談し、修正し、次へ進める人かを見る。",
      retention: "困難が起きたとき、すぐ投げ出さず向き合えるか。",
      growth: "失敗から学んで行動を変えられるか。",
      talk: "今の質問は、失敗したかどうかを責めたいわけじゃない。『失敗したあと、あなたはどうする人？』を見てる。だから定着性も活躍性も、かなり強く見える質問。"
    },
    E06: {
      intent: "自分の長所を、仕事の中で再現できる具体的な強みとして理解しているかを見る。",
      retention: "自分の特徴と仕事の相性を現実的に考えているか。",
      growth: "強みを入社後の行動や貢献につなげられるか。",
      talk: "今の質問は、『長所の名前を言って』じゃない。『その強み、本当に行動として出る？ 仕事でどう使える？』を見てる。主に活躍性だね。"
    },
    E07: {
      intent: "意見の違いが起きたとき、自分の軸を持ちながら相手と対話し、目的に向けて調整できるかを見る。",
      retention: "人間関係のズレがあっても向き合えるか。",
      growth: "他者と協働してより良い結果をつくれるか。",
      talk: "今の質問は、『相手に合わせられる？』だけじゃない。意見が違ったときに、逃げずに対話して、自分も必要なら修正できるかを見てる。定着性と活躍性、両方だね。"
    },
    E08: {
      intent: "希望と違う配属などのズレが起きても、状況を理解し、学び、相談しながら現実的に向き合えるかを見る。",
      retention: "希望どおりでない状況でも即断せず向き合えるか。",
      growth: "与えられた環境から学びや次の行動を見つけられるか。",
      talk: "今の質問は、『何でも我慢できますか？』じゃない。希望と現実がズレたとき、どう考えてどう動く人なのかを見てる。定着性が特に強くて、活躍性も見える。"
    },
    E09: {
      intent: "その会社で時間を重ねる未来を想像し、どの方向へ成長したいか考えているかを見る。",
      retention: "3年後もその会社で働く未来を描けているか。",
      growth: "身につけたい力や担いたい役割が具体的か。",
      talk: "今の質問は、3年後を当てる予言じゃない。『この会社で続ける未来を考えてる？』『どう成長したい？』を見てる。定着性と活躍性の両方がそのまま出る質問。"
    },
    E10: {
      intent: "他社でも通じる一般論を外したあとに、それでもこの会社を選ぶ本人固有の理由が残るかを見る。",
      retention: "会社との接点や選択理由が本人の中にあるか。",
      growth: "この会社で何を実現・成長したいかまでつながるか。",
      talk: "今の質問は、志望動機を一回はがしてる。『それ、他でも言えるよね。じゃあ、それでもなんでここ？』ってこと。だから定着性をかなり強く見てる質問だね。"
    },
    U01: {
      intent: "数ある大学・学部の中で、なぜこの環境が自分の学びに必要なのかを見る。",
      retention: "学びたい内容と大学・学部が本当に合っているか。",
      growth: "入学後にどう学び、伸びたいかまで見えているか。",
      talk: "今の質問は、大学の良いところを並べてほしいわけじゃない。『あなたが学びたいことに、なぜこの大学が必要なの？』を見てる。だから定着性が強くて、入学後の話から活躍性も見える。"
    },
    U02: {
      intent: "その分野への興味が本人の経験や疑問から生まれ、学び続ける動機になっているかを見る。",
      retention: "学問そのものへの関心が続きそうか。",
      growth: "興味を調べる・試すなどの行動へ発展させているか。",
      talk: "今の質問は、『昔から好きです』を聞きたいわけじゃない。『なんでそれが気になったの？ そのあと何をしたの？』を見てる。学び続ける定着性と、動き出す活躍性だね。"
    },
    U03: {
      intent: "大学進学を惰性で選ばず、4年間を使って何を得る必要があるのか自分で理解しているかを見る。",
      retention: "大学という進路を自分で納得して選んでいるか。",
      growth: "大学で得たいものと、その後の使い道が見えているか。",
      talk: "今の質問は、『大学に行きたい理由』だけじゃなくて、『なぜ今すぐ働くのではなく、大学で学ぶ必要があるの？』を見てる。選択の定着性と、その4年を使う活躍性、両方だね。"
    },
    U04: {
      intent: "合格をゴールにせず、入学後に何を学び、どう動くつもりかを見る。",
      retention: "大学の学びと本人の目的が合っているか。",
      growth: "自分から学びに行く具体的な姿勢があるか。",
      talk: "今の質問は、『合格したい？』じゃない。『入ったあと、何するの？』を見てる。大学との相性を見る定着性と、入学後に動ける活躍性の両方。"
    },
    U05: {
      intent: "課題研究を通して、問いを持ち、自分で考え、試し、修正できる人かを見る。",
      retention: "一つの課題に向き合い続けられたか。",
      growth: "主体的に考え、試行錯誤し、学びを次へつなげられるか。",
      talk: "今の質問は、研究作品の完成度だけを見てるんじゃない。『あなた自身は何を考えて、何を試して、どう直した？』を見てる。主に活躍性が強く出る質問だね。"
    },
    U06: {
      intent: "知らないことを恥じず、自分なりの問いを持って学びの入口にできるかを見る。",
      retention: "その分野への関心が表面的ではないか。",
      growth: "分からないことから問いを立て、調べ、深めていけるか。",
      talk: "今の質問は、知識量のテストじゃない。『分からないことを持ってる？ そこから学びに行ける？』を見てる。これはかなり活躍性が強い質問。"
    },
    U07: {
      intent: "勉強でつまずいたとき、具体的に学び方を変えたり助けを求めたりできるかを見る。",
      retention: "学業上の困難でそのまま離脱しないか。",
      growth: "自分で学び方を修正し、周囲の支援も使えるか。",
      talk: "今の質問は、『根性ありますか？』じゃない。ついていけなくなったとき、どう立て直す人なのかを見てる。だから定着性も活躍性もかなり見える。"
    },
    U08: {
      intent: "希望どおりの研究室に入れなくても、目的と手段を分け、別の方法で学びを続けられるかを見る。",
      retention: "計画変更があっても大学で学び続けられるか。",
      growth: "目的に向けて別ルートを探し、行動を修正できるか。",
      talk: "今の質問は、『第一希望を諦められる？』じゃない。計画が崩れたときに、目的まで捨てず別の道を探せるかを見てる。定着性と活躍性、両方だね。"
    },
    U09: {
      intent: "大学4年間を大卒資格だけで終わらせず、自分をどう成長させたいか考えているかを見る。",
      retention: "4年間をこの大学で過ごす意味に納得しているか。",
      growth: "学位以外に得たい力・経験・考え方があるか。",
      talk: "今の質問は、『卒業証書以外に何を持って出る？』ってこと。大学で4年間過ごす意味を考えてるか、そしてどう成長したいか。定着性と活躍性の両方が見える。"
    },
    U10: {
      intent: "大学進学が社会に出る不安からの逃避だけになっていないか、それでも進学を選ぶ積極的な理由があるかを見る。",
      retention: "大学進学を自分で選び、納得できているか。",
      growth: "4年間で何を学び、どう変わるつもりか。",
      talk: "今の質問は、『不安があるなら進学するな』って話じゃない。『不安だけに進路を決めさせてない？ それでも大学を選ぶ理由は何？』を見てる。定着性も活躍性も、かなり強く問う質問。"
    }
  };

  const style = document.createElement("style");
  style.textContent = `
    .quick-review {
      grid-column: 1 / -1;
      padding: 20px;
      background: rgba(230, 221, 210, .10);
      border: 2px solid var(--accent);
      box-shadow: 4px 4px 0 var(--shadow);
    }

    .quick-review-head {
      display: flex;
      flex-wrap: wrap;
      align-items: baseline;
      gap: 8px 14px;
      margin-bottom: 14px;
    }

    .quick-review-kicker,
    .quick-talk-label {
      color: var(--accent-dark);
      font-size: .72rem;
      font-weight: 700;
      letter-spacing: .14em;
    }

    .quick-review-title {
      margin: 0;
      font-family: var(--font-heading);
      font-size: clamp(1.15rem, 2.4vw, 1.55rem);
      font-weight: 700;
      line-height: 1.45;
    }

    .quick-intent {
      margin: 0 0 14px;
      padding: 12px 14px;
      font-family: var(--font-heading);
      font-size: clamp(1.02rem, 2vw, 1.25rem);
      font-weight: 700;
      line-height: 1.7;
      background: rgba(46, 47, 49, .42);
      border-left: 5px solid var(--accent-dark);
    }

    .quick-axis-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .quick-axis {
      padding: 12px 13px;
      background: rgba(86, 82, 79, .66);
      border: 1px solid var(--line-soft);
    }

    .quick-axis strong {
      display: block;
      margin-bottom: 4px;
      color: var(--ink);
      font-family: var(--font-heading);
      font-size: 1rem;
    }

    .quick-axis p {
      margin: 0;
      color: var(--accent);
      font-size: .84rem;
      line-height: 1.65;
    }

    .quick-talk {
      margin-top: 12px;
      padding: 14px 16px;
      background: var(--bg-deep);
      border-left: 6px solid var(--accent);
    }

    .quick-talk p {
      margin: 5px 0 0;
      color: var(--ink);
      font-size: clamp(.93rem, 1.8vw, 1.04rem);
      font-weight: 500;
      line-height: 1.78;
    }

    .detail-review {
      grid-column: 1 / -1;
      overflow: hidden;
      background: rgba(46, 47, 49, .30);
      border: 1px solid var(--line);
    }

    .detail-review > summary {
      position: relative;
      padding: 13px 50px 13px 16px;
      color: var(--muted);
      font-size: .82rem;
      font-weight: 700;
      letter-spacing: .08em;
      cursor: pointer;
      list-style: none;
      background: rgba(86, 82, 79, .56);
    }

    .detail-review > summary::-webkit-details-marker {
      display: none;
    }

    .detail-review > summary::after {
      position: absolute;
      top: 50%;
      right: 20px;
      width: 10px;
      height: 10px;
      content: "";
      border-right: 2px solid currentColor;
      border-bottom: 2px solid currentColor;
      transform: translateY(-65%) rotate(45deg);
    }

    .detail-review[open] > summary::after {
      transform: translateY(-25%) rotate(225deg);
    }

    .detail-review .review-grid {
      padding: 14px;
    }

    @media (max-width: 620px) {
      .quick-review {
        padding: 16px 14px;
      }

      .quick-axis-grid {
        grid-template-columns: 1fr;
      }

      .quick-intent {
        padding: 11px 12px;
      }

      .quick-talk {
        padding: 12px 13px;
      }
    }
  `;
  document.head.appendChild(style);

  function installQuickReview() {
    document.querySelectorAll(".deck-card[data-card-id]").forEach((card) => {
      const id = card.dataset.cardId;
      const quick = quickReviews[id];
      const body = card.querySelector(".review-body");
      const grid = body?.querySelector(".review-grid");
      const toggle = card.querySelector(".review-toggle");

      if (!quick || !body || !grid || body.querySelector(".quick-review")) return;

      const retentionLabel = card.querySelector(".axis-chip:first-child")?.textContent?.trim() || "定着性";
      const growthLabel = card.querySelector(".axis-chip:last-child")?.textContent?.trim() || "活躍性";

      const quickBlock = document.createElement("section");
      quickBlock.className = "quick-review";
      quickBlock.innerHTML = `
        <div class="quick-review-head">
          <span class="quick-review-kicker">QUICK REVIEW / 10–20 SEC</span>
          <h3 class="quick-review-title">今の質問を、ひと言で返すなら</h3>
        </div>

        <p class="quick-intent">${quick.intent}</p>

        <div class="quick-axis-grid">
          <div class="quick-axis">
            <strong>${retentionLabel}</strong>
            <p>${quick.retention}</p>
          </div>
          <div class="quick-axis">
            <strong>${growthLabel}</strong>
            <p>${quick.growth}</p>
          </div>
        </div>

        <div class="quick-talk">
          <span class="quick-talk-label">その場で返すなら</span>
          <p>${quick.talk}</p>
        </div>
      `;

      const detail = document.createElement("details");
      detail.className = "detail-review";
      const summary = document.createElement("summary");
      summary.textContent = "DETAIL REVIEW / 必要なら詳しく見る";
      detail.appendChild(summary);
      detail.appendChild(grid);

      body.prepend(detail);
      body.prepend(quickBlock);

      if (toggle) {
        toggle.textContent = "QUICK REVIEWを開く";
        toggle.addEventListener("click", () => {
          const isOpen = toggle.getAttribute("aria-expanded") === "true";
          toggle.textContent = isOpen ? "QUICK REVIEWを閉じる" : "QUICK REVIEWを開く";
        });
      }
    });
  }

  installQuickReview();
})();
