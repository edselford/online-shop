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

  const addToCart = (carId: string) => {
    if (session.status === "unauthenticated" || session.data == null) {
      router.push(`/auth/signin?callbackUrl=http://${host}/`);
      return;
    }

    addCart({
      variables: {
        username: session.data.user?.name,
        carId,
        amount: 1,
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
      <div className="w-[80vw] h-[200px] mx-5 grid place-items-center dark:bg-github-dark-bg2 bg-github-light-bg2 rounded-xl border dark:border-github-dark-border border-github-light-border">
        <h4 className="dark:text-slate-500 font-sans">Loading</h4>
      </div>
    );

  if (cars.data.car.length === 0)
    return (
      <div className="h-[80vh] w-full grid place-items-center">
        <h1 className="font-sans">There's no car for sale : (</h1>
      </div>
    );

  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [zfix, setzfix] = useState<string|null>(null)

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 items-center h-full w-full px-10">
        {cars.data &&
          cars.data.car.map((car: Car, i: number) => {
            if (i === 0) {
              return (
                <BigCard
                  key={car.id}
                  car={car}
                  addToCart={() => addToCart(car.id)}
                  onClick={() => {setSelectedId(car.id); setzfix(car.id)}}
                  isSelected={zfix == car.id}
                />
              );
            } else
              return (
                <Card
                  key={car.id}
                  car={car}
                  addToCart={() => addToCart(car.id)}
                  onClick={() => {setSelectedId(car.id), setzfix(car.id)}}
                  isSelected={zfix == car.id}
                />
              );
          })}
      </div>
      <AnimatePresence>
        {(() => {
          if (!selectedId) return <></>;
          const car = cars.data.car.filter(
            (car: Car) => car.id === selectedId
          )[0] as Car;
          return (
            <motion.div className="absolute z-50 left-0 top-0 w-[100vw] h-[100vh] bg-opacity-50 bg-black">
              <motion.div
                className="relative top-[10vh] left-[10vw] w-[80vw] h-[80vh] dark:bg-github-dark-bg2 border border-solid dark:border-github-dark-border rounded-lg overflow-hidden"
                layoutId={selectedId}
                onClick={() => {}}
              >
                <motion.div className="flex flex-row h-full w-full">
                  <motion.div className="w-3/5">
                    <motion.img
                      src={car.image}
                      className="w-full h-[400px] object-cover rounded-br-lg"
                    />
                  </motion.div>
                  <motion.div className="w-2/5 p-5">
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
                    <motion.p className="font-sans">{car.description}</motion.p>
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
