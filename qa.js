/* ================================================================
   INTERVIEW QUESTION ARCHIVE / STUDENT Q&A
   deck側で蓄積したQ&Aを、高校生が自分で読める形に整理して表示する。
   ================================================================ */

(() => {
  const qaItems = [
    {
      id: "QA01",
      category: "core",
      question: "本当に、面接の全部の質問で「定着性」と「活躍性」を見ているんですか？",
      answer: [
        "実際の採用や入試には、志望度、適性、基礎学力、専門性、人物面、コミュニケーションなど、もっと細かな評価項目があります。",
        "このサイトでは、それらを高校生が理解しやすいように、大きく<strong>「ここで続けていけそうか＝定着性」</strong>と<strong>「ここで伸びていきそうか＝活躍性」</strong>の二つに整理して考えています。",
        "だから「世の中の面接官が必ずこの二語で採点している」という意味ではありません。いろいろな質問の意図を読み解くための<strong>考え方の軸</strong>です。"
      ]
    },
    {
      id: "QA02",
      category: "core",
      question: "定着性って、「絶対に辞めません」と言えればいいんですか？",
      answer: [
        "いいえ。未来のことを100％約束できる人はいませんし、「絶対に辞めません」と強く言うだけでは根拠になりません。",
        "見られやすいのは、<strong>なぜその場所を選んだのか</strong>、思いどおりにならないときに<strong>どう向き合えそうか</strong>、困ったときに相談・工夫・修正ができそうか、というところです。",
        "定着性は「我慢して居続ける力」ではなく、<strong>自分で選んだ場所と現実的に向き合っていけそうか</strong>と考える方が近いです。"
      ]
    },
    {
      id: "QA03",
      category: "core",
      question: "活躍性って、成績が良かったり資格をたくさん持っている人の方が高いんですか？",
      answer: [
        "成績や資格は一つの材料にはなります。でも、それだけで活躍性が決まるわけではありません。",
        "高校生の段階では、すでに何でもできることより、<strong>分からないことを学べるか、失敗から修正できるか、人と協力できるか、自分で考えて動けるか</strong>の方が未来の成長を想像する材料になります。",
        "「今の完成度」だけでなく、<strong>これから伸びる可能性</strong>を感じてもらうことが大切です。"
      ]
    },
    {
      id: "QA04",
      category: "core",
      question: "面接官によって考え方は違いますよね。それでも質問の意図を考える意味はありますか？",
      answer: [
        "もちろん面接官によって質問の仕方も、重視するポイントも違います。だから、相手の頭の中を完全に当てることはできません。",
        "それでも<strong>「なぜこの質問をしたのだろう？」</strong>と考える癖には意味があります。質問の表面だけに反応するより、相手が知りたいことを想像して答えられるからです。",
        "これは面接だけでなく、仕事や学校での会話にもつながるコミュニケーションの力です。"
      ]
    },
    {
      id: "QA05",
      category: "honesty",
      question: "「素直」って、面接官の言うことに何でも「はい」と言うことですか？",
      answer: [
        "違います。このサイトで言う「素直」は、従順であることではありません。",
        "分からないなら分からないと認める。失敗したなら失敗を認める。助けてもらったなら助けてもらったと認める。そのうえで、<strong>自分はどう考え、これからどうしようとしているのか</strong>を話すことです。",
        "自分にも相手にも嘘をつかず、現状を受け止める。ここではそれを<strong>誠実さとしての素直さ</strong>と考えています。"
      ]
    },
    {
      id: "QA06",
      category: "honesty",
      question: "失敗や短所を正直に話したら、不利になりませんか？",
      answer: [
        "内容によっては注意が必要ですが、失敗や短所が一つもない人に見せることが目的ではありません。",
        "面接官が知りたいのは、失敗した事実だけではなく、<strong>そのあと何を考えて、どう対応したのか</strong>です。自分の課題を理解して工夫しているなら、それは自己理解や成長性の材料にもなります。",
        "隠すことより、<strong>認めたうえで向き合っている姿</strong>の方が信用につながる場合があります。"
      ]
    },
    {
      id: "QA07",
      category: "honesty",
      question: "分からない質問に「分かりません」と答えてもいいんですか？",
      answer: [
        "分からないのに知ったふりをするよりは、分からないことを認めた方がいいです。",
        "ただし、「分かりません」で会話を終わらせる必要はありません。たとえば<strong>「今の時点では十分に理解できていません。入社・入学までに調べたいです」</strong>、<strong>「少し考える時間をいただいてもよろしいですか」</strong>のように、その後の姿勢まで示せます。",
        "素直さと、そこで止まらず向き合おうとする姿勢は両立します。"
      ]
    },
    {
      id: "QA08",
      category: "honesty",
      question: "じゃあ、本音は全部正直に話した方がいいんですか？",
      answer: [
        "「素直であること」と「頭に浮かんだことを全部そのまま話すこと」は違います。",
        "面接は相手との対話です。自分の本音を理解したうえで、<strong>相手が何を知りたいのかを考え、必要なことを選んで伝える</strong>ことが大切です。",
        "嘘はつかない。でも、伝え方には配慮する。その両方が必要です。"
      ]
    },
    {
      id: "QA09",
      category: "words",
      question: "「自分の言葉で話す」って、具体的にはどういうことですか？",
      answer: [
        "言葉遣いを全部自分でゼロから発明する、という意味ではありません。",
        "大事なのは、<strong>その内容を「なぜ自分がそう思うのか」まで説明できること</strong>です。自分の経験、考えたこと、選んだ理由とつながっている言葉なら、表現を誰かに教えてもらっていても自分の言葉になり得ます。",
        "逆に、立派な文章でも「なぜ？」と聞かれた瞬間に自分で説明できなければ、まだ借り物の言葉かもしれません。"
      ]
    },
    {
      id: "QA10",
      category: "words",
      question: "先生に添削してもらったら、自分の言葉じゃなくなりませんか？",
      answer: [
        "添削してもらうこと自体は問題ありません。自分では気づけなかった表現や伝わりにくさを直してもらうことは、普通の学びです。",
        "ただし、直された文章を<strong>意味も分からず丸ごと暗記する</strong>と借り物になります。",
        "「なぜこの表現になったのか」「自分が本当に言いたいことと一致しているか」を確認して、自分で説明できる状態にしてください。"
      ]
    },
    {
      id: "QA11",
      category: "words",
      question: "AIを使って志望理由や面接回答を考えたらダメなんですか？",
      answer: [
        "AIを使うこと自体が問題なのではありません。考えを整理したり、別の視点をもらったり、伝わりやすい表現を探したりする道具として使えます。",
        "問題になるのは、<strong>AIが作った答えを、自分の中にない考えのまま提出・暗唱すること</strong>です。",
        "AIに考えてもらうのではなく、AIと一緒に自分の経験や考えを掘る。最後に「これは本当に自分が言いたいことか？」を確認できれば、使い方は大きく変わります。"
      ]
    },
    {
      id: "QA12",
      category: "words",
      question: "面接回答を丸暗記するのはダメですか？",
      answer: [
        "暗記そのものが悪いわけではありません。話したい内容を整理して、ある程度覚えておくことはあります。",
        "ただ、文章を一字一句再生することが目的になると、質問の言い方が少し変わっただけで崩れます。深掘りされたときにも対応しづらくなります。",
        "覚えるなら文章ではなく、<strong>「この質問では、この経験とこの考えを伝えたい」という材料や軸</strong>を覚える方が強いです。"
      ]
    },
    {
      id: "QA13",
      category: "words",
      question: "「熱意」って、声を大きくしたり「絶対入りたいです」と強く言うことですか？",
      answer: [
        "それも伝わり方の一部にはなりますが、熱意は声量や勢いだけではありません。",
        "なぜ興味を持ったのか、何を調べたのか、そこへ行くために何をしてきたのか、入ったあと何をしたいのか。<strong>言葉と行動がつながっていること</strong>の方が強い熱意になります。",
        "熱意は、<strong>「その進路について、自分で考えてきた痕跡」</strong>にも表れると考えています。"
      ]
    },
    {
      id: "QA14",
      category: "words",
      question: "第一志望だけど、「ここじゃなきゃ絶対ダメ」とまでは思えていません。それでも大丈夫ですか？",
      answer: [
        "進路には似た選択肢があるので、「世界でここしかありません」と思えないこと自体は不自然ではありません。",
        "大切なのは、他にも選択肢があることを認めたうえで、<strong>それでも自分がここを選んだ理由</strong>を説明できることです。",
        "無理に運命の場所のように言うより、自分が比較して何を大切にして選んだかを話す方が信用できます。"
      ]
    },
    {
      id: "QA15",
      category: "words",
      question: "会社や大学の良いところをたくさん言った方が、志望度が伝わりますか？",
      answer: [
        "情報をたくさん知っていることは企業・学校研究の材料にはなります。でも、良いところを並べるだけではパンフレットの説明になりやすいです。",
        "大事なのは<strong>「その特徴が、なぜ自分にとって重要なのか」</strong>です。",
        "一つか二つでも、自分の経験や将来像とのつながりまで深く説明できる方が、志望理由としては本人性が出ます。"
      ]
    },
    {
      id: "QA16",
      category: "words",
      question: "「それ、他の会社・大学でもできますよね？」と言われたら、どうすればいいですか？",
      answer: [
        "まず、「他でもできる部分がある」こと自体を無理に否定しなくても構いません。",
        "そのうえで、<strong>自分が比較したときに何を重視し、なぜここを選んだのか</strong>へ戻ります。会社・大学の特徴だけでなく、自分の経験や価値観との接点まで話せると強くなります。",
        "この質問は、あなたを落とすためだけの問いではありません。自分の選択理由をどこまで考え抜けているか、確かめるために使われることがあります。"
      ]
    },
    {
      id: "QA17",
      category: "deep",
      question: "たくさん深掘りされたんですけど、最初の回答が悪かったってことですか？",
      answer: [
        "必ずしもそうではありません。もちろん説明が足りず確認される場合もありますが、<strong>もっとあなたのことを知りたいから</strong>深掘りされることもあります。",
        "「なぜ？」「具体的には？」「そのときあなたは何をした？」と掘ることで、用意した文章の奥にある本人の経験や考えが見えてきます。",
        "深掘りされたこと自体を失敗判定にせず、<strong>どこをもっと説明してほしかったのか</strong>を振り返ってみてください。"
      ]
    },
    {
      id: "QA18",
      category: "deep",
      question: "「なぜ？」を何回も聞かれると、途中で答えられなくなります。",
      answer: [
        "それは珍しいことではありません。むしろ、そこで自分の考えがまだ言語化できていない場所が見つかります。",
        "答えられなかったら、後から<strong>「自分はなぜそう思ったのか」「きっかけになった経験は何か」「本当にそう思っているのか」</strong>を掘り直してください。",
        "模擬面接で詰まることは失敗ではありません。本番前に、<strong>まだ考え切れていない場所を発見できた</strong>ということです。"
      ]
    },
    {
      id: "QA19",
      category: "deep",
      question: "面接官に反対されたり、「本当にそうですか？」と言われたら、考えを変えた方がいいですか？",
      answer: [
        "相手に合わせてすぐ考えを変える必要はありませんし、意地になって絶対に変えない必要もありません。",
        "まず相手の指摘を聞いて、<strong>「確かにそういう見方もある」と考えたうえで、自分はどう考えるのか</strong>を話せばいいです。",
        "素直さは、自分の軸を捨てることではありません。相手の意見を受け取ったうえで考え直せることも、素直さや思考力の一部です。"
      ]
    },
    {
      id: "QA20",
      category: "answer",
      question: "結局、この質問には何て答えるのが「正解」なんですか？",
      answer: [
        "面接には、計算問題のような一つの模範回答がない質問がたくさんあります。",
        "このサイトが答えそのものを載せないのは、<strong>その質問に対する文章を覚えるのではなく、なぜ聞かれたかを考えて、自分の経験から答えを作れるようになってほしい</strong>からです。",
        "質問の意図を考える。使える自分の経験を探す。自分が本当に伝えたいことを決める。そこから言葉にする。その過程で作った答えが、あなたの答えになります。"
      ]
    }
  ];

  let activeCategory = "all";
  let isInstalled = false;
  let isInitialized = false;

  function categoryLabel(category) {
    const labels = {
      core: "定着性・活躍性",
      honesty: "素直さ",
      words: "自分の言葉・熱意",
      deep: "深掘り",
      answer: "正解・模範回答"
    };
    return labels[category] || category;
  }

  function installShell() {
    if (isInstalled || document.getElementById("view-qa")) return;

    const mainNav = document.querySelector('.sidebar .nav[aria-label="メインナビゲーション"]');
    const trainingButton = mainNav?.querySelector('[data-view="training"]');

    if (trainingButton) {
      trainingButton.insertAdjacentHTML("afterend", `
        <button class="nav-button" type="button" data-view="qa">
          <span class="nav-num">04</span><span>Q&amp;A</span>
        </button>
      `);
    }

    document.querySelectorAll(".article-nav .nav-num").forEach((number, index) => {
      number.textContent = String(index + 5).padStart(2, "0");
    });

    const heroActions = document.querySelector(".hero-actions");
    const randomHeroButton = document.getElementById("randomHeroButton");
    if (heroActions && randomHeroButton && !heroActions.querySelector('[data-go="qa"]')) {
      randomHeroButton.insertAdjacentHTML("beforebegin", '<button class="btn" type="button" data-go="qa">よくある疑問を見る</button>');
    }

    const trainingView = document.getElementById("view-training");
    if (trainingView) {
      trainingView.insertAdjacentHTML("afterend", `
        <!-- Q&A -->
        <section class="view" id="view-qa" data-view-panel="qa">
          <header class="page-header">
            <div class="eyebrow">INTERVIEW Q&amp;A</div>
            <h1>面接について、よくある疑問</h1>
            <p>このサイトを読んでいて「でも、本当に？」「じゃあ、こういうときは？」と思ったら、ここを使ってください。面接の考え方について、高校生から出やすい疑問をまとめています。</p>
          </header>

          <section class="filter-panel" aria-label="Q&Aの絞り込み">
            <div class="filter-row">
              <span class="filter-label">分類</span>
              <div class="filter-buttons" id="qaCategoryFilters">
                <button class="filter-btn active" type="button" data-qa-filter="all">ALL</button>
                <button class="filter-btn" type="button" data-qa-filter="core">定着性・活躍性</button>
                <button class="filter-btn" type="button" data-qa-filter="honesty">素直さ</button>
                <button class="filter-btn" type="button" data-qa-filter="words">自分の言葉・熱意</button>
                <button class="filter-btn" type="button" data-qa-filter="deep">深掘り</button>
                <button class="filter-btn" type="button" data-qa-filter="answer">正解・模範回答</button>
              </div>
            </div>

            <div class="filter-row">
              <label class="filter-label" for="qaSearchInput">検索</label>
              <input class="search-input" id="qaSearchInput" type="search" placeholder="例：素直、短所、AI、深掘り">
            </div>

            <div class="filter-row filter-meta">
              <span class="filter-label">表示</span>
              <strong id="qaResultCount">0件</strong>
              <button class="text-button" id="qaResetButton" type="button">絞り込みを解除</button>
            </div>
          </section>

          <div class="question-list" id="qaList"></div>
        </section>
      `);
    }

    isInstalled = true;
  }

  function createCard(item) {
    const article = document.createElement("article");
    article.className = "question-card";
    article.dataset.qaCategory = item.category;
    article.dataset.qaId = item.id;

    article.innerHTML = `
      <div class="question-main">
        <div class="question-topline">
          <span class="question-number">${item.id}</span>
          <span class="badge">${categoryLabel(item.category)}</span>
        </div>
        <h2 class="question-title">${item.question}</h2>
      </div>

      <button class="intent-toggle qa-toggle" type="button" aria-expanded="false">考え方を見る</button>

      <div class="intent-body qa-answer">
        <h3>この疑問について</h3>
        ${item.answer.map((paragraph) => `<p>${paragraph}</p>`).join("")}
      </div>
    `;

    const toggle = article.querySelector(".qa-toggle");
    const answer = article.querySelector(".qa-answer");

    toggle?.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      answer?.classList.toggle("open", !isOpen);
      toggle.textContent = isOpen ? "考え方を見る" : "考え方を閉じる";
    });

    return article;
  }

  function applyFilters() {
    const query = (document.getElementById("qaSearchInput")?.value || "").trim().toLowerCase();
    const filtered = qaItems.filter((item) => {
      const categoryMatch = activeCategory === "all" || item.category === activeCategory;
      const searchable = [
        item.question,
        categoryLabel(item.category),
        ...item.answer.map((paragraph) => paragraph.replace(/<[^>]+>/g, ""))
      ].join(" ").toLowerCase();
      return categoryMatch && (!query || searchable.includes(query));
    });

    const list = document.getElementById("qaList");
    if (list) {
      list.innerHTML = "";
      if (filtered.length === 0) {
        list.innerHTML = '<div class="empty-state">該当するQ&amp;Aはありません。検索語や分類を変えてみてください。</div>';
      } else {
        filtered.forEach((item) => list.appendChild(createCard(item)));
      }
    }

    const count = document.getElementById("qaResultCount");
    if (count) count.textContent = `${filtered.length}件`;
  }

  function bindFilters() {
    document.querySelectorAll("[data-qa-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        activeCategory = button.dataset.qaFilter;
        document.querySelectorAll("[data-qa-filter]").forEach((target) => {
          target.classList.toggle("active", target === button);
        });
        applyFilters();
      });
    });

    document.getElementById("qaSearchInput")?.addEventListener("input", applyFilters);

    document.getElementById("qaResetButton")?.addEventListener("click", () => {
      activeCategory = "all";
      const input = document.getElementById("qaSearchInput");
      if (input) input.value = "";
      document.querySelectorAll("[data-qa-filter]").forEach((button) => {
        button.classList.toggle("active", button.dataset.qaFilter === "all");
      });
      applyFilters();
    });
  }

  function bindStatus() {
    const setQaStatus = () => {
      const status = document.getElementById("topStatus");
      if (status) status.textContent = "面接Q&A / よくある疑問";
    };

    document.querySelectorAll('[data-view="qa"], [data-go="qa"]').forEach((button) => {
      button.addEventListener("click", setQaStatus);
    });
  }

  function initialize() {
    if (isInitialized) return;
    applyFilters();
    bindFilters();
    bindStatus();
    isInitialized = true;
  }

  window.InterviewQA = {
    installShell,
    initialize
  };
})();