/* ================================================================
   INTERVIEW QUESTION ARCHIVE / LAST CHECK
   面接直前に「新しいことを覚える」のではなく、基本へ戻るためのページ。
   ================================================================ */

(() => {
  let isInstalled = false;
  let isInitialized = false;

  function installStylesheet() {
    if (document.querySelector('link[href="last-check.css"]')) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "last-check.css";
    document.head.appendChild(link);
  }

  function installNavigation() {
    const mainNav = document.querySelector('.sidebar .nav[aria-label="メインナビゲーション"]');
    const qaButton = mainNav?.querySelector('[data-view="qa"]');

    if (qaButton && !mainNav.querySelector('[data-view="lastcheck"]')) {
      qaButton.insertAdjacentHTML("afterend", `
        <button class="nav-button" type="button" data-view="lastcheck">
          <span class="nav-num">05</span><span>面接直前チェック</span>
        </button>
      `);
    }

    document.querySelectorAll(".article-nav .nav-num").forEach((number, index) => {
      number.textContent = String(index + 6).padStart(2, "0");
    });
  }

  function installHeroEntry() {
    const heroActions = document.querySelector(".hero-actions");
    const questionsButton = heroActions?.querySelector('[data-go="questions"]');

    if (heroActions && questionsButton && !heroActions.querySelector('[data-go="lastcheck"]')) {
      questionsButton.insertAdjacentHTML(
        "afterend",
        '<button class="btn last-check-entry" type="button" data-go="lastcheck">面接直前チェック</button>'
      );
    }
  }

  function installView() {
    if (document.getElementById("view-lastcheck")) return;

    const qaView = document.getElementById("view-qa");
    const trainingView = document.getElementById("view-training");
    const insertAfter = qaView || trainingView;
    if (!insertAfter) return;

    insertAfter.insertAdjacentHTML("afterend", `
      <!-- 面接直前チェック -->
      <section class="view last-check-view" id="view-lastcheck" data-view-panel="lastcheck">
        <header class="page-header last-check-header">
          <div class="eyebrow">LAST CHECK / BEFORE INTERVIEW</div>
          <h1>面接直前 最終チェック</h1>
          <p class="last-check-subtitle">新しいことを覚えるページじゃない。<br>いつもの自分を取り戻すためのページです。</p>
        </header>

        <section class="last-check-intro" aria-labelledby="lastCheckIntroTitle">
          <h2 id="lastCheckIntroTitle" class="sr-only">このページの使い方</h2>
          <p>面接の直前に、新しいテクニックを詰め込む必要はありません。</p>
          <p>ここまで準備してきたなら、最後にやることは、<strong>大事なことを思い出すだけ。</strong></p>
          <p class="last-check-rhythm">緊張してもいい。<br>少し言葉に詰まってもいい。<br>完璧じゃなくてもいい。</p>
          <p>でも、</p>
          <p class="last-check-three"><strong>相手の話を聞く。<br>訊かれたことに答える。<br>自分の経験を、自分の言葉で話す。</strong></p>
          <p>これは忘れないでください。</p>
          <p>面接は、あなたの小さなミスを探すためだけの試験ではありません。</p>
          <p>面接官はあなたと話しながら、</p>
          <p><strong>「この人なら、ここでやっていけそうだ」<br>「この人は、ここから伸びていきそうだ」</strong></p>
          <p>そんな未来も見ようとしています。</p>
          <p>だから、完璧な人間を演じなくていい。</p>
          <p><strong>ここまでやってきた自分を連れて、目の前の人と話をしてきてください。</strong></p>
        </section>

        <section class="section-block" aria-labelledby="lastCheckBasicsTitle">
          <div class="section-heading">
            <span class="section-kicker">ABSOLUTE BASICS</span>
            <h2 id="lastCheckBasicsTitle">面接直前、これだけは忘れない。</h2>
          </div>

          <div class="last-check-basics">
            <ul class="last-check-basic-list">
              <li><strong>質問されたら、まず答える。</strong></li>
              <li><strong>相手の話を最後まで聞く。</strong></li>
              <li><strong>少しくらい考えてから答えていい。</strong></li>
              <li><strong>分からないことは、ごまかさない。</strong></li>
              <li><strong>暗記した文章ではなく、自分の言葉で話す。</strong></li>
              <li><strong>完璧にやろうとしない。目の前の人と、ちゃんと話す。</strong></li>
            </ul>

            <p class="last-check-breath"><strong>聞く → うなずく → 吸う → 答える。</strong></p>
          </div>

          <div class="last-check-shortcut">
            <p><strong>時間がなければ、ここまで読めば十分です。</strong></p>
            <p>この先は、いま自分が不安なところだけ開いて確認してください。</p>
          </div>
        </section>

        <section class="section-block" aria-labelledby="lastCheckNeedTitle">
          <div class="section-heading">
            <span class="section-kicker">CHECK WHAT YOU NEED</span>
            <h2 id="lastCheckNeedTitle">不安なところだけ確認する</h2>
          </div>

          <div class="last-check-disclosures">
            <details class="archive-disclosure last-check-disclosure">
              <summary><span><span class="last-check-summary-num">01</span>入室・マナー・言葉づかい</span></summary>
              <div class="archive-disclosure-body">
                <p>ノックの回数なんて、そこで勝負は決まりません。<strong>迷ったら3回。それで十分です。</strong></p>
                <p>ドアは雑に扱わない。<strong>両手で丁寧に開けて、両手で閉める。</strong>それで大丈夫です。</p>
                <p>挨拶とお辞儀は、きちんとする。</p>
                <p><strong>お辞儀をしなさすぎるくらいなら、少しくらい多い方がいい。困ったら礼をしよう。</strong></p>
                <p>席は、勧められてから座れば大丈夫です。</p>
                <p>そして、完璧な敬語を使おうとして固まらなくていい。<strong>相手に失礼のない、丁寧な言葉づかいで十分です。</strong></p>

                <div class="last-check-mini-box">
                  <p><strong>ただし、これだけは覚えておこう。</strong></p>
                  <p><strong>「貴社」＝書き言葉 ／ 「御社」＝話し言葉</strong></p>
                  <p><strong>「貴校」＝書き言葉 ／ 「御校」＝話し言葉</strong></p>
                  <p>面接で実際に話すときは、<strong>御社（おんしゃ）</strong>、<strong>御校（おんこう）</strong>を使います。</p>
                  <p>履歴書や志願理由書に書いた「貴社」「貴校」を、そのまま読み上げないように注意してください。</p>
                  <p class="last-check-note">※大学では、書面で「貴学」と表現する場合もあります。</p>
                </div>

                <p>そして、もしマナーを一つ間違えてしまっても、<strong>「終わった……」なんて思わなくていい。</strong></p>
                <p>ノックが一回多かったことより、そのあと相手とどう話すかの方が、ずっと大切です。</p>
                <p class="last-check-closing"><strong>失敗しないように入室するんじゃない。<br>目の前の人と話をするために入室するんです。</strong></p>
              </div>
            </details>

            <details class="archive-disclosure last-check-disclosure">
              <summary><span><span class="last-check-summary-num">02</span>質問されたら</span></summary>
              <div class="archive-disclosure-body">
                <p>面接官が話し終わる前に、答え始めない。</p>
                <p>まずは、<strong>「何を訊かれたのか」</strong>をちゃんと聞いてください。</p>
                <p>聞きながら軽くうなずいてもいい。そして、質問が終わったら一呼吸。</p>
                <p>すぐに答えが出てこなくても大丈夫です。<strong>少しくらい考えてから回答していい。</strong></p>
                <p>慌てて質問とズレたことを話すより、少し考えてから答える方がずっといい。</p>
                <p class="last-check-breath inline"><strong>聞く → うなずく → 吸う → 答える。</strong></p>
                <p class="last-check-closing"><strong>考えている一秒は、失敗ではありません。</strong></p>
              </div>
            </details>

            <details class="archive-disclosure last-check-disclosure">
              <summary><span><span class="last-check-summary-num">03</span>答えるとき</span></summary>
              <div class="archive-disclosure-body">
                <p class="last-check-keyline"><strong>質問されたら、まず答える。</strong></p>
                <p>基本は、<strong>結論 → 理由 → 具体的な経験</strong>です。</p>
                <p>たとえば、<strong>「はい、私の長所は〇〇です。なぜなら――」</strong>。それくらい単純でいい。</p>
                <p>いきなり長い経緯から話し始める必要はありません。</p>
                <p>聞かれていないことまで全部説明しようとしない。関係のない話へ広げすぎない。そして、<strong>自分のターンを長くしすぎない。</strong></p>
                <p>一度の回答ですべてを伝えなくても大丈夫です。面接官がもっと知りたければ、その続きを向こうから訊いてくれます。</p>
                <p>あなたが話す。相手が聞く。相手がまた訊く。あなたがまた答える。それでいい。</p>
                <p class="last-check-closing"><strong>面接は、スピーチではなく対話です。</strong></p>
              </div>
            </details>

            <details class="archive-disclosure last-check-disclosure">
              <summary><span><span class="last-check-summary-num">04</span>目線・声・話し方</span></summary>
              <div class="archive-disclosure-body">
                <p>基本は、質問してくれた相手を見て答えます。</p>
                <p>でも、ずっと目を見続けるのが苦手なら、無理に凝視しなくて大丈夫です。</p>
                <p><strong>せめて回答の最初と最後は、質問した相手を見よう。</strong></p>
                <p>それだけでも、「あなたに向かって話しています」ということは伝わります。</p>
                <p>面接官が複数いる場合は、まず質問した人へ。余裕があれば、ほかの面接官にも少し視線を配れば十分です。</p>
                <p>緊張すると、声が小さくなったり、早口になったりします。そんなときは、<strong>いつもより少し大きな声で、少しゆっくり。</strong></p>
                <p class="last-check-closing"><strong>大切なのは、目の前の人と話そうとしていることが、ちゃんと相手に伝わることです。</strong></p>
              </div>
            </details>

            <details class="archive-disclosure last-check-disclosure">
              <summary><span><span class="last-check-summary-num">05</span>分からない・聞き取れないとき</span></summary>
              <div class="archive-disclosure-body">
                <p>質問を聞き取れなかったなら、</p>
                <p class="last-check-phrase"><strong>「申し訳ございません。もう一度お願いしてもよろしいでしょうか。」</strong></p>
                <p>で大丈夫です。</p>
                <p>質問の意味を取り違えていそうなら、</p>
                <p class="last-check-phrase"><strong>「申し訳ございません。〇〇という意味でよろしいでしょうか。」</strong></p>
                <p>と確認しても構いません。</p>
                <p>そして、本当に分からないことを訊かれたなら、無理に知っているふりをしないでください。</p>
                <p>分からないことを認めたうえで、自分なりに考えられることがあるなら、それを話せばいい。</p>
                <p><strong>分からないときに、ごまかさない。<br>間違えたときに、認める。<br>教えてもらったら、受け止める。</strong></p>
                <p>そういう姿勢にも、その人の信用は表れます。</p>
                <p class="last-check-closing"><strong>素直さは、弱さではありません。</strong></p>
              </div>
            </details>

            <details class="archive-disclosure last-check-disclosure">
              <summary><span><span class="last-check-summary-num">06</span>なぜ、この質問をされた？</span></summary>
              <div class="archive-disclosure-body">
                <p>面接で、「何て答えれば評価されるんだろう？」だけを考えないでください。</p>
                <p>もう一歩だけ先へ行こう。</p>
                <p class="last-check-question"><strong>「この人は、何を知りたくてこの質問をしているんだろう？」</strong></p>
                <p>と考えてみてください。</p>
                <p>この質問集では、面接官が見ようとしている未来を考えるための大きな軸として、</p>
                <p><strong>定着性 ＝ ここで続けていけそうか。</strong></p>
                <p><strong>活躍性 ＝ ここで学び、成長し、力を発揮していけそうか。</strong></p>
                <p>という二つを使っています。</p>
                <p>もちろん、世の中のすべての面接官が本当にこの二語で採点しているわけではありません。これは、<strong>質問の裏側を考えるための道具</strong>です。</p>
                <p>質問の意図を想像できれば、</p>
                <p class="last-check-question"><strong>「自分のどの経験を話せば、この人の知りたいことに答えられるだろう？」</strong></p>
                <p>と考えられるようになります。</p>
                <p class="last-check-closing">そこまでできれば、もうただの暗記ではありません。<br><strong>ちゃんと、対話が始まっています。</strong></p>
              </div>
            </details>

            <details class="archive-disclosure last-check-disclosure">
              <summary><span><span class="last-check-summary-num">07</span>経験と、自分の言葉</span></summary>
              <div class="archive-disclosure-body">
                <p>経験を話すなら、</p>
                <p class="last-check-flow"><strong>何があった<br>↓<br>どう考えた<br>↓<br>どう動いた<br>↓<br>何が変わった</strong></p>
                <p>を意識してください。</p>
                <p>結果が派手じゃなくてもいい。失敗した経験でもいい。</p>
                <p>大切なのは、<strong>そのあと、あなたがどうしたのか。</strong></p>
                <p>失敗して終わったのか。そこから考えたのか。誰かに相談したのか。やり方を変えたのか。もう一度挑戦したのか。そこに、その人らしさが出ます。</p>
                <p>誰かに助けてもらったなら、それも隠さなくていい。</p>
                <p><strong>助けを求められること。<br>人の助言を素直に受け取れること。<br>そして、そのうえで自分でも動けること。</strong></p>
                <p>それも立派な強さです。</p>
                <p>そして、質問ごとに新しいエピソードを量産しなくても大丈夫です。自分にとって本当に大切な経験なら、質問によって違う角度から話せます。</p>
                <p>さらに、準備した文章を一字一句そのまま再生しようとしないこと。</p>
                <p><strong>言葉を忘れても、あなた自身が経験したことまで消えるわけじゃない。</strong></p>
                <p>言い回しを忘れたら、自分の言葉で言い直せばいい。多少不格好でも、<strong>「この人は、本当にそう思っているんだな」</strong>と伝わる言葉の方が強い。</p>
                <p>話を盛らない。借り物の言葉で自分を作らない。無理に相手好みの人間を演じない。</p>
                <p class="last-check-closing"><strong>模範回答にならなくていい。<br>あなたの回答になっていればいい。</strong></p>
              </div>
            </details>

            <details class="archive-disclosure last-check-disclosure">
              <summary><span><span class="last-check-summary-num">08</span>志望理由と未来</span></summary>
              <div class="archive-disclosure-body">
                <p>会社でも学校でも、<strong>入ることそのものをゴールにしない。</strong></p>
                <p>入ったあと、何をしたいのか。何を学びたいのか。どう成長したいのか。自分のこれまでの経験と、その会社・学校がどうつながっているのか。</p>
                <p>そこまで考えてみてください。</p>
                <p>面接官が見ようとしているのは、「この人は入りたいらしい」という現在だけではありません。</p>
                <p class="last-check-question"><strong>「入ったあと、この人はどうしていくんだろう」</strong></p>
                <p>という未来もあります。</p>
                <p>だから、<strong>その場所で、自分はどう生きていくのか。</strong>そこまで話せたら強い。</p>
                <p>会社や学校の名前を、人生のゴールにしないでください。</p>
                <p class="last-check-closing"><strong>そこは、これからの自分をつくるための場所です。</strong></p>
              </div>
            </details>

            <details class="archive-disclosure last-check-disclosure">
              <summary><span><span class="last-check-summary-num">09</span>面接の最後まで</span></summary>
              <div class="archive-disclosure-body">
                <p>最後の質問まで、きちんと聞く。</p>
                <p>「何か質問はありますか？」と訊かれたときのために、聞いてみたいことを一つくらい持っておく。</p>
                <p>面接が終わったら、きちんと挨拶をする。立ち上がったら礼をする。退出するときも丁寧に。ドアを閉めるところまで、落ち着いて。</p>
                <p>でも、椅子を少し鳴らしてしまった。お辞儀のタイミングを少し間違えた。退出するときに一瞬戸惑った。</p>
                <p>そんなことで、<strong>「全部ダメだった」なんて決めつけないでください。</strong></p>
                <p>面接は、一つの動作だけで評価されるものではありません。</p>
                <p class="last-check-closing"><strong>最後まで、目の前の相手に誠実でいればいい。</strong></p>
              </div>
            </details>
          </div>
        </section>

        <section class="section-block last-check-final" aria-labelledby="lastCheckFinalTitle">
          <div class="section-heading">
            <span class="section-kicker">FINAL MESSAGE</span>
            <h2 id="lastCheckFinalTitle">最後に。相手から、信用してもらおう。</h2>
          </div>

          <div class="last-check-final-box">
            <p>面接で大切なのは、<strong>完璧な人間に見せることではありません。</strong></p>

            <div class="last-check-pillars" aria-label="面接で大切な三つのこと">
              <strong>可能性を感じてもらうこと。</strong>
              <strong>信用してもらうこと。</strong>
              <strong>素直であること。</strong>
            </div>

            <p>分からないことをごまかさない。</p>
            <p>失敗を無理に隠さない。</p>
            <p>自分を必要以上に大きく見せない。</p>
            <p>人から教えてもらったことを受け止める。</p>
            <p>間違えたら、修正する。</p>
            <p>そして、</p>
            <p><strong>「私はここで頑張りたい」<br>「私はここからもっと伸びていける」</strong></p>
            <p>ということを、自分の経験と、自分の言葉で伝えてください。</p>
            <p>あなたは、完成された人間である必要はありません。</p>
            <p class="last-check-student"><strong>高校生なんだから、まだ途中で当たり前です。</strong></p>
            <p>だからこそ、</p>
            <p><strong>「この人なら、ここから伸びていきそうだ」</strong></p>
            <p>と思ってもらえばいい。</p>

            <div class="last-check-final-basics">
              <strong>質問されたら、まず答える。</strong>
              <strong>相手の話を聞く。</strong>
              <strong>自分の言葉で話す。</strong>
            </div>

            <p>ここまで準備してきたなら、もう直前に新しいことを増やさなくていい。</p>
            <p>深呼吸して。</p>
            <p>姿勢を整えて。</p>
            <p class="last-check-sendoff"><strong>目の前の人と、ちゃんと話してこよう。</strong></p>
          </div>
        </section>
      </section>
    `);
  }

  function installShell() {
    if (isInstalled || document.getElementById("view-lastcheck")) return;

    installStylesheet();
    installNavigation();
    installHeroEntry();
    installView();

    isInstalled = true;
  }

  function bindStatus() {
    const setLastCheckStatus = () => {
      const status = document.getElementById("topStatus");
      if (status) status.textContent = "面接直前 / LAST CHECK";
    };

    document.querySelectorAll('[data-view="lastcheck"], [data-go="lastcheck"]').forEach((button) => {
      button.addEventListener("click", setLastCheckStatus);
    });
  }

  function initialize() {
    if (isInitialized) return;
    bindStatus();
    isInitialized = true;
  }

  window.InterviewLastCheck = {
    installShell,
    initialize
  };
})();
