import { Car } from "@prisma/client";

export default function ({
  car,
  addToCart,
}: {
  car: Car;
  addToCart: Function;
}) {
  return (
    <div
      key={car.id}
      className="w-full h-[480px] shadow group m-0 col-span-2 row-span-2 rounded-xl overflow-hidden dark:bg-github-dark-bg2 border border-solid dark:border-github-dark-border border-github-light-border"
    >
      <div className="h-2/3 overflow-hidden relative">
        <img src={car.image} className="w-full h-[300px] object-cover" />
        <button
          onClick={() => addToCart(car.id)}
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
}
