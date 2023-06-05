import { Categories } from "@/types/category";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { Clip, Clips } from "@/types/clip";
import { useRouter } from "next/router";
import { useState } from "react";
import { addQueryParams } from "@/utils/AddQueryParams";

const status = ["pending", "verified"];

const MyClips = () => {
  const router = useRouter();
  //   const queryClient = useQueryClient();
  const [activeStatus, setActiveStatus] = useState<string>(() => (router.query.status as string) || "pending");

  const { data: categories } = useQuery<Categories>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get<Categories>("http://localhost:5000/api/v1/categories");
      const data = response.data;

      return data;
    },
  });

  const { data: clips } = useQuery<Clips>({
    queryKey: ["clips", router.query.categoryId, activeStatus],
    queryFn: async () => {
      const response = await axios.get<Clips>("http://localhost:5000/api/v1/clips", {
        withCredentials: true,
        params: {
          categoryId: router.query.categoryId,
          status: activeStatus,
        },
      });
      const data = response.data;
      return data;
    },
    enabled: !!router.query.categoryId,
  });

  return (
    <div>
      <div>
        {categories?.map((category) => {
          return (
            // <Link
            //   key={category._id}
            //   href={`/admin/${category._id}`}
            // >
            //   {category.name}
            // </Link>

            <div
              key={category._id}
              className={`${router.query.categoryId === category._id ? "font-bold" : ""}`}
              onClick={() => {
                const newUrl = addQueryParams(window.location.href, "categoryId", category._id);

                router.push(newUrl);
              }}
            >
              {category.name}
            </div>
          );
        })}
      </div>

      <div>
        {status.map((stats) => {
          return (
            <div
              key={stats}
              className={activeStatus === stats ? "font-bold" : ""}
              onClick={() => {
                setActiveStatus(stats);
                const newUrl = addQueryParams(window.location.href, "status", stats);
                router.push(newUrl);
              }}
            >
              {stats}
            </div>
          );
        })}
      </div>

      <div>
        {clips?.map((clip) => {
          return (
            <div key={clip._id}>
              <span className="text-blue-600 underline">{clip.link} </span>
              <span>{clip.status} </span>
            </div>
          );
        })}
      </div>

      <div>{router.query.categoryId ? null : "Select a category to see your clips"}</div>
    </div>
  );
};

export default MyClips;
