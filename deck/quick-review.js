/* ================================================================
   INTERVIEW PRACTICE DECK / QUICK REVIEW BOOTSTRAP
   QUICK REVIEW本体を読み込んだあと、視認性補正とCOMBO拡張を適用する。
   ================================================================ */

(() => {
  function loadScript(src, onLoad) {
    const script = document.createElement("script");
    script.src = src;
    script.addEventListener("load", onLoad, { once: true });
    document.body.appendChild(script);
  }

  function improveQuickAxisContrast() {
    const style = document.createElement("style");
    style.textContent = `
      .quick-axis p {
        color: var(--ink);
        font-weight: 500;
      }
    `;
    document.head.appendChild(style);
  }

  loadScript("quick-review-core.js", () => {
    improveQuickAxisContrast();
    loadScript("combo-review.js", () => {});
  });
})();