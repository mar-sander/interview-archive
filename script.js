// ===== 00. 入室パスワード認証 =====
const AUTH_KEY = "interview_archive_auth_v1";
const AUTH_HASH = "409dfa7ef0cf9f5481db2ebe2993a0a8fffdc69b792149f7fbdea4608958f44e";

async function sha256(value) {
  if (!window.crypto?.subtle) {
    throw new Error("このブラウザーでは認証機能を利用できません。");
  }

  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);

  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function setAuthError(message = "") {
  const error = document.getElementById("authError");
  if (error) error.textContent = message;
}

function unlockSite() {
  document.body.classList.remove("auth-locked");
  document.body.classList.add("auth-unlocked");
  document.getElementById("authGate")?.setAttribute("aria-hidden", "true");
  setAuthError("");
}

function lockSite({ focus = true } = {}) {
  document.body.classList.remove("auth-unlocked");
  document.body.classList.add("auth-locked");
  document.getElementById("authGate")?.removeAttribute("aria-hidden");

  const input = document.getElementById("authPassword");
  if (input) input.value = "";

  setAuthError("");

  if (focus) {
    setTimeout(() => input?.focus(), 30);
  }
}

function hasSavedAuth() {
  try {
    return localStorage.getItem(AUTH_KEY) === AUTH_HASH;
  } catch (error) {
    return false;
  }
}

function saveAuth() {
  try {
    localStorage.setItem(AUTH_KEY, AUTH_HASH);
    return true;
  } catch (error) {
    return false;
  }
}

function bindAuth() {
  const form = document.getElementById("authForm");
  const input = document.getElementById("authPassword");

  if (hasSavedAuth()) {
    unlockSite();
  } else {
    lockSite({ focus: true });
  }

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const value = input?.value ?? "";
    if (!value) {
      setAuthError("パスワードを入力してください。");
      input?.focus();
      return;
    }

    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    submit.textContent = "確認しています…";
    setAuthError("");

    try {
      const hash = await sha256(value);

      if (hash !== AUTH_HASH) {
        setAuthError("パスワードが違います。入力内容を確認してください。");
        input?.select();
        return;
      }

      saveAuth();
      unlockSite();
    } catch (error) {
      setAuthError(error?.message || "認証中にエラーが発生しました。");
    } finally {
      submit.disabled = false;
      submit.textContent = "入室する";
    }
  });
}

bindAuth();

/* ================================================================
   面接想定質問集 Ver.0.7
   質問データ・画面切替・絞り込み・ランダム出題
   ================================================================ */

