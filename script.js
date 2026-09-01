/* ================================================================
   INTERVIEW QUESTION ARCHIVE / BOOTSTRAP
   Q&Aと面接直前チェックの画面を先に組み込み、既存のアーカイブ本体を読み込む。
   ================================================================ */

(() => {
  function loadScript(src, onLoad) {
    const script = document.createElement("script");
    script.src = src;
    script.addEventListener("load", onLoad, { once: true });
    document.body.appendChild(script);
  }

  loadScript("qa.js", () => {
    window.InterviewQA?.installShell();

    loadScript("last-check.js", () => {
      window.InterviewLastCheck?.installShell();

      loadScript("archive-core.js", () => {
        window.InterviewQA?.initialize();
        window.InterviewLastCheck?.initialize();
      });
    });
  });
})();