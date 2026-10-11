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
        const close = root.querySelector('.review-close');
        assert.equal(close.textContent, '確認を閉じる');
        assert.equal(panel.lastElementChild, close);
        assert.equal(close.getAttribute('aria-controls'), panel.id);
        toggle.click();
        const other = [...doc.querySelectorAll('.practice-card')].find((el) => el !== root);
        const otherToggle = other.querySelector('.review-toggle');
        const otherPanel = other.querySelector('.review-panel');
        otherToggle.click();
        let scrollCalls = 0;
        const originalScroll = window.scrollTo;
        window.scrollTo = () => { scrollCalls++; };
        close.click();
        window.scrollTo = originalScroll;
        assert.equal(scrollCalls, 0);
        assert.equal(panel.hidden, true);
        assert.equal(toggle.getAttribute('aria-expanded'), 'false');
        assert.equal(toggle.textContent.trim(), 'REVIEW｜答えたあとに確認する');
        assert.equal(doc.activeElement, toggle);
        assert.equal(otherPanel.hidden, false);
        assert.equal(otherToggle.getAttribute('aria-expanded'), 'true');
        otherToggle.click();
        toggle.click();
        assert.equal(panel.hidden, false);
        toggle.click();
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

for (const mode of ['university', 'employment']) {
  for (const reduced of [false, true]) {
    test(`${mode}：全10枚の下側出口・FINISH・reduced motion=${reduced}`, async () => {
      const window = createWindow({ savedHash: newHash });
      const doc = window.document;
      const frames = [];
      window.requestAnimationFrame = (callback) => { frames.push(callback); return frames.length; };
      window.matchMedia = (query) => {
        assert.equal(query, '(prefers-reduced-motion: reduce)');
        return { matches: reduced };
      };
      doc.querySelector(`[data-mode="${mode}"]`).click();
      const cards = [...doc.querySelectorAll('.practice-card')];
      for (const [index, card] of cards.entries()) {
        const toggle = card.querySelector('.review-toggle');
        const panel = card.querySelector('.review-panel');
        const destination = cards[index + 1] || doc.getElementById('finish');
        const calls = [];
        destination.scrollIntoView = (options) => {
          assert.equal(panel.hidden, true);
          assert.equal(toggle.getAttribute('aria-expanded'), 'false');
          calls.push(options);
        };
        toggle.click();
        toggle.click();
        assert.equal(frames.length, 0, '上側の開閉はスクロールを予約しない');
        toggle.click();
        card.querySelector('.review-close').click();
        assert.equal(panel.hidden, true);
        assert.equal(calls.length, 0, 'レイアウト更新前にスクロールしない');
        assert.equal(frames.length, 1);
        frames.shift()();
        assert.deepEqual(JSON.parse(JSON.stringify(calls)), [{
          behavior: 'instant', block: 'start', inline: 'nearest'
        }]);
        assert.equal(doc.activeElement, toggle, '移動先へのfocusを強制しない');
        toggle.click();
        assert.equal(panel.hidden, false, '閉じたカードも再度開ける');
        toggle.click();
      }
      // フレーム待機中にモードを離れた場合、古いカードから移動しない。
      let staleCalls = 0;
      cards[1].scrollIntoView = () => staleCalls++;
      cards[0].querySelector('.review-toggle').click();
      cards[0].querySelector('.review-close').click();
      doc.querySelector('[data-return-top]').click();
      frames.shift()();
      assert.equal(staleCalls, 0);
      await window.happyDOM.close();
    });
  }
}
