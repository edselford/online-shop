import { intArg, list, mutationField, nonNull, objectType, queryField, stringArg } from "nexus"
import { CarHistory as car_history } from "nexus-prisma"
import type { Context } from "@/graphql/context";

export const CarHistory = objectType({
  name: car_history.$name,
  definition(t) {
    t.field(car_history.id)
    t.field(car_history.id_history)
    // t.field(carHistory.history)
    t.field(car_history.id_car)
    t.field(car_history.car)
    t.field(car_history.price)
    t.field(car_history.amount)
  }
})

export const queryCarHistory = queryField("car_history", {
  type: list(nonNull(CarHistory)),
  args: {
    id_history: nonNull(stringArg())
  },
  async resolve(_, args, ctx:Context) {
    return await ctx.prisma.carHistory.findMany({
      where: {
        id_history: args.id_history,
      }
    })
  }
})

export const addCarHistory = mutationField("addCarHistory", {
  type: "Boolean",
  args: {
    id_history: nonNull(stringArg()),
    id_car: nonNull(stringArg()),
    price: nonNull(intArg()),
    amount: nonNull(intArg())
  },
  async resolve(_, args, ctx:Context) {
    await ctx.prisma.carHistory.create({
      data: {
        history: { connect: {id: args.id_history} },
        car: { connect: {id: args.id_car} },
        price: args.price,
        amount: args.amount
      }
    })
    return true;
  }
})
