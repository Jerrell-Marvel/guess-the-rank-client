import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex justify-center bg-slate-950 py-14">
        <Navbar />
        <div className="max-w-7xl w-full">
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={false} />
        </div>
      </div>
    </QueryClientProvider>
  );
}
