import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
// @ts-ignore: IT EXISTS YOU MOTHERFUCKER
import { Buffer } from "buffer";
// @ts-ignore: YOU TOO
import { mkdir, readFile, writeFile } from "fs";
// @ts-ignore: YOU TOO
import { basename } from "path";
// @ts-ignore: AND YOU TOO
import * as process from 'process';
import { defineConfig, Plugin } from "rollup";
import esbuild from "rollup-plugin-esbuild";
import { MusicRegex } from "./src/regex";

const pluginName = basename(process.cwd());

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: `dist/${pluginName}.js`,
      format: "cjs",
      strict: false
    },
  ],
  plugins: [
    nodeResolve(),
    commonjs(),
    esbuild({ minify: true, target: "ES2019" }),
    validateMusicRegex(),
    createPluginJson(),
  ]
});

function createPluginJson(options = {}): Plugin {
  return {
    name: 'plugin-info',
    writeBundle: (_) => {
      readFile('./package.json', (err: Error, data: Buffer) => {
        if (err) throw err;
        const info = JSON.parse(String(data));
        const pluginData = {
          "name": pluginName,
          "description": info?.description ?? "No description was provided.",
          "author": info?.author?.name ?? "Unknown",
          "version": info?.version ?? "1.0.0"
        };
        mkdir('./dist/', { recursive: true }, (err: any) => {
          if (err) throw err;
          writeFile(`./dist/${pluginName}.json`, JSON.stringify(pluginData, null, 4), { flag: 'w' }, (_: any) => {})  
        })
      })
    }
  }
};

function validateMusicRegex(options = {}): Plugin {
  return {
    name: 'music-regex-test',
    writeBundle: (_) => {
      const testURLs: string[] = [
        "https://open.spotify.com/track/6gObQgJsiJM46ZUFcaGYAy",
        "https://music.apple.com/vn/album/aegleseeker/1569408472?i=1569408474",
        "https://youtube.com/watch?v=s0K53t4dNyg",
        "https://music.amazon.com/albums/B095X51BY8?trackAsin=B095X6NCS5",
        "https://soundcloud.com/silentrm-net/aegleseeker?id=1047411334",
        "https://www.deezer.com/track/1383830592",
        "https://music.youtube.com/watch?v=s0K53t4dNyg&feature=share",
        "https://listen.tidal.com/track/51123340",
        "https://open.qobuz.com/track/147400636",
        "https://youtube.com/watch?v=s0K53t4dNyg&feature=share",
      ]
      for (let i in testURLs) {
        if (testURLs[i].search(MusicRegex) === -1) {
          throw `Regex failed for URL ${testURLs[i]}`
        }
      }
      console.log("\x1b[32m✅ All regex tests passed\x1b[0m")
    }
  }
}
