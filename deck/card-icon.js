/* ================================================================
   INTERVIEW PRACTICE DECK / QUESTION CARD ICON
   質問文の左とヘッダーのブランド位置に、
   2枚のカードを重ねたアイコンを控えめに表示する。
   ================================================================ */

(() => {
  const style = document.createElement("style");
  style.textContent = `
    /* ===== 質問カードの左アイコン ===== */
    .card-question {
      position: relative;
      padding-left: 48px;
    }

    .card-question::before {
      position: absolute;
      top: .20em;
      left: 0;
      width: 36px;
      height: 36px;
      content: "";
      background: var(--accent);
      -webkit-mask: url("hand-holding-card.svg") center / contain no-repeat;
      mask: url("hand-holding-card.svg") center / contain no-repeat;
      opacity: .92;
    }

    /* ===== ヘッダーのDECKアイコン ===== */
    .brand-mark {
      display: block;
      width: 25px;
      height: 25px;
      flex: 0 0 25px;
      background: var(--accent);
      -webkit-mask: url("hand-holding-card.svg") center / contain no-repeat;
      mask: url("hand-holding-card.svg") center / contain no-repeat;
      box-shadow: none;
      opacity: .94;
    }

    @media (max-width: 620px) {
      .card-question {
        padding-left: 40px;
      }

      .card-question::before {
        top: .22em;
        width: 30px;
        height: 30px;
      }

      /* style.css側の非表示指定を上書きして、スマホでも表示する */
      .brand-mark {
        display: block;
        width: 23px;
        height: 23px;
        flex-basis: 23px;
      }

      .brand-mini {
        gap: 8px;
      }
    }
  `;

  document.head.appendChild(style);
})();
