import { Rank } from "./rank";

export type Category = {
  _id: string;
  name: string;
  description: string;
  ranks: Rank[];
};

export type Categories = Category[];
