import { Clip } from "@/types/clip";
import { Guesses } from "@/types/guess";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
import { useQuery } from "react-query";
import axios from "axios";
type GetClipResponse = {
  guesses: Guesses;
  clip: Clip;
};

const ClipDetails = () => {
  const router = useRouter();
  const { data: clipDetails } = useQuery<GetClipResponse, AxiosError>({
    queryKey: ["clip", "details", router.query.clipId],
    queryFn: async () => {
      const response = await axios.get<GetClipResponse>(`http://localhost:5000/api/v1/clip/details/${router.query.clipId!}`, { withCredentials: true });
      const data = response.data;
      return data;
    },

    enabled: router.isReady,
  });

  return (
    <>
      <div>{clipDetails?.clip.link}</div>
      <div>{clipDetails?.clip._id}</div>

      <div>
        {clipDetails?.guesses.map((guess) => {
          return (
            <div key={guess.rank._id}>
              <div>{guess.rank.name}</div>
              <div>{guess.percentage}</div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default ClipDetails;
