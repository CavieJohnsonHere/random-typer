"use client";
import { useState } from "react";

function getRandomEnglishCharacter(chars: string) {
  const randomIndex = Math.floor(Math.random() * chars.length);
  return chars[randomIndex];
}

export default function Home() {
  const defaultChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz            ,./\"'";
  const [value, setValue] = useState("Start typing!!!");
  const [chars, setChars] = useState(defaultChars);

  return (
    <div className="min-h-screen bg-gray-950 p-10 text-white">
      <h1 className="text-3xl mb-10">Random Typer!</h1>
      <textarea
        className="bg-gray-50 rounded w-96 h-64 text-black p-2 text-lg"
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
            ;
          }}
        >
          Decode the text using the key of
          <input className="bg-amber-50/50 p-1 rounded text-black" />
        </button>
      </div>
    </div>
  );
}
