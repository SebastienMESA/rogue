// app/game/choose-partner/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGameStore } from "@/stores/gameStore";

export default function ChoosePartnerPage() {
  const router = useRouter();
  const { players, currentPlayerIndex, phase, choosePartner, startGame } =
    useGameStore();

  // if game not started, redirect to setup (safety)
  useEffect(() => {
    if (!players || players.length === 0) {
      router.push("/");
    }
  }, [players, router]);

  // auto-redirect if phase changed
  useEffect(() => {
    if (phase !== "choose-partner") {
      router.push("/game/choose-card");
    }
  }, [phase, router]);

  const current = players[currentPlayerIndex];

  return (
    <main className="min-h-screen p-6">
      <h2 className="text-xl font-bold mb-4">
        {current?.name ?? "Joueur"}, c'est à toi de jouer
      </h2>

      <div className="grid grid-cols-1 gap-3 max-w-md">
        {players
          .filter((p) => p.id !== current.id && !p.imprisoned)
          .map((p) => (
            <button
              key={p.id}
              onClick={() => {
                choosePartner(p.id);
                // navigate will be triggered by phase watcher in store effect
                router.push("/game/choose-card");
              }}
              className="w-full bg-gray-800 text-white py-3 rounded-md"
            >
              {p.name}
            </button>
          ))}
      </div>
    </main>
  );
}
