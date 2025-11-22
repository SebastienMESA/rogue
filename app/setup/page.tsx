"use client";

import { useGameStore } from "@/stores/gameStore";
import { useRouter } from "next/navigation";

export default function SetupPage() {
  const router = useRouter();

  const {
    playerCount,
    players,
    agentCount,
    goldLimit,
    suspicionLimit,

    setPlayerName,
    setAgentCount,
    setGoldLimit,
    setSuspicionLimit,

    startGame,
  } = useGameStore();

  const handleStart = () => {
    startGame();
    router.push("/game/choose-card");
  };

  return (
    <main className="min-h-screen p-6 space-y-6">
      <h1 className="text-2xl font-bold text-center">Configuration</h1>

      {/* Noms des joueurs */}
      <section className="space-y-3">
        <h2 className="font-semibold">Noms des joueurs</h2>
        <div className="space-y-2">
          {Array.from({ length: playerCount }).map((_, i) => {
            // players may be uninitialized during prerender/build; provide safe defaults
            const p = players[i] ?? { id: `player-${i}`, name: "" };

            return (
              <input
                key={p.id}
                type="text"
                placeholder={`Joueur ${i + 1}`}
                value={p.name}
                onChange={(e) => setPlayerName(p.id, e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            );
          })}
        </div>
      </section>

      {/* Paramètres de partie */}
      <section className="space-y-3">
        <h2 className="font-semibold">Paramètres</h2>

        <label className="block">
          Nombre d’agents infiltrés :
          <input
            type="number"
            min={1}
            max={Math.floor(playerCount / 2)}
            value={agentCount}
            onChange={(e) => setAgentCount(Number(e.target.value))}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </label>

        <label className="block">
          Limite d’or pour la victoire des voleurs:
          <input
            type="number"
            min={1}
            max={50}
            value={goldLimit}
            onChange={(e) => setGoldLimit(Number(e.target.value))}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </label>

        <label className="block">
          Limite de suspicion pour la victoire des agents :
          <input
            type="number"
            min={1}
            max={20}
            value={suspicionLimit}
            onChange={(e) => setSuspicionLimit(Number(e.target.value))}
            className="mt-1 w-full border rounded-md px-3 py-2"
          />
        </label>
      </section>

      <button
        onClick={handleStart}
        className="w-full bg-blue-600 text-white py-3 rounded-md text-lg"
      >
        Démarrer la partie
      </button>
    </main>
  );
}
