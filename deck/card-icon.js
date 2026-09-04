/* ================================================================
   INTERVIEW PRACTICE DECK / QUESTION CARD ICON
   質問文の左にだけ、2枚のカードを重ねたアイコンを控えめに表示する。
   ================================================================ */

(() => {
  const style = document.createElement("style");
  style.textContent = `
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

    @media (max-width: 620px) {
      .card-question {
        padding-left: 40px;
      }

      .card-question::before {
        top: .22em;
        width: 30px;
        height: 30px;
      }
    }
  `;

  document.head.appendChild(style);
})();
