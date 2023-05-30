import { toast } from "react-hot-toast";
import { GetServerSideProps } from "next";
import { QueryResult, useMutation, useQuery } from "@apollo/client";
import { ADD_CART, CAR_QUERY } from "@/lib/queries";
import { Car } from "@prisma/client";
import BigCard from "@/components/Home/BigCard";
import Card from "@/components/Home/Card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Container from "@/components/Container";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export const getServerSideProps: GetServerSideProps<{
  host: string | null;
}> = async (context) => ({
  props: { host: context.req.headers.host || null },
});

export default function ({ host }: { host: string | null }) {
  const session = useSession();
  const router = useRouter();

  const cars = useQuery(CAR_QUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const [addCart] = useMutation(ADD_CART, {
    onCompleted() {
      toast.success("Added to Cart", {
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

  const addToCart = (carId: string, amount: number = 1) => {
    if (session.status === "unauthenticated" || session.data == null) {
      router.push(`/auth/signin?callbackUrl=http://${host}/`);
      return;
    }

    addCart({
      variables: {
        username: session.data.user?.name,
        carId,
        amount,
      },
    });
  };

  return (
    <Container host={host}>
      <Body cars={cars} addToCart={addToCart} />
    </Container>
  );
}

const Body = function ({
  cars,
  addToCart,
}: {
  cars: QueryResult;
  addToCart: Function;
}) {
  console.log(cars);

  if (cars.loading)
    return (
      <div className="h-[80vh] w-full grid place-items-center">
        <h1 className="font-sans">Loading</h1>
      </div>
    );

  if (cars.data.car.length === 0)
    return (
      <div className="h-[80vh] w-full grid place-items-center">
        <h1 className="font-sans">There's no car for sale : (</h1>
      </div>
    );

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [zfix, setzfix] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(0);

  return (
    <div className="h-full">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 items-center h-full w-full px-10">
        {cars.data &&
          cars.data.car.map((car: Car, i: number) => {
            if (i === 0) {
              return (
                <BigCard
                  key={car.id}
                  car={car}
                  addToCart={() => addToCart(car.id)}
                  onClick={() => {
                    setSelectedId(car.id);
                    setzfix(car.id);
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth"
                    })
                  }}
                  isSelected={zfix == car.id}
                />
              );
            } else
              return (
                <Card
                  key={car.id}
                  car={car}
                  addToCart={() => addToCart(car.id)}
                  onClick={() => {
                    setSelectedId(car.id), setzfix(car.id);
                    window.scrollTo({
                      top: 0,
                      behavior: "smooth"
                    })
                  }}
                  isSelected={zfix == car.id}
                />
              );
          })}
      </div>
      <AnimatePresence>
        {(() => {
          if (!selectedId) {
            document.body.style.overflow = "scroll"
            return <></>
          };
          const car = cars.data.car.filter(
            (car: Car) => car.id === selectedId
          )[0] as Car;
          document.body.style.overflow = "hidden";
          return (
            <motion.div className="absolute z-50 left-0 top-0 w-[100vw] h-[100%] bg-opacity-50 bg-black">
              <motion.div
                className="md:p-5 relative md:top-[5vh] md:left-[10vw] md:w-[80vw] md:h-[90vh] lg:h-[60vh] lg:top-[20vh] w-[100vw] h-[100vh] overflow-scroll dark:bg-github-dark-bg2 bg-github-light-bg2 border border-solid dark:border-github-dark-border border-github-light-border md:rounded-2xl"
                layoutId={selectedId}
                onClick={() => {}}
              >
                <motion.div className="flex lg:flex-row flex-col h-full w-full">
                  <motion.div className="lg:w-3/5 w-full">
                    <motion.img
                      src={`/images/${car.image}`}
                      className="w-full h-[400px] object-cover md:rounded-lg"
                    />
                  </motion.div>
                  <motion.div className="lg:w-2/5 w-full p-5">
                    <motion.div
                      className="absolute right-4 top-4 rounded-lg dark:bg-github-dark-bg1 bg-github-light-bg2 cursor-pointer"
                      onClick={() => setSelectedId(undefined)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        className="rotate-45"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                      </svg>
                    </motion.div>
                    <motion.h1 className="font-sans">{car.name}</motion.h1>
                    <motion.h3 className="font-sans text-slate-400">
                      {car.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </motion.h3>
                    <motion.p className="font-sans">{car.description}</motion.p>
                    <motion.p className="font-sans text-slate-400">Stock : {car.stock}</motion.p>
                    <div className="!pt-5">
                      <p className="font-sans !pl-1">Amount</p>
                      <input
                        type="number"
                        name="amount"
                        disabled={car.stock == 0}
                        required
                        value={amount}
                        onChange={({ target }) =>
                          setAmount(parseInt(target.value))
                        }
                        className="w-full !px-3 !py-2 border border-github-light-border rounded-md focus:outline-none focus:border-indigo-300 dark:bg-github-dark-bg1 dark:text-white dark:placeholder-gray-500 dark:border-github-dark-border dark:focus:ring-gray-900 dark:focus:border-gray-500"
                      />
                    </div>
                    <motion.button
                      disabled={car.stock == 0}
                      onClick={() => addToCart(car.id, amount)}
                      className="dark:bg-github-dark-bg3 disabled:bg-github-dark-bg1 dark:border-none bg-white border border-github-light-border w-full p-3 rounded-lg mt-5"
                    >
                      {car.stock == 0 ? "Out of Stock" : "Add to Cart"}
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
};
