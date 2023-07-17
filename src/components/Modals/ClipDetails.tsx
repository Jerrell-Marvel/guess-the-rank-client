import { ClipWithActualRank } from "@/types/clip";

type ClipDetailsProps = {
  clipDetails: {
    clip: ClipWithActualRank;
    totalGuesses: number;
    rankGuesses: {
      count: number;
      percentage: string;
      _id: string;
      name: string;
      imgUrl: string;
    }[];
  };

  onClose: () => void;
};

const ClipDetails = ({ clipDetails, onClose }: ClipDetailsProps) => {
  return (
    <div className="bg-slate-950 fixed top-0 left-0 right-0 bottom-0 bg-opacity-40 flex justify-center items-center page-spacing-x page-spacing-y z-[99]">
      <div className="w-[85%] md:w-1/2 max-w-[640px] max-h-[80vh] bg-slate-800 p-6 text-white rounded-md relative">
        <svg
          fillRule="evenodd"
          strokeLinejoin="round"
          strokeMiterlimit="2"
          width={32}
          height={32}
          fill="white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute right-6 top-6 cursor-pointer"
          onClick={() => {
            // document.body.style.overflowY = "scroll";
            // document.body.style.paddingRight = "0px";
            // setIsClipDetailActive(false);
            onClose();
          }}
        >
          <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
        </svg>

        <h3 className="text-paragraph font-semibold">Clip Details</h3>

        <div className="text-md md:text-lg my-2 text-slate-400 flex gap-2">
          <div>Total guesses : {clipDetails.totalGuesses}</div>
          <span>|</span>
          <div>Actual rank : {clipDetails.clip.actualRank.name}</div>
        </div>

        <div className="flex flex-col gap-2">
          {clipDetails?.rankGuesses.map((rank) => {
            return (
              <div
                key={rank._id}
                className=""
              >
                <div className="flex justify-between">
                  <div>{rank.name}</div>
                  <div>{rank.percentage}%</div>
                </div>

                <div className="bg-slate-700">
                  <div
                    className={`bg-blue-400 h-6 rounded-sm`}
                    style={{ width: `${rank.percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClipDetails;
