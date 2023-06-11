import { Rank } from "./rank";

export type Category = {
  _id: string;
  name: string;
  description: string;
  ranks: Rank[];
  imgUrl: string;
};

export type Categories = Category[];
