import dayjs from "dayjs";
import { intArg, list, mutationField, nonNull, objectType, stringArg } from "nexus";
import { History as history } from "nexus-prisma";
import type { Context } from "../context";

export const History = objectType({
  name: history.$name,
  definition(t) {
    t.field(history.id);
    t.field(history.total);
    // t.field(history.cars)
  },
});

export const saveToHistory = mutationField("saveToHistory", {
  type: "Boolean",
  args: {
    total: nonNull(intArg()),
    tanggal: nonNull(stringArg()),
    transaction_ids: nonNull(list(nonNull(stringArg()))),
  },
  async resolve(_, args, ctx: Context) {
    const transaction = (
      await ctx.prisma.transaction.findMany({
        where: {
          id: { in: args.transaction_ids },
        },
        include: {
          car: true,
        },
      })
    ).map((temp) => {
      return {
        id_car: temp.car_id,
        price: temp.car.price,
        amount: temp.amount,
      };
    });

    transaction.forEach(async (res) => {
      await ctx.prisma.car.update({
        where: {
          id: res.id_car
        },
        data: {
          stock: {
            decrement: res.amount
          }
        }
      })
    })

    

    await ctx.prisma.transaction.deleteMany({
      where: {
        id: { in: args.transaction_ids },
      },
    });

    await ctx.prisma.history.create({
      data: {
        total: args.total,
        tanggal: dayjs(args.tanggal).toDate(),
        cars: {
          createMany: {
            data: transaction,
          },
        },
      },
    });

    return true;
  },
});