// ===== 01. 高校生向け付録「面接を始める前に知っておいてほしいこと」 =====
const guideItems = [
  {
    title: "あらゆる質問には、それを訊く理由がある",
    body: "面接官は、なんとなく質問しているわけではありません。質問を聞いたら、すぐ答えを探す前に「この人は、私の何を知りたいのだろう？」と考えてみてください。"
  },
  {
    title: "面接は『正解を当てる試験』ではない",
    body: "同じ質問でも、答えは人によって違います。必要なのは模範解答ではなく、自分の経験や考えを使って、相手が知りたいことに答えることです。"
  },
  {
    title: "面接官は、あなたの『これから』を見ようとしている",
    body: "高校生の時点で完成された社会人や大学生である必要はありません。今の実績だけでなく、入社・入学後にどんなふうに学び、成長していきそうかが見られています。"
  },
  {
    title: "このサイトでは『定着性』と『活躍性』で整理する",
    body: "面接で評価される項目はたくさんあります。このサイトでは理解しやすくするため、「ここで続けられそうか＝定着性」と「ここで伸びていきそうか＝活躍性」の二つに大きく整理します。"
  },
  {
    title: "定着性は、ただ『辞めない』という意味ではない",
    body: "思い通りにならないことや、想像と現実の違いがあったときにも、状況を考え、相談し、自分なりに向き合えるか。自分でその場所を選んだ理由を持っているか、という意味も含みます。"
  },
  {
    title: "活躍性は、今すでに優秀かどうかではない",
    body: "分からないことを学ぶ、失敗したら修正する、周囲と協力する、自分から動く。そうやって入ったあとに成長できそうかを見る考え方です。"
  },
  {
    title: "テンプレートは、少し深掘りされると崩れる",
    body: "ネットやAIで見つけた立派な文章を覚えても、自分の経験や考えとつながっていなければ「なぜ？」「具体的には？」と聞かれた瞬間に答えられなくなります。"
  },
  {
    title: "『なぜ？』『具体的には？』を怖がらない",
    body: "深掘りされるのは、最初の回答が間違っていたからとは限りません。むしろ、あなたについてもっと知りたいから質問されている場合があります。"
  },
  {
    title: "鋭い質問は、あなたを否定するためとは限らない",
    body: "「他でもできますよね？」「本当に進学が必要ですか？」のような質問は、あなたの選択を一度疑ってみて、それでも残る理由や覚悟を確認するために使われます。"
  },
  {
    title: "進路は『何かから逃げた結果』だけにしない",
    body: "不安や迷いがあることは自然です。ただ、「就職が怖いから進学」「進学が大変だから就職」だけで止まらず、それでも自分は何を選び、何をしたいのかまで考えてください。"
  },
  {
    title: "大学合格や内定は、ゴールではない",
    body: "大切なのは、その場所に入ったあとです。そこで何を学ぶのか、どんな力を身につけるのか、どう働くのか。進路先は未来をつくるための場所です。"
  },
  {
    title: "『他でもできる』と言われたときが本番",
    body: "「ものづくりがしたい」「社会に貢献したい」だけなら、似た会社や大学でも言えます。それでもそこを選ぶ理由を、自分の経験や価値観とつなげて考えましょう。"
  },
  {
    title: "弱みや不安を、無理に隠す必要はない",
    body: "大切なのは「弱みがない人」に見せることではありません。自分の課題を理解し、どう向き合っているかを説明できる方が、自分を客観的に見られていることが伝わります。"
  },
  {
    title: "答えを丸暗記するより、自分の『軸』を持つ",
    body: "質問を全部予想することはできません。でも、自分が大切にしていること、経験から学んだこと、これからどうなりたいかが整理されていれば、知らない質問にも自分の言葉で対応できます。"
  },
  {
    title: "面接は、相手との対話である",
    body: "質問を聞き、意図を考え、自分の言葉で返す。分からなければ確認する。面接は一方的な暗唱ではなく、お互いを知るためのコミュニケーションです。"
  }
];

