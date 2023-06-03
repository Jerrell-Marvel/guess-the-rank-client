import { Categories, Category } from "@/types/category";
import { validateYouTubeUrl } from "@/utils/matchRegex";
import axios from "axios";
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useState } from "react";
import { useMutation } from "react-query";

const SubmitClipPage = ({ category }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const [clipData, setClipData] = useState<{ link: string; actualRank: string }>({ link: "", actualRank: category.ranks[0].name });

  const { data: submitResponse, mutate: submitClip } = useMutation({
    mutationFn: async () => {
      const rankId = category.ranks.find((rank) => rank.name === clipData.actualRank)?._id;
      const response = await axios.post("http://localhost:5000/api/v1/clip", { link: clipData.link, category: category._id, actualRank: rankId }, { withCredentials: true });
      const data = response.data;
      return data;
    },
  });
  return (
    <div>
      <h1>Submit Clip</h1>
      <h2>{category.name}</h2>
      <form
        onSubmit={(e) => {
          console.log(clipData.link);
          e.preventDefault();

          if (!clipData.link) {
            return console.log("link can't be empty");
          }

          if (!validateYouTubeUrl(clipData.link)) {
            return console.log("invalid link");
          } else {
            return;
          }
          submitClip();
        }}
      >
        <input
          type="text"
          placeholder="link"
          onChange={(e) => {
            setClipData({ ...clipData, link: e.target.value });
          }}
        />

        <select
          onChange={(e) => {
            setClipData({ ...clipData, actualRank: e.target.value });
          }}
        >
          {category.ranks.map((rank) => {
            return <option key={rank._id}>{rank.name}</option>;
          })}
        </select>

        <button type="submit">SUBMIT</button>
      </form>
    </div>
  );
};

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

export default SubmitClipPage;
