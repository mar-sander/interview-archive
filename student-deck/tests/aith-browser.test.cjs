// 実行：AITH_CHROME_EXECUTABLE=/path/to/chrome node --test student-deck/tests/aith-browser.test.cjs
// Playwrightが必要です。Androidの画面幅・touch操作を検証し、実機IME試験は別に行います。
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const vm = require('node:vm');
const { chromium } = require('playwright');

const repoDir = path.resolve(__dirname, '../..');
const source = fs.readFileSync(path.join(repoDir, 'student-deck/script.js'), 'utf8');
const uSource = fs.readFileSync(path.join(repoDir, 'student-deck/university-cards.js'), 'utf8');
const start = source.indexOf('const cards = [');
const employmentSource = source.slice(start, source.indexOf('\n];', start) + 3);
const expected = {
  university: JSON.parse(vm.runInNewContext(uSource + '; JSON.stringify(universityCards);')),
  employment: JSON.parse(vm.runInNewContext(employmentSource + '; JSON.stringify(cards);'))
};
const authKey = 'employment_final_training_auth_v1';
const oldHash = '2f437e589a83bb85585630820b729a74ba1c1d068f87f7d614ec1cdcb651fc56';
const newHash = '29954b90c2f76b1ab2642b1a06488f43295896b3377bff95db94db41b719c22d';
let server, browser, url;

