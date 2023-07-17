import { Categories, CategoriesWithRanks, Category, CategoryWithRanks } from "@/types/category";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { Clip, ClipWithActualRank, Clips } from "@/types/clip";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { addQueryParams } from "@/utils/AddQueryParams";
import { youtubeParser } from "@/utils/youtubeParser";
import { Guesses, GuessesWithPercentage } from "@/types/guess";
import { Rank } from "@/types/rank";
import StatusDropdown from "@/components/Dropdown/StatusDropdown";
import CategoriesDropdown from "@/components/Dropdown/CategoriesDropdown";

const status = ["pending", "verified"];
type GetClipDetailsResponse = { clip: ClipWithActualRank; guesses: GuessesWithPercentage; totalGuesses: number };

type ClipDetailsResponse = {
  // guesses: Guesses;
  // total: number;
  // isCorrect: boolean;
  ranks: {
    _id: string;
    name: string;
    imgUrl: string;
    count: number;
    percentage: string;
  }[];
};

type A = {
  clip: ClipWithActualRank;
  totalGuesses: number;
  rankGuesses: {
    count: number;
    percentage: string;
    _id: string;
    name: string;
    imgUrl: string;
  }[];
};

const AdminPage = () => {
  const router = useRouter();
  //   const queryClient = useQueryClient();
  const [activeStatus, setActiveStatus] = useState<"pending" | "verified">("pending");
  const [isStatusActive, setIsStatusActive] = useState(false);
  const [isCategoryActive, setIsCategoryActive] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithRanks | null>(null);
  const [isClipDetailActive, setIsClipDetailActive] = useState(false);

  const queryClient = useQueryClient();

  // const { data: categories } = useQuery<CategoriesWithRanks>({
  //   queryKey: ["categories", "ranks"],
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

  useEffect(() => {
    if (router.query.status === "verified") {
      setActiveStatus("verified");
    }
  }, [router.isReady]);

  const { data: clips } = useQuery<Clips>({
    queryKey: ["clips", selectedCategory?.name, activeStatus],
    queryFn: async () => {
      const response = await axios.get<Clips>("http://localhost:5000/api/v1/clips", {
        withCredentials: true,
        params: {
          categoryId: selectedCategory?._id,
          status: activeStatus,
        },
      });
      const data = response.data;
      return data;
    },
    enabled: !!selectedCategory,
  });

  const { data: clipDetails, mutate: getClipDetails } = useMutation<A, AxiosError, string>({
    mutationFn: async (clipId) => {
      const response = await axios.get<GetClipDetailsResponse>(`http://localhost:5000/api/v1/clip/details/${clipId}`, { withCredentials: true });

      const data = response.data;

      const rankGuesses = selectedCategory!.ranks.map((rank) => {
        const rankData = data.guesses.find((e) => e.rank._id == rank._id);
        return { ...rank, count: rankData?.count || 0, percentage: rankData?.percentage || "0" };
      });

      const result = { clip: data.clip, rankGuesses, totalGuesses: data.totalGuesses };
      return result;
    },

    onSuccess: () => {
      setIsClipDetailActive(true);
    },
  });

  const { data: verifyClipResponse, mutate: verifyClip } = useMutation<Clip, AxiosError, string>({
    mutationFn: async (clipId) => {
      const response = await axios.post<Clip>(`http://localhost:5000/api/v1/clip/verify/${clipId}`, null, { withCredentials: true });
      const data = response.data;
      return data;
    },

    onSuccess: (_res, clipId) => {
      console.log(["category", router.query.category, "pending"]);
      const clips = queryClient.getQueryData<Clips>(["clips", selectedCategory?.name, "pending"]);

      if (clips) {
        const tempClips = clips
          .map((clip) => {
            return { ...clip };
          })
          .filter((clip) => {
            return clip._id !== clipId;
          });

        console.log(tempClips);

        queryClient.setQueryData<Clips>(["clips", selectedCategory?.name, "pending"], tempClips);
      }
    },
  });

  const handleCategoryClick = () => {
    setIsCategoryActive((prev) => !prev);
    setIsStatusActive(false);
  };

  const handleCategoryItemClick = (category: CategoryWithRanks) => {
    setSelectedCategory(category);

    const newUrl = addQueryParams(window.location.href, "categoryId", category._id);
    router.push(newUrl);

    setIsCategoryActive(false);
  };

  const handleStatusClick = () => {
    setIsStatusActive((prev) => !prev);
    setIsCategoryActive(false);
  };

  const handleStatusItemClick = (stat: "pending" | "verified") => {
    setIsStatusActive(false);
    setActiveStatus(stat);
    const newUrl = addQueryParams(window.location.href, "status", stat);
    router.push(newUrl);
  };

  return (
    <>
      {clipDetails && isClipDetailActive ? (
        <div className="bg-slate-950 fixed top-0 left-0 right-0 bottom-0 bg-opacity-40 flex justify-center items-center page-spacing-x page-spacing-y z-[99]">
          <div className="w-[85%] md:w-1/2 max-w-[640px] max-h-[80vh] bg-slate-800 p-6 text-white rounded-md relative">
            <svg
              fillRule="evenodd"
              strokeLinejoin="round"
              strokeMiterlimit="2"
              width={32}
              height={32}
              fill="white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-6 top-6 cursor-pointer"
              onClick={() => {
                setIsClipDetailActive(false);
              }}
            >
              <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
            </svg>

            <h3 className="text-paragraph font-semibold">Clip Details</h3>

            <div className="text-md md:text-lg my-2 text-slate-400 flex gap-2">
              <div>Total guesses : {clipDetails.totalGuesses}</div>
              <span>|</span>
              <div>Actual rank : {clipDetails.clip.actualRank.name}</div>
            </div>

            <div className="flex flex-col gap-2">
              {clipDetails?.rankGuesses.map((rank) => {
                return (
                  <div
                    key={rank._id}
                    className=""
                  >
                    <div className="flex justify-between">
                      <div>{rank.name}</div>
                      <div>{rank.percentage}%</div>
                    </div>

                    <div className="bg-slate-700">
                      <div
                        className={`bg-blue-400 h-6 rounded-sm`}
                        style={{ width: `${rank.percentage}%` }}
                      ></div>
                    </div>

                    {/* <span>{rank.name}</span> */}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      <div className="text-white page-spacing-x page-spacing-y">
        <h1 className="text-paragraph font-bold">My Clips</h1>
        <p className="text-slate-400 my-2">
          To access game clips, please select a game category first. Once you have chosen a game category, you can browse through existing submitted clips. If you do not have any clips yet, you can{" "}
          <Link
            href="/upload"
            className="underline text-blue-400"
          >
            click here
          </Link>{" "}
          to upload{" "}
        </p>
        <div className="grid grid-cols-2 gap-4">
          <CategoriesDropdown
            onClick={handleCategoryClick}
            onItemClick={handleCategoryItemClick}
            isActive={isCategoryActive}
            activeCategory={selectedCategory}
            allowQueryParam={true}
            setActiveCategory={setSelectedCategory}
          />

          <StatusDropdown
            activeStatus={activeStatus}
            isStatusActive={isStatusActive}
            onClick={handleStatusClick}
            onItemClick={handleStatusItemClick}
          />
        </div>

        {clips?.length === 0 ? (
          <div className="mt-4 text-center text-slate-400">
            No game clips found. It looks like you have not submitted any game clips yet{" "}
            <Link
              href="/upload"
              className="underline text-blue-400"
            >
              click here
            </Link>{" "}
            to start uploading clip!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
            {clips?.map((clip) => {
              return (
                <div
                  className="w-full aspect-[560/315] bg-slate-800 rounded-md"
                  key={clip._id}
                >
                  <iframe
                    width="560"
                    height="315"
                    src={`https://www.youtube.com/embed/${youtubeParser(clip.link)}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>

                  {clip.status === "verified" ? (
                    <div
                      className="p-4 font-medium flex justify-end items-center group cursor-pointer"
                      onClick={() => {
                        getClipDetails(clip._id);
                      }}
                    >
                      <div className="flex gap-1 items-center group-hover:translate-x-[4px] transition duration-300">
                        <span> See details</span>

                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="white"
                          className="-mb-[1px]"
                        >
                          <path d="M10.024 4h6.015l7.961 8-7.961 8h-6.015l7.961-8-7.961-8zm-10.024 16h6.015l7.961-8-7.961-8h-6.015l7.961 8-7.961 8z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 font-medium flex justify-end items-center group">
                      <button
                        className="bg-green-600 px-4 py-2 rounded-md"
                        onClick={() => {
                          verifyClip(clip._id);
                        }}
                      >
                        Verify clip
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* <div>{router.query.categoryId ? null : "Select a category to see your clips"}</div> */}
      </div>
    </>
  );
};

export default AdminPage;
