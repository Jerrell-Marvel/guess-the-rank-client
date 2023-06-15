import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Categories, Category } from "@/types/category";
import { useMutation } from "react-query";
import { Clip } from "@/types/clip";
import { Guesses } from "@/types/guess";
import Image from "next/image";
import { youtubeParser } from "@/utils/youtubeParser";

type SubmitResponse = {
  guesses: Guesses;
  isCorrect: boolean;
  totalDocuments: number;
};

type SubmitResult = {
  total: number;
  isCorrect: boolean;
  ranks: {
    _id: string;
    name: string;
    imgUrl: string;
    count: number;
    percentage: string;
  }[];
};

const CategoryPage = ({ category }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  // useEffect(() => {}, [router.query.category]);

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [selectedRank, setSelectedRank] = useState("");
  // const [isResultShow, setIsResultShow] = useState(false);
  // const [result, setResult] = useState();

  const [submitResult, setSubmitResult] = useState<SubmitResult | null>(null);

  const { data: clip, mutate: getClip } = useMutation<Clip, AxiosError, string>({
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

      return data as SubmitResponse;
    },

    onSuccess: (data) => {
      // setIsResultShow(true);
      setSelectedRank("");

      const ranks = category.ranks.map((rank) => {
        const rankData = data.guesses.find((e) => e.rank._id == rank._id);
        return { ...rank, count: rankData?.count || 0, percentage: rankData?.percentage || "0" };
      });

      const result: SubmitResult = { total: data.totalDocuments, isCorrect: data.isCorrect, ranks };

      // console.log(result);
      setSubmitResult(result);
    },
  });

  return (
    <div className=" w-full border-white flex items-center text-white flex-col min-h-screen justify-center gap-6 px-4 md:px-8 py-6 md:py-12">
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
            <button className="w-full bg-slate-800 font-semibold max-w-sm hover:text-blue-400">
              <div className="py-3">Upload own clip</div>
            </button>
          </div>
        </>
      ) : submitResult ? (
        <>
          <div className="bg-slate-700 w-full flex flex-col">
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
          <span>{JSON.stringify(submitResult)}</span>

          <button
            className="w-full bg-slate-800 font-semibold max-w-sm hover:text-blue-400"
            onClick={() => {
              setSubmitResult(null);
              getClip(category._id);
            }}
          >
            <div className="py-3">Play again</div>
          </button>
          <button className="w-full bg-slate-800 font-semibold max-w-sm hover:text-blue-400">
            <div className="py-3">Upload own clip</div>
          </button>
          <button className="w-full bg-slate-800 font-semibold max-w-sm hover:text-blue-400">
            <div className="py-3">Home</div>
          </button>
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
                onClick={() => setSelectedRank(rank._id)}
                className={`${selectedRank === rank._id ? "text-purple-400" : ""}`}
              >
                {rank.name}
              </div>
            );
          })}

          <button
            className="w-full bg-slate-800 font-semibold max-w-sm hover:text-blue-400"
            onClick={() => {
              submitClip({ clipId: clip._id, rankGuess: selectedRank });
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

export const getStaticProps: GetStaticProps<{ category: Category }> = async (context) => {
  const { params } = context;
  const response = await axios.get<Category>(`http://localhost:5000/api/v1/category/${params?.category}`);
  const data = response.data;

  return {
    props: {
      category: data,
    },
  };
};
