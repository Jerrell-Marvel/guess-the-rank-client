import { CategoriesWithRanks, Category, CategoryWithRanks } from "@/types/category";
import { useState } from "react";
import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";

type CategoriesDropdownProps = {
  onItemClick: (category: CategoryWithRanks) => void;
};

const CategoriesDropdown = ({ onItemClick }: CategoriesDropdownProps) => {
  const [isActive, setIsActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories } = useQuery<CategoriesWithRanks, AxiosError>({
    queryKey: ["categories", "ranks"],
    queryFn: async () => {
      const response = await axios.get<CategoriesWithRanks>("http://localhost:5000/api/v1/categories", {
        params: {
          ranks: "true",
        },
      });
      const data = response.data;
      return data;
    },
  });

  // console.log(categories);

  return (
    <div className="py-2 relative">
      <label
        className="mb-2 block"
        htmlFor="game"
      >
        Game *
      </label>
      <div
        id="game"
        className="flex items-center justify-between py-3 cursor-pointer bg-slate-800 px-3 rounded-md"
        onClick={() => {
          setIsActive((prev) => !prev);
          //   setIsCategoryActive((prev) => !prev);
          //   setIsRankActive(false);
        }}
      >
        <span className="capitalize">{selectedCategory ? selectedCategory : "Select game"}</span>
        <i className="h-3 w-3 -mt-[3px] border-r-2 border-b-2 border-white rotate-45 ml-1"></i>
      </div>

      {isActive ? (
        <ul className="p-3 flex flex-col gap-3 w-full bg-slate-800 mt-2 rounded-md absolute max-h-[244px] overflow-auto z-50">
          {categories?.map((category) => {
            return (
              <li
                className="w-full py-3 px-3 border-[1px] border-white rounded-sm capitalize cursor-pointer hover:bg-slate-600"
                key={category.name}
                onClick={() => {
                  setSelectedCategory(category.name);
                  setIsActive(false);
                  onItemClick(category);
                  //   setSelectedCategory(category);
                  //   setIsCategoryActive(false);
                  //   setSelectedRank(null);
                }}
              >
                {category.name}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default CategoriesDropdown;
