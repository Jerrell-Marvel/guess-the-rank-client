import Image from "next/image";
import { Inter } from "next/font/google";
import axios from "axios";
import { useState, useEffect } from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { Categories } from "@/types/category";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ categories }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <div className="bg-slate-950">
        <div className="text-center md:text-left flex flex-wrap px-4 py-6 md:py-12 md:px-8">
          {/* Main banner */}
          <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start">
            <h1 className="text-title font-bold mb-4 md:mb-6 text-blue-400">Can You Guess The Rank ?</h1>

            <p className="text-slate-400 font-extralight text-paragraph mb-4 md:mb-6">Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa, ducimus iure! Voluptatum expedita sunt quam enim ab iusto unde. Sapiente.</p>

            <button className="bg-blue-400 relative font-semibold text-white my-3 w-[calc(90%-16px)] max-w-sm group ml-2">
              <div className="absolute left-[-8px] top-[-8px] w-[calc(100%+16px)] h-[calc(50%+4px)] border-t-[0.5px] border-l-[0.5px] border-r-[0.5px] border-white"></div>
              <div className="absolute left-[-8px] bottom-[-8px] w-[calc(100%+16px)] h-[calc(50%+4px)] border-b-[0.5px] border-l-[0.5px] border-r-[0.5px] border-white "></div>

              <Link
                className="overflow-hidden relative h-full py-3 block"
                href="#category"
                scroll={false}
              >
                <div className="absolute w-[125%] h-full top-0 left-[-125%] group-hover:translate-x-[87.5%] bg-slate-950 transition duration-[400ms] clip-tilt"></div>
                <span className="uppercase relative">Start guessing</span>
              </Link>

              <div className="absolute right-0 bottom-0 w-[5px] aspect-square bg-slate-950 group-hover:bg-white duration-[800ms]"></div>
            </button>
          </div>

          <div className="w-full md:w-1/2 flex items-center">
            <div className="w-full aspect-square relative">
              <div className="w-2/3 h-2/3 bg-blue-400 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-full"></div>
              <Image
                src="/jett.png"
                fill={true}
                alt="jett"
              />
            </div>
          </div>
        </div>

        <div className="separator"></div>

        {/* How to play */}
        <div className="text-center text-white py-6 md:py-12 px-4 md:px-8">
          <h2 className="font-bold mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-title text-blue-400">How To Play ? </h2>
          <div className="flex flex-col text-slate-400 text-paragraph font-extralight">
            <div>
              <p>You will be given clip of the game that you chose.</p>
            </div>
            <div>
              <p>The objective of the game is to guess the rank or level achieved in a particular game clip.</p>
            </div>
            <div>
              <p>Show off your game knowledge and guess the rank correctly!</p>
            </div>
          </div>
        </div>

        {/* <div className="separator"></div> */}
        {/* Category */}
        <div
          className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-8"
          id="category"
        >
          {categories.map((category) => {
            return (
              <Link
                href={`/${category.name}`}
                className="w-full group text-white rounded-md overflow-hidden"
                key={category.name}
              >
                <div className="w-full relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={`http://localhost:5000/static/category-images/${category.imgUrl}`}
                    alt={category.name}
                    fill={true}
                    className="group-hover:scale-110 transition duration-500"
                  />
                </div>

                {/* <div className="h-1/2 absolute bottom-0 w-full bg-gradient-to-t to-transparent from-slate-900 bg-opacity-10"></div> */}

                {/* <h4 className="text-4xl md:text-3xl font-bold uppercase absolute bottom-[10%] px-6">{category.name}</h4> */}
                <h4 className="text-lg sm:text-2xl md:text-xl font-semibold uppercase p-4 bg-slate-900 group-hover:text-slate-400 transition duration-500">{category.name}</h4>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<{ categories: Categories }> = async () => {
  const response = await axios.get<Categories>("http://localhost:5000/api/v1/categories");
  const data = response.data;

  // [
  //   {
  //     _id: '6483fcff7fb54cba574c38a1',
  //     name: 'valorant',
  //     imgUrl: 'categoryImg-1686371583509-189958557.jpg',
  //     description: 'valorant description, lorem ipsum dolor sit amet',
  //     ranks: [
  //       '6483fd127fb54cba574c38a3',
  //       '6483fd187fb54cba574c38a6',
  //       '6483fd1d7fb54cba574c38a9'
  //     ],
  //     __v: 0
  //   },
  //   {
  //     _id: '6483fd4e7fb54cba574c38ac',
  //     name: 'cs go',
  //     imgUrl: 'categoryImg-1686371662383-334958501.png',
  //     description: 'cs go description, lorem ipsum dolor sit amet',
  //     ranks: [ '6483fd777fb54cba574c38ae', '6483fd7e7fb54cba574c38b1' ],
  //     __v: 0
  //   }
  // ]
  // [
  //   {
  //     _id: '6483fcff7fb54cba574c38a1',
  //     name: 'valorant',
  //     imgUrl: 'categoryImg-1686371583509-189958557.jpg',
  //     description: 'valorant description, lorem ipsum dolor sit amet',
  //     ranks: [
  //       '6483fd127fb54cba574c38a3',
  //       '6483fd187fb54cba574c38a6',
  //       '6483fd1d7fb54cba574c38a9'
  //     ],
  //     __v: 0
  //   },
  //   {
  //     _id: '6483fd4e7fb54cba574c38ac',
  //     name: 'cs go',
  //     imgUrl: 'categoryImg-1686371662383-334958501.png',
  //     description: 'cs go description, lorem ipsum dolor sit amet',
  //     ranks: [ '6483fd777fb54cba574c38ae', '6483fd7e7fb54cba574c38b1' ],
  //     __v: 0
  //   }
  // ]

  return { props: { categories: [...data, ...data, ...data, ...data] } };
};