// ===== 02. 面接想定質問データ =====
// category: common / employment / university / training
// reality: 3=本番でそのままあり得る、2=深掘りとしてあり得る、1=訓練価値が高い
const questions = [
  {
    id: 1,
    category: "common",
    question: "なぜ、この会社・学校を志望したのですか？",
    reality: 3,
    retention: "◎",
    growth: "○",
    intent: "単に『魅力を感じた点』を知りたいのではありません。数ある選択肢の中から、なぜここを選んだのか。本人の価値観や経験と、会社・学校との間にどのようなつながりがあるのかを見ています。"
  },
  {
    id: 2,
    category: "common",
    question: "あなたの長所を教えてください。",
    reality: 3,
    retention: "○",
    growth: "◎",
    intent: "長所の名前よりも、その力をどのような場面で発揮してきたのか、そして入社・入学後にどう生かせそうなのかを見ています。"
  },
  {
    id: 3,
    category: "common",
    question: "あなたの短所・苦手なことを教えてください。",
    reality: 3,
    retention: "○",
    growth: "◎",
    intent: "欠点探しだけが目的ではありません。自分自身を客観的に理解できているか。苦手なことに対して、どのように工夫・改善しているかを見ています。"
  },
  {
    id: 4,
    category: "common",
    question: "高校生活で最も力を入れたことは何ですか？",
    reality: 3,
    retention: "○",
    growth: "◎",
    intent: "成果の大きさだけではなく、何を大切にし、どのように考え、どのように行動した人なのか。その経験から何を学び、次の環境でも生かせそうかを見ています。"
  },
  {
    id: 5,
    category: "common",
    question: "失敗した経験について教えてください。",
    reality: 3,
    retention: "○",
    growth: "◎",
    intent: "失敗そのものより、『失敗したあとにどうした人なのか』を見ています。原因を考え、必要な修正を行い、次の行動につなげられるかを確認します。"
  },
  {
    id: 6,
    category: "common",
    question: "周囲の人から、あなたはどんな人だと言われますか？",
    reality: 3,
    retention: "○",
    growth: "◎",
    intent: "自分が思っている自分と、周囲から見た自分との違いを理解しているか。自分を客観視する力があるかを見ています。"
  },
  {
    id: 7,
    category: "common",
    question: "人と意見が合わなかったとき、どうしますか？",
    reality: 2,
    retention: "◎",
    growth: "◎",
    intent: "集団の中で自分の考えを持ちながら、他者とも関係を築けるか。自分を押し通す・すべて相手に合わせる以外の選択肢を持っているかを見ています。"
  },
  {
    id: 8,
    category: "common",
    question: "あなたにとって『成長する』とは、どういうことですか？",
    reality: 1,
    retention: "○",
    growth: "◎",
    intent: "本人がどのような方向へ成長したいと思っているのか。成長を他人からの評価だけで考えていないか。自分なりの判断基準を持っているかを見ます。",
    realityNote: "本番頻出というより、本人の価値観を深く知るための訓練・深掘り向けの質問です。"
  },

  {
    id: 9,
    category: "employment",
    question: "それは、他の会社でもできるのではありませんか？",
    reality: 3,
    retention: "◎",
    growth: "○",
    intent: "志望理由が、どの会社にも当てはまる内容だけになっていないか。それでもこの会社を選ぶ理由が残るかを見ています。",
    realityNote: "志望動機への追撃として、十分に想定しておきたい質問です。"
  },
  {
    id: 10,
    category: "employment",
    question: "希望している仕事に配属されなかった場合、どうしますか？",
    reality: 3,
    retention: "◎",
    growth: "◎",
    intent: "特定の仕事内容だけを見て会社を選んでいないか。希望通りにならなかったときにも、その環境で何ができるかを考えられるかを見ています。"
  },
  {
    id: 11,
    category: "employment",
    question: "仕事をする中で、想像していたことと違うことがあった場合、どうしますか？",
    reality: 2,
    retention: "◎",
    growth: "◎",
    intent: "理想と現実に違いが生まれたとき、すぐに逃げるのか、我慢するだけなのか。それとも状況を確認し、相談し、自分で行動したうえで判断できるのかを見ています。"
  },
  {
    id: 12,
    category: "employment",
    question: "入社後、会社にどのような形で貢献していきたいですか？",
    reality: 3,
    retention: "○",
    growth: "◎",
    intent: "現在できることだけでなく、これからどのように成長し、将来どんな形で会社の力になっていきたいかを見ています。",
    realityNote: "訓練ではさらに『会社があなたを数年間かけて育てるメリットは？』と強く言い換えることもできます。"
  },
  {
    id: 13,
    category: "employment",
    question: "今のあなたを採用するとしたら、会社側は何を不安に感じると思いますか？",
    reality: 1,
    retention: "○",
    growth: "◎",
    intent: "自分自身を採用する側の立場から考えられるか。自分の課題を理解し、それに対してどのような行動を取ろうとしているかを見ています。",
    realityNote: "本番では『短所』『仕事をするうえで不安なこと』などに分けて聞かれる可能性が高い質問です。"
  },
  {
    id: 14,
    category: "employment",
    question: "仕事がなかなかうまくいかないとき、どうしますか？",
    reality: 3,
    retention: "◎",
    growth: "◎",
    intent: "うまくいかない状況でも、自分の仕事を見直し、必要なら周囲へ相談しながら改善できるか。評価や成功だけに頼らず続けられるかを見ています。"
  },
  {
    id: 15,
    category: "employment",
    question: "納得できない指示を受けた場合、どうしますか？",
    reality: 2,
    retention: "◎",
    growth: "◎",
    intent: "組織の中で働くことを理解しながら、自分の考えも持てるか。感情的に反発したり、何も考えず従ったりするのではなく、確認や相談を含めた適切な対応ができるかを見ています。"
  },
  {
    id: 16,
    category: "employment",
    question: "3年後、どんな状態になっていれば『この会社に入ってよかった』と思いますか？",
    reality: 3,
    retention: "◎",
    growth: "◎",
    intent: "本人が会社で働く未来を具体的に想像できているか。何を得たいのか、どんな人になりたいのか、本人の価値観と会社との相性を見ています。"
  },

  {
    id: 17,
    category: "university",
    question: "その学問は、他の大学でも学べますよね。それでも、なぜ本学なのですか？",
    reality: 3,
    retention: "◎",
    growth: "○",
    intent: "大学名を入れ替えても成立する志望理由になっていないか。学びたい内容と、その大学の環境・特色との間に具体的な接点があるかを見ています。"
  },
  {
    id: 18,
    category: "university",
    question: "なぜ、高校卒業後すぐ就職するのではなく、さらに学ぶ必要があるのですか？",
    reality: 3,
    retention: "◎",
    growth: "◎",
    intent: "進学そのものが目的になっていないか。時間や学費を使ってでも学ぶ必要性を、自分自身で理解しているかを見ています。"
  },
  {
    id: 19,
    category: "university",
    question: "入学後、どのようなことに取り組みたいですか？",
    reality: 3,
    retention: "○",
    growth: "◎",
    intent: "大学合格をゴールとして考えていないか。入学後の生活や学びを具体的に想像し、自分から行動する準備ができているかを見ています。"
  },
  {
    id: 20,
    category: "university",
    question: "希望していた研究室・ゼミに入れなかったらどうしますか？",
    reality: 2,
    retention: "◎",
    growth: "◎",
    intent: "特定の教授や研究室だけを理由に大学を選んでいないか。予定通りにならない場合でも、別の可能性を探しながら学び続けられるかを見ています。"
  },
  {
    id: 21,
    category: "university",
    question: "高校までの『勉強』と、大学での『学び』は何が違うと思いますか？",
    reality: 2,
    retention: "○",
    growth: "◎",
    intent: "教えてもらうことを待つだけでなく、自分で問いを持ち、調べ、考える必要があることを理解しているか。大学で学ぶ準備ができているかを見ています。"
  },
  {
    id: 22,
    category: "university",
    question: "今、その分野について『分からないからこそ知りたい』と思っていることはありますか？",
    reality: 2,
    retention: "○",
    growth: "◎",
    intent: "知識量を競わせる質問ではありません。その分野に対して、本当に興味や疑問を持っているか。自分自身の『問い』を持っているかを見ています。"
  },
  {
    id: 23,
    category: "university",
    question: "大学4年間で、どのように成長したいですか？",
    reality: 3,
    retention: "◎",
    growth: "◎",
    intent: "大学を単なる『就職までの4年間』として考えていないか。専門性、研究経験、考える力、人との関係などを通じて、どんな自分になりたいかを見ています。",
    realityNote: "訓練では『卒業時、学位以外に何を持って帰りたいですか？』と問い直すと、より深く考えられます。"
  },
  {
    id: 24,
    category: "university",
    question: "あなたが入学したら、周囲の学生にどんな良い影響を与えられると思いますか？",
    reality: 2,
    retention: "○",
    growth: "◎",
    intent: "教育を一方的に受け取るだけでなく、自分も学びの場をつくる一員になれるか。周囲と関わりながらどんな価値を生み出せそうかを見ています。",
    realityNote: "『大学はあなたに何を与えますか。では、あなたは大学に何を返せますか？』という訓練質問の、本番寄りの言い換えです。"
  },

  {
    id: 25,
    category: "training",
    target: "大学",
    question: "率直に聞きます。進学は、社会に出ることを先延ばしにするための『延命』になっていませんか？",
    reality: 1,
    retention: "◎",
    growth: "◎",
    intent: "就職から逃げるために、とりあえず進学を選んでいないか。進学という手段を使って何をするのか、自分自身で説明できるかを確認します。単に否定できるかではなく、不安や迷いも含めて、それでも進学を選ぶ理由を持っているかを見ます。",
    realityNote: "本番では『なぜ就職ではなく進学なのですか？』『大学で何をしたいですか？』など、より柔らかな複数の質問に分解される可能性が高い内容です。"
  },
  {
    id: 26,
    category: "training",
    target: "大学",
    question: "大学に入ること自体が目的になっていませんか？",
    reality: 1,
    retention: "◎",
    growth: "◎",
    intent: "合格することと、進路を実現することを混同していないか。入学後に何を学び、何を目指すのかまで考えられているかを見ています。",
    realityNote: "本番では『入学後の目標を教えてください』などの形で問われる可能性が高い内容です。"
  },
  {
    id: 27,
    category: "training",
    target: "大学",
    question: "就職する自信がないから、進学を選んだという部分はありませんか？",
    reality: 1,
    retention: "◎",
    growth: "○",
    intent: "進路選択に含まれる本人の不安まで含めて、自分自身を理解できているか。不安があること自体ではなく、不安だけに進路を決めさせていないかを見ています。",
    realityNote: "本番再現ではなく、進路選択の自己理解を深めるための訓練質問です。"
  },
  {
    id: 28,
    category: "training",
    target: "就職",
    question: "この会社に入りたいのではなく、『とにかく内定が欲しい』だけになっていませんか？",
    reality: 1,
    retention: "◎",
    growth: "○",
    intent: "就職することそのものが目的となり、会社選びが後回しになっていないか。仕事内容、働き方、価値観などを比較したうえで、自分自身で選択しているかを見ています。",
    realityNote: "本番では『なぜ当社なのですか？』『第一志望ですか？』などの質問として確かめられる可能性があります。"
  },
  {
    id: 29,
    category: "training",
    target: "就職",
    question: "進学するのが大変だから就職する。そのような選択になっていませんか？",
    reality: 1,
    retention: "◎",
    growth: "○",
    intent: "『進学しないから就職』ではなく、働くという道を自分自身で選んだのか。消去法だけで進路を決めていないかを確認します。",
    realityNote: "本番再現というより、本人の進路選択を点検するための訓練質問です。"
  },
  {
    id: 30,
    category: "training",
    target: "共通",
    question: "もし今日、あなたを不採用・不合格にするとしたら、その理由は何だと思いますか？",
    reality: 1,
    retention: "○",
    growth: "◎",
    intent: "自分を相手側の立場から見ることができるか。現在の自分に足りないものを理解しているか。そして、それを今後どう改善していこうとしているかを見ています。",
    realityNote: "頻出ではありませんが、自己理解と相手視点を同時に確認できる強い訓練質問です。"
  }
];

