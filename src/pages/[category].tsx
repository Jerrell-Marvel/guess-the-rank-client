import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import axios from "axios";
import { Categories, Category } from "@/types/category";

const CategoryPage = ({ category }: InferGetStaticPropsType<typeof getStaticProps>) => {
  const router = useRouter();

  // useEffect(() => {}, [router.query.category]);
  return (
    <div>
      <h1>GUESS THE RANK</h1>
      <h2>{category.name}</h2>
      <p>You will be asked to guess the rank of given clip!!!</p>

      <button>Start</button>
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

  console.log(paths);

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
