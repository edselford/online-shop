import { Jual as jual } from "nexus-prisma";
import { intArg, list, mutationField, nonNull, objectType, stringArg } from "nexus";
import type { Context } from "../context";
import dayjs from "dayjs";

export const Jual = objectType({
  name: jual.$name,
  definition(t) {
    t.field(jual.id);
    t.field(jual.total);
  },
});

export const saveToJual = mutationField("saveToJual", {
  type: Jual,
  args: {
    total: nonNull(intArg()),
    tanggal: nonNull(stringArg()),
    transaksi_ids: nonNull(list(nonNull(stringArg()))),
  },
  async resolve(_, args, ctx: Context) {
    const transaksi = (
      await ctx.prisma.transaksi.findMany({
        where: {
          id: { in: args.transaksi_ids },
        },
        include: {
          barang: true,
        },
      })
    ).map((tmp) => {
      return {
        id_barang: tmp.id_barang,
        harga: tmp.barang.harga,
        jumlah: tmp.jumlah,
      };
    });

    await ctx.prisma.transaksi.deleteMany({
      where: {
        id: { in: args.transaksi_ids }
      }
    })

    return await ctx.prisma.jual.create({
      data: {
        total: args.total,
        tanggal: dayjs(args.tanggal).toDate(),
        penjualan: {
          createMany: {
            data: transaksi,
          },
        },
      },
    });
  },
});
