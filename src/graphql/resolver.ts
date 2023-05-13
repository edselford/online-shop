import type { Context } from "./context";

export const resolvers = {
  Query: {
    links: async (_parent: any, _args: any, context: Context) => {
      await context.prisma.transaksi.findMany();
    },
  },
};
