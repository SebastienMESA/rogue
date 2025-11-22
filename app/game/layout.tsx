"use client";

import { useGameStore } from "@/stores/gameStore";
import Link from "next/link";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { gold, suspicion, goldLimit, suspicionLimit, turn } = useGameStore();

  // Pour un affichage simple : 5 tours au total
  const totalTurns = 5; // tu pourras le mettre dans le store plus tard

  return (
    <div className="min-h-screen flex flex-col">
      {/* Barre d’état */}
      <div className="w-full bg-black text-white py-3 px-4 flex justify-end gap-6 text-sm">
        <div>
          <strong>Tour :</strong> {turn}/{totalTurns}
        </div>

        <div>
          <strong>Or :</strong> {gold} / {goldLimit}
        </div>

        <div>
          <strong>Suspicion :</strong> {suspicion} / {suspicionLimit}
        </div>
      </div>

      {/* Contenu des pages */}
      <div className="flex-1">{children}</div>
    </div>
  );
}
