import { useRouter } from "next/router";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";
import axios from "axios";
import { Clips } from "@/types/clip";

const AdminCategoryPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: clips } = useQuery<Clips>({
    queryKey: ["category", router.query.category],
    queryFn: async () => {
      const response = await axios.get<Clips>(`http://localhost:5000/api/v1/clips/${router.query.category}`, {
        params: {
          status: "pending",
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
  return (
    <div>
      <div>{router.query.category}</div>
      <div>
        {clips?.map((clip) => {
          return (
            <div key={clip._id}>
              <span>{clip.link}</span>
              <span>{clip.status}</span>
              <button>Verify</button>
            </div>
          );
        })}
      </div>
      lol
    </div>
  );
};

export default AdminCategoryPage;
