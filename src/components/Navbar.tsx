import Link from "next/link";
import { useState } from "react";

const games = ["Valorant", "League of Legends", "CS:GO", "Apex Legends", "Overwatch", "Dota 2", "Rainbow Six Siege"];

const Navbar = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <>
      <div className="w-full bg-slate-950 bg-opacity-75 fixed top-0 h-16 flex items-center spacing-x justify-end z-[999]">
        <div
          className="w-6 h-6 z-[9999] cursor-pointer flex flex-col justify-around"
          onClick={() => setIsActive(true)}
        >
          <div className="h-[2px] bg-white"></div>
          <div className="h-[2px] bg-white"></div>
          <div className="h-[2px] bg-white"></div>
        </div>

        <div
          className={`fixed top-0 left-0 w-full h-full bg-slate-950 bg-opacity-40 z-[999]  transition-all duration-500 ${isActive ? "block" : "hidden"}`}
          onClick={() => {
            setIsActive(false);
          }}
        ></div>

        <div className={`w-full max-w-sm h-screen bg-slate-950 p-4 overflow-y-scroll text-white  transition-all duration-[400ms] ${isActive ? "translate-x-0" : "translate-x-full"} absolute z-[10000] right-0 top-0 rtl`}>
          <div className="w-full flex justify-end ltr">
            <svg
              clip-rule="evenodd"
              fill-rule="evenodd"
              stroke-linejoin="round"
              stroke-miterlimit="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              className="w-8 h-8 cursor-pointer"
              onClick={() => {
                setIsActive(false);
              }}
            >
              <path d="m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z" />
            </svg>
          </div>
          <Link
            href="/"
            className="w-full py-4 px-2 hover:bg-slate-800 rounded-md flex gap-3 ltr"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M21 13v10h-6v-6h-6v6h-6v-10h-3l12-12 12 12h-3zm-1-5.907v-5.093h-3v2.093l3 3z" />
            </svg>

            <span>Home</span>
          </Link>
          <div className="w-full py-4 px-2 flex gap-3 hover:bg-slate-800 rounded-md cursor-pointer ltr">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M17.622 3c-1.913 0-2.558 1.382-5.623 1.382-3.009 0-3.746-1.382-5.623-1.382-5.209 0-6.376 10.375-6.376 14.348 0 2.145.817 3.652 2.469 3.652 3.458 0 2.926-5 6.915-5h5.23c3.989 0 3.457 5 6.915 5 1.652 0 2.471-1.506 2.471-3.651 0-3.973-1.169-14.349-6.378-14.349zm-10.622 10c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zm10-6c.552 0 1 .447 1 1 0 .553-.448 1-1 1s-1-.447-1-1c0-.553.448-1 1-1zm-2 4c-.552 0-1-.447-1-1 0-.553.448-1 1-1s1 .447 1 1c0 .553-.448 1-1 1zm2 2c-.552 0-1-.447-1-1 0-.553.448-1 1-1s1 .447 1 1c0 .553-.448 1-1 1zm2-2c-.552 0-1-.447-1-1 0-.553.448-1 1-1s1 .447 1 1c0 .553-.448 1-1 1zm-10.25-1c0 .965-.785 1.75-1.75 1.75s-1.75-.785-1.75-1.75.785-1.75 1.75-1.75 1.75.785 1.75 1.75z" />
            </svg>
            <span>Games</span>
          </div>

          {games.map((game) => {
            return (
              <div
                className="w-full block py-4 pr-2 pl-6 hover:bg-slate-800 rounded-md cursor-pointer ltr"
                key={game}
              >
                {game}
              </div>
            );
          })}

          <Link
            className="w-full py-4 px-2 rounded-md hover:bg-slate-800 cursor-pointer flex gap-3 ltr"
            href="/upload"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M8 10h-5l9-10 9 10h-5v10h-8v-10zm11 9v3h-14v-3h-2v5h18v-5h-2z" />
            </svg>
            <span>Upload</span>
          </Link>
          <Link
            className="w-full py-4 px-2 hover:bg-slate-800 cursor-pointer flex gap-3 ltr"
            href="/about"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 18.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25c.691 0 1.25.56 1.25 1.25s-.559 1.25-1.25 1.25zm1.961-5.928c-.904.975-.947 1.514-.935 2.178h-2.005c-.007-1.475.02-2.125 1.431-3.468.573-.544 1.025-.975.962-1.821-.058-.805-.73-1.226-1.365-1.226-.709 0-1.538.527-1.538 2.013h-2.01c0-2.4 1.409-3.95 3.59-3.95 1.036 0 1.942.339 2.55.955.57.578.865 1.372.854 2.298-.016 1.383-.857 2.291-1.534 3.021z" />
            </svg>
            <span>About</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
