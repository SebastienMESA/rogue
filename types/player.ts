export type Role = "thief" | "agent";

export type Player = {
  id: string;
  name: string;
  role: Role | null;
  imprisoned: boolean;
};
