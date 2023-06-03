import { Rank } from "./rank";

export type Guess = {
  count: number;
  rank: Rank;
  percentage: string;
};

export type Guesses = Guess[];
