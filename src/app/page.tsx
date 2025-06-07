"use client";
import { useState } from "react";
import { Cipher } from "crypto";

// All this code by Jesse Jackson: https://jsejcksn.github.io/secrets/

function decode(key: string, cipher: string) {
  // Primary decode operation
  let arrKey = key.split("");
  let arrCipher = cipher.split("");
  let arrKeyNum = uniEncode(arrKey);
  let arrCipherNum = uniEncode(arrCipher);
  let arrKeystream = [];
  for (let i = 0; i < arrCipherNum.length; i++) {
    let mult = returnInt(i / arrKeyNum.length);
    let pos = i % arrKeyNum.length;
    arrKeystream.push(arrKeyNum[pos] + mult);
  }
  let arrTextNum = [];
  for (let j = 0; j < arrCipherNum.length; j++) {
    arrTextNum.push((arrCipherNum[j] + 65536 - arrKeystream[j]) % 65536);
  }
  let arrText = uniDecode(arrTextNum);
  let text = arrText.join("");
  return text;
}

function encode(key: string, text: string) {
  // Primary encode operation
  let arrKey = key.split("");
  let arrText = text.split("");
  let arrKeyNum = uniEncode(arrKey);
  let arrTextNum = uniEncode(arrText);
  let arrKeystream = [];
  for (let i = 0; i < arrTextNum.length; i++) {
    let mult = returnInt(i / arrKeyNum.length);
    let pos = i % arrKeyNum.length;
    arrKeystream.push(arrKeyNum[pos] + mult);
  }
  let arrCipherNum = [];
  for (let j = 0; j < arrTextNum.length; j++) {
    arrCipherNum.push((arrTextNum[j] + arrKeystream[j]) % 65536);
  }
  let arrCipher = uniDecode(arrCipherNum);
  let cipher = arrCipher.join("");
  return cipher;
}

function returnInt(n: any) {
  // Staple function
  return parseInt(n, 10);
}

function uniDecode(arr: any[]) {
  // Maps an array of Unicode values to their UTF-8 characters
  return arr.map(function (x) {
    return String.fromCharCode(x);
  });
}

function uniEncode(arr: any[]) {
  // Maps an array of UTF-8 characters to their Unicode values
  return arr.map(function (x) {
    return x.charCodeAt(0);
  });
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

  return (
    <div className="min-h-screen bg-gray-950 p-10 text-white">
      <h1 className="text-3xl mb-10">Random Typer!</h1>
      <textarea
        className={`bg-gray-50 rounded w-96 h-64 text-black p-2 text-lg`}
        value={value}
        onChange={(e) => {
          if (value.length < e.target.value.length) {
            setValue(value + getRandomEnglishCharacter(chars));
          } else {
            setValue(e.target.value);
          }
        }}
      />
      <div className="mt-5">
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
          className="bg-amber-50/50 p-1 rounded text-black ms-2"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </div>
    </div>
  );
}
