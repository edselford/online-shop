import { AnimatePresence, motion } from "framer-motion";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ({ page, host }: { page: string; host: string }) {
  const session = useSession();
  const router = useRouter();

  const [isDark, setDark] = useState(false);
  const [authDrop, setAuthDrop] = useState(false);

  const darkToggle = (dark: boolean) => {
    setDark(dark);
    document.getElementById("container")?.classList.toggle("dark", dark);
    localStorage.setItem("dark", dark ? "true" : "false");
  };

  useEffect(() => {
    darkToggle(localStorage.getItem("dark") === "true");
  }, []);

  return (
    <>
      <div className="flex flex-row justify-between py-5 px-10">
        <div className="flex flex-row md:justify-between w-[100vw] dark:text-white">
          <h1
            onClick={() => router.push("/")}
            className="font-sans cursor-pointer pt-3 mr-2 md:mr-5"
          >
            Zel Ford
          </h1>
          <div className="w-[200px] flex justify-between items-center">
            <div
              onClick={() => darkToggle(!isDark)}
              className={`m-1 flex items-center cursor-pointer shadow-inner bg-github-light-bg2 dark:bg-github-dark-bg2 rounded-full w-[50px] h-[25px] ${
                isDark && "place-content-end"
              }`}
            >
              <motion.div
                className="w-[20px] h-[20px] mx-1 bg-github-light-border dark:bg-github-dark-border rounded-full"
                layout
                transition={{ duration: 0.1 }}
              ></motion.div>
            </div>
            <button
              onClick={() =>
                router.push("/cart", undefined, { shallow: false })
              }
              className="m-1 dark:hover:bg-github-dark-bg2 hover:bg-github-light-bg2 rounded-lg h-2/3 w-[50px] flex justify-center items-center"
            >
              {cartSVG}
            </button>
            <button
              onClick={() => setAuthDrop(!authDrop)}
              className=" dark:hover:bg-github-dark-bg2 hover:bg-github-light-bg2 rounded-lg h-2/3 w-[50px] flex justify-center items-center"
            >
              {profileSVG}
            </button>
          </div>
        </div>
      </div>
      {authDrop && (
        <div className="absolute z-[99] p-5 right-14 top-20 mt-2 origin-top-right rounded-md shadow-lg w-max dark:bg-github-dark-bg2 border bg-github-light-bg2 border-solid dark:border-github-dark-border border-github-light-border">
          {session.status === "authenticated" ? (
            <div>
              Logged as {session.data.user?.name} <br />
              {session.data.user.role === "ADMIN" && (
                <>
                  <button
                    onClick={() => {
                      router.push(`http://${host}/admin/car`);
                    }}
                    className="dark:text-blue-400 text-blue-800"
                  >
                    {" "}
                    Admin dashboard
                  </button>
                  <br />
                </>
              )}
              <button
                onClick={() => {
                  signOut({
                    redirect: false,
                  });
                  router.push(`http://${host}/`);
                }}
                className="dark:text-blue-400 text-blue-800"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div>
              Not Logged in <br />
              <button
                onClick={() =>
                  router.push(`/auth/signin?callbackUrl=http://${host}/`)
                }
                className="dark:text-blue-400 text-blue-800"
              >
                Login
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

const profileSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="32"
    viewBox="0 96 960 960"
    width="32"
    fill="currentColor"
  >
    <path d="M222 801q63-40 124.5-60.5T480 720q72 0 134 20.5T739 801q44-54 62.5-109T820 576q0-145-97.5-242.5T480 236q-145 0-242.5 97.5T140 576q0 61 19 116t63 109Zm257.814-195Q422 606 382.5 566.314q-39.5-39.686-39.5-97.5t39.686-97.314q39.686-39.5 97.5-39.5t97.314 39.686q39.5 39.686 39.5 97.5T577.314 566.5q-39.686 39.5-97.5 39.5Zm-.219 370q-83.146 0-156.275-31.5t-127.225-86Q142 804 111 731.159 80 658.319 80 575.5q0-82.819 31.5-155.659Q143 347 197.5 293t127.341-85.5Q397.681 176 480.5 176q82.819 0 155.659 31.5Q709 239 763 293t85.5 127Q880 493 880 575.734q0 82.734-31.5 155.5T763 858.5q-54 54.5-127.129 86T479.595 976Z" />
  </svg>
);

const cartSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="32"
    viewBox="0 96 960 960"
    width="32"
    fill="currentColor"
  >
    <path d="M220 976q-24 0-42-18t-18-42V396q0-24 18-42t42-18h110v-10q0-63 43.5-106.5T480 176q63 0 106.5 43.5T630 326v10h110q24 0 42 18t18 42v520q0 24-18 42t-42 18H220Zm140-460q13 0 21.5-8.5T390 486v-90h-60v90q0 13 8.5 21.5T360 516Zm30-180h180v-10q0-38-26-64t-64-26q-38 0-64 26t-26 64v10Zm210 180q13 0 21.5-8.5T630 486v-90h-60v90q0 13 8.5 21.5T600 516Z" />
  </svg>
);
