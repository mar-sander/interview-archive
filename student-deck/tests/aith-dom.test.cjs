// DOM上で認証・切替・20枚の開閉を検証します。レイアウト／実機IME試験ではありません。
// happy-domが必要です（AITH_DOM_MODULEでインストール先を指定可能）。
const { test, before } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto } = require('node:crypto');
const { pathToFileURL } = require('node:url');

const dir = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const source = fs.readFileSync(path.join(dir, 'script.js'), 'utf8');
const uSource = fs.readFileSync(path.join(dir, 'university-cards.js'), 'utf8');
const start = source.indexOf('const cards = [');
const eSource = source.slice(start, source.indexOf('\n];', start) + 3);
const expected = {
  university: JSON.parse(vm.runInNewContext(uSource + '; JSON.stringify(universityCards);')),
  employment: JSON.parse(vm.runInNewContext(eSource + '; JSON.stringify(cards);'))
};
const authKey = 'employment_final_training_auth_v1';
const oldHash = '2f437e589a83bb85585630820b729a74ba1c1d068f87f7d614ec1cdcb651fc56';
const newHash = '29954b90c2f76b1ab2642b1a06488f43295896b3377bff95db94db41b719c22d';
let Window;
before(async () => {
  const module = process.env.AITH_DOM_MODULE;
  ({ Window } = await import(module ? pathToFileURL(module).href : 'happy-dom'));
});

function createWindow({ savedHash, blockStorage = false, noCrypto = false } = {}) {
  const window = new Window({
    url: 'https://example.test/student-deck/',
    settings: { disableCSSFileLoading: true, disableJavaScriptFileLoading: true }
  });
  window.document.documentElement.innerHTML = html;
  Object.defineProperty(window, 'crypto', { value: noCrypto ? {} : webcrypto });
  window.TextEncoder = TextEncoder;
  if (savedHash) window.localStorage.setItem(authKey, savedHash);
  if (blockStorage) {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('storage blocked'); } });
  }
  // classic scriptの共通スコープを、eval一回で再現します。
  window.eval(uSource + "\n" + source);
  return window;
}

async function submit(window, value, method = 'event') {
  window.document.getElementById('authPassword').value = value;
  const form = window.document.getElementById('authForm');
  if (method === 'button') form.querySelector('button').click();
  else form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  for (let n = 0; form.querySelector('button').disabled && n < 100; n++) {
    await new Promise((resolve) => setTimeout(resolve, 2));
  }
  assert.equal(form.querySelector('button').disabled, false);
}

for (const method of ['event', 'button']) {
  test(`正式パスワードでTOPへ入室・保存・再読込 (${method})`, async () => {
    const window = createWindow();
    await submit(window, 'エースインザホール', method);
    assert.ok(window.document.body.classList.contains('auth-unlocked'));
    assert.equal(window.localStorage.getItem(authKey), newHash);
    assert.equal(window.document.getElementById('topView').hidden, false);
    assert.equal(window.document.getElementById('trainingView').hidden, true);
    assert.equal(window.document.querySelectorAll('.practice-card').length, 0);
    const reloaded = createWindow({ savedHash: window.localStorage.getItem(authKey) });
    assert.ok(reloaded.document.body.classList.contains('auth-unlocked'));
    assert.equal(reloaded.document.getElementById('trainingView').hidden, true);
    await window.happyDOM.close();
    await reloaded.happyDOM.close();
  });
}

test('空欄・誤パスワード・旧パスワードでは入室しない', async () => {
  const window = createWindow();
  for (const value of ['', '間違い', '臨時休校']) {
    await submit(window, value);
    assert.ok(window.document.body.classList.contains('auth-locked'));
    assert.ok(window.document.getElementById('authError').textContent.length > 0);
  }
  assert.equal(window.localStorage.getItem(authKey), null);
  await window.happyDOM.close();
});

