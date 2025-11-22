"use client";

import { useGameStore } from "@/stores/gameStore";

export default function GamePage() {
  const { players, gold, suspicion, turn } = useGameStore();

  return (
    <main className="p-6">
      <h2 className="text-2xl font-bold">Tour {turn}</h2>

      <p className="flex items-center">
        {gold}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-circle-dollar-sign-icon lucide-circle-dollar-sign text-yellow-500 inline-block mr-1"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
          <path d="M12 18V6" />
        </svg>
      </p>
      <p>Suspicion : {suspicion}</p>

      <h3 className="mt-6 text-xl font-semibold">Joueurs</h3>
      <ul className="mt-2 space-y-1">
        {players.map((p) => (
          <li key={p.id}>
            {p.name} — <em>{p.role}</em>
          </li>
        ))}
      </ul>
    </main>
  );
}
