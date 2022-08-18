import ytdl from 'ytdl-core';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import ffmpeg from 'fluent-ffmpeg';

const BASE_URL = 'https://www.youtube.com/watch?v=';

const YOUTUBE_ID = 'zL1W6Z2JroM';

const url = `${BASE_URL}${YOUTUBE_ID}`;

const userHome = process.env[process.platform == "win32" ? "USERPROFILE" : "HOME"] ?? '';

const saveDir = path.join(userHome, 'Music/Spotify');

const inputFilePath = `${YOUTUBE_ID}.mp4`;

/* MP3ファイルのアーティスト名 */
const MP3_TITLE = ''

/* MP3ファイルのアーティスト名 */
const ARTIST_NAME = ''

const video = ytdl(url);

video.pipe(fs.createWriteStream(inputFilePath));

video.on('end', () => {
  console.log('file downloaded.');
  // 空白がある場合は空白排除したファイル名に設定
  const outputFilePath = `${saveDir}/${MP3_TITLE.replace(/\s+/g, '')}.mp3`;
  // ffmpegでmp3に変換する。yオプションで上書きができる（これがないと、出力先にファイルが存在している場合は止まってしまう）
  exec(`ffmpeg -y -i ${inputFilePath} -metadata title='${MP3_TITLE}' -metadata artist='${ARTIST_NAME}' ${outputFilePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      fixMedia(inputFilePath, outputFilePath);
      return;
    }
    console.log(stdout);
    console.log(stderr);
    // DLしたMP4ファイル削除
    fs.unlink(inputFilePath,(error) => {
      if (error) {
        console.log(error)
        return;
      }
      console.log('MP4 Deleted!');
    });
  });
});

async function fixMedia(
  input_file: string,
  output_file: string
) {
  // input_fileを読み込んでoutput_fileを生成する
  const converted = await ffmpeg(input_file)
    .toFormat('mp3')
    .on('end', () => {
      console.log(`変換完了`);
    }).save(output_file);
}

// 前から時間指定でカット
// ffmpeg -ss 4 -i hoge.mp3 -c copy hoge2.mp3
// 前から切り出す時間を指定
// ffmpeg -i hoge.mp3 -t 183 -c copy hoge2.mp3
// 前後時間指定でカット(後ろはback-frontの時間分カットらしい)
// ffmpeg -ss 28 -i hoge.mp3 -ss 40 -i hoge.mp3 -c copy -map 1:0 -map 0 -shortest -f nut - | ffmpeg -f nut -i - -map 0 -map -0:0 -c copy hoge2.mp3