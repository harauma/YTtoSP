# YTtoSP
`ytdl-core`を用いたお試し
## 実行方法
ターミナルでTypeScriptのコードを実行<br>
```
$ ./node_modules/.bin/ts-node index.ts
```
## ファイルの加工コマンド
前から時間指定(s)でカット<br>
```
$ ffmpeg -ss ”指定時間” -i hoge.mp3 -c copy hoge2.mp3
```
前から切り出す時間(s)を指定<br>
```
$ ffmpeg -i hoge.mp3 -t ”指定時間” -c copy hoge2.mp3
```
前後時間指定(s)でカット(後ろはback-frontの時間分カットらしい)<br>
```
$ ffmpeg -ss "開始部の指定時間" -i hoge.mp3 -ss "終了部の指定時間" -i hoge.mp3 -c copy -map 1:0 -map 0 -shortest -f nut - | ffmpeg -f nut -i - -map 0 -map -0:0 -c copy hoge2.mp3
```
