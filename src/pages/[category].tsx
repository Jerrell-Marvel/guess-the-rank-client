import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Categories, Category, CategoryWithRanks } from "@/types/category";
import { useMutation } from "react-query";
import { Clip } from "@/types/clip";
import { Guesses, GuessesWithPercentage } from "@/types/guess";
import Image from "next/image";
import { youtubeParser } from "@/utils/youtubeParser";
import { Rank } from "@/types/rank";
import Link from "next/link";
import LoadingSpinner from "@/components/Spinner/LoadingSpinner";

type SubmitResponse = { isCorrect: boolean; guesses: GuessesWithPercentage; totalGuesses: number; actualRank: Rank };

type SubmitResult = {
  isCorrect: boolean;
  totalGuesses: number;
  ranks: {
    _id: string;
    name: string;
    imgUrl: string;
    count: number;
    percentage: string;
  }[];
  actualRank: Rank;
};

const CategoryPage = ({ category }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  // useEffect(() => {}, [router.query.category]);

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [selectedRank, setSelectedRank] = useState<Rank | null>(null);
  // const [isResultShow, setIsResultShow] = useState(false);
  // const [result, setResult] = useState();

  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  const {
    data: clip,
    mutate: getClip,
    isLoading: isGetClipLoading,
  } = useMutation<Clip, AxiosError, string>({
    mutationFn: async (category) => {
      const response = await axios.get<Clip>(`http://localhost:5000/api/v1/clip/${category}`);
      const data = response.data;
      return data;
    },
  });

  const { data, mutate: submitClip } = useMutation<SubmitResponse, AxiosError, { clipId: string; rankGuess: string }>({
    mutationFn: async ({ clipId, rankGuess }) => {
      const response = await axios.post<SubmitResponse>(`http://localhost:5000/api/v1/guess/${clipId}`, { rankGuess });
      const data = response.data;

      return data;
    },

    onSuccess: (data) => {
      // setIsResultShow(true);
      // setSelectedRank(null);

      const ranks = category.ranks.map((rank) => {
        const rankData = data.guesses.find((e) => e.rank._id == rank._id);
        return { ...rank, count: rankData?.count || 0, percentage: rankData?.percentage || "0" };
      });

      const result: SubmitResult = { totalGuesses: data.totalGuesses, isCorrect: data.isCorrect, ranks, actualRank: data.actualRank };

      // console.log(result);
      setSubmitResult(result);
    },
  });

  if (isGetClipLoading) {
    return (
      <div className=" w-full border-white flex items-center text-white flex-col min-h-screen justify-center gap-6 page-spacing-x page-spacing-y ">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className=" w-full border-white flex items-center text-white flex-col min-h-screen justify-center gap-6 page-spacing-x page-spacing-y">
      {!clip ? (
        <>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl uppercase font-bold">{category.name}</h2>
          <div className="w-full sm:w-1/2 aspect-[4/3] bg-blue-200 relative">
            <Image
              src={`http://localhost:5000/static/category-images/${category.imgUrl}`}
              fill={true}
              alt={category.name}
            />
          </div>
          <h4 className="text-paragraph text-slate-400">
            Play guess the rank for <span className="capitalize">{category.name}</span>
          </h4>

          {/* <button
            onClick={() => {
              getClip(category._id);
            }}
          >
            Start
          </button> */}
          <div className="flex flex-col w-full max-w-sm gap-4">
            <button
              className="w-full bg-slate-800 font-semibold max-w-sm hover:text-blue-400"
              onClick={() => {
                getClip(category._id);
              }}
            >
              <div className="py-3">Start</div>
            </button>
            <Link
              className="w-full bg-slate-800 font-semibold max-w-sm hover:text-blue-400 block"
              href="/upload"
            >
              <div className="py-3 text-center">Upload own clip</div>
            </Link>
          </div>
        </>
      ) : submitResult ? (
        <>
          {/* <div className="bg-slate-700 w-full flex flex-col">
            {submitResult.ranks.map((rank) => {
              return (
                <div
                  key={rank._id}
                  className="w-full"
                >
                  <span>{rank.name}</span>
                  <span>{rank.percentage}</span>
                  <div
                    className={`bg-blue-200 h-8`}
                    style={{ width: `${rank.percentage}%` }}
                  ></div>
                </div>
              );
            })}
          </div>
          <span>{JSON.stringify(submitResult)}</span> */}
          <div className="w-full bg-slate-800 p-6 text-white rounded-md relative max-w-[640px]">
            <h3 className="text-paragraph font-semibold">Clip Details</h3>
            <h3 className="text-paragraph font-semibold">{JSON.stringify(submitResult.isCorrect)}</h3>
            <div>your guesses : {selectedRank?.name}</div>
            <div>correct rank : {submitResult.actualRank.name}</div>

            <div className="text-md md:text-lg my-2 text-slate-400 flex gap-2">
              <div>Total guesses : {submitResult.totalGuesses}</div>
              {/* <div>Your guesses : {${selectedRank.}}</div> */}
              {/* <div>Actual rank : {submitResult.}</div> */}
            </div>

            <div className="flex flex-col gap-2">
              {submitResult.ranks.map((rank) => {
                return (
                  <>
                    {/* <div
                      key={rank._id}
                      className="h-full flex flex-col justify-end"
                    >
                      <span>{rank.percentage}%</span>
                      <div
                        className={`bg-blue-400`}
                        style={{ height: `${rank.percentage}%` }}
                      ></div>
                      <span>{rank.name}</span>
                    </div>

                    <div
                      key={rank._id}
                      className="h-full flex flex-col justify-end"
                    >
                      <span>{rank.percentage}%</span>
                      <div
                        className={`bg-blue-400`}
                        style={{ height: `${rank.percentage}%` }}
                      ></div>
                      <span>{rank.name}</span>
                    </div> */}

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
                  </>
                );
              })}
            </div>
          </div>

          <button
            className="w-full bg-slate-800 font-semibold max-w-sm hover:text-blue-400"
            onClick={() => {
              setSubmitResult(null);
              setSelectedRank(null);
              getClip(category._id);
            }}
          >
            <div className="py-3">Play again</div>
          </button>
          <Link
            className="w-full bg-slate-800 font-semibold max-w-sm hover:text-blue-400 block"
            href="/upload"
          >
            <div className="py-3 text-center">Upload own clip</div>
          </Link>
          <Link
            className="w-full bg-slate-800 font-semibold max-w-sm hover:text-blue-400 block"
            href="/"
          >
            <div className="py-3 text-center">Home</div>
          </Link>
        </>
      ) : (
        <>
          {/* <h3>{clip.link}</h3> */}
          <div className="w-full bg-red-200 aspect-[560/315]">
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
          </div>

          {category.ranks.map((rank) => {
            return (
              <div
                key={rank.name}
                onClick={() => setSelectedRank(rank)}
                className={`${selectedRank?._id === rank._id ? "text-purple-400" : ""}`}
              >
                {rank.name}
              </div>
            );
          })}

          <button
            className="w-full bg-slate-800 font-semibold max-w-sm hover:text-blue-400"
            onClick={() => {
              if (selectedRank) {
                submitClip({ clipId: clip._id, rankGuess: selectedRank._id });
              }
            }}
          >
            <div className="py-3">Submit</div>
          </button>
        </>
      )}
    </div>
  );
};

export default CategoryPage;

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await axios.get<Categories>("http://localhost:5000/api/v1/categories");
  const data = response.data;

  // console.log(response.data);

  const paths = data.map((category) => {
    return {
      params: {
        category: category.name,
      },
    };
  });

  // console.log(paths);

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<{ category: CategoryWithRanks }> = async (context) => {
  const { params } = context;
  const response = await axios.get<CategoryWithRanks>(`http://localhost:5000/api/v1/category/${params?.category}`);
  const data = response.data;

  return {
    props: {
      category: data,
    },
  };
};