before(async () => {
  server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = path.resolve(repoDir, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
    if (!file.startsWith(repoDir + path.sep)) {
      response.writeHead(403).end();
      return;
    }
    const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
    fs.readFile(file, (error, data) => {
      if (error) response.writeHead(404).end();
      else response.writeHead(200, { 'Content-Type': `${types[path.extname(file)] || 'application/octet-stream'}; charset=utf-8` }).end(data);
    });
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  url = `http://127.0.0.1:${server.address().port}/student-deck/`;
  browser = await chromium.launch({
    executablePath: process.env.AITH_CHROME_EXECUTABLE || undefined,
    headless: true,
    args: ['--no-sandbox']
  });
  console.log('Browser:', await browser.version());
});

after(async () => {
  await browser?.close();
  if (server) await new Promise((resolve) => server.close(resolve));
});

async function noOverflow(page) {
  const widths = await page.evaluate(() => ({
    window: innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));
  assert.ok(widths.document <= widths.window && widths.body <= widths.window, JSON.stringify(widths));
}

async function screenshot(page, name) {
  if (!process.env.AITH_QA_DIR) return;
  await page.screenshot({ path: path.join(process.env.AITH_QA_DIR, name + '.png'), fullPage: false });
}

const profiles = [
  { name: 'small-phone', width: 320, height: 740, touch: true },
  { name: 'android-phone', width: 360, height: 800, touch: true },
  { name: 'android-phone-wide', width: 412, height: 915, touch: true },
  { name: 'android-tablet', width: 800, height: 1280, touch: true },
  { name: 'pc-chrome', width: 1440, height: 1000, touch: false }
];

for (const profile of profiles) {
  test(`${profile.name}：認証・20枚・両方向切替・REVIEW・横幅`, async () => {
    const context = await browser.newContext({
      viewport: { width: profile.width, height: profile.height },
      isMobile: profile.touch, hasTouch: profile.touch,
      userAgent: profile.touch ? 'Mozilla/5.0 (Linux; Android 16) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36' : undefined
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
    const activate = async (selector) => {
      if (profile.touch) await page.locator(selector).tap();
      else await page.locator(selector).click();
    };
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const input = page.locator('#authPassword');
    assert.equal(await input.getAttribute('type'), 'text');
    // 自動focusを含め、入力中だけ伏字解除。blur/focusで入力値は変わりません。
    await page.waitForFunction(() => document.activeElement === document.getElementById('authPassword'));
    assert.equal(await input.evaluate((el) => getComputedStyle(el).webkitTextSecurity), 'none');
    await input.fill('エース');
    await input.press('Tab');
    assert.equal(await input.evaluate((el) => getComputedStyle(el).webkitTextSecurity), 'disc');
    assert.equal(await input.inputValue(), 'エース');
    await activate('#authPassword');
    assert.equal(await input.evaluate((el) => getComputedStyle(el).webkitTextSecurity), 'none');
    assert.equal(await input.inputValue(), 'エース');
    await input.fill('');
    await noOverflow(page);
    await screenshot(page, profile.name + '-auth');
    await activate('#authForm button');
    await page.waitForFunction(() => document.getElementById('authError').textContent.includes('入力してください'));
    for (const password of ['違うパスワード', '臨時休校']) {
      await input.fill(password);
      await activate('#authForm button');
      await page.waitForFunction(() => document.getElementById('authError').textContent.includes('違います'));
      assert.equal(await page.locator('body').getAttribute('class'), 'auth-locked');
    }
    // 日本語文字列の入力とEnter・送信の両経路。実機の画面キーボードは別試験。
    await input.fill('エースインザホール');
    if (profile.name === 'pc-chrome') await input.press('Enter');
    else await activate('#authForm button');
    await page.waitForFunction(() => document.body.classList.contains('auth-unlocked'));
    assert.equal(await page.evaluate((key) => localStorage.getItem(key), authKey), newHash);
    assert.equal(await page.locator('#topView').isVisible(), true);
    assert.equal(await page.locator('#trainingView').isVisible(), false);
    assert.equal(await page.locator('.practice-card').count(), 0);
    await noOverflow(page);
    await screenshot(page, profile.name + '-top');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('#authGate').isVisible(), false);
    assert.equal(await page.locator('#topView').isVisible(), true);
    const initialUrl = page.url();

    // 進学→TOP→就職→TOP→進学。再入場でREVIEWは必ず閉じます。
    for (const mode of ['university', 'employment', 'university']) {
      await activate(`button[data-mode="${mode}"]`);
      assert.equal(page.url(), initialUrl);
      assert.equal(await page.locator('#topView').isVisible(), false);
      assert.equal(await page.locator('#trainingView').isVisible(), true);
      assert.equal(await page.locator('#modeTitle').textContent(), mode === 'university' ? 'UNIVERSITY｜進学' : 'EMPLOYMENT｜就職');
      assert.equal(await page.locator('#employmentAxes').isVisible(), mode === 'employment');
      assert.equal(await page.locator('.practice-card').count(), 10);
      assert.equal(await page.locator('.review-toggle[aria-expanded="false"]').count(), 10);
      assert.equal(await page.locator('.review-panel:visible').count(), 0);
      assert.equal(await page.locator('.steps li').count(), 5);
      assert.ok((await page.locator('#finish').textContent()).includes('10枚、終了。'));
      await noOverflow(page);
      await page.locator('.practice-card').first().scrollIntoViewIfNeeded();
      await screenshot(page, profile.name + '-' + mode + '-card');
      for (const card of expected[mode]) {
        const root = page.locator('#' + card.id);
        assert.equal(await root.locator('.card-question').textContent(), card.q);
        assert.deepEqual(await root.locator('.combo-text').allTextContents(), card.combo);
        assert.equal(await root.locator('.think-zone').isVisible(), true);
        await activate(`#${card.id} .review-toggle`);
        assert.equal(await root.locator('.review-panel').isVisible(), true);
        assert.deepEqual(await root.locator('.review-block').first().locator('p:not(.review-block__code)').allTextContents(), card.intent);
        assert.deepEqual(await root.locator('.axis-review > p').allTextContents(), [card.axisRet, card.axisGrowth]);
        assert.deepEqual(await root.locator('.axis-review__grade').allTextContents(), [card.ret, card.growth]);
        assert.deepEqual(await root.locator('.sign-item > p:not(.sign-item__title)').allTextContents(), [...card.good, ...card.warning].map((item) => item[1]));
        assert.deepEqual(await root.locator('.sign-item__title').allTextContents(), [...card.good, ...card.warning].map((item, i) => `${String(i % 2 + 1).padStart(2, '0')}｜${item[0]}`));
        assert.equal(await root.locator('.retry-prompt').textContent(), card.retry);
        await noOverflow(page);
        if (card.id.endsWith('01')) await screenshot(page, profile.name + '-' + mode + '-review');
        await activate(`#${card.id} .review-toggle`);
        assert.equal(await root.locator('.review-panel').isVisible(), false);
        assert.equal(await root.locator('.review-toggle').getAttribute('aria-expanded'), 'false');
      }
      // 開いたカードを置いたままTOPへ戻り、状態を次の進路へ持ち込まない。
      await activate(`.practice-card:first-child .review-toggle`);
      await activate(mode === 'employment' ? '#finish [data-return-top]' : '.mode-heading [data-return-top]');
      assert.equal(await page.locator('#topView').isVisible(), true);
      assert.equal(await page.locator('.practice-card').count(), 0);
      await noOverflow(page);
    }
    assert.deepEqual(errors, []);
    await context.close();
  });
}

test('旧保存認証を失効・storage使用不可でも認証と切替を継続', async () => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(url);
  await page.evaluate(({ key, hash }) => localStorage.setItem(key, hash), { key: authKey, hash: oldHash });
  await page.reload();
  assert.equal(await page.locator('#authGate').isVisible(), true);
  await page.evaluate(() => {
    Storage.prototype.getItem = () => { throw new Error('blocked'); };
    Storage.prototype.setItem = () => { throw new Error('blocked'); };
  });
  await page.locator('#authPassword').fill('エースインザホール');
  await page.locator('#authPassword').press('Enter');
  await page.waitForFunction(() => document.body.classList.contains('auth-unlocked'));
  await page.locator('button[data-mode="employment"]').click();
  assert.equal(await page.locator('.practice-card').count(), 10);
  await context.close();
});
