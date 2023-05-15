import { ADD_CART, AMOUNT_TANSACTION, CAR_QUERY } from "@/lib/queries";
import { useMutation, useQuery } from "@apollo/client";
import { Car } from "@prisma/client";
import { toast } from "react-hot-toast";

export default function Home({ username, carsFetch }: { username: string; carsFetch: Function }) {
  const cars = useQuery(CAR_QUERY, {
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const [addCart] = useMutation(ADD_CART, {
    onCompleted() {
      carsFetch();
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

  const addCartHandler = (carId: string) => {
    addCart({
      variables: {
        username,
        carId,
        amount: 1,
      },
    });
  };

  if (cars.loading)
    return (
      <div className="w-full h-[200px] mx-5 grid place-items-center dark:bg-github-dark-bg2 bg-github-light-bg2 rounded-xl border dark:border-github-dark-border border-github-light-border">
        <h4 className="dark:text-slate-500 font-sans">Loading</h4>
      </div>
    );
    

  if (cars.data.car.length === 0) return <div className="h-[80vh] w-full grid place-items-center">
    <h1 className="font-sans">There's no car for sale : (</h1>
  </div>

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-10 items-center h-full w-full px-10">
      {cars.data &&
        cars.data.car.map((car: Car, i: number) => {
          if (i === 0) {
            return (
              <div
                key={car.id}
                className="w-full h-[480px] shadow group m-0 col-span-2 row-span-2 rounded-xl overflow-hidden dark:bg-github-dark-bg2 border border-solid dark:border-github-dark-border border-github-light-border"
              >
                <div className="h-2/3 overflow-hidden relative">
                  <img src={car.image} className="w-full h-[300px] object-cover" />
                  <button
                    onClick={() => addCartHandler(car.id)}
                    className="absolute top-3 right-3 dark:bg-github-dark-bg1 bg-white rounded-xl group-hover:opacity-100 opacity-0 transition duration-75 ease-in-out text-slate-400 hover:text-slate-600 dark:text-slate-600  dark:hover:text-slate-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="30"
                      width="30"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                  </button>
                </div>
                <div className="p-5">
                  <div className="flex flex-row justify-between">
                    <h1 className="font-sans">{car.name}</h1>
                    <h3 className="font-sans m-2 text-slate-400">
                      {car.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </h3>
                  </div>
                  <p>{car.description}</p>
                </div>
              </div>
            );
          } else
            return (
              <div
                key={car.id}
                className="w-full h-[220px] shadow group m-0 rounded-xl overflow-hidden dark:bg-github-dark-bg2 border border-solid dark:border-github-dark-border border-github-light-border"
              >
                <div className="h-4/6 overflow-hidden relative">
                  <img src={car.image} className="w-full h-[130px] object-cover" />
                  <button
                    onClick={() => car.stock != 0 && addCartHandler(car.id)}
                    className="absolute top-3 right-3 dark:bg-github-dark-bg1 bg-white rounded-xl group-hover:opacity-100 opacity-0 transition duration-75 ease-in-out text-slate-400 hover:text-slate-600 dark:text-slate-600  dark:hover:text-slate-400"
                  >
                    {car.stock != 0 ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="30"
                        width="30"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                      </svg>
                    ) : (
                      <div className="p-5">Out of Stock</div>
                    )}
                  </button>
                </div>
                <div className="px-3">
                  <h3 className="mb-0  font-sans">{car.name}</h3>
                  <p className="text-slate-400 font-sans">
                    {car.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </p>
                </div>
              </div>
            );
        })

        
        }
    </div>
  );
}
