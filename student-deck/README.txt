EMPLOYMENT FINAL TRAINING / student-deck
============================================================

目的
----
臨時休校により学校で面接練習を受けにくくなった、
就職試験直前の高校生向け自主練習サイト。

設計原則
--------
- 1ページ完結
- Mobile First
- QUESTION → COMBO → THINK → REVIEW → RETRY
- REVIEWは初期状態で閉じる
- 模範回答は置かない
- GOOD SIGN / WARNING は「正解・不正解」ではなく自己点検として扱う
- 氏名や回答内容は入力・送信・保存しない
- 検索エンジンには noindex / nofollow / noarchive を指定
- 元の /deck/ を直接参照せず、このフォルダ内で完結

入室
----
パスワードはSHA-256ハッシュ照合。
静的サイト上の簡易ゲートであり、秘密情報を守る強固な認証ではない。

ファイル
--------
index.html
style.css
script.js
hand-holding-card.svg
README.txt
