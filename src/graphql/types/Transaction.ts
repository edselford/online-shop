import type { Context } from "@/graphql/context";
import {
  booleanArg,
  intArg,
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import { Transaction as transaction } from "nexus-prisma";

export const Transaction = objectType({
  name: transaction.$name,
  definition(t) {
    t.field(transaction.id);
    t.field(transaction.user_id);
    // t.field(transaction.user);
    t.field(transaction.car_id);
    t.field(transaction.car);
    t.field(transaction.amount);
  },
});

export const queryTransaction = queryField("transaction", {
  type: list(nonNull(Transaction)),
  args: {
    id: nonNull(stringArg()),
  },
  async resolve(_, args, ctx: Context) {
    return await ctx.prisma.transaction.findMany({
      where: {
        user_id: args.id
      },
    });
  },
});

export const addTransaction = mutationField("addTransaction", {
  type: "Boolean",
  args: {
    username: nonNull(stringArg()),
    car_id: nonNull(stringArg()),
    amount: nonNull(intArg()),
  },
  async resolve(_, args, ctx: Context) {
    const dup = await ctx.prisma.transaction.findFirst({
      where: {
        car_id: args.car_id,
      },
    });
    if (dup) {
      setAmount(ctx, dup.id, 1, true);
      return true;
    }
    await ctx.prisma.transaction.create({
      data: {
        user: { connect: { username: args.username } },
        car: { connect: { id: args.car_id } },
        amount: args.amount,
      },
    });
    return true;
  },
});

export const deleteTransaction = mutationField("deleteTransaction", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
  },
  async resolve(_, args, ctx: Context) {
    await ctx.prisma.transaction.delete({
      where: {
        id: args.id,
      },
    });
    return true;
  },
});

export const amountTransaction = mutationField("amountTransaction", {
  type: "Boolean",
  args: {
    id: nonNull(stringArg()),
    amount: nonNull(intArg()),
    isIncrement: nonNull(booleanArg()),
  },
  async resolve(_, args, ctx: Context) {
    await setAmount(ctx, args.id, args.amount, args.isIncrement);
    return true;
  },
});

async function setAmount(ctx: Context, id: string, amount: number, increment: boolean) {
  return await ctx.prisma.transaction.update({
    data: {
      amount: increment
        ? {
            increment: amount,
          }
        : amount,
    },
    where: {
      id: id,
    },
  });
}
