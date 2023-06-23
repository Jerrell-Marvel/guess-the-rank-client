import { Rank } from "./rank";

export type GuessSchema = {
  clip: string;
  rankGuess: string;
};

type Guess = {
  count: number;
  rank: Rank;
};

export type Guesses = Guess[];

type GuessWithPercentage = Guess & { percentage: string };

export type GuessesWithPercentage = GuessWithPercentage[];
