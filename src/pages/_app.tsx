import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <div>
      <div className="flex justify-center bg-slate-950">
        <div className="max-w-7xl w-full">
          <QueryClientProvider client={queryClient}>
            <Component {...pageProps} />
            {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          </QueryClientProvider>
        </div>
      </div>

      {/* <div className="bg-slate-400 h-12"></div> */}
    </div>
  );
}
