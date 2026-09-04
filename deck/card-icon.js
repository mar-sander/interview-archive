/* ================================================================
   INTERVIEW PRACTICE DECK / QUESTION CARD ICON
   質問文の左にだけ、カードを持つ手のアイコンを控えめに表示する。
   ================================================================ */

(() => {
  const style = document.createElement("style");
  style.textContent = `
    .card-question {
      position: relative;
      padding-left: 44px;
    }

    .card-question::before {
      position: absolute;
      top: .28em;
      left: 0;
      width: 32px;
      height: 32px;
      content: "";
      background: var(--accent);
      -webkit-mask: url("hand-holding-card.svg") center / contain no-repeat;
      mask: url("hand-holding-card.svg") center / contain no-repeat;
      opacity: .92;
    }

    @media (max-width: 620px) {
      .card-question {
        padding-left: 37px;
      }

      .card-question::before {
        top: .30em;
        width: 27px;
        height: 27px;
      }
    }
  `;

  document.head.appendChild(style);
})();
