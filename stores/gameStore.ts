import { create } from "zustand";
import type { Player } from "@/types/player";
import type { GameStore } from "@/types/game";

export const useGameStore = create<GameStore>((set) => ({
  players: [],
  playerCount: 4,
  gold: 0,
  suspicion: 0,
  turn: 1,

  setPlayerCount: (n) => set({ playerCount: n }),

  startGame: () =>
    set((state) => {
      const players: Player[] = [];

      const agentCount = 1; // pour l’instant fixe

      // Générer les voleurs
      for (let i = 0; i < state.playerCount; i++) {
        players.push({
          id: crypto.randomUUID(),
          name: `Joueur ${i + 1}`,
          role: "thief",
          imprisoned: false,
        });
      }

      // Convertir un joueur aléatoire → agent infiltré
      const index = Math.floor(Math.random() * state.playerCount);
      players[index].role = "agent";

      return {
        players,
        gold: 0,
        suspicion: 0,
        turn: 1,
      };
    }),
}));
