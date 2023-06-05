import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { Categories, Category } from "@/types/category";
import { useMutation } from "react-query";
import { Clip } from "@/types/clip";
import { Guesses } from "@/types/guess";

type SubmitResponse = {
  guesses: Guesses;
  isCorrect: boolean;
  totalDocuments: number;
};

const CategoryPage = ({ category }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  // useEffect(() => {}, [router.query.category]);

  const [isGameStarted, setIsGameStarted] = useState(false);
  const [selectedRank, setSelectedRank] = useState("");
  const [isResultShow, setIsResultShow] = useState(false);

  const { data: clip, mutate: getClip } = useMutation<Clip, AxiosError, string>({
    mutationFn: async (category) => {
      const response = await axios.get<Clip>(`http://localhost:5000/api/v1/clip/${category}`);
      const data = response.data;
      return data;
    },
  });

  const { data: submitResponse, mutate: submitClip } = useMutation<SubmitResponse, AxiosError, { clipId: string; rankGuess: string }>({
    mutationFn: async ({ clipId, rankGuess }) => {
      const response = await axios.post<SubmitResponse>(`http://localhost:5000/api/v1/guess/${clipId}`, { rankGuess });
      const data = response.data;

      return data as SubmitResponse;
    },

    onSuccess: () => {
      setIsResultShow(true);
      setSelectedRank("");
    },
  });

  return (
    <div>
      {!clip ? (
        <div>
          <h1>GUESS THE RANK</h1>
          <h2>{category.name}</h2>
          <p>You will be asked to guess the rank of given clip!!!</p>

          <button
            onClick={() => {
              getClip(category._id);
            }}
          >
            Start
          </button>
        </div>
      ) : isResultShow ? (
        <div>
          <span>{JSON.stringify(submitResponse)}</span>
          <button
            onClick={() => {
              setIsResultShow(false);
              getClip(category._id);
            }}
          >
            Play again
          </button>
        </div>
      ) : (
        <div>
          <h3>{clip.link}</h3>
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
            onClick={() => {
              submitClip({ clipId: clip._id, rankGuess: selectedRank });
            }}
          >
            submit
          </button>
        </div>
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
