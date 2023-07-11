import { useRouter } from "next/router";
import { useEffect } from "react";

const CallbackPage = () => {
  const router = useRouter();
  useEffect(() => {
    const cbURL = localStorage.getItem("cbURL");

    if (cbURL) {
      router.push(`/${cbURL}`);
      localStorage.removeItem("cbURL");
    } else {
      router.push("/");
    }

    // console.log(cbURL);
  }, []);
  return <div className="page-spacing-x page-spacing-y text-white text-center text-paragraph">Redirecting you in...</div>;
};

export default CallbackPage;
