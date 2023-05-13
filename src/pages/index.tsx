// import { Menu, Segment } from "semantic-ui-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Home from "@/components/Home";
import Cart from "@/components/Cart";
import { useRouter } from "next/router";
import { QueryResult, useQuery } from "@apollo/client";
import { CART_QUERY } from "@/lib/queries";
import { GetServerSideProps } from "next";
import { motion, spring } from "framer-motion";

export const getServerSideProps: GetServerSideProps<{ host: string | null }> = async (context) => ({
  props: { host: context.req.headers.host || null },
});

export default function ({ host }: { host: string | null }) {
  const session = useSession();
  const router = useRouter();
  const hashtag = router.asPath.match(/#(.*)/)?.[1];

  useEffect(() => {
    if (session.status === "unauthenticated")
      router.push(`/auth/signin?callbackUrl=http://${host}/`);
  }, [session]);

  const cart: QueryResult<any, any> = useQuery(CART_QUERY, {
    variables: { username: session.data?.user?.name || "" },
  });

  const [page, setPage] = useState("home");
  const [isDark, setDark] = useState(false);

  const darkToggle = (dark: boolean) => {
    setDark(dark);
    document.getElementById("container")?.classList.toggle("dark", dark);
    localStorage.setItem("dark", dark ? "true" : "false");
  };

  useEffect(() => {
    darkToggle(localStorage.getItem("dark") === "true");
    if (hashtag) setPage(hashtag);
  }, []);

  const pageHandler = () => {
    switch (page) {
      case "cart":
        return <Cart query={cart} />;
      default:
        return <Home carsFetch={cart.refetch} username={session.data?.user?.name || "null"} />;
    }
  };

  return (
    <div className={`font-sans dark:bg-github-dark-bg1 min-h-screen dark:text-white`}>
      <Toaster />
      <div className="flex flex-row justify-between py-5 px-10">
        <div className="flex flex-row md:justify-between w-max lg:w-[500px]">
          <h1 className="font-sans pt-3 mr-2 md:mr-5">Zel Ford</h1>
          <motion.div
            layout
            transition={{ duration: 0.5 }}
            className="flex flex-row items-center justify-between "
          >
            <div
              className={`${
                page == "home" && "dark:bg-github-dark-bg2 bg-github-light-bg2"
              } dark:hover:bg-github-dark-bg2 hover:bg-github-light-bg2 mx-2 cursor-pointer h-min rounded-lg md:h-5/6`}
              onClick={() => setPage("home")}
            >
              <div className="md:hidden w-10 h-10 grid place-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-7 h-7"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                </svg>
              </div>

              <h3 className="hidden my-0 mx-6 md:inline-block align-middle leading-[275%] font-sans">
                Home
              </h3>
            </div>
            <div
              className={`${
                page == "cart" && "dark:bg-github-dark-bg2 bg-github-light-bg2"
              } dark:hover:bg-github-dark-bg2 hover:bg-github-light-bg2 mx-2 cursor-pointer rounded-lg h-min md:h-5/6`}
              onClick={() => setPage("cart")}
            >
              <div className="md:hidden w-10 h-10 grid place-items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                </svg>
              </div>
              <h3 className="hidden my-0 mx-6 md:inline-block align-middle leading-[275%] font-sans">
                Cart
              </h3>
            </div>
            {/* <div */}
            {/*   className={`${ */}
            {/*     page == "history" && "dark:bg-github-dark-bg2 bg-github-light-bg2" */}
            {/*   } dark:hover:bg-github-dark-bg2 hover:bg-github-light-bg2 mx-2 cursor-pointer rounded-lg h-5/6`} */}
            {/*   onClick={() => setPage("history")} */}
            {/* > */}
            {/*   <h3 className="my-0 mx-6 inline-block align-middle leading-[275%] font-sans"> */}
            {/*     History */}
            {/*   </h3> */}
            {/* </div> */}
          </motion.div>
        </div>
        <div className="flex flex-row items-center">
          <div
            onClick={() => darkToggle(!isDark)}
            className={`flex items-center cursor-pointer shadow-inner bg-github-light-bg2 dark:bg-github-dark-bg2 rounded-full w-[50px] h-[25px] ${
              isDark && "place-content-end"
            }`}
          >
            <motion.div
              className="w-[20px] h-[20px] mx-1 bg-github-light-border dark:bg-github-dark-border rounded-full"
              layout
              transition={{ duration: 0.1 }}
            ></motion.div>
          </div>
          <div
            onClick={async () => {
              await signOut({
                redirect: false,
              });
              router.push(`/auth/signin?callbackUrl=http://${host}/`);
            }}
            className="dark:hover:bg-github-dark-bg2 hover:bg-github-light-bg2 mx-2 cursor-pointer rounded-lg h-5/6"
            title="click to logout"
          >
            {session.status === "authenticated" ? (
              <h3 className="my-0 mx-6 inline-block align-middle leading-[275%] font-sans">
                Logged as <span className="capitalize">{session.data.user?.name}</span>
              </h3>
            ) : (
              <h3 className="my-0 mx-6 inline-block align-middle leading-[275%] font-sans">
                Sign in
              </h3>
            )}
          </div>
        </div>
      </div>

      <div className="p-5">{pageHandler()}</div>
    </div>
  );
}
