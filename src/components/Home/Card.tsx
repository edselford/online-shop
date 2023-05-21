import { Car } from "@prisma/client";
import { motion } from "framer-motion";

export default function ({
  car,
  addToCart,
  onClick,
  isSelected
}: {
  car: Car;
  addToCart: Function;
  onClick: Function;
  isSelected: boolean;
}) {
  return (
    <motion.div
      layoutId={car.id}
      key={car.id}
      className={`w-full h-[220px] shadow group m-0 rounded-xl overflow-hidden dark:bg-github-dark-bg2 border border-solid dark:border-github-dark-border border-github-light-border ${isSelected && "z-50"}`}
    >
      <div className="h-4/6 overflow-hidden relative">
        <img src={`/images/${car.image}`} className="w-full h-[130px] object-cover" />
        <button
          onClick={() => car.stock != 0 && addToCart(car.id)}
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
      <div className="px-3 cursor-pointer" onClick={() => onClick()}>
        <h3 className="mb-0  font-sans">{car.name}</h3>
        <p className="text-slate-400 font-sans">
          {car.price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </p>
      </div>
    </motion.div>
  );
}
