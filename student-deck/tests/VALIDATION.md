# Stage AITH-1 検証記録

開始remote main：`aeb6ef0101b226b33222d15b9f01da28b8037ade`

## 完了した確認

- `aith-integration.test.cjs`：19/19 PASS。
- `aith-dom.test.cjs`：7/7 PASS（happy-dom 20.14.6）。
- PDF正本と移植データを、pdfplumberとpypdfの独立した抽出結果で突合：100項目一致。COMBO各4問、GOOD SIGN・WARNING各2組の見出しと本文をすべて含む。
- PDF正本のSHA-256：`a417810ed724ccf1525cc43f1e71eb8e88f8e618d36af6765d374636ecb39fd4`。
- 就職E01〜E10のデータ定義：開始mainの定義とバイト単位で一致。
- 就職カードの描画HTML：開始mainの出力と全文一致（テンプレート内の空白のみ正規化）。QUESTION・COMBO・THINK・REVIEW・RETRY・タグを含む。
- 正式パスワード、誤入力、旧パスワード、旧保存認証の失効、認証後TOP、再読込、storage使用不可時、暗号API非対応時：DOM検証で確認。
- 進学→TOP→就職、および就職→TOP→進学、再入場時REVIEW初期閉じ：DOM検証で確認。
- 全20枚のQUESTION・COMBO・QUESTION INTENT・AXIS・GOOD SIGN・WARNING・RETRY：描画されたDOMの全文をデータと比較。
- HTML構造・重複ID・JavaScript構文・git diffの空白不備：問題なし。
- `student-deck/`以外のtrackedファイルは差分なし。公開質問集、教員用`deck/`、faviconを含む。
- 色、フォント、既存カード・REVIEWのCSSを継承。追加CSSはTOP選択肢・TOPへ戻る・モード見出し・正本の段落表示・hidden制御。
- 入力欄はtype="text"、CSS伏字、autocomplete/inputmode/autocapitalize/spellcheck/enterkeyhintを維持。
- noindex/nofollow/noarchive/nosnippet、氏名・回答を収集しない方針を維持。

## 未完了の画面・実機検証

Chromeを実行環境内で起動できませんでした。起動時に内部ソケットが`Operation not permitted`となり、Playwrightの6シナリオはセットアップで停止しています。別ブラウザからローカル検証サーバーへの接続もできませんでした。

このため、次は**未確認**です。DOM検証の通過を、ブラウザ・Android実機試験の通過とは扱いません。

- PC Chromeの描画・実ブラウザconsole error。
- Androidスマートフォン・タブレットの描画。
- 320/360/412/800/1440pxでの横スクロール。
- hoverを使わない実ブラウザのtouch操作。
- Android画面キーボードの日本語変換・送信操作、PCでのEnter送信。

確認待ちのDraft PRとし、mainへmerge・Pages公開は行いません。
公開質問集側の隠し入口は未実装です。

## 再実行

Repositoryルートから実行します。

```sh
node --test student-deck/tests/aith-integration.test.cjs

# happy-domを利用できる環境で実行
node --test student-deck/tests/aith-dom.test.cjs

# PlaywrightとChromeを利用できる環境で実行
AITH_CHROME_EXECUTABLE=/path/to/chrome \
  node --test student-deck/tests/aith-browser.test.cjs
```

happy-domが標準の解決パスにない場合は、`AITH_DOM_MODULE`に`happy-dom/lib/index.js`の絶対パスを指定できます。
ブラウザテストは自身で一時HTTPサーバーを起動し、検証終了後に停止します。
`AITH_QA_DIR`に既存の一時ディレクトリを指定した場合のみ、確認用スクリーンショットを出力します。

ブラウザテストはAndroidの画面幅・touchを再現します。実機の画面キーボードを再現するものではありません。

## No.Mによる最終確認

1. スマートフォンで新パスワードを日本語入力し、送信します。
2. 進学と就職を各一度開き、カードとREVIEWを確認します。
3. TOPへ戻って別進路を開き、REVIEWが閉じていることを確認します。
4. 横スクロールがないことを、REVIEWを開いた状態でも確認します。
5. PCでEnter送信、タブレットでも入力・開閉を確認します。
