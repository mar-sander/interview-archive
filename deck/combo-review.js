/* ================================================================
   INTERVIEW PRACTICE DECK / COMBO LAYER
   面接中に使う「追撃カード」を常時表示し、
   DETAIL REVIEW はレビュー時に見つけやすい導線へ整える。
   ================================================================ */

(() => {
  // ===== 01. COMBO / DETAIL REVIEW 専用スタイル =====
  const style = document.createElement("style");
  style.textContent = `
    /* 面接中に一瞬で拾うための追撃カード */
    .combo-panel {
      margin: 0;
      padding: 16px 20px 18px;
      background: rgba(46, 47, 49, .56);
      border: 0;
      border-top: 1px solid var(--line);
      border-bottom: 1px solid var(--line);
      border-left: 8px solid var(--accent-dark);
      box-shadow: none;
    }

    .combo-panel .review-label {
      margin-bottom: 3px;
      color: var(--accent-dark);
      letter-spacing: .18em;
    }

    .combo-panel h3 {
      margin: 0 0 12px;
      font-family: var(--font-heading);
      font-size: 1.08rem;
      line-height: 1.45;
    }

    .combo-panel ul {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      margin: 0;
      padding: 0;
      list-style: none;
      counter-reset: combo-card;
    }

    .combo-panel li {
      position: relative;
      min-height: 54px;
      margin: 0;
      padding: 10px 12px 10px 46px;
      font-size: .88rem;
      font-weight: 500;
      line-height: 1.55;
      background: rgba(86, 82, 79, .82);
      border: 1px solid var(--line-soft);
      counter-increment: combo-card;
    }

    .combo-panel li::before {
      position: absolute;
      top: 10px;
      left: 10px;
      display: grid;
      place-items: center;
      width: 27px;
      height: 27px;
      content: counter(combo-card, decimal-leading-zero);
      color: var(--text-dark);
      font-size: .68rem;
      font-weight: 700;
      line-height: 1;
      background: var(--accent);
      border: 1px solid var(--accent-dark);
    }

    /* REVIEW中に「押せる場所」とすぐ認識できるDETAILボタン */
    .detail-review {
      margin-top: 14px;
      border: 0;
      background: transparent;
    }

    .detail-review > summary {
      min-height: 52px;
      padding: 14px 54px 14px 18px;
      color: var(--ink);
      font-size: .86rem;
      font-weight: 700;
      letter-spacing: .04em;
      background: var(--surface-3);
      border: 2px solid var(--accent-dark);
      box-shadow: 3px 3px 0 var(--shadow);
      transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
    }

    .detail-review > summary:hover {
      transform: translate(1px, 1px);
      box-shadow: 2px 2px 0 var(--shadow);
      background: var(--main);
    }

    .detail-review > summary:active {
      transform: translate(3px, 3px);
      box-shadow: none;
    }

    .detail-review[open] > summary {
      color: var(--text-dark);
      background: var(--accent);
    }

    .detail-review .review-grid {
      margin-top: 8px;
      padding: 14px;
      background: rgba(46, 47, 49, .30);
      border: 1px solid var(--line-soft);
    }

    @media (max-width: 820px) {
      .combo-panel ul {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 620px) {
      .combo-panel {
        padding: 14px 14px 16px;
      }

      .combo-panel li {
        min-height: 50px;
        padding: 9px 10px 9px 43px;
        font-size: .86rem;
      }

      .combo-panel li::before {
        top: 9px;
        left: 9px;
      }

      .detail-review > summary {
        padding-left: 14px;
        font-size: .82rem;
      }
    }
  `;
  document.head.appendChild(style);

  // ===== 02. 追撃カードをDETAIL REVIEWから面接中の常時表示領域へ移動 =====
  function installComboLayer() {
    document.querySelectorAll(".deck-card[data-card-id]").forEach((card) => {
      if (card.dataset.comboEnhanced === "true") return;

      const detail = card.querySelector(".detail-review");
      const quickToggle = card.querySelector(".review-toggle");
      if (!detail || !quickToggle) return;

      const deepDiveSection = [...detail.querySelectorAll(".review-section")].find((section) => {
        return section.querySelector(".review-label")?.textContent?.trim() === "DEEP DIVE";
      });

      if (!deepDiveSection) return;

      // 表記をカードゲーム的な運用語へ変更する。
      const label = deepDiveSection.querySelector(".review-label");
      const heading = deepDiveSection.querySelector("h3");
      if (label) label.textContent = "COMBO";
      if (heading) heading.textContent = "追撃カード";

      // DETAIL REVIEW 内から外へ移し、QUICK REVIEWを開く前から見えるようにする。
      deepDiveSection.classList.remove("full");
      deepDiveSection.classList.add("combo-panel");
      card.insertBefore(deepDiveSection, quickToggle);

      // ===== 03. DETAIL REVIEW の開閉文言を「操作できるボタン」として明確化 =====
      const summary = detail.querySelector(":scope > summary");
      const syncDetailLabel = () => {
        if (!summary) return;
        summary.textContent = detail.open
          ? "DETAIL REVIEWを閉じる"
          : "DETAIL REVIEWを開く";
      };

      syncDetailLabel();
      detail.addEventListener("toggle", syncDetailLabel);

      card.dataset.comboEnhanced = "true";
    });
  }

  installComboLayer();
})();
