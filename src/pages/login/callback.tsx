import { useRouter } from "next/router";
import { useEffect } from "react";

const CallbackPage = () => {
  const router = useRouter();
  useEffect(() => {
    const authCallbackURL = localStorage.getItem("authCallbackURL");

    if (authCallbackURL) {
      localStorage.removeItem("authCallbackURL");
      console.log(authCallbackURL);
      router.push(`/${authCallbackURL}`);
    } else {
      router.push("/");
    }

    // console.log(authCallbackURL);
  }, [router]);
  return <div className="spacing-x spacing-y text-white text-center text-paragraph">Redirecting you in...</div>;
};

export default CallbackPage;
