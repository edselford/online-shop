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

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 items-center h-full w-full px-10">
      {cars.data &&
        cars.data.car.map((car: Car, i: number) => {
          if (i === 0) {
            return (
              <BigCard
                key={car.id}
                car={car}
                addToCart={() => addToCart(car.id)}
              />
            );
          } else
            return (
              <Card
                key={car.id}
                car={car}
                addToCart={() => addToCart(car.id)}
              />
            );
        })}
    </div>
  );
};