test('旧保存認証を新ハッシュで失効させる', async () => {
  const window = createWindow({ savedHash: oldHash });
  assert.ok(window.document.body.classList.contains('auth-locked'));
  await submit(window, 'エースインザホール');
  assert.equal(window.localStorage.getItem(authKey), newHash);
  await window.happyDOM.close();
});

test('storage使用不可でも認証後にTOPへ入り、暗号API非対応時はエラーを表示', async () => {
  const window = createWindow({ blockStorage: true });
  await submit(window, 'エースインザホール');
  assert.ok(window.document.body.classList.contains('auth-unlocked'));
  const unsupported = createWindow({ noCrypto: true });
  await submit(unsupported, 'エースインザホール');
  assert.ok(unsupported.document.body.classList.contains('auth-locked'));
  assert.ok(unsupported.document.getElementById('authError').textContent.includes('このブラウザーでは認証機能を利用できません'));
  await window.happyDOM.close();
  await unsupported.happyDOM.close();
});

for (const first of ['university', 'employment']) {
  test(`${first} → TOP → 他進路 → TOP → ${first}：全文・開閉・再入場`, async () => {
    const window = createWindow({ savedHash: newHash });
    const doc = window.document;
    const second = first === 'university' ? 'employment' : 'university';
    const errors = [];
    window.addEventListener('error', (event) => errors.push(event.message));
    for (const mode of [first, second, first]) {
      doc.querySelector(`button[data-mode="${mode}"]`).click();
      assert.equal(window.location.href, 'https://example.test/student-deck/');
      assert.equal(doc.getElementById('topView').hidden, true);
      assert.equal(doc.getElementById('trainingView').hidden, false);
      assert.equal(doc.getElementById('employmentAxes').hidden, mode !== 'employment');
      assert.equal(doc.getElementById('modeTitle').textContent, mode === 'university' ? 'UNIVERSITY｜進学' : 'EMPLOYMENT｜就職');
      assert.equal(doc.activeElement.id, 'modeTitle');
      assert.equal(doc.querySelectorAll('.practice-card').length, 10);
      for (const card of expected[mode]) {
        const root = doc.getElementById(card.id);
        const panel = root.querySelector('.review-panel');
        const toggle = root.querySelector('.review-toggle');
        assert.equal(panel.hidden, true);
        assert.equal(toggle.getAttribute('aria-expanded'), 'false');
        assert.equal(root.querySelector('.card-question').textContent, card.q);
        assert.deepEqual([...root.querySelectorAll('.combo-text')].map((el) => el.textContent), card.combo);
        toggle.click();
        assert.equal(panel.hidden, false);
        assert.equal(toggle.getAttribute('aria-expanded'), 'true');
        assert.deepEqual([...root.querySelector('.review-block').querySelectorAll('p:not(.review-block__code)')].map((el) => el.textContent), card.intent);
        assert.deepEqual([...root.querySelectorAll('.axis-review > p')].map((el) => el.textContent), [card.axisRet, card.axisGrowth]);
        assert.deepEqual([...root.querySelectorAll('.axis-review__grade')].map((el) => el.textContent), [card.ret, card.growth]);
        assert.deepEqual([...root.querySelectorAll('.sign-item > p:not(.sign-item__title)')].map((el) => el.textContent), [...card.good, ...card.warning].map((item) => item[1]));
        assert.equal(root.querySelector('.retry-prompt').textContent, card.retry);
        toggle.click();
        assert.equal(panel.hidden, true);
        assert.equal(toggle.getAttribute('aria-expanded'), 'false');
      }
      doc.querySelector('.review-toggle').click();
      doc.querySelector(mode === first ? '.mode-heading [data-return-top]' : '#finish [data-return-top]').click();
      assert.equal(doc.getElementById('topView').hidden, false);
      assert.equal(doc.getElementById('trainingView').hidden, true);
      assert.equal(doc.querySelectorAll('.practice-card').length, 0);
      assert.equal(doc.activeElement.id, 'topTitle');
    }
    assert.deepEqual(errors, []);
    await window.happyDOM.close();
  });
}
