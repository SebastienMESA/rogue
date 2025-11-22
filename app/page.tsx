"use client";

import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/gameStore";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const setPlayerCount = useGameStore((s) => s.setPlayerCount);
  const startGame = useGameStore((s) => s.startGame);

  const [count, setCount] = useState(4);

  const handleStart = () => {
    setPlayerCount(count);
    startGame();
    router.push("/setup");
  };

  return (
    <main className="min-h-screen flex flex-col px-6 pb-8">
      <header className="pt-6">
        <h1 className="text-3xl font-bold text-center">Rogue</h1>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center gap-6">
        <img
          src="/images/thief.svg"
          alt="Illustration d'un voleur"
          className="w-40 h-40 sm:w-56 sm:h-56"
        />

        <div className="text-center">
          <p className="text-lg font-medium">Combien de joueurs ?</p>

          <div className="mt-4 flex flex-col items-center gap-4 w-full max-w-xs">
            <input
              type="number"
              min={4}
              max={8}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full text-center border rounded-md px-3 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleStart}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md text-base"
            >
              Commencer la partie
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
