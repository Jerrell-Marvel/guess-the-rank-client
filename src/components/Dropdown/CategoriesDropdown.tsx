import { CategoriesWithRanks, Category, CategoryWithRanks } from "@/types/category";
import { use, useEffect, useState, Dispatch, SetStateAction } from "react";
import { useQuery } from "react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";

type CategoriesDropdownProps = {
  onClick: () => void;
  onItemClick: (category: CategoryWithRanks) => void;
  isActive: boolean;
  activeCategory: CategoryWithRanks | null;
  setActiveCategory?: Dispatch<SetStateAction<CategoryWithRanks | null>>;
  allowQueryParam?: boolean;
};

const CategoriesDropdown = ({ onItemClick, isActive, onClick, activeCategory, allowQueryParam = false, setActiveCategory }: CategoriesDropdownProps) => {
  // const [isActive, setIsActive] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState<CategoryWithRanks | null | undefined>(activeCategory);

  const router = useRouter();

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

  useEffect(() => {
    // console.log("==========================");
    // console.log(router.isReady);
    // console.log(categories);
    // console.log(allowQueryParam);
    // console.log(setActiveCategory);
    if (allowQueryParam && router.isReady && router.query.categoryId && categories && setActiveCategory) {
      console.log("here");
      const activeCategory = categories.find((category) => category._id === router.query.categoryId);
      if (activeCategory) {
        setActiveCategory(activeCategory);
      }
    }
    // if (router.query.status === "pending") {
    //   setActiveStatus("pending");
    // }
  }, [allowQueryParam, router.isReady, setActiveCategory, router.query.categoryId, categories]);

  // useEffect(() => {
  //   if (activeCategory) {
  //     setSelectedCategory(activeCategory);
  //   }
  // }, [activeCategory]);

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
          onClick();
          //   setIsActive((prev) => !prev);
          //   setisActive((prev) => !prev);
          //   setIsRankActive(false);
        }}
      >
        {/* <div>{JSON.stringify(selectedCategory)}</div> */}
        <span className="capitalize">{activeCategory ? activeCategory.name : "Select game"}</span>
        <i className="h-3 w-3 -mt-[3px] border-r-2 border-b-2 border-white rotate-45 ml-1"></i>
      </div>

      {isActive ? (
        <ul className="p-3 flex flex-col gap-3 w-full bg-slate-800 mt-2 rounded-md absolute max-h-[244px] overflow-auto z-50">
          {categories?.map((category) => {
            return (
              <li
                className="w-full py-3 px-3 rounded-sm capitalize cursor-pointer hover:bg-slate-600 bg-slate-700"
                key={category.name}
                onClick={() => {
                  // setSelectedCategory(category);
                  // setIsActive(false);
                  onItemClick(category);
                  //   setSelectedCategory(category);
                  //   setisActive(false);
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
