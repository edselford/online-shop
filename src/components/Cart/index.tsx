import {
  AMOUNT_TANSACTION,
  CartQuery,
  CART_QUERY,
  DEL_CART,
  SAVE_TO_HISTORY,
} from "@/lib/queries";
import { QueryResult, useMutation, useQuery } from "@apollo/client";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function ({
  query: { data, loading, refetch },
}: {
  query: QueryResult;
}) {
  const session = useSession();

  if (session.status === "loading") return <h1>Loading...</h1>;

  const [amountTransaction] = useMutation(AMOUNT_TANSACTION, {
    onCompleted() {
      refetch();
    },
  });

  const [delTransaction] = useMutation(DEL_CART, {
    onCompleted() {
      refetch();
      toast.success("Deleted", {
        style: {
          border: "1px solid #30363D",
          padding: "20px",
          color: "white",
          background: "#161B22",
        },
        iconTheme: {
          primary: "#21262D",
          secondary: "#F6F8FA",
        },
      });
    },
  });

  const [saveToHistory] = useMutation(SAVE_TO_HISTORY, {
    onCompleted() {
      refetch();
      toast.success("Saved", {
        style: {
          border: "1px solid #30363D",
          padding: "20px",
          color: "white",
          background: "#161B22",
        },
        iconTheme: {
          primary: "#21262D",
          secondary: "#F6F8FA",
        },
      });
    },
  });

  function amountHandler(id: string, amount: number, increment: boolean) {
    amountTransaction({
      variables: {
        amountTransactionId: id,
        amount,
        isIncrement: increment,
      },
    });
  }

  return (
    <div className="w-full h-min grid grid-cols-1 lg:grid-cols-4 gap-10 px-10">
      <div className="bg-github-light-bg2 dark:bg-github-dark-bg2 h-max p-5 rounded-xl lg:order-last border border-github-light-border dark:border-github-dark-border">
        <h3 className="text-slate-600 my-0">Total</h3>
        <h1 className="my-0">
          {!loading &&
            data.transaction
              .reduce(
                (a: number, b: CartQuery) => a + b.amount * b.car.price,
                0
              )
              .toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
        </h1>
        <button
          onClick={() =>
            saveToHistory({
              variables: {
                total: data.transaction.reduce(
                  (a: number, b: CartQuery) => a + b.amount * b.car.price,
                  0
                ),
                tanggal: dayjs().toString(),
                transactionIds: data.transaction.map(
                  (cart: CartQuery) => cart.id
                ),
              },
            })
          }
          className="dark:bg-github-dark-bg3 dark:border-none bg-white border border-github-light-border w-full p-3 rounded-lg mt-5"
        >
          Checkout
        </button>
      </div>
      <div className="dark:bg-github-dark-bg2 bg-github-light-bg2 border border-github-light-border dark:border-github-dark-border h-max lg:col-span-3 p-5 rounded-xl flex flex-col items-center">
        {data.transaction.length != 0 ? (
          !loading &&
          data.transaction.map((trs: CartQuery, i: number) => (
            <div key={trs.id} className="w-full">
              <div className="grid grid-cols-6 place-items-center w-full">
                <img
                  src={trs.car.image}
                  className="w-[100px] h-[70px] object-cover rounded-xl"
                />
                <div className="ml-4 place-self-center w-full">
                  <h3 className="font-sans my-0">{trs.car.name}</h3>
                  <h4 className="text-slate-600 my-0">{trs.car.brand}</h4>
                </div>
                <h4 className="my-0 mx-7">
                  {trs.car.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </h4>

                <div className="h-[30px] w-[90px] select-none rounded dark:bg-github-dark-bg1 dark:border-github-dark-border bg-white border border-github-light-border grid grid-cols-3 place-items-stretch">
                  <div
                    className="text-center h-full leading-[200%] cursor-pointer"
                    onClick={() =>
                      trs.amount - 1 >= 1 && amountHandler(trs.id, -1, true)
                    }
                  >
                    -
                  </div>
                  <div className="border-x border-x-github-light-border dark:border-x-github-dark-border text-center h-full leading-[200%]">
                    {trs.amount}
                  </div>
                  <div
                    className="text-center h-full leading-[200%] cursor-pointer"
                    onClick={() => amountHandler(trs.id, 1, true)}
                  >
                    +
                  </div>
                </div>
                <h4 className="my-0 mx-7">
                  {(trs.car.price * trs.amount).toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </h4>
                <button
                  className="dark:bg-github-dark-bg1 bg-white border border-github-light-border dark:border-github-dark-border p-[5px] rounded"
                  onClick={() =>
                    delTransaction({
                      variables: {
                        deleteTransactionId: trs.id,
                      },
                    })
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                  </svg>
                </button>
              </div>
              {i !== data.transaction.length - 1 && (
                <hr className="w-5/6 my-5 dark:border-github-dark-border border-github0kight-border m-auto" />
              )}
            </div>
          ))
        ) : (
          <div className="grid place-items-center h-full">
            <h4 className="text-slate-500 font-sans">Cart is Empty</h4>
          </div>
        )}
      </div>
    </div>
  );
}
