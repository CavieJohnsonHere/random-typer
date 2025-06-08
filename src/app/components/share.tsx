"use client";

import { useState } from "react";

export default function Share({
  value,
  setValue,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [key, setKey] = useState("greetings!");

  const onShareClicked = async () => {
    await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: key,
        data: value,
      }),
    });
  };

  const onGetClicked = async () => {
    const res = await fetch(`/api/share?key=${key}`);
    if (res.ok) setValue(JSON.parse(await res.text()).data);
  };

  return (
    <div>
      <button
        className="bg-gray-700 hover:bg-gray-800 transition rounded h-12 mx-1 text-white/80 cursor-pointer p-2"
        onClick={onShareClicked}
      >
        Share your text.
      </button>

      <button
        className="bg-gray-700 hover:bg-gray-800 transition rounded h-12 mx-1 text-white/80 cursor-pointer p-2"
        onClick={onGetClicked}
      >
        Get other people&apos;s text.
      </button>

      <div className="mt-2">
        <span> Put the key here: </span>
        <input
          className="bg-amber-50/50 focus:bg-amber-100/60 transition text-white p-1 rounded ms-2"
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
      </div>
    </div>
  );
}
