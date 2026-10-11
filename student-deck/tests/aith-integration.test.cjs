// 確定文章・Android入力属性・公開範囲の回帰確認。
// 実行：node --test student-deck/tests/aith-integration.test.cjs
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');

const deckDir = path.resolve(__dirname, '..');
const repoDir = path.resolve(deckDir, '..');
const source = fs.readFileSync(path.join(deckDir, 'script.js'), 'utf8');
const universitySource = fs.readFileSync(path.join(deckDir, 'university-cards.js'), 'utf8');
const html = fs.readFileSync(path.join(deckDir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(deckDir, 'style.css'), 'utf8');
const baseline = JSON.parse(fs.readFileSync(path.join(__dirname, 'content-baseline.json'), 'utf8'));
const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex');

function employmentBlock(text) {
  const start = text.indexOf('const cards = [');
  assert.notEqual(start, -1);
  return text.slice(start, text.indexOf('\n];', start) + 3);
}

const employment = vm.runInNewContext(`${employmentBlock(source)}; JSON.stringify(cards);`);
const university = vm.runInNewContext(`${universitySource}; JSON.stringify(universityCards);`);
const employmentCards = JSON.parse(employment);
const universityCards = JSON.parse(university);

function compact(text) {
  return text.replace(/<[^>]*>/g, '').replace(/\s+/g, '');
}

test('就職E01〜E10の確定データを一字も変更していない', () => {
  assert.equal(sha256(employmentBlock(source)), baseline.employmentBlockSha256);
  assert.deepEqual(employmentCards.map((c) => c.id), Array.from({ length: 10 }, (_, i) => `E${String(i + 1).padStart(2, '0')}`));
});

for (const card of universityCards) {
  test(`${card.id}：PDF正本との照合済み全項目を保持`, () => {
    const fields = baseline.university[card.id];
    assert.ok(fields);
    assert.deepEqual(Object.keys(card).sort(), ['id', ...Object.keys(fields)].sort());
    for (const [field, expectedHash] of Object.entries(fields)) {
      assert.equal(sha256(JSON.stringify(card[field])), expectedHash, field);
    }
    assert.equal(card.combo.length, 4);
    assert.equal(card.good.length, 2);
    assert.equal(card.warning.length, 2);
    assert.ok(card.intent.length > 0);
    assert.ok(card.retry.length > 0);
    assert.match(card.ret, /^[◎○]$/);
    assert.match(card.growth, /^[◎○]$/);
  });
}

test('進学10枚の連番とQUESTION・RETRYを欠落させていない', () => {
  assert.deepEqual(universityCards.map((c) => c.id), Array.from({ length: 10 }, (_, i) => `U${String(i + 1).padStart(2, '0')}`));
  assert.equal(new Set(universityCards.map((c) => c.id)).size, 10);
  assert.equal(universityCards[9].q.split('\n').length, 3);
});

test('正式パスワードのUTF-8 SHA-256を照合し、旧パスワードを廃止', () => {
  const hash = source.match(/const AUTH_HASH = "([a-f0-9]+)"/)[1];
  assert.equal(hash, sha256('エースインザホール'));
  assert.notEqual(hash, sha256('臨時休校'));
  assert.match(source, /const AUTH_KEY = "employment_final_training_auth_v1"/);
});

test('Android日本語入力と視覚的な伏字の属性を保持', () => {
  const input = html.match(/<input[\s\S]*?>/)[0];
  for (const [key, value] of Object.entries({
    type: 'text', autocomplete: 'off', inputmode: 'text',
    autocapitalize: 'none', spellcheck: 'false', enterkeyhint: 'go'
  })) {
    assert.ok(input.includes(`${key}="${value}"`), key);
  }
  assert.ok(input.includes('-webkit-text-security: disc'));
  assert.equal((html.match(/<input\b/g) || []).length, 1);
  assert.match(html, /<button type="submit">DECKを開く<\/button>/);
});

test('TOP・HOW TO USE・FINISHの指定文面と同一ページ内の選択肢', () => {
  const text = compact(html);
  for (const phrase of [
    'INTERVIEW FINAL DECK', '面接官の10枚の切り札', 'ACE IN THE HOLE',
    '面接官が切る10枚。あなたは、自分の言葉で返せるか。',
    'ここは、答えを作る場所ではありません。',
    '自分の中にある筋の通った想いと熱意を、面接官の質問意図を捉えたうえで、',
    '「訊かれたことへの答え」として伝えられているか。',
    '面接本番の前に、それを確かめるための最終確認用質問集です。',
    '4年制大学を想定した10枚', '企業就職を想定した10枚',
    'QUESTIONに、まず声に出して答える。', 'COMBOにも、その場で答える。',
    'なぜ訊かれたのか、自分で考える。', 'REVIEWを開き、自分の回答を振り返る。',
    '必要なら閉じて、もう一度答える。', '模範解答を覚えるためのものではありません。',
    '答えを直すのではなく、もう一度考える。',
    '10枚、終了。', 'でも、ここで終わりではありません。',
    '10枚の中から、「うまく答えられなかった」「まだ自分の言葉になっていない」と感じた3枚を選んでください。',
    'REVIEWをもう一度読む。そして今度はREVIEWを閉じて、何も見ずに、もう一度声に出して答える。',
    '最初と同じ言葉にならなくても構いません。むしろ、考えたことで言葉が変わったなら、それも一つの前進です。',
    '答えを覚えるのではなく、問いの裏側を読む。そして本番では、自分の言葉で、対話してきてください。'
  ]) {
    assert.ok(text.includes(compact(phrase)), phrase);
  }
  assert.match(html, /<button[^>]*data-mode="university"/);
  assert.match(html, /<button[^>]*data-mode="employment"/);
  assert.match(html, /id="trainingView" hidden/);
  assert.match(source, /title: "UNIVERSITY｜進学"/);
  assert.match(source, /title: "EMPLOYMENT｜就職"/);
  assert.equal((html.match(/data-return-top/g) || []).length, 2);
});

test('REVIEWは初期閉じ・共通構造と開閉を保持', () => {
  for (const zone of ['QUESTION', 'COMBO', 'THINK', 'QUESTION INTENT', 'AXIS', 'GOOD SIGN', 'WARNING', 'RETRY']) {
    assert.ok(source.includes(zone), zone);
  }
  assert.match(source, /aria-expanded="false"/);
  assert.match(source, /class="review-panel" id="\$\{panelId\}" hidden/);
  assert.match(source, /panel.hidden = !willOpen/);
  assert.match(css, /\[hidden\] \{\s*display: none !important/);
});

test('既存就職カードの描画結果を開始mainと全文比較', () => {
  // 初期化前の純粋な描画を、同じカード・同じ出力先で比較します。
  const old = execFileSync('git', ['show', `${baseline.startMain}:student-deck/script.js`], { cwd: repoDir, encoding: 'utf8' });
  function render(text, current) {
    const root = { innerHTML: '' };
    const initMarker = current ? 'returnToTop({ focus: false });' : 'bindAuth();\nrenderCards();';
    const context = { document: { getElementById: () => root } };
    vm.runInNewContext(text.slice(0, text.lastIndexOf(initMarker)) + (current ? '\nrenderCards("employment");' : '\nrenderCards();'), context);
    // 追加した閉じる操作部だけを除き、既存本文・構造を全文比較します。
    return root.innerHTML.replace(/<button class="review-close"[^>]*>確認を閉じる<\/button>/g, '').replace(/\s+/g, ' ').trim();
  }
  assert.equal(render(source, true), render(old, false));
});

test('検索除外・収集しない方針・旧説明の除去', () => {
  assert.equal((html.match(/content="noindex,nofollow,noarchive,nosnippet"/g) || []).length, 2);
  const footer = html.match(/<footer>[\s\S]*?<\/footer>/)[0];
  assert.equal(footer.replace(/\s+/g, ' ').trim(), '<footer> <p>Copyright © M.M. All Rights Reserved.</p> </footer>');
  for (const text of [html, source, css, fs.readFileSync(path.join(deckDir, 'README.txt'), 'utf8')]) {
    assert.doesNotMatch(text, /臨時休校/);
  }
  assert.doesNotMatch(source + universitySource, /fetch\(|XMLHttpRequest|sendBeacon|gtag\(|localStorage\.setItem\((?!AUTH_KEY)/);
});

test('公開質問集・教員deckを含むstudent-deck以外のtrackedファイルに差分なし', () => {
  const names = execFileSync('git', ['diff', '--name-only', baseline.startMain, '--'], { cwd: repoDir, encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  assert.ok(names.every((name) => name.startsWith('student-deck/')), names.join('\n'));
});
