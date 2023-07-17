import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect } from "react";
const Login = () => {
  const router = useRouter();

  return (
    <div className="flex justify-center min-h-screen items-center page-spacing-x page-spacing-y">
      <div className="text-white flex justify-center items-center flex-col text-center gap-4 max-w-2xl p-6 bg-gray-700 rounded-md bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 border border-gray-100">
        <h1 className="text-3xl sm:text-4xl font-semibold">Login to Your Account</h1>
        <p className="text-md sm:text-lg text-slate-400 font-light">Login to share and let others guess your rank based on your game clips! Join gamers worldwide in posting and showcasing your epic gameplay moments.</p>

        <a
          href="http://localhost:5000/auth/google"
          className="border-slate-400 border-[1px] px-6 py-2 flex gap-4 hover:bg-slate-950 transition duration-100"
          onClick={() => {
            if (router.query.cbURL) {
              localStorage.setItem("cbURL", router.query.cbURL as string);
            } else {
              localStorage.setItem("cbURL", "/");
            }
          }}
          // target="_blank"
        >
          <Image
            src="/google.png"
            alt="google logo"
            width={24}
            height={24}
          />
          Continue with Google
        </a>
      </div>
    </div>
  );
};

export default Login;
