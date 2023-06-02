import Image from "next/image";
import { Inter } from "next/font/google";
import axios from "axios";
import { useState, useEffect } from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Categories } from "@/types/category";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ categories }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div>
      {categories.map((category) => {
        return <div key={category._id}>{category.name}</div>;
      })}
    </div>
  );
}

export const getStaticProps: GetStaticProps<{ categories: Categories }> = async () => {
  const response = await axios.get<Categories>("http://localhost:5000/api/v1/categories");
  const data = response.data;

  return { props: { categories: data } };
};
