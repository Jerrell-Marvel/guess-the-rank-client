const stats: ("pending" | "verified")[] = ["pending", "verified"];

type StatusDropdownProps = {
  activeStatus: "pending" | "verified";
  onClick: () => void;
  onItemClick: (stat: "pending" | "verified") => void;
  isStatusActive: boolean;
};
const StatusDropdown = ({ activeStatus, onClick, onItemClick, isStatusActive }: StatusDropdownProps) => {
  return (
    <div className="py-2 relative">
      <label
        className="mb-2 block"
        htmlFor="game"
      >
        Status
      </label>
      <div
        id="game"
        className="flex items-center justify-between py-3 cursor-pointer bg-slate-800 px-3 rounded-md"
        onClick={() => {
          onClick();
          //   setIsStatusActive((prev) => !prev);
          //   setIsCategoryActive(false);
          // setIsRankActive(false);
        }}
      >
        <span className="capitalize">{activeStatus}</span>
        <i className="h-3 w-3 -mt-[3px] border-r-2 border-b-2 border-white rotate-45 ml-1"></i>
      </div>

      {isStatusActive ? (
        <ul className="p-3 flex flex-col gap-3 w-full bg-slate-800 mt-2 rounded-md absolute max-h-[244px] overflow-auto z-50">
          {stats.map((stat) => {
            return (
              <li
                className="w-full py-3 px-3 border-[1px] border-white rounded-sm capitalize cursor-pointer hover:bg-slate-600"
                key={stat}
                onClick={() => {
                  onItemClick(stat);
                  // setSelectedCategory(category);
                  //   setIsStatusActive(false);
                  //   setActiveStatus(stat);
                  //   const newUrl = addQueryParams(window.location.href, "status", stat);
                  //   router.push(newUrl);
                }}
              >
                {stat}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default StatusDropdown;
