import { Rank } from "./rank";

export type CategorySchema = {
  name: string;
  imgUrl: string;
  description: string;
  ranks: string[] | Rank[];
};

export type Category = CategorySchema & {
  _id: string;
};

export type Categories = Category[];

export type CategoryWithRanks = Omit<Category, "ranks"> & { ranks: Rank[] };

export type CategoriesWithRanks = CategoryWithRanks[];