// ===== 03. DOM取得 =====
const navButtons = [...document.querySelectorAll(".nav-button")];
const views = [...document.querySelectorAll("[data-view-panel]")];
const goButtons = [...document.querySelectorAll("[data-go]")];
const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");
const sidebarScrim = document.getElementById("sidebarScrim");
const topStatus = document.getElementById("topStatus");

const guideList = document.getElementById("guideList");
const questionList = document.getElementById("questionList");
const trainingList = document.getElementById("trainingList");
const categoryFilters = document.getElementById("categoryFilters");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const resetFiltersButton = document.getElementById("resetFiltersButton");

const randomDialog = document.getElementById("randomDialog");
const randomQuestionContent = document.getElementById("randomQuestionContent");
const randomAgainButton = document.getElementById("randomAgainButton");
const randomButtons = [
  document.getElementById("randomTopButton"),
  document.getElementById("randomSideButton"),
  document.getElementById("randomHeroButton")
].filter(Boolean);

let currentCategory = "all";
let currentSearch = "";

// ===== 04. 表示用ヘルパー =====
function categoryLabel(category) {
  const labels = {
    common: "共通",
    employment: "就職",
    university: "大学",
    training: "覚悟"
  };
  return labels[category] ?? category;
}

function realityStars(level) {
  return `${"★".repeat(level)}${"☆".repeat(3 - level)}`;
}

