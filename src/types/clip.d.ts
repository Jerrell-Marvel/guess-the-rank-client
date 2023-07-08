export type ClipSchema = {
  link: string;
  actualRank: string | Rank;
  category: string | Category;
  status: "pending" | "verified";
  createdBy: string | User;
};

export type Clip = ClipSchema & {
  _id: string;
};

export type Clips = Clip[];

export type ClipWithRanks = Omit<Omit<ClipSchema, "category">, "actualRank"> & { actualRank: string; category: CategoryWithRanks };

export type ClipWithActualRank = Omit<ClipSchema, "actualRank"> & { actualRank: Rank };

export type ClipWithRanksAndActualRank = Omit<Omit<ClipSchema, "category">, "actualRank"> & { actualRank: Rank; category: CategoryWithRanks };
