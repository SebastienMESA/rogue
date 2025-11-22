// app/game/reveal/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/stores/gameStore";

export default function RevealPage() {
  const router = useRouter();
  const {
    players,
    currentPlayerIndex,
    selectedPartnerId,
    phase,
    choices,
    resolveVol,
    gold,
    suspicion,
  } = useGameStore();

  useEffect(() => {
    if (phase !== "reveal") {
      // redirect to appropriate phase
      if (phase === "choose-partner") router.push("/game/choose-partner");
      if (phase === "choose-card-first" || phase === "choose-card-second")
        router.push("/game/choose-card");
    }
  }, [phase, router]);

  if (!selectedPartnerId) {
    return (
      <main className="p-6">
        <p>Aucun partenaire sélectionné — redirection...</p>
      </main>
    );
  }

  const current = players[currentPlayerIndex];
  const partner = players.find((p) => p.id === selectedPartnerId)!;
  const a = choices[current.id];
  const b = choices[partner.id];

  const result =
    a === "success" && b === "success"
      ? "Succès ! +1 or"
      : "Échec… +1 suspicion";

  return (
    <main className="min-h-screen p-6">
      <h2 className="text-xl font-bold mb-4">Résultat du vol</h2>

      <div className="mb-4">
        <p>
          {current.name} a choisi : <strong>{a ?? "—"}</strong>
        </p>
        <p>
          {partner.name} a choisi : <strong>{b ?? "—"}</strong>
        </p>
      </div>

      <div className="mb-6">
        <p className="text-lg font-semibold">{result}</p>
        <p className="text-sm text-gray-500">
          Or : {gold} — Suspicion : {suspicion}
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => {
            // resolveVol will update gold/suspicion and advance to next player/phase
            resolveVol();
            router.push("/game/choose-partner");
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Continuer
        </button>
      </div>
    </main>
  );
}
