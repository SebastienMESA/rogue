// app/game/choose-card/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/gameStore";

export default function ChooseCardPage() {
  const router = useRouter();
  const {
    players,
    currentPlayerIndex,
    selectedPartnerId,
    phase,
    hands,
    dealHandFor,
    chooseCard,
  } = useGameStore();

  // determine which player must choose now
  const current = players[currentPlayerIndex];
  const firstPlayerId = current?.id;
  const secondPlayerId = selectedPartnerId ?? null;

  // who is chooser now
  const chooserId =
    phase === "choose-card-first" ? firstPlayerId : secondPlayerId;

  // when entering page, if chooser has no hand yet, deal (safe)
  useEffect(() => {
    if (!chooserId) return;
    if (!hands[chooserId]) {
      // deal for chooser (store method handles deck)
      dealHandFor(chooserId);
    }
  }, [chooserId, hands, dealHandFor]);

  // if phase not be choose-card -> redirect appropriately
  useEffect(() => {
    if (phase === "choose-partner") {
      router.push("/game/choose-partner");
      return;
    }
    if (phase === "reveal") router.push("/game/reveal");
  }, [phase, router]);

  if (!chooserId) {
    return (
      <main className="p-6">
        <p>Pas de joueur sélectionné — redirection...</p>
      </main>
    );
  }

  const hand = hands[chooserId] ?? [];

  const [revealed, setRevealed] = useState<boolean>(false);

  return (
    <main className="min-h-screen p-6">
      <h2 className="text-xl font-bold mb-4">
        {players.find((p) => p.id === chooserId)?.name}, choisissez une carte
      </h2>

      <p className="mb-4 text-sm text-gray-500">
        Cliquez sur une carte pour la retourner, puis sélectionnez-la.
      </p>

      <div className="flex gap-4">
        {hand.map((c, i) => (
          <div key={i} className="w-24 h-36 perspective">
            <button
              onClick={() => {
                setRevealed(true);
              }}
              className="w-full h-full rounded-md bg-gray-700 flex items-center justify-center text-white"
            >
              {/* face-down while !revealed, reveal value when revealed */}
              {!revealed ? (
                <span>?</span>
              ) : (
                <div className="text-lg">
                  {c === "success" ? "Succès" : "Échec"}
                </div>
              )}
            </button>

            {revealed && (
              <button
                onClick={() => {
                  chooseCard(chooserId, i);
                  // if we reveal then choose, phase progression is handled by store
                }}
                className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md"
              >
                Choisir cette carte
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
