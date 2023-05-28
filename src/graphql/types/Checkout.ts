import { Checkout as checkout } from "nexus-prisma";
import { enumType, intArg, list, mutationField, nonNull, objectType, stringArg } from "nexus";
import { Context } from "../context";
import dayjs from "dayjs";



export const Checkout = objectType({
  name: checkout.$name,
  definition(t) {
      t.field(checkout.id);
      t.field(checkout.total);
      t.field('status', {
        type: StatusEnum
      }),
      t.field(checkout.user),
      t.field(checkout.provinsi),
      t.field(checkout.kota),
      t.field(checkout.alamat),
      t.field(checkout.kodepos)
  },
})

const StatusEnum = enumType({
  name: "StatusEnum",
  members: ['APPROVED','REJECTED','PENDING']
})

export const addToCheckout = mutationField("addToCheckout", {
  type: "Boolean",
  args: {
    total: nonNull(intArg()),
    tanggal: nonNull(stringArg()),
    provinsi: nonNull(stringArg()),
    kota: nonNull(stringArg()),
    alamat: nonNull(stringArg()),
    kodepos: nonNull(stringArg()),
    user_id: nonNull(stringArg()),
    transaction_ids: nonNull(list(nonNull(stringArg()))),
  },

  async resolve(_, args, ctx:Context) {
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

    await ctx.prisma.checkout.create({
      data: {
        total: args.total,
        tanggal: dayjs(args.tanggal).toDate(),
        status: "PENDING",
        provinsi: args.provinsi,
        kota: args.kota,
        alamat: args.alamat,
        kodepos: args.kodepos,
        user: {
          connect: {
            id: args.user_id
          }
        },
        cars: {
          createMany: {
            data: transaction
          }
        }
      }
    })

    return true;

  }
})