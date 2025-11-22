// /stores/gameStore.ts
"use client";

import { create } from "zustand";
import type { Player } from "@/types/player";
import type { Card as CardType } from "@/types/card";

export type Phase =
  | "choose-partner"
  | "choose-card-first"
  | "choose-card-second"
  | "reveal";

export type GameStore = {
  // players & configuration
  players: Player[];
  playerCount: number;
  agentCount: number;
  goldLimit: number;
  suspicionLimit: number;

  // runtime
  gold: number;
  suspicion: number;
  turn: number; // 1..T
  currentPlayerIndex: number; // index of who must choose partner

  // vol state
  phase: Phase;
  selectedPartnerId: string | null;
  hands: Record<string, CardType[]>;
  choices: Record<string, CardType | null>;

  // API
  setPlayerCount: (n: number) => void;
  setPlayerName: (id: string, name: string) => void;
  setAgentCount: (n: number) => void;
  setGoldLimit: (n: number) => void;
  setSuspicionLimit: (n: number) => void;

  startSetup: () => void; // initialize players array for setup
  startGame: () => void; // assigns roles and resets scores

  // vol flow
  choosePartner: (partnerId: string) => void;
  dealHandFor: (playerId: string) => void;
  chooseCard: (playerId: string, cardIndex: number) => void;
  resolveVol: () => void;

  // helpers
  resetDeck: () => void;
  drawThree: () => CardType[];
};

const T = 16;
const F = 8;

