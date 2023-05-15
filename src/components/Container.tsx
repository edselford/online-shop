import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./Navbar";

export default function Container({children, host}: {children: ReactNode, host: string | null}) {
  return <div
      className={`font-sans dark:bg-github-dark-bg1 min-h-screen dark:text-white`}
    >
      <Toaster />
      <Navbar page="home" host={host || "localhost"} />
      {children}
    </div>
}