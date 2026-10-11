INTERVIEW FINAL DECK / ACE IN THE HOLE / student-deck
============================================================

目的
----
進学・就職面接の本番前に、自分の言葉で質問へ答えられるかを確かめる
恒久的な最終確認用質問集。

設計原則
--------
- TOP → UNIVERSITY（進学）またはEMPLOYMENT（就職）を同一ページ内で選択
- Mobile First / 現行student-deckの配色・カード・操作を継承
- QUESTION → COMBO → THINK → REVIEW → RETRY
- REVIEWは初期状態・進路の再選択時とも閉じる
- 模範回答は置かない
- 氏名や回答内容は入力・送信・保存しない
- noindex / nofollow / noarchive / nosnippet を維持
- 公開質問集本体と /deck/ は変更・直接参照しない
- 公開質問集側からの隠し入口は、このStageでは未実装

コンテンツ
----------
就職E01〜E10：開始mainの実戦投入済みデータと文面を維持。
進学U01〜U10：ACE_IN_THE_HOLE_進学版_内容最終稿_確認用.pdfの3〜22ページ。
PDFの組版上の折り返しのみ除去し、段落を保持。文言の要約・補足は行わない。

入室
----
SHA-256ハッシュ照合と既存localStorageキーを継承。
正式パスワード用の新ハッシュで照合するため、旧認証済み端末も再認証が必要。
Android日本語入力のためtype="text"とCSS伏字・入力属性を維持。
静的サイト上の簡易ゲートであり、秘密情報を守る強固な認証ではない。

ファイル
--------
index.html / style.css / script.js / university-cards.js
hand-holding-card.svg / README.txt / tests/

検証
----
node --test student-deck/tests/aith-integration.test.cjs
（Repositoryルートから実行）

検証の範囲・実機確認項目
----------------------
tests/VALIDATION.md を参照。
DOM検証は画面描画・Android実機の入力確認を代替しない。