function shuffle<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export const useGameStore = create<GameStore>((set, get) => {
  // internal deck (reset per vol)
  let deck: CardType[] = [];

  const resetDeckInternal = () => {
    deck = [];
    for (let i = 0; i < T - F; i++) deck.push("success");
    for (let i = 0; i < F; i++) deck.push("fail");
    shuffle(deck);
  };

  return {
    // defaults / config
    players: [],
    playerCount: 4,
    agentCount: 1,
    goldLimit: 4 * 4, // example default (4 * N) but will be set on setup
    suspicionLimit: 4,
    // runtime
    gold: 0,
    suspicion: 0,
    turn: 1,
    currentPlayerIndex: 0,
    phase: "choose-partner",
    selectedPartnerId: null,
    hands: {},
    choices: {},

    // setters
    setPlayerCount: (n) =>
      set((s) => {
        const players: Player[] = [];
        for (let i = 0; i < n; i++) {
          players.push({
            id: s.players[i]?.id ?? crypto.randomUUID(),
            name: s.players[i]?.name ?? `Joueur ${i + 1}`,
            role: s.players[i]?.role ?? null,
            imprisoned: s.players[i]?.imprisoned ?? false,
          });
        }
        return {
          playerCount: n,
          players,
          goldLimit: 4 * n, // sensible default
          suspicionLimit: n,
        };
      }),

    setPlayerName: (id, name) =>
      set((s) => ({
        players: s.players.map((p) => (p.id === id ? { ...p, name } : p)),
      })),

    setAgentCount: (n) => set({ agentCount: n }),
    setGoldLimit: (n) => set({ goldLimit: n }),
    setSuspicionLimit: (n) => set({ suspicionLimit: n }),

    startSetup: () =>
      set((s) => {
        // ensure players array exists with correct length
        const players: Player[] = [];
        for (let i = 0; i < s.playerCount; i++) {
          players.push({
            id: s.players[i]?.id ?? crypto.randomUUID(),
            name: s.players[i]?.name ?? `Joueur ${i + 1}`,
            role: s.players[i]?.role ?? null,
            imprisoned: s.players[i]?.imprisoned ?? false,
          });
        }
        return { players };
      }),

    startGame: () =>
      set((s) => {
        // assign default names if empty
        const players: Player[] = s.players.map((p, i) => ({
          id: p.id ?? crypto.randomUUID(),
          name: p.name?.trim() ? p.name : `Joueur ${i + 1}`,
          role: "thief",
          imprisoned: false,
        }));

        // choose agentCount random unique indices
        let indices = Array.from({ length: s.playerCount }, (_, i) => i);
        for (let i = 0; i < s.agentCount; i++) {
          const rand = Math.floor(Math.random() * indices.length);
          const idx = indices[rand];
          players[idx].role = "agent";
          indices.splice(rand, 1);
        }

        // reset runtime
        resetDeckInternal(); // not strictly necessary here
        return {
          players,
          gold: 0,
          suspicion: 0,
          turn: 1,
          currentPlayerIndex: 0,
          phase: "choose-partner",
          selectedPartnerId: null,
          hands: {},
          choices: {},
        };
      }),

    // vol flow
    choosePartner: (partnerId) =>
      set((s) => {
        // partner chosen by current player
        // reset deck and deal hand for current player
        resetDeckInternal();
        const current = s.players[s.currentPlayerIndex];
        const hands = { ...s.hands };
        // draw three for current player
        const hand = [deck.pop()!, deck.pop()!, deck.pop()!];
        hands[current.id] = shuffle(hand.slice());
        return {
          selectedPartnerId: partnerId,
          hands,
          phase: "choose-card-first",
        };
      }),

    dealHandFor: (playerId) =>
      set((s) => {
        const hands = { ...s.hands };
        const hand = [deck.pop()!, deck.pop()!, deck.pop()!];
        hands[playerId] = shuffle(hand.slice());
        return { hands };
      }),

    chooseCard: (playerId, cardIndex) =>
      set((s) => {
        const choices = { ...s.choices };
        const hand = s.hands[playerId] ?? [];
        const chosen = hand[cardIndex];
        choices[playerId] = chosen;
        // if first player just chose -> move to second & deal for partner
        const currentPlayer = s.players[s.currentPlayerIndex];
        if (playerId === currentPlayer.id) {
          // deal for partner next
          const partnerId = s.selectedPartnerId!;
          // if no cards dealt yet for partner, deal
          if (!s.hands[partnerId]) {
            // draw 3 now
            const newHand = [deck.pop()!, deck.pop()!, deck.pop()!];
            const hands = { ...s.hands, [partnerId]: shuffle(newHand.slice()) };
            return { choices, hands, phase: "choose-card-second" };
          } else {
            return { choices, phase: "choose-card-second" };
          }
        } else {
          // second player chose -> go to reveal
          return { choices, phase: "reveal" };
        }
      }),

    resolveVol: () =>
      set((s) => {
        const current = s.players[s.currentPlayerIndex];
        const partnerId = s.selectedPartnerId!;
        const partner = s.players.find((p) => p.id === partnerId)!;

        const a = s.choices[current.id];
        const b = s.choices[partnerId];

        let gold = s.gold;
        let suspicion = s.suspicion;

        if (a === "success" && b === "success") {
          gold += 1;
        } else {
          suspicion += 1;
        }

        // clear hands & choices for those players
        const hands = { ...s.hands };
        delete hands[current.id];
        delete hands[partnerId];

        const choices: Record<string, CardType | null> = { ...s.choices };
        delete choices[current.id];
        delete choices[partnerId];

        // advance currentPlayerIndex to next non-imprisoned player
        const players = s.players;
        let nextIndex = s.currentPlayerIndex;
        for (let i = 1; i <= players.length; i++) {
          const idx = (s.currentPlayerIndex + i) % players.length;
          if (!players[idx].imprisoned) {
            nextIndex = idx;
            break;
          }
        }

        // reset deck variable for next vol
        resetDeckInternal();

        return {
          gold,
          suspicion,
          hands,
          choices,
          selectedPartnerId: null,
          phase: "choose-partner",
          currentPlayerIndex: nextIndex,
        };
      }),

    // helpers
    resetDeck: () => {
      resetDeckInternal();
      return;
    },
    drawThree: () => {
      if (!deck || deck.length < 3) resetDeckInternal();
      return [deck.pop()!, deck.pop()!, deck.pop()!];
    },
  };
});
