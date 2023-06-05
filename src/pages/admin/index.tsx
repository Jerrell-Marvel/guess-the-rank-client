import { Categories } from "@/types/category";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { Clip, Clips } from "@/types/clip";
import { useRouter } from "next/router";
import { useState } from "react";
import { addQueryParams } from "@/utils/AddQueryParams";

const status = ["pending", "verified"];

const AdminPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeStatus, setActiveStatus] = useState("pending");

  const { data: categories } = useQuery<Categories>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get<Categories>("http://localhost:5000/api/v1/categories");
      const data = response.data;

      return data;
    },
  });

  const { data: clips } = useQuery<Clips>({
    queryKey: ["admin", "clips", router.query.categoryId, activeStatus],
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

  const { data: verifyClipResponse, mutate: verifyClip } = useMutation<Clip, AxiosError, string>({
    mutationFn: async (clipId) => {
      const response = await axios.post<Clip>(`http://localhost:5000/api/v1/clip/verify/${clipId}`, null, { withCredentials: true });
      const data = response.data;
      return data;
    },

    onSuccess: (_res, clipId) => {
      console.log(["admin", "clips", router.query.category, "pending"]);
      const clips = queryClient.getQueryData<Clips>(["admin", "clips", router.query.categoryId, "pending"]);

      if (clips) {
        const tempClips = clips
          .map((clip) => {
            return { ...clip };
          })
          .filter((clip) => {
            return clip._id !== clipId;
          });

        console.log(tempClips);

        queryClient.setQueryData<Clips>(["admin", "clips", router.query.categoryId, "pending"], tempClips);
      }
    },
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

              {clip.status === "pending" ? <button onClick={() => verifyClip(clip._id)}>Verify </button> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminPage;