function realityDescription(level) {
  const descriptions = {
    3: "本番でそのまま、またはほぼ同じ形で聞かれても不思議ではない質問",
    2: "回答内容への深掘りとして十分あり得る質問",
    1: "そのままの表現では特殊でも、考えておく価値が高い訓練・深掘り質問"
  };
  return descriptions[level];
}

function createQuestionCard(question) {
  const article = document.createElement("article");
  article.className = `question-card${question.category === "training" ? " training" : ""}`;

  const targetBadge = question.target
    ? `<span class="badge">対象：${question.target}</span>`
    : `<span class="badge">${categoryLabel(question.category)}</span>`;

  const trainingBadge = question.category === "training"
    ? `<span class="badge training-badge">覚悟</span>`
    : "";

  article.innerHTML = `
    <div class="question-main">
      <div class="question-topline">
        <span class="question-number">Q.${String(question.id).padStart(2, "0")}</span>
        ${trainingBadge}
        ${targetBadge}
        <span class="badge reality" title="${realityDescription(question.reality)}">本番可能性 ${realityStars(question.reality)}</span>
      </div>

      <h2 class="question-title">${question.question}</h2>

      <div class="question-meta">
        <span class="relation">定着性：${question.retention}</span>
        <span class="relation growth">活躍性：${question.growth}</span>
      </div>
    </div>

    <button class="intent-toggle" type="button" aria-expanded="false">質問の意図を見る</button>

    <div class="intent-body">
      <h3>この質問から、何を見たいのか</h3>
      <p>${question.intent}</p>
      ${question.realityNote ? `<p class="reality-note"><strong>本番との距離：</strong>${question.realityNote}</p>` : ""}
    </div>
  `;

  const toggle = article.querySelector(".intent-toggle");
  const body = article.querySelector(".intent-body");

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    body.classList.toggle("open", !open);
    toggle.textContent = open ? "質問の意図を見る" : "質問の意図を閉じる";
  });

  return article;
}

