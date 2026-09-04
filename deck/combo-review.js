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
      display: grid;
      grid-template-columns: 30px minmax(0, 1fr);
      align-items: center;
      gap: 10px;
      min-height: 54px;
      margin: 0;
      padding: 10px 12px;
      font-size: .88rem;
      font-weight: 500;
      line-height: 1.55;
      background: rgba(86, 82, 79, .82);
      border: 1px solid var(--line-soft);
      counter-increment: combo-card;
    }

    .combo-panel li::before {
      display: grid;
      place-items: center;
      align-self: center;
      justify-self: center;
      width: 28px;
      height: 28px;
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
      position: relative;
      min-height: 58px;
      padding: 16px 60px 16px 18px;
      color: var(--text-dark);
      font-size: .92rem;
      font-weight: 700;
      letter-spacing: .045em;
      cursor: pointer;
      background: var(--accent);
      border: 2px solid var(--ink);
      border-left: 9px solid var(--accent-dark);
      box-shadow: 5px 5px 0 var(--shadow-strong);
      transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
    }

    .detail-review > summary::after {
      right: 22px;
      width: 12px;
      height: 12px;
      border-width: 0 3px 3px 0;
    }

    .detail-review > summary:hover {
      transform: translate(1px, 1px);
      box-shadow: 4px 4px 0 var(--shadow-strong);
      background: var(--ink);
    }

    .detail-review > summary:active {
      transform: translate(4px, 4px);
      box-shadow: 1px 1px 0 var(--shadow-strong);
    }

    .detail-review[open] > summary {
      color: var(--ink);
      background: var(--surface-3);
      border-color: var(--accent);
      border-left-color: var(--accent);
      box-shadow: 4px 4px 0 var(--shadow);
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
        grid-template-columns: 30px minmax(0, 1fr);
        gap: 9px;
        min-height: 50px;
        padding: 9px 10px;
        font-size: .86rem;
      }

      .detail-review > summary {
        min-height: 56px;
        padding: 15px 54px 15px 14px;
        font-size: .84rem;
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
          ? "DETAIL REVIEW / 詳細情報を閉じる"
          : "DETAIL REVIEW / 必要なら詳しく見る";
      };

      syncDetailLabel();
      detail.addEventListener("toggle", syncDetailLabel);

      card.dataset.comboEnhanced = "true";
    });
  }

  installComboLayer();
})();
