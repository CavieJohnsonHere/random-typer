"use client";
import { useState } from "react";

function getRandomEnglishCharacter() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz            ,./\"'";
  const randomIndex = Math.floor(Math.random() * chars.length);
  return chars[randomIndex];
}

export default function Home() {
  const [value, setValue] = useState("Start typing!!!");

  return (
    <div className="min-h-screen bg-gray-950 p-10 text-white">
      <h1 className="text-3xl mb-10">Random Typer!</h1>

      <textarea
        className="bg-gray-50 rounded w-96 h-64 text-black p-2 text-lg"
        value={value}
        onChange={(e) => {
          if (value.length < e.target.value.length) {
            setValue(value + getRandomEnglishCharacter());
          } else {
            setValue(e.target.value);
          }
        }}
      />
    </div>
  );
}
