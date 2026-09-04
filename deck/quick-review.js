/* ================================================================
   INTERVIEW PRACTICE DECK / QUICK REVIEW BOOTSTRAP
   QUICK REVIEW本体を読み込んだあと、COMBO拡張を適用する。
   ================================================================ */

(() => {
  function loadScript(src, onLoad) {
    const script = document.createElement("script");
    script.src = src;
    script.addEventListener("load", onLoad, { once: true });
    document.body.appendChild(script);
  }

  loadScript("quick-review-core.js", () => {
    loadScript("combo-review.js", () => {});
  });
})();