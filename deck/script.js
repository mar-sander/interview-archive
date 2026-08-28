// ===== 00. 入室パスワード認証 =====
const AUTH_KEY = "interview_practice_deck_auth_v1";
const AUTH_HASH = "f85f2abc324a588c3d92f6d750aaae7125aff688497428d2a36b7bba81566294";

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
  if (focus) setTimeout(() => input?.focus(), 30);
}

function hasSavedAuth() {
  try { return localStorage.getItem(AUTH_KEY) === AUTH_HASH; }
  catch (error) { return false; }
}

function saveAuth() {
  try { localStorage.setItem(AUTH_KEY, AUTH_HASH); return true; }
  catch (error) { return false; }
}

function bindAuth() {
  const form = document.getElementById("authForm");
  const input = document.getElementById("authPassword");

  if (hasSavedAuth()) unlockSite();
  else lockSite({ focus: true });

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
      submit.textContent = "DECKを開く";
    }
  });
}

bindAuth();

/* ================================================================
   INTERVIEW PRACTICE DECK Ver.0.2
   REVIEW TALK / Q&A / 就職10枚 / 進学10枚
   ================================================================ */

const cards = [
  // ===== 就職デッキ =====
  {
    id: "E01",
    deck: "employment",
    question: "なぜ、この会社・この職種を志望したのですか？",
    reality: 3,
    retention: "◎",
    growth: "○",
    intent: "志望理由そのものより、『数ある選択肢の中で、なぜここなのか』を見たい質問。会社・職種の特徴と、本人の経験・価値観・将来像が接続しているかを確認する。定着性を見る基本カード。",
    axis: "定着性では、会社・職種を自分で選んだ理由の具体性を見る。活躍性では、その場所で何をしたいか、どの方向へ成長したいかが語れるかを見る。",
    lookFor: [
      "会社名を他社へ入れ替えても成立する内容になっていないか",
      "本人の経験や価値観から志望理由へつながっているか",
      "『入社したい』で止まらず、入社後の行動まで見えているか",
      "企業研究で得た情報を、自分との接点として語れているか"
    ],
    deepDive: [
      "その中でも、特にこの会社でなければならない理由は何ですか？",
      "その職種に興味を持ったきっかけは？",
      "その考えにつながった高校生活の経験はありますか？",
      "入社後、その志望理由をどんな行動で示せそうですか？"
    ],
    good: [
      "企業情報の引用ではなく、自分との接点まで説明できる",
      "過去の経験→会社選択→入社後の未来が一本につながっている",
      "華美な言葉ではなく、本人の普段の言葉で説明している"
    ],
    warning: [
      "理念への共感・社会貢献・ものづくりがしたい、だけで終わる",
      "会社のパンフレットを読み上げているような回答",
      "『有名だから』『安定しているから』だけで会社との相性が見えない"
    ],
    hint: "回答が弱い場合は、『会社の良いところを増やす』より、本人の経験へ戻す。『その会社を知ったとき、自分のどんな経験や考えとつながった？』と問い返すと本人性が出やすい。",
    review: "感想戦では『志望動機は会社を褒める時間ではない』と返す。相手が知りたいのは、会社の魅力を調べた量よりも、なぜ“あなたが”ここを選ぶのか。その接続が見えた部分／見えなかった部分を具体的に伝える。"
  },
  {
    id: "E02",
    deck: "employment",
    question: "会社見学をして、どんなことを感じましたか？",
    reality: 3,
    retention: "◎",
    growth: "○",
    intent: "実際に会社を見たうえで志望しているか、会社への理解が表面的でないかを確認する質問。見学で得た事実と、自分が感じたことを分けて話せるかも見る。",
    axis: "定着性では、現場を見たうえで選択しているかを確認する。活躍性では、観察したことから自分なりに考えを持てるかを見る。",
    lookFor: [
      "『きれいだった』『雰囲気が良かった』だけで終わっていないか",
      "仕事の様子、社員同士の関わり、設備、安全、製品など具体的な観察があるか",
      "見学で感じたことが志望理由にどう影響したか",
      "想像と違った点も含めて現実を見られているか"
    ],
    deepDive: [
      "一番印象に残った場面は？",
      "見学前と見学後で、会社への印象は変わりましたか？",
      "逆に、少し不安に感じたことはありましたか？",
      "その現場で自分が働いている姿を想像できましたか？"
    ],
    good: [
      "具体的な場面を一つ挙げて、自分の考えまで話せる",
      "良い面だけでなく、現実的な特徴も受け止めている",
      "会社見学が志望理由の補強材料になっている"
    ],
    warning: [
      "『皆さん優しそうでした』だけで終了する",
      "見学した事実はあるが何も観察していない",
      "会社見学の感想と志望理由がまったくつながっていない"
    ],
    hint: "『見学して何を感じた？』で止まる生徒には、『目に入ったものを一つだけ選ぶなら？』『そのとき何を思った？』と場面を限定すると話しやすい。",
    review: "感想戦では、見学は“感想文”ではなく企業理解の証拠になると伝える。観察→意味づけ→自分との接点までいくと、志望度の説得力が上がる。"
  },
  {
    id: "E03",
    deck: "employment",
    question: "高校生活で、一番力を入れて取り組んだことは何ですか？",
    reality: 3,
    retention: "○",
    growth: "◎",
    intent: "成果自慢を求める質問ではない。何を選び、どのように取り組み、何を学んだ人なのかを見る。高校生活の実例から、入社後の行動傾向を予測するカード。",
    axis: "活躍性が主。継続・主体性・工夫・協働・改善など、未来の働き方につながる行動特性を見る。定着性は、物事を継続する姿勢から補助的に見る。",
    lookFor: [
      "成果より、行動の具体性があるか",
      "本人が自分で選んだ工夫や判断があるか",
      "経験から得た学びを自分の言葉で言えるか",
      "その学びが仕事へどう接続しそうか"
    ],
    deepDive: [
      "なぜそれに力を入れようと思ったのですか？",
      "途中で一番大変だったことは？",
      "あなた自身が工夫した部分は？",
      "その経験は仕事でどう生きると思いますか？"
    ],
    good: [
      "小さな経験でも本人の考えと行動が具体的",
      "成功だけでなく途中の変化を語れる",
      "経験の意味を現在・未来へつなげられる"
    ],
    warning: [
      "賞や資格名だけで終わる",
      "『頑張りました』の中身が見えない",
      "すべて先生や仲間にやってもらった話になっている"
    ],
    hint: "立派な題材がなくてもよい。『最初はできなかった→自分なりに何かした→少し変わった』があれば十分材料になる。",
    review: "感想戦では、『何をしたか』より『そのとき、あなたはどう考えて動いたか』を面接官は見ていると返す。本人の行動が見えた箇所を具体的に褒めると再現しやすい。"
  },
  {
    id: "E04",
    deck: "employment",
    question: "課題研究では何に取り組み、その中であなた自身は何をしましたか？",
    reality: 3,
    retention: "○",
    growth: "◎",
    intent: "工業高校生にとって、仕事に最も近い実践経験を掘る質問。研究・製作物の説明だけでなく、本人の役割、工夫、判断、失敗、改善までを見たい。",
    axis: "活躍性を強く観測できる。自分で考える力、技術を学ぶ力、試行錯誤、チームでの役割などを具体例から見る。",
    lookFor: [
      "『私たちは作りました』ではなく本人の担当が明確か",
      "技術や方法を選んだ理由を説明できるか",
      "失敗・変更・改善の過程があるか",
      "完成物より、本人の成長や考え方が語れているか"
    ],
    deepDive: [
      "その成果の中で『自分がやった』と言い切れる部分は？",
      "先生や仲間に助けてもらった部分と、自分で決めた部分を分けると？",
      "なぜその方法・技術を選んだのですか？",
      "もう一度やるなら何を改善しますか？"
    ],
    good: [
      "他者の支援を認めつつ自分の役割を説明できる",
      "技術選択に理由がある",
      "失敗を隠さず改善まで語れる"
    ],
    warning: [
      "作品紹介だけで本人が消える",
      "グループ全体の成果を自分の成果のように語る",
      "技術名は言えるが『なぜそれを使ったか』がない"
    ],
    hint: "答えが作品説明に寄りすぎたら、『その中で君は何をした？』『一番頭を使ったところは？』へ戻す。",
    review: "感想戦では、課題研究は作品のプレゼンではなく“あなたの働き方のサンプル”として見られると伝える。本人の判断・行動・修正が見えるほど強い。"
  },
  {
    id: "E05",
    deck: "employment",
    question: "うまくいかなかった経験を一つ教えてください。そのとき、どうしましたか？",
    reality: 3,
    retention: "◎",
    growth: "◎",
    intent: "失敗の有無ではなく、問題が起きた後の行動を見る質問。原因を考える、相談する、修正する、再挑戦するなど、困難への向き合い方を確認する。",
    axis: "定着性では、困難で即座に投げ出さないかを見る。活躍性では、失敗から学んで行動を変えられるかを見る。",
    lookFor: [
      "他責だけで終わらないか",
      "我慢しただけではなく何らかの行動があるか",
      "相談すべき場面で相談できるか",
      "経験後に行動や考えが変わったか"
    ],
    deepDive: [
      "原因は何だったと思いますか？",
      "自分で変えられた部分はどこでしたか？",
      "誰かに相談しましたか？ なぜその人でしたか？",
      "同じことが起きたら次はどうしますか？"
    ],
    good: [
      "自分の責任範囲を冷静に見ている",
      "失敗→分析→行動→変化がある",
      "助けを求めることも選択肢として持っている"
    ],
    warning: [
      "『周りが悪かった』で終了する",
      "ただ耐えただけを美徳として語る",
      "失敗経験が『ありません』で思考停止する"
    ],
    hint: "大失敗でなくてよい。『思い通りにいかなかった』『予定より遅れた』『人との認識がずれた』も十分。大事なのは、その後どう動いたか。",
    review: "感想戦では、企業は“失敗しない人”を探しているのではなく、“失敗したときに壊れず修正できる人”かを見ていると伝える。"
  },
  {
    id: "E06",
    deck: "employment",
    question: "あなたの長所は、仕事でどのように生かせると思いますか？",
    reality: 3,
    retention: "○",
    growth: "◎",
    intent: "長所の名称ではなく、実際の行動として再現できる強みかを見る。自分の特徴を仕事の場面へ翻訳できるかを確認する。",
    axis: "活躍性が主。本人の強みが入社後の行動や貢献につながる可能性を見る。",
    lookFor: [
      "『責任感があります』だけで終わらず事例があるか",
      "仕事の具体的な場面へ接続できているか",
      "長所の扱い方を本人が理解しているか",
      "長所を過剰に盛っていないか"
    ],
    deepDive: [
      "それが表れた高校生活の経験は？",
      "その長所が逆に短所になる場面はありますか？",
      "入社後、どんな場面で役立ちそうですか？",
      "周囲からも同じことを言われますか？"
    ],
    good: [
      "長所→実例→仕事での活用がつながる",
      "自分の強みを絶対視せず扱い方まで理解している",
      "本人の言葉に無理がない"
    ],
    warning: [
      "テンプレ長所を言うだけ",
      "根拠となる経験が出ない",
      "仕事への接続が『頑張ります』だけ"
    ],
    hint: "長所を名詞で考えにくい生徒には、『人より自然にやってしまうこと』『周りから頼まれること』『苦にならず続けられること』から探す。",
    review: "感想戦では、長所は自己評価の宣言ではなく、過去の行動から相手に納得してもらうものだと返す。仕事での使い道まで語れると活躍性が見えやすい。"
  },
  {
    id: "E07",
    deck: "employment",
    question: "周囲と意見が合わなかったとき、あなたはどうしますか？",
    reality: 2,
    retention: "◎",
    growth: "◎",
    intent: "組織で働くための対話力・協働性を見る。自分の考えを持ちながら、相手の意見も聞き、目的に沿って調整できるかを確認する。",
    axis: "定着性では人間関係のズレにどう向き合うか。活躍性では、協働してより良い結果をつくれるかを見る。",
    lookFor: [
      "譲る／押し通すの二択になっていないか",
      "相手の理由を聞く姿勢があるか",
      "『誰が正しいか』より共通目的へ戻れるか",
      "必要なら第三者へ相談する判断があるか"
    ],
    deepDive: [
      "実際に意見が合わなかった経験は？",
      "相手の意見の方が良いと分かったらどうしますか？",
      "どうしても折り合えなかったら？",
      "納得できない指示を受けたらどうしますか？"
    ],
    good: [
      "まず相手の意図を確認しようとする",
      "目的や事実を基準に調整する",
      "自分の意見を持ちながら修正もできる"
    ],
    warning: [
      "全部相手に合わせることを協調性だと思っている",
      "自分が正しい前提で説得だけを考える",
      "人間関係の問題を避けるため黙るだけ"
    ],
    hint: "『仲良くする』より、『目的を共有して話し合う』『相手の理由を聞く』『必要なら相談する』という行動に落とすと答えやすい。",
    review: "感想戦では、協調性は“自分を消す力”ではないと返す。違いが起きたときに対話し、必要なら自分も修正できることが仕事では重要。"
  },
  {
    id: "E08",
    deck: "employment",
    question: "希望していた仕事や配属にならなかった場合、どうしますか？",
    reality: 3,
    retention: "◎",
    growth: "◎",
    intent: "特定の仕事内容だけを見て会社を選んでいないか、予定外の状況でも学びや意味を見つけられるかを見る。ミスマッチ耐性を確認するカード。",
    axis: "定着性が強い。希望と現実のズレにどう向き合うかを見る。活躍性では、与えられた環境から学びを得られるかを見る。",
    lookFor: [
      "『何でもやります』という無思考な迎合になっていないか",
      "まず与えられた役割を理解しようとするか",
      "希望を持ちながら現実にも向き合えるか",
      "相談・努力・キャリア形成という時間軸を持てるか"
    ],
    deepDive: [
      "それでもこの会社を選ぶ理由は残りますか？",
      "希望と違う仕事から何を学べると思いますか？",
      "どのくらい続けてから判断しますか？",
      "それでも希望が変わらなかったら、どう動きますか？"
    ],
    good: [
      "希望を持ちつつ、まず役割に向き合う姿勢がある",
      "状況確認→学ぶ→相談→判断というプロセスを持つ",
      "会社全体を志望している理由がある"
    ],
    warning: [
      "『絶対辞めません』だけで現実感がない",
      "希望配属でなければすぐ辞める前提",
      "何でも従うことだけを正解だと思っている"
    ],
    hint: "答えは『辞めない宣言』ではない。まず何が違うのかを確認し、その仕事でできることを考え、必要なら相談する、という現実的なプロセスを持てると強い。",
    review: "感想戦では、定着性は我慢大会ではないと返す。予定外が起きたとき、即断せず状況を理解し、自分ができる行動を取れるかが見られている。"
  },
  {
    id: "E09",
    deck: "employment",
    question: "3年後、どんな社員になっていたいですか？",
    reality: 3,
    retention: "◎",
    growth: "◎",
    intent: "入社後の未来を具体的に想像できているかを見る。会社を“入る場所”ではなく“成長する場所”として捉えているかを確認する。",
    axis: "定着性では、その会社で時間を重ねる未来が描けるか。活躍性では、どの方向へ成長し、何を担いたいかを見る。",
    lookFor: [
      "役職名や資格名だけでなく、できるようになりたいことがあるか",
      "会社での仕事と本人の成長方向がつながっているか",
      "周囲への貢献や役割まで想像できるか",
      "現実的な時間軸になっているか"
    ],
    deepDive: [
      "そのために入社1年目は何を身につけたいですか？",
      "周囲からどんな社員だと思われたいですか？",
      "その姿に近づくため、今からできることは？",
      "3年後に『入ってよかった』と思うのはどんな状態？"
    ],
    good: [
      "具体的な技能・役割・姿勢がある",
      "自分の成長だけでなく周囲や会社への価値も見える",
      "今→1年目→3年後の連続性がある"
    ],
    warning: [
      "『立派な社会人』など抽象語だけ",
      "給与や肩書きだけで未来を語る",
      "入社後の学びについて何も考えていない"
    ],
    hint: "『何になりたい？』で固まる場合は、『何ができるようになっていたい？』『誰から何を任されていたい？』と役割・技能に落とす。",
    review: "感想戦では、未来像は当てる予言ではなく“今どの方向へ進もうとしているか”を示すものだと返す。具体性があるほど投資後の成長を想像してもらいやすい。"
  },
  {
    id: "E10",
    deck: "employment",
    question: "率直に聞きます。それなら他の会社でもできるのではありませんか？ それでも当社なのはなぜですか？",
    reality: 2,
    retention: "◎",
    growth: "○",
    intent: "志望動機のテンプレートを一枚剥がす覚悟確認カード。『社会貢献』『ものづくり』『人の役に立つ』など他社でも成立する理由の先に、その会社を選ぶ本人固有の理由が残るかを見る。",
    axis: "定着性を強く見る。この会社との接点が弱ければ、入社後のミスマッチや離職の懸念につながる。活躍性は、会社で何を実現したいかから補助的に見る。",
    lookFor: [
      "反射的に否定せず、比較して考えられるか",
      "会社固有の特徴と本人の価値観が接続しているか",
      "『第一志望だから』以外の理由があるか",
      "これまでの回答と一貫しているか"
    ],
    deepDive: [
      "同業他社との違いを一つ挙げるなら？",
      "その違いが、あなたにとってなぜ重要なのですか？",
      "希望職種に就けなくても、その理由は残りますか？",
      "会社の弱点も含めて、それでも選びますか？"
    ],
    good: [
      "他社にも魅力があることを認めたうえで、自分の選択理由を語れる",
      "企業研究ではなく本人の判断軸が出る",
      "それまでの回答を材料に即興で組み直せる"
    ],
    warning: [
      "『御社が一番だからです』と感情だけで押す",
      "企業HPの情報を追加して逃げる",
      "他社を下げることで志望先を上げる"
    ],
    hint: "この質問への正解は『他社では絶対できない』と言い切ることではない。似た選択肢がある中で、自分は何を基準にここを選んだのかを説明できればよい。",
    review: "感想戦では、この質問は“志望度を疑っていじめる”ためではなく、選択の軸を確認する質問だと説明する。ここで自分の経験と会社の特徴を結び直せれば、志望動機は一段強くなる。"
  },

  // ===== 進学デッキ =====
  {
    id: "U01",
    deck: "university",
    question: "なぜ、この大学・この学部学科を志望したのですか？",
    reality: 3,
    retention: "◎",
    growth: "○",
    intent: "大学・学部学科を選んだ理由が、本人の興味・経験・将来像とつながっているかを見る基本カード。学校案内の魅力紹介ではなく、本人と大学の適合性を確認する。",
    axis: "定着性では、学びたい内容と大学環境のミスマッチが少ないかを見る。活躍性では、入学後にどう学ぶかの方向性を見る。",
    lookFor: [
      "大学名を入れ替えても成立しない内容になっているか",
      "学部学科で何を学ぶか理解しているか",
      "高校までの経験と志望がつながっているか",
      "大学の特色を“自分に必要な環境”として説明できるか"
    ],
    deepDive: [
      "その学問なら他大学でも学べますよね？",
      "本学のどの授業・研究・環境に魅力を感じましたか？",
      "その特徴があなたに必要なのはなぜ？",
      "大学名ではなく学びの内容だけで説明すると？"
    ],
    good: [
      "自分の問い・経験→学部学科→大学の環境がつながる",
      "具体的な学びの内容を理解している",
      "大学を“目的”ではなく学ぶための“場所”として語る"
    ],
    warning: [
      "偏差値・知名度・就職率だけで終わる",
      "オープンキャンパスの雰囲気だけが志望理由",
      "大学案内の文章をそのまま言う"
    ],
    hint: "『大学の魅力』を増やすより、『自分が何を学びたい→そのために何が必要→それがこの大学にある』という順で考えると整理しやすい。",
    review: "感想戦では、志望理由は大学を褒める文章ではなく『自分の目的に、この環境がなぜ必要か』を説明するものだと返す。"
  },
  {
    id: "U02",
    deck: "university",
    question: "その分野に興味を持ったきっかけは何ですか？",
    reality: 3,
    retention: "◎",
    growth: "○",
    intent: "学問への興味が後付けの志望理由ではなく、本人の経験や問題意識から生まれているかを見る。学び続ける動機の根を確認するカード。",
    axis: "定着性では、学問そのものへの関心の持続可能性を見る。活躍性では、興味を行動や学びへ発展させているかを見る。",
    lookFor: [
      "きっかけが具体的な経験・疑問・制作などに結びついているか",
      "興味を持った後、自分で調べたり試したりしたか",
      "現在の志望へどう発展したか",
      "『なんとなく好き』から一段深い理由があるか"
    ],
    deepDive: [
      "そのとき何が一番気になったのですか？",
      "興味を持ってから、自分で何か調べましたか？",
      "高校の授業や課題研究とつながっていますか？",
      "今は当時と興味の方向が変わりましたか？"
    ],
    good: [
      "小さな原体験でも本人の感情や疑問が具体的",
      "興味→行動→現在の志望へ発展している",
      "本人の言葉で学問の面白さを話せる"
    ],
    warning: [
      "『昔から好きでした』だけで具体性がない",
      "先生や親に勧められたことしか理由がない",
      "興味を持った後に何も行動していない"
    ],
    hint: "大げさな原体験は不要。授業、実習、ゲーム、身近な不便、ニュース、制作など『なぜか気になった瞬間』を掘ると本人らしい材料が出やすい。",
    review: "感想戦では、原点はドラマチックである必要はないと伝える。本人が本当に気になった出来事から現在までの流れが見えることの方が重要。"
  },
  {
    id: "U03",
    deck: "university",
    question: "高校卒業後すぐ就職するのではなく、大学でさらに学ぶ必要があるのはなぜですか？",
    reality: 3,
    retention: "◎",
    growth: "◎",
    intent: "大学進学を“当たり前の次の段階”として選んでいないかを見る。4年間という時間と費用を使って学ぶ必要性を、本人自身が理解しているかを確認する。",
    axis: "定着性では進学選択への納得度を見る。活躍性では、大学で何を獲得し、その後どう使うかを見る。",
    lookFor: [
      "大学でなければ得にくい学び・経験が説明できるか",
      "就職・専門学校など他の選択肢も考えた形跡があるか",
      "大学進学と将来像がつながっているか",
      "『大卒資格が欲しい』だけで止まっていないか"
    ],
    deepDive: [
      "4年間と学費を使う価値はどこにありますか？",
      "大学でなければ得られないものは？",
      "高校で既に専門を学んでいますよね。それでも大学へ行く理由は？",
      "もし大学へ進学しなくても、その目標へ近づけますか？"
    ],
    good: [
      "他の進路を否定せず、自分に大学が必要な理由を語る",
      "学びたい内容と将来の使い道が具体的",
      "資格取得だけでなく学び方・研究経験・専門性まで見ている"
    ],
    warning: [
      "『まだ働きたくないから』だけ",
      "周囲が進学するから",
      "大学に行けば将来が何とかなるという期待だけ"
    ],
    hint: "『大学へ行く理由』ではなく、『大学で何を得る必要があるか』へ問いを変えると考えやすい。必要な知識・研究経験・環境・人とのつながりなどを具体化する。",
    review: "感想戦では、大学は高校卒業後の待機場所ではないと返す。進学理由は“大学に入りたい”ではなく“大学でこれを得る必要がある”まで言えると強い。"
  },
  {
    id: "U04",
    deck: "university",
    question: "入学後、具体的に何を学び、何に取り組みたいですか？",
    reality: 3,
    retention: "◎",
    growth: "◎",
    intent: "合格をゴールとしていないかを見る質問。入学後の授業・研究・活動を具体的に想像し、自分から学びに行く準備があるかを確認する。",
    axis: "定着性では大学との学びの適合性を見る。活躍性では主体的に学ぶ姿勢と将来への接続を見る。",
    lookFor: [
      "学部学科のカリキュラムをある程度理解しているか",
      "授業を受けるだけでなく自分から取り組む内容があるか",
      "高校までの経験を次の学びへ発展させているか",
      "将来像との接続があるか"
    ],
    deepDive: [
      "入学した翌日から始められることは？",
      "特に学びたい授業・分野は？",
      "授業外でやってみたいことは？",
      "4年間の中でどのように深めたいですか？"
    ],
    good: [
      "具体的な学問分野・行動がある",
      "受け身ではなく自分から学ぶ姿が見える",
      "入学後の行動と卒業後の未来がつながる"
    ],
    warning: [
      "『勉強を頑張ります』だけ",
      "大学の施設・イベントの話しかない",
      "合格後のことをほとんど考えていない"
    ],
    hint: "『何を学ぶ？』で広すぎる場合は、『1年目に身につけたいこと』『研究室に入るまでに知りたいこと』『授業外で試したいこと』へ分解する。",
    review: "感想戦では、大学側は“入れてほしい人”だけでなく“入った後に動く人”を見ていると返す。入学後の具体的な行動が未来の可能性になる。"
  },
  {
    id: "U05",
    deck: "university",
    question: "課題研究では何に取り組み、その中であなた自身は何を考え、何をしましたか？",
    reality: 3,
    retention: "○",
    growth: "◎",
    intent: "高校での実践的な学びから、大学で研究・制作・探究を続けられる人かを見る。成果物より、問い・判断・試行錯誤・本人の役割を観察する。",
    axis: "活躍性が主。大学の主体的な学びに近い行動を既に経験しているかを見る。",
    lookFor: [
      "テーマの目的を自分で理解しているか",
      "本人が考えて決めた部分があるか",
      "うまくいかなかったことから修正したか",
      "研究をやって新しい問いが生まれたか"
    ],
    deepDive: [
      "なぜそのテーマを選んだのですか？",
      "自分が一番考えた部分は？",
      "成果を成功と判断した根拠は？",
      "まだ解決できていない課題はありますか？"
    ],
    good: [
      "研究の目的・方法・自分の役割を区別して話せる",
      "結果より過程の思考を説明できる",
      "研究から次の疑問や学びたいことへつながる"
    ],
    warning: [
      "作品紹介で終了する",
      "先生に言われた通り進めただけ",
      "グループ成果の中で本人の役割が見えない"
    ],
    hint: "大学側に伝えたいのは完成度だけではない。『何を疑問に思った→どう試した→何が分かった／分からなかった』を話せると研究する人として見えやすい。",
    review: "感想戦では、課題研究は大学の学びへの橋になると伝える。作品の価値より、本人が問いを持ち、試し、修正した痕跡が重要。"
  },
  {
    id: "U06",
    deck: "university",
    question: "その分野について、今『分からないからこそ知りたい』と思っていることはありますか？",
    reality: 2,
    retention: "○",
    growth: "◎",
    intent: "知識量ではなく『問いを持っているか』を見る。大学で伸びる人は、知らないことを恥じるのではなく、分からないことを学びの入口にできるかを確認する。",
    axis: "活躍性が強い。自分で問いを立て、調べ、深めていける可能性を見る。",
    lookFor: [
      "本人なりの疑問があるか",
      "なぜそれを知りたいのか説明できるか",
      "高校までの経験と問いがつながっているか",
      "正解を知っているふりをしないか"
    ],
    deepDive: [
      "なぜそれが気になっているのですか？",
      "今まで自分で調べたことは？",
      "大学ではどのように確かめたいですか？",
      "その問いが解けたら、次に何を知りたくなりそう？"
    ],
    good: [
      "素朴でも本人の疑問が具体的",
      "『分からない』を認めて学びへ変えられる",
      "問いから行動へつなげようとしている"
    ],
    warning: [
      "知っている知識を披露するだけ",
      "『特にありません』で関心の広がりがない",
      "難しい専門用語を並べて本人も理解していない"
    ],
    hint: "立派な研究テーマでなくてよい。『なぜこうなる？』『もっと便利にできない？』『この方法と別の方法で何が違う？』のような小さな疑問から探す。",
    review: "感想戦では、大学は“知っている人”になるだけでなく“問い続ける人”になる場所だと返す。分からないことを持っているのは弱点ではなく、学びの入口。"
  },
  {
    id: "U07",
    deck: "university",
    question: "大学で勉強についていけない科目が出てきたら、どうしますか？",
    reality: 3,
    retention: "◎",
    growth: "◎",
    intent: "大学で必ず起こり得る困難に対して、具体的な対処手段を持てるかを見る。『頑張ります』ではなく、学び直し・質問・相談・時間管理など行動レベルを確認する。",
    axis: "定着性では学業上のつまずきで離脱しないか。活躍性では、自分で学び方を修正できるかを見る。",
    lookFor: [
      "具体的な行動が複数あるか",
      "早めに相談・質問できるか",
      "自分の理解不足を分析できるか",
      "一人で抱え込むことを美徳にしていないか"
    ],
    deepDive: [
      "まず最初に何をしますか？",
      "それでも理解できなかったら？",
      "高校で似た経験はありますか？",
      "周囲へ助けを求めることに抵抗はありますか？"
    ],
    good: [
      "復習・質問・友人・教員・学習支援など手段を使い分ける",
      "早い段階で問題を認識する",
      "自分の学び方そのものを見直せる"
    ],
    warning: [
      "『気合で頑張る』だけ",
      "分からなくても誰にも聞かない",
      "科目が合わなければすぐ諦める"
    ],
    hint: "『頑張る』を禁止して、具体的な行動を3つ挙げてもらうとよい。誰に聞く、何を調べる、時間をどう使う、まで落とす。",
    review: "感想戦では、大学は“分からないことが出ない人”が勝つ場所ではなく、分からなくなったときに学び方を変えられる人が伸びると返す。"
  },
  {
    id: "U08",
    deck: "university",
    question: "希望していた研究室やゼミに入れなかったら、どうしますか？",
    reality: 2,
    retention: "◎",
    growth: "◎",
    intent: "特定の教授・研究室だけを大学志望の唯一の柱にしていないかを見る。予定通りにならなくても、学問への関心を別ルートで継続できるかを確認する。",
    axis: "定着性では計画変更への適応を見る。活躍性では、目的と手段を分けて別の学び方を探せるかを見る。",
    lookFor: [
      "研究室は手段であり、学びたい本質を理解しているか",
      "代替となる研究・授業・自主活動を考えられるか",
      "失望を否定せず、それでも次の行動へ移れるか",
      "大学そのものを選ぶ理由が研究室一つに依存していないか"
    ],
    deepDive: [
      "その研究室で何をしたかったのですか？",
      "その目的は別の方法でも追えますか？",
      "それでも本学を選ぶ理由は残りますか？",
      "どんな別ルートを考えますか？"
    ],
    good: [
      "残念さを認めつつ代替案を考える",
      "教授名ではなく学びたいテーマの本質を語れる",
      "状況に応じてルートを修正できる"
    ],
    warning: [
      "その研究室に入れなければ大学へ行く意味がない",
      "『絶対入れると思います』と前提を疑わない",
      "代替の学び方が何もない"
    ],
    hint: "『研究室に入りたい理由』を分解し、そこで得たい知識・経験・テーマを明確にする。その本質が分かれば、別ルートも考えやすい。",
    review: "感想戦では、目標と手段を分けて考える練習だと説明する。計画が崩れたときにも目的へ向けて別の手段を探せることは、大学での活躍性そのもの。"
  },
  {
    id: "U09",
    deck: "university",
    question: "大学卒業時、学位以外に何を得ていたいですか？",
    reality: 2,
    retention: "◎",
    growth: "◎",
    intent: "大学を単なる大卒資格取得の場所として見ていないかを確認する。専門性、研究経験、考える力、人との関係、挑戦など、4年間をどう使いたいかを見る。",
    axis: "定着性では4年間を過ごす意味への納得を見る。活躍性では、どんな成長を目指しているかを見る。",
    lookFor: [
      "資格・就職以外の学びの価値を考えているか",
      "専門性だけでなく考え方や行動の成長も見えているか",
      "本人の価値観が出るか",
      "卒業後にどう使うかまでつながるか"
    ],
    deepDive: [
      "それを得るために、大学で何をしますか？",
      "高校卒業時の自分と何が変わっていたい？",
      "周囲へどんな影響を与えられる人になりたい？",
      "それが得られたとどう判断しますか？"
    ],
    good: [
      "自分なりの大学4年間の意味を持っている",
      "得たいものと行動がつながる",
      "卒業後の生き方へ接続している"
    ],
    warning: [
      "『大卒資格』だけ",
      "大学生活を受け身のサービスとして考える",
      "何を得たいかと将来がまったくつながらない"
    ],
    hint: "『知識』『技能』『経験』『人との関わり』『考え方』の5方向から一つずつ考えてみると、本人が本当に欲しいものが見つかりやすい。",
    review: "感想戦では、大学は4年間を消費する場所ではなく、自分をどう変えるかに使う場所だと返す。学位以外の目標があると入学後の行動にも芯ができる。"
  },
  {
    id: "U10",
    deck: "university",
    question: "率直に聞きます。あなたにとって大学進学は、社会に出ることを先延ばしにするための『延命』になっていませんか？",
    reality: 1,
    retention: "◎",
    growth: "◎",
    intent: "進学への覚悟確認カード。就職への不安があること自体を責めるのではなく、不安だけに進路を決めさせていないかを見る。大学という手段を使って何をするのか、本人が説明できるかを確認する。",
    axis: "定着性では進学選択への納得度とミスマッチの少なさを見る。活躍性では、4年間を使って何を学び、どう成長するかを見る。",
    lookFor: [
      "反射的に『違います』と言うだけで終わらないか",
      "自分の不安や弱い動機も認められるか",
      "それでも大学を選ぶ積極的な理由があるか",
      "これまでの志望理由・入学後の話と一貫しているか"
    ],
    deepDive: [
      "もし就職への不安がなくても、大学へ行きますか？",
      "4年間という時間を使って何を得ますか？",
      "大学に入れた瞬間、進路目標は達成ですか？",
      "大学へ行かなかった場合でも、目標へ近づく方法はありますか？"
    ],
    good: [
      "『不安もあります』と認めたうえで、それとは別の進学理由を語る",
      "進学のメリットだけでなくコストも理解して選んでいる",
      "これまでの回答を使って、自分の選択を再説明できる"
    ],
    warning: [
      "『大学に行けば何とかなる』",
      "社会に出たくないことが主目的",
      "周囲や親の期待だけで進路を決めている"
    ],
    hint: "この問いへの答えは、就職への不安を否定することではない。『不安はある。でも、それとは別に大学で○○を学ぶ必要があり、自分はそのために進学を選んだ』というように、弱い動機と積極的な理由を分けて考える。",
    review: "感想戦では、この質問は進学を否定するためではなく『その進路は、自分で選んだ結果になっているか』を点検する問いだと説明する。ここで迷ったなら、それ自体が本番前に見つかってよかった問い。"
  }
];


// ===== 生徒からのQ&A =====
// この配列へ実際の感想戦で出た質問を追加して、デッキを育てていく。
// category: core / honesty / words / deep / answer
const qaItems = [
  {
    id: "QA01",
    category: "core",
    question: "本当に、面接の全部の質問で「定着性」と「活躍性」を見ているんですか？",
    answer: [
      "実際の採用や入試には、志望度、適性、基礎学力、専門性、人物面、コミュニケーションなど、もっと細かな評価項目があります。",
      "私はそれらを高校生が理解しやすいように、大きく<strong>「ここで続けていけそうか＝定着性」</strong>と<strong>「ここで伸びていきそうか＝活躍性」</strong>の二つに整理して考えています。",
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
      "違います。私が言う「素直」は、従順であることではありません。",
      "分からないなら分からないと認める。失敗したなら失敗を認める。助けてもらったなら助けてもらったと認める。そのうえで、<strong>自分はどう考え、これからどうしようとしているのか</strong>を話すことです。",
      "自分にも相手にも嘘をつかず、現状を受け止める。私はそれを<strong>誠実さとしての素直さ</strong>だと考えています。"
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
      "ただし、「分かりません」で会話を終わらせる必要はありません。たとえば<strong>「今の時点では十分に理解できていません。入学までに調べたいです」</strong>、<strong>「少し考える時間をいただいてもよろしいですか」</strong>のように、その後の姿勢まで示せます。",
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
      "私は、熱意は<strong>「その進路について、自分で考えてきた痕跡」</strong>にも表れると思っています。"
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
      "この質問は、あなたを落とすためというより、選択理由がどこまで本人の中で煮込まれているかを見る問いとして使えます。"
    ]
  },
  {
    id: "QA17",
    category: "deep",
    question: "今日たくさん深掘りされたんですけど、最初の回答が悪かったってことですか？",
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
      "模擬面接で詰まることは失敗ではありません。本番前に、まだ煮込みが足りない場所を発見できたということです。"
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
      "私が答えそのものを渡さないのは、<strong>その質問に対する文章を覚えてほしいのではなく、なぜ聞かれたかを考えて、自分の経験から答えを作れるようになってほしい</strong>からです。",
      "質問の意図を考える。使える自分の経験を探す。自分が本当に伝えたいことを決める。そこから言葉にする。その過程で作った答えが、あなたの答えになります。"
    ]
  }
];

function qaCategoryLabel(category) {
  const labels = {
    core: "定着性・活躍性",
    honesty: "素直さ",
    words: "自分の言葉・熱意",
    deep: "深掘り",
    answer: "正解・模範回答"
  };
  return labels[category] || category;
}

function renderQaItem(item) {
  return `
    <article class="qa-card" data-qa-id="${item.id}" data-qa-category="${item.category}">
      <details>
        <summary>
          <span class="qa-number">${item.id}</span>
          <span class="qa-question">${item.question}</span>
          <span class="badge qa-badge">${qaCategoryLabel(item.category)}</span>
        </summary>
        <div class="qa-answer">
          <span class="review-label">ANSWER / TALK SUPPORT</span>
          ${item.answer.map((paragraph) => `<p>${paragraph}</p>`).join("")}
        </div>
      </details>
    </article>
  `;
}

let activeQaCategory = "all";

function applyQaFilters() {
  const input = document.getElementById("qaSearchInput");
  const query = (input?.value || "").trim().toLowerCase();

  const filtered = qaItems.filter((item) => {
    const categoryMatch = activeQaCategory === "all" || item.category === activeQaCategory;
    const haystack = [
      item.question,
      qaCategoryLabel(item.category),
      ...item.answer.map((p) => p.replace(/<[^>]+>/g, ""))
    ].join(" ").toLowerCase();
    return categoryMatch && (!query || haystack.includes(query));
  });

  const list = document.getElementById("qaList");
  if (list) {
    list.innerHTML = filtered.length
      ? filtered.map(renderQaItem).join("")
      : `<div class="qa-empty">該当するQ&amp;Aはありません。</div>`;
  }

  const count = document.getElementById("qaResultCount");
  if (count) count.textContent = `${filtered.length}件`;
}

function renderQAs() {
  applyQaFilters();
}

function bindQaControls() {
  document.querySelectorAll("[data-qa-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      activeQaCategory = button.dataset.qaFilter;
      document.querySelectorAll("[data-qa-filter]").forEach((target) => {
        target.classList.toggle("active", target === button);
      });
      applyQaFilters();
    });
  });

  document.getElementById("qaSearchInput")?.addEventListener("input", applyQaFilters);

  document.getElementById("qaResetButton")?.addEventListener("click", () => {
    activeQaCategory = "all";
    const input = document.getElementById("qaSearchInput");
    if (input) input.value = "";
    document.querySelectorAll("[data-qa-filter]").forEach((button) => {
      button.classList.toggle("active", button.dataset.qaCategory === "all");
    });
    applyQaFilters();
  });
}


function stars(value) {
  return "★".repeat(value) + "☆".repeat(3 - value);
}

function deckLabel(deck) {
  return deck === "employment" ? "就職" : "進学";
}

function listHtml(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function renderCard(card) {
  return `
    <article class="deck-card" data-card-id="${card.id}">
      <div class="card-main">
        <div class="card-topline">
          <span class="card-number">${card.id}</span>
          <span class="badge">${deckLabel(card.deck)}</span>
          <span class="badge reality">本番可能性 ${stars(card.reality)}</span>
        </div>
        <h2 class="card-question">${card.question}</h2>
        <div class="card-axis">
          <span class="axis-chip">定着性：${card.retention}</span>
          <span class="axis-chip">活躍性：${card.growth}</span>
        </div>
      </div>

      <button class="review-toggle" type="button" aria-expanded="false">レビュー情報を開く</button>

      <div class="review-body">
        <div class="review-grid">
          <section class="review-section full">
            <span class="review-label">INTENT</span>
            <h3>質問の本質</h3>
            <p>${card.intent}</p>
          </section>

          <section class="review-section">
            <span class="review-label">AXIS</span>
            <h3>定着性・活躍性との関連</h3>
            <p>${card.axis}</p>
          </section>

          <section class="review-section">
            <span class="review-label">LOOK FOR</span>
            <h3>回答から観察したいもの</h3>
            ${listHtml(card.lookFor)}
          </section>

          <section class="review-section full">
            <span class="review-label">DEEP DIVE</span>
            <h3>追撃カード</h3>
            ${listHtml(card.deepDive)}
          </section>

          <section class="review-section good">
            <span class="review-label">GOOD SIGN</span>
            <h3>良い兆候</h3>
            ${listHtml(card.good)}
          </section>

          <section class="review-section warning">
            <span class="review-label">WARNING</span>
            <h3>気になる兆候</h3>
            ${listHtml(card.warning)}
          </section>

          <section class="review-section hint full">
            <span class="review-label">HINT</span>
            <h3>生徒の回答を引き出すヒント</h3>
            <p>${card.hint}</p>
          </section>

          <section class="review-section review full">
            <span class="review-label">REVIEW</span>
            <h3>感想戦で返したいこと</h3>
            <p>${card.review}</p>
          </section>
        </div>
      </div>
    </article>
  `;
}

function renderDecks() {
  const employment = cards.filter((card) => card.deck === "employment");
  const university = cards.filter((card) => card.deck === "university");
  document.getElementById("employmentDeck").innerHTML = employment.map(renderCard).join("");
  document.getElementById("universityDeck").innerHTML = university.map(renderCard).join("");
  bindReviewToggles();
}

function bindReviewToggles() {
  document.querySelectorAll(".review-toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const body = button.nextElementSibling;
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      body?.classList.toggle("open", !isOpen);
      button.textContent = isOpen ? "レビュー情報を開く" : "レビュー情報を閉じる";
    });
  });
}

function setSidebarOpen(open) {
  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("sidebarScrim");
  const menu = document.getElementById("menuButton");
  sidebar?.classList.toggle("open", open);
  scrim?.classList.toggle("show", open);
  menu?.setAttribute("aria-expanded", String(open));
}

function showView(name) {
  document.querySelectorAll("[data-view-panel]").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.viewPanel === name);
  });
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === name);
  });

  const status = document.getElementById("topStatus");
  if (status) {
    status.textContent = name === "employment" ? "EMPLOYMENT / 10 CARDS"
      : name === "university" ? "UNIVERSITY / 10 CARDS"
      : name === "review" ? "REVIEW TALK / AFTER INTERVIEW"
      : name === "qa" ? "QUESTIONS FROM STUDENTS"
      : "PRIVATE OPERATOR TOOL";
  }

  setSidebarOpen(false);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bindNavigation() {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });
  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.go));
  });

  const menu = document.getElementById("menuButton");
  menu?.addEventListener("click", () => {
    setSidebarOpen(!document.getElementById("sidebar")?.classList.contains("open"));
  });
  document.getElementById("sidebarScrim")?.addEventListener("click", () => setSidebarOpen(false));
}

function currentDeckCards() {
  if (document.getElementById("view-employment")?.classList.contains("active")) {
    return cards.filter((card) => card.deck === "employment");
  }
  if (document.getElementById("view-university")?.classList.contains("active")) {
    return cards.filter((card) => card.deck === "university");
  }
  return cards;
}

function randomCard() {
  const pool = currentDeckCards();
  return pool[Math.floor(Math.random() * pool.length)];
}

function showRandomCard() {
  const card = randomCard();
  const content = document.getElementById("randomCardContent");
  content.innerHTML = `
    <div class="random-content">
      <div class="random-meta">
        <span class="badge">${card.id}</span>
        <span class="badge">${deckLabel(card.deck)}</span>
        <span class="badge reality">本番可能性 ${stars(card.reality)}</span>
      </div>
      <h2 class="random-question" id="randomDialogTitle">${card.question}</h2>
      <p class="random-hint">まず質問だけを投げる。回答を聞いてから、必要なら元カードのレビュー情報を開く。</p>
    </div>
  `;
  document.getElementById("randomDialog")?.showModal();
}

function bindRandom() {
  ["randomTopButton", "randomSideButton", "randomHeroButton", "randomAgainButton"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", showRandomCard);
  });
}

renderDecks();
renderQAs();
bindNavigation();
bindQaControls();
bindRandom();
