import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import axios, { AxiosError } from "axios";
import { Clip, Clips } from "@/types/clip";
const clipStatusArr = ["pending", "verified"];

const AdminCategoryPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [clipStatus, setClipStatus] = useState("pending");

  const { data: clips } = useQuery<Clips>({
    queryKey: ["category", router.query.category, clipStatus],
    queryFn: async () => {
      const response = await axios.get<Clips>(`http://localhost:5000/api/v1/clips/${router.query.category}`, {
        params: {
          status: clipStatus,
        },
        withCredentials: true,
      });

      const data = response.data;
      return data;
    },
    enabled: router.isReady,
  });

  // useEffect(() => {
  //   console.log(router.isReady);
  //   if (router.isReady) {
  //     queryClient.refetchQueries(["test"]);
  //   }
  // }, [router.isReady, queryClient]);

  const { data: verifyClipResponse, mutate: verifyClip } = useMutation<Clip, AxiosError, string>({
    mutationFn: async (clipId) => {
      const response = await axios.post<Clip>(`http://localhost:5000/api/v1/clip/verify/${clipId}`, null, { withCredentials: true });
      const data = response.data;
      return data;
    },

    onSuccess: (_res, clipId) => {
      console.log(["category", router.query.category, "pending"]);
      const clips = queryClient.getQueryData<Clips>(["category", router.query.category, "pending"]);

      if (clips) {
        const tempClips = clips
          .map((clip) => {
            return { ...clip };
          })
          .filter((clip) => {
            return clip._id !== clipId;
          });

        console.log(tempClips);

        queryClient.setQueryData<Clips>(["category", router.query.category, "pending"], tempClips);
      }
    },
  });

  return (
    <div>
      <div>
        {clipStatusArr.map((stat) => {
          return (
            <span
              className={`${clipStatus === stat ? "text-xl" : ""}`}
              key={stat}
              onClick={() => setClipStatus(stat)}
            >
              {stat}
            </span>
          );
        })}
      </div>
      <div>{router.query.category}</div>
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

export default AdminCategoryPage;
