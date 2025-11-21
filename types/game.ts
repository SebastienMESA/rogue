import type { Player } from "@/types/player";

export type GameStore = {
  players: Player[];
  playerCount: number;
  gold: number;
  suspicion: number;
  turn: number;
  setPlayerCount: (n: number) => void;
  startGame: () => void;
};
