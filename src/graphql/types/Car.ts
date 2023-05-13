import { Context } from "@/graphql/context";
import { list, nonNull, objectType, queryField, stringArg } from "nexus";
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
