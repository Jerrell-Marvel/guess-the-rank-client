import Image from "next/image";
import { Inter } from "next/font/google";
import axios from "axios";
import { useState, useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return <div>TESTING</div>;
}

// export const getStaticProps = async () => {
//   const response = await axios.get("http://localhost:5000/api/v1/clip/6479728f88e02872c413728d");
//   return { props: { hi: response.data.clip._id } };
// };
