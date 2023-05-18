import { CREATE_USER } from "@/lib/queries";
import { useMutation } from "@apollo/client";
import { FormEvent, useEffect, useState } from "react";
import md5 from "md5";
import { useRouter } from "next/router";

export default function () {
  const router = useRouter();

  const [regInfo, setRegInfo] = useState({
    name: "",
    pass: "",
    pass2: "",
    email: "",
    phone: "",
  });

  const [error, setError] = useState<number | null>(null);
  const [createUser] = useMutation(CREATE_USER);

  const darkToggle = (dark: boolean) => {
    document.getElementById("container")?.classList.toggle("dark", dark);
    localStorage.setItem("dark", dark ? "true" : "false");
  };

  useEffect(() => {
    darkToggle(localStorage.getItem("dark") === "true");
  }, []);

  const submitHandler = function (event: FormEvent) {
    event.preventDefault();

    if (regInfo.pass !== regInfo.pass2) {
      setError(2);
      return;
    }

    createUser({
      variables: {
        name: regInfo.name,
        password: md5(regInfo.pass),
        email: regInfo.email,
        phone: regInfo.phone,
      },
    });

    router.push("/auth/signin");
  };

  const changeHandler = function (name: string, value: string) {
    switch (name) {
      case "username":
        setRegInfo({ ...regInfo, name: value });
        break;
      case "pass":
        setRegInfo({ ...regInfo, pass: value });
        break;
      case "pass2":
        setRegInfo({ ...regInfo, pass2: value });
        break;
      case "email":
        setRegInfo({ ...regInfo, email: value });
        break;
      case "phone":
        setRegInfo({ ...regInfo, phone: value });
        break;
    }
  };

  return (
    <div className="grid place-items-center font-sans dark:bg-github-dark-bg1 min-h-screen dark:text-white">
      <div className="w-[500px]">
        <h1 className="text-center font-sans ">Register</h1>
        <div className="dark:bg-github-dark-bg2 bg-github-light-bg2 p-5 rounded">
          <form onSubmit={submitHandler}>
            {error && (
              <div className="bg-red-500 text-red-100 dark:bg-red-800 dark:text-red-300 h-10 w-full mb-2 p-2 rounded-md">
                Error - Password confirmation must be the same as the password
                entered
              </div>
            )}
            <div className="pb-5">
              <p className="font-sans pl-1">Username</p>
              <input
                type="text"
                name="username"
                required
                onChange={(event) =>
                  changeHandler(event.target.name, event.target.value)
                }
                className="font-sans w-full px-3 py-2 border border-github-light-border rounded-md focus:outline-none focus:border-indigo-300 dark:bg-github-dark-bg1 dark:text-white dark:placeholder-gray-500 dark:border-github-dark-border dark:focus:ring-gray-900 dark:focus:border-gray-500"
              />
            </div>
            <div className="pb-5">
              <p className="font-sans pl-1">Password</p>
              <input
                type="password"
                name="pass"
                required
                onChange={(event) =>
                  changeHandler(event.target.name, event.target.value)
                }
                className="w-full px-3 py-2 border border-github-light-border rounded-md focus:outline-none focus:border-indigo-300 dark:bg-github-dark-bg1 dark:text-white dark:placeholder-gray-500 dark:border-github-dark-border dark:focus:ring-gray-900 dark:focus:border-gray-500"
              />
            </div>

            <div className="pb-5">
              <p className="font-sans pl-1">Confirm Password</p>
              <input
                type="password"
                name="pass2"
                required
                onChange={(event) =>
                  changeHandler(event.target.name, event.target.value)
                }
                className="w-full px-3 py-2 border border-github-light-border rounded-md focus:outline-none focus:border-indigo-300 dark:bg-github-dark-bg1 dark:text-white dark:placeholder-gray-500 dark:border-github-dark-border dark:focus:ring-gray-900 dark:focus:border-gray-500"
              />
            </div>
            <div className="pb-5">
              <p className="font-sans pl-1">Email</p>
              <input
                type="email"
                name="email"
                required
                onChange={(event) =>
                  changeHandler(event.target.name, event.target.value)
                }
                className="w-full px-3 py-2 border border-github-light-border rounded-md focus:outline-none focus:border-indigo-300 dark:bg-github-dark-bg1 dark:text-white dark:placeholder-gray-500 dark:border-github-dark-border dark:focus:ring-gray-900 dark:focus:border-gray-500"
              />
            </div>
            <div className="pb-5">
              <p className="font-sans pl-1">Phone Number</p>
              <input
                type="number"
                name="phone"
                required
                onChange={(event) =>
                  changeHandler(event.target.name, event.target.value)
                }
                className="w-full px-3 py-2 border border-github-light-border rounded-md focus:outline-none focus:border-indigo-300 dark:bg-github-dark-bg1 dark:text-white dark:placeholder-gray-500 dark:border-github-dark-border dark:focus:ring-gray-900 dark:focus:border-gray-500"
              />
            </div>
            <button className="dark:bg-github-dark-bg3 dark:hover:bg-github-dark-border bg-slate-200 hover:bg-github-light-bg2 w-full mt-5 px-5 py-3 rounded">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
