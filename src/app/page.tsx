"use client";
import { useState } from "react";
import Share from "./components/share";

// All this code by Jesse Jackson: https://jsejcksn.github.io/secrets/

function decode(key: string, cipher: string) {
  // Primary decode operation
  const arrKey = key.split("");
  const arrCipher = cipher.split("");
  const arrKeyNum = uniEncode(arrKey);
  const arrCipherNum = uniEncode(arrCipher);
  const arrKeystream = [];
  for (let i = 0; i < arrCipherNum.length; i++) {
    const mult = returnInt(i / arrKeyNum.length);
    const pos = i % arrKeyNum.length;
    arrKeystream.push(arrKeyNum[pos] + mult);
  }
  const arrTextNum = [];
  for (let j = 0; j < arrCipherNum.length; j++) {
    arrTextNum.push((arrCipherNum[j] + 65536 - arrKeystream[j]) % 65536);
  }
  const arrText = uniDecode(arrTextNum);
  const text = arrText.join("");
  return text;
}

function encode(key: string, text: string) {
  // Primary encode operation
  const arrKey = key.split("");
  const arrText = text.split("");
  const arrKeyNum = uniEncode(arrKey);
  const arrTextNum = uniEncode(arrText);
  const arrKeystream = [];
  for (let i = 0; i < arrTextNum.length; i++) {
    const mult = returnInt(i / arrKeyNum.length);
    const pos = i % arrKeyNum.length;
    arrKeystream.push(arrKeyNum[pos] + mult);
  }
  const arrCipherNum = [];
  for (let j = 0; j < arrTextNum.length; j++) {
    arrCipherNum.push((arrTextNum[j] + arrKeystream[j]) % 65536);
  }
  const arrCipher = uniDecode(arrCipherNum);
  const cipher = arrCipher.join("");
  return cipher;
}

function returnInt(n: number | string): number {
  // Staple function
  return parseInt(n.toString(), 10);
}

function uniDecode(arr: number[]): string[] {
  // Maps an array of Unicode values to their UTF-8 characters
  return arr.map((x) => String.fromCharCode(x));
}

function uniEncode(arr: string[]): number[] {
  // Maps an array of UTF-8 characters to their Unicode values
  return arr.map((x) => x.charCodeAt(0));
}

function getRandomEnglishCharacter(chars: string) {
  const randomIndex = Math.floor(Math.random() * chars.length);
  return chars[randomIndex];
}

export default function Home() {
  const defaultChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz            ,./\"'";
  const [value, setValue] = useState("Start typing!!!");
  const [chars, setChars] = useState(defaultChars);
  const [key, setKey] = useState("gulp");
  const [noobMode, setNoobMode] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-white md:grid grid-cols-3 relative">
      <div className="col-span-2 p-10">
        <h1 className="text-3xl mb-10">Random Typer!</h1>
        <textarea
          className={`bg-gray-50 rounded w-96 h-64 text-black p-2 text-lg`}
          value={value}
          onChange={(e) => {
            if (noobMode) {
              setValue(e.target.value);
            } else if (value.length < e.target.value.length) {
              setValue(value + getRandomEnglishCharacter(chars));
            } else {
              setValue(e.target.value);
            }
          }}
        />

        <div className="mt-5">
            <input type="checkbox" value={noobMode ? "on" : "off"} onChange={() => setNoobMode(!noobMode)} />{" "}
            <span>Noob mode</span>
        </div>
      </div>

      <div className="p-10 bg-gray-900 my-5 rounded-s-2xl">
        <div>
          <span>
            You can change the character string here. Characters apear more
            frequently if you put more of them here:{" "}
          </span>
          <input
            type="text"
            className="bg-gray-50 text-black p-2 rounded h-12 mx-1"
            value={chars}
            onChange={(e) => setChars(e.target.value)}
          />
          <button
            className="bg-gray-700 hover:bg-gray-800 transition rounded h-12 mx-1 text-white/80 cursor-pointer p-2"
            onClick={() => setChars(defaultChars)}
          >
            Reset
          </button>
        </div>
        <div className="mt-5">
          <button
            className="bg-gray-700 hover:bg-gray-800 transition rounded h-12 mx-1 text-white/80 cursor-pointer p-2"
            onClick={() => {
              setValue(encode(key, value));
            }}
          >
            Encode
          </button>
          <span> Put the key here: </span>{" "}
          <input
            className="bg-amber-50/50 focus:bg-amber-100/60 transition text-white p-1 rounded ms-2"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>

        <div className="mt-5">
          <button
            className="bg-gray-700 hover:bg-gray-800 transition rounded h-12 mx-1 text-white/80 cursor-pointer p-2"
            onClick={() => {
              setValue(decode(key, value));
            }}
          >
            Decode
          </button>
          <span> Put the key here: </span>{" "}
          <input
            className="bg-amber-50/50 focus:bg-amber-100/60 transition text-white p-1 rounded ms-2"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>

        <div className="mt-5">
          <button
            className="bg-gray-700 hover:bg-gray-800 transition rounded h-12 mx-1 text-white/80 cursor-pointer p-2"
            onClick={() => {
              setValue(
                Array.from(new TextEncoder().encode(value))
                  .map((v) => v.toString(2))
                  .join(" ")
              );
            }}
          >
            Turn into bytes
          </button>
        </div>

        <div className="md:absolute bottom-15">
          <Share value={value} setValue={setValue} />
        </div>
      </div>
    </div>
  );
}
