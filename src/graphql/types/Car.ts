import { Context } from "@/graphql/context";
import { intArg, list, mutationField, nonNull, objectType, queryField, stringArg } from "nexus";
import { Car as car } from "nexus-prisma";

export const Car = objectType({
  name: car.$name,
  definition(t) {
    t.field(car.id);
    t.field(car.name);
    t.field(car.brand);
    t.field(car.description);
    t.field(car.image);
    t.field(car.price);
    t.field(car.stock);
    t.field(car.transaction);
  },
});

export const carQuery = queryField("car", {
  type: list(nonNull(Car)),
  async resolve(_, __, ctx: Context) {
    return await ctx.prisma.car.findMany({
      orderBy: {
        name: "asc"
      }
    })
  }
})

export const createCar = mutationField("createCar", {
  type: "Boolean",
  args: {
    name: nonNull(stringArg()),
    brand: nonNull(stringArg()),
    desc: nonNull(stringArg()),
    price: nonNull(intArg()),
    stock: nonNull(intArg()),
    image: nonNull(stringArg())
  }, 
  async resolve(_, args, ctx:Context) {
    await ctx.prisma.car.create({
      data: {
        name: args.name,
        brand: args.brand,
        description: args.desc,
        price: args.price,
        stock: args.stock,
        image: args.image
      }
    })
    return true;
  }

})