// ===== 05. GUIDE描画 =====
function renderGuide() {
  guideList.innerHTML = "";

  guideItems.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "guide-card";
    article.innerHTML = `
      <div class="guide-number">${String(index + 1).padStart(2, "0")}</div>
      <div>
        <h2>${item.title}</h2>
        <p>${item.body}</p>
      </div>
    `;
    guideList.appendChild(article);
  });
}

// ===== 06. 質問集描画 =====
function renderQuestions() {
  const keyword = currentSearch.trim().toLowerCase();

  const filtered = questions.filter((question) => {
    const categoryMatch = currentCategory === "all" || question.category === currentCategory;
    const searchable = `${question.question} ${question.intent} ${question.target ?? ""}`.toLowerCase();
    const searchMatch = !keyword || searchable.includes(keyword);
    return categoryMatch && searchMatch;
  });

  questionList.innerHTML = "";

  if (filtered.length === 0) {
    questionList.innerHTML = `<div class="empty-state">条件に合う質問がありません。検索語や対象を変えてみてください。</div>`;
  } else {
    filtered.forEach((question) => questionList.appendChild(createQuestionCard(question)));
  }

  resultCount.textContent = `${filtered.length}問`;
}

function renderTraining() {
  trainingList.innerHTML = "";
  questions
    .filter((question) => question.category === "training")
    .forEach((question) => trainingList.appendChild(createQuestionCard(question)));
}

// ===== 07. 画面切替 =====
function showView(viewName) {
  views.forEach((view) => {
    view.classList.toggle("active", view.dataset.viewPanel === viewName);
  });

  navButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });

  const statusMap = {
    home: "問いの裏側を読む",
    guide: "面接の考え方 / 15の前提",
    questions: "想定質問集",
    training: "覚悟"
  };

  topStatus.textContent = statusMap[viewName] ?? "面接想定質問集";
  closeSidebar();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

navButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.view));
});

goButtons.forEach((button) => {
  button.addEventListener("click", () => showView(button.dataset.go));
});

// ===== 08. スマートフォン用サイドバー =====
function openSidebar() {
  sidebar.classList.add("open");
  sidebarScrim.classList.add("show");
  menuButton.setAttribute("aria-expanded", "true");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarScrim.classList.remove("show");
  menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  open ? closeSidebar() : openSidebar();
});

sidebarScrim.addEventListener("click", closeSidebar);

// ===== 09. 絞り込み =====
categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  currentCategory = button.dataset.category;
  [...categoryFilters.querySelectorAll(".filter-btn")].forEach((item) => {
    item.classList.toggle("active", item === button);
  });

  renderQuestions();
});

searchInput.addEventListener("input", () => {
  currentSearch = searchInput.value;
  renderQuestions();
});

resetFiltersButton.addEventListener("click", () => {
  currentCategory = "all";
  currentSearch = "";
  searchInput.value = "";

  [...categoryFilters.querySelectorAll(".filter-btn")].forEach((button) => {
    button.classList.toggle("active", button.dataset.category === "all");
  });

  renderQuestions();
});

// ===== 10. ランダム出題 =====
function showRandomQuestion() {
  const source = questions.filter((question) => question.category !== "training");
  const question = source[Math.floor(Math.random() * source.length)];

  randomQuestionContent.innerHTML = `
    <div class="random-content">
      <div class="question-topline">
        <span class="badge">${categoryLabel(question.category)}</span>
        <span class="badge reality">本番可能性 ${realityStars(question.reality)}</span>
      </div>
      <h2>${question.question}</h2>
      <div class="random-hint">
        <strong>すぐに答えを見る前に。</strong><br>
        「なぜ、この質問をされたのか？」を考えてから、自分の言葉で答えてみてください。
      </div>
    </div>
  `;

  if (typeof randomDialog.showModal === "function" && !randomDialog.open) {
    randomDialog.showModal();
  }
}

randomButtons.forEach((button) => button.addEventListener("click", showRandomQuestion));
randomAgainButton.addEventListener("click", showRandomQuestion);

// ===== 11. 初期表示 =====
renderGuide();
renderQuestions();
renderTraining();
