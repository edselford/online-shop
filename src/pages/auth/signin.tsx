import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { ChangeEvent, FormEvent, useState } from "react";

const SignIn: NextPage = (_props) => {
  const router = useRouter();
  const [logInfo, setLogInfo] = useState({ username: "", password: "" });
  const [error, setError] = useState(false);

  const submitHandler = async (event:FormEvent) => {
    event.preventDefault();
    const res = await signIn("credentials", {
      username: logInfo.username,
      password: logInfo.password,
      redirect: false,
    });

    if (!res?.ok) {
      setError(true);
      return
    }

    if (router.query.callbackUrl) {
      router.push(new URL(router.query.callbackUrl as string));
    } else {
      router.push("/")
    }

    
  };

  const changeHandler = (name: string, value: string) => {
    if (name === "username") {
      setLogInfo({ ...logInfo, username: value });
    } else if (name === "password") {
      setLogInfo({ ...logInfo, password: value });
    }
  };

  return (
    <div className="grid place-items-center font-sans dark:bg-github-dark-bg1 min-h-screen dark:text-white">
      <div>
        <h1 className="text-center font-sans">Log In</h1>
        <div className="dark:bg-github-dark-bg2 bg-github-light-bg2 p-5 rounded">
          <form onSubmit={submitHandler}>
            {error && (
              <div className="bg-red-500 text-red-100 dark:bg-red-800 dark:text-red-300 h-10 w-full mb-2 p-2 rounded-md">
                Error - Username / Password Incorrect
              </div>
            )}
            <div className="pb-5">
              <p className="font-sans pl-1">Username</p>
              <input
                type="text"
                name="username"
                required
                onChange={(event) => changeHandler(event.target.name, event.target.value)}
                className="font-sans w-full px-3 py-2 border border-github-light-border rounded-md focus:outline-none focus:border-indigo-300 dark:bg-github-dark-bg1 dark:text-white dark:placeholder-gray-500 dark:border-github-dark-border dark:focus:ring-gray-900 dark:focus:border-gray-500"
              />
            </div>
            <div>
              <p className="font-sans pl-1">Password</p>
              <input
                type="password"
                name="password"
                required
                onChange={(event) => changeHandler(event.target.name, event.target.value)}
                className="w-full px-3 py-2 border border-github-light-border rounded-md focus:outline-none focus:border-indigo-300 dark:bg-github-dark-bg1 dark:text-white dark:placeholder-gray-500 dark:border-github-dark-border dark:focus:ring-gray-900 dark:focus:border-gray-500"
              />
            </div>
            <button
              onClick={() => console.log(logInfo)}
              className="dark:bg-github-dark-bg3 dark:hover:bg-github-dark-border bg-slate-200 hover:bg-github-light-bg2 w-full mt-5 px-5 py-3 rounded"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
