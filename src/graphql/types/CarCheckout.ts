import { intArg, list, mutationField, nonNull, objectType, queryField, stringArg } from "nexus"
import { CarCheckout as car_checkout } from "nexus-prisma"
import type { Context } from "@/graphql/context";

export const CarCheckout = objectType({
  name: car_checkout.$name,
  definition(t) {
    t.field(car_checkout.id)
    t.field(car_checkout.id_checkout)
    t.field(car_checkout.id_car)
    t.field(car_checkout.car)
    t.field(car_checkout.price)
    t.field(car_checkout.amount)
  }
})

export const queryCarHistory = queryField("car_checkout", {
  type: list(nonNull(CarCheckout)),
  args: {
    id_checkout: nonNull(stringArg())
  },
  async resolve(_, args, ctx:Context) {
    return await ctx.prisma.carCheckout.findMany({
      where: {
        id_checkout: args.id_checkout,
      }
    })
  }
})

export const addCarCheckout = mutationField("addCarCheckout", {
  type: "Boolean",
  args: {
    id_checkout: nonNull(stringArg()),
    id_car: nonNull(stringArg()),
    price: nonNull(intArg()),
    amount: nonNull(intArg())
  },
  async resolve(_, args, ctx:Context) {
    await ctx.prisma.carCheckout.create({
      data: {
        checkout: { connect: {id: args.id_checkout} },
        car: { connect: {id: args.id_car} },
        price: args.price,
        amount: args.amount
      }
    })
    return true;
  }
})
