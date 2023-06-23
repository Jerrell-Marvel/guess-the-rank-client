export type RankSchema = {
  name: string;
  imgUrl: string;
};

export type Rank = RankSchema & {
  _id: string;
};
