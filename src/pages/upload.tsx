import { Categories, CategoriesWithRanks, Category, CategoryWithRanks } from "@/types/category";
import { AxiosError } from "axios";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import { Rank } from "@/types/rank";
import { youtubeParser } from "@/utils/youtubeParser";
import { Clip } from "@/types/clip";
import CategoriesDropdown from "@/components/Dropdown/CategoriesDropdown";

type SubmitClipFnParams = {
  ytLink: string;
  rank: string;
  category: string;
};

const games = ["Valorant", "Cs Go", "Fortnite", "Rocket Leagues", "Apex Legends", "Overwatch"];
const Upload = () => {
  const [isCategoryActive, setIsCategoryActive] = useState(false);
  const [isRankActive, setIsRankActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithRanks | null>(null);
  const [selectedRank, setSelectedRank] = useState<Rank | null>(null);

  const [ytLink, setYtLink] = useState("");
  const [validYtLinkId, setValidYtLinkId] = useState("");

  // const pRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ytId = youtubeParser(ytLink);
    if (ytId) {
      setValidYtLinkId(ytId);
    }
    console.log(validYtLinkId);
  }, [ytLink]);

  // const { data: categories } = useQuery<CategoriesWithRanks, AxiosError>({
  //   queryKey: ["categories"],
  //   queryFn: async () => {
  //     const response = await axios.get<CategoriesWithRanks>("http://localhost:5000/api/v1/categories", {
  //       params: {
  //         ranks: "true",
  //       },
  //     });
  //     const data = response.data;
  //     return data;
  //   },
  // });

  const { mutate: submitClip } = useMutation<Clip, AxiosError, SubmitClipFnParams>({
    mutationFn: async ({ category, rank, ytLink }) => {
      const response = await axios.post<Clip>("http://localhost:5000/api/v1/clip", { link: ytLink, actualRank: rank, category }, { withCredentials: true });
      const data = response.data;
      return data;
    },
  });

  const handleCategoryItemClick = (category: CategoryWithRanks) => {
    setSelectedCategory(category);
    setSelectedRank(null);
  };

  // console.log(selectedCategory);

  return (
    <div className="min-h-screen flex items-center md:items-start">
      <div className="bg-slate-950 spacing-x spacing-y text-white grid grid-cols-1 md:grid-cols-5 gap-4 w-full">
        {/* yt frame */}
        <div className="flex items-center w-full md:col-[1/4] md:items-start flex-col">
          <div className="w-full bg-red-200 aspect-[560/315]">
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${validYtLinkId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>

        <div className="flex w-full items-center md:col-[4/6] h-fit flex-col">
          <form
            className="flex flex-col w-full max-w-sm md:max-w-none"
            onSubmit={(e) => {
              e.preventDefault();

              if (selectedRank && selectedCategory && validYtLinkId) {
                submitClip({ rank: selectedRank._id, category: selectedCategory._id, ytLink: `https://youtu.be/${validYtLinkId}` });
              }
            }}
          >
            {/* Form item */}

            <CategoriesDropdown onItemClick={handleCategoryItemClick} />

            {selectedCategory ? (
              <>
                <div className="py-2 relative">
                  <label
                    className="mb-2 block"
                    htmlFor="youtube-link"
                  >
                    Youtube Link *
                  </label>
                  <input
                    id="#youtube-link"
                    type="text"
                    className="w-full py-3 px-3 bg-slate-800 rounded-md focus:outline-none"
                    placeholder="e.g: youtube.com/pMoL2URoqhI"
                    onChange={(e) => {
                      setYtLink(e.target.value);
                    }}
                    value={ytLink}
                  />
                </div>

                <div className="py-2 relative">
                  <label
                    className="mb-2 block"
                    htmlFor="rank"
                  >
                    Rank *
                  </label>
                  <div
                    id="rank"
                    className="flex items-center justify-between py-3 cursor-pointer bg-slate-800 px-3 rounded-md"
                    onClick={() => {
                      setIsRankActive((prev) => !prev);
                      setIsCategoryActive(false);
                    }}
                  >
                    <span className="capitalize">{selectedRank ? selectedRank.name : "Select rank"}</span>
                    <i className="h-3 w-3 -mt-[3px] border-r-2 border-b-2 border-white rotate-45 ml-1"></i>
                  </div>

                  {isRankActive ? (
                    <ul className="p-3 flex flex-col gap-3 w-full bg-slate-800 mt-2 rounded-md absolute max-h-[244px] overflow-auto z-50">
                      {selectedCategory.ranks.map((rank) => {
                        return (
                          <li
                            className="w-full py-3 px-3 border-[1px] border-white rounded-sm capitalize cursor-pointer hover:bg-slate-600"
                            key={rank.name}
                            onClick={() => {
                              setSelectedRank(rank);
                              setIsRankActive(false);
                            }}
                          >
                            {rank.name}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              </>
            ) : null}

            <div className="flex justify-center my-3 md:justify-end">
              <button className="px-8 py-2 rounded-md bg-slate-800 w-fit hover:text-blue-400">Submit</button>
            </div>
          </form>

          <div className=" text-center mt-2">
            <h3 className="font-bold text-xl md:text-2xl mb-2">Guideline for clip submissions</h3>

            <ul className="flex flex-col gap-1 text-md md:text-lg">
              <li>Make sure your clip is not private</li>
              <li>8-60 seconds length</li>
              <li>720p minimum quality</li>
              <li>No music in background</li>
              <li>No black border on the edge</li>
              <li>No act rank gun buddies</li>
            </ul>

            <h3 className="font-bold text-lg md:text-xl mt-2">By submitting a clip you are allowing us to use it wihin the app.</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
