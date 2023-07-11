import { CategoriesWithRanks, Category, CategoryWithRanks } from "@/types/category";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { Rank, Ranks } from "@/types/rank";

type CategoriesDropdownProps = {
  onClick: () => void;
  onItemClick: (rank: Rank) => void;
  ranks: Ranks;
};

const RanksDropdown = ({ onItemClick, ranks, onClick }: CategoriesDropdownProps) => {
  const [isActive, setIsActive] = useState(false);
  const [selectedRank, setSelectedRank] = useState<string | null>(null);

  // console.log(categories);

  useEffect(() => {
    setSelectedRank(null);
  }, [ranks]);

  return (
    <div className="py-2 relative">
      <label
        className="mb-2 block"
        htmlFor="game"
      >
        Rank *
      </label>
      <div
        id="game"
        className="flex items-center justify-between py-3 cursor-pointer bg-slate-800 px-3 rounded-md"
        onClick={() => {
          setIsActive((prev) => !prev);
          onClick();
          //   setIsCategoryActive((prev) => !prev);
          //   setIsRankActive(false);
        }}
      >
        <span className="capitalize">{selectedRank ? selectedRank : "Select rank"}</span>
        <i className="h-3 w-3 -mt-[3px] border-r-2 border-b-2 border-white rotate-45 ml-1"></i>
      </div>

      {isActive ? (
        <ul className="p-3 flex flex-col gap-3 w-full bg-slate-800 mt-2 rounded-md absolute max-h-[244px] overflow-auto z-50">
          {ranks.map((rank) => {
            return (
              <li
                className="w-full py-3 px-3 border-[1px] border-white rounded-sm capitalize cursor-pointer hover:bg-slate-600"
                key={rank.name}
                onClick={() => {
                  setSelectedRank(rank.name);
                  setIsActive(false);
                  onItemClick(rank);
                  //   setselectedRank(category);
                  //   setIsCategoryActive(false);
                  //   setSelectedRank(null);
                }}
              >
                {rank.name}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default RanksDropdown;
