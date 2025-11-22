import type { Player } from "@/types/player";

export type GameStore = {
  players: Player[];
  playerCount: number;

  agentCount: number;
  goldLimit: number;
  suspicionLimit: number;

  gold: number;
  suspicion: number;
  turn: number;

  setPlayerCount: (n: number) => void;
  setPlayerName: (id: string, name: string) => void;

  setAgentCount: (n: number) => void;
  setGoldLimit: (n: number) => void;
  setSuspicionLimit: (n: number) => void;

  startGame: () => void;
};
