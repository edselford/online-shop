import {
  list,
  mutationField,
  nonNull,
  objectType,
  queryField,
  stringArg,
} from "nexus";
import { User as user } from "nexus-prisma";
import { Context } from "../context";

export const User = objectType({
  name: user.$name,
  definition(t) {
    t.field(user.id);
    t.field(user.username);
    t.field(user.email);
    t.field(user.phone);
  },
});

export const userQuery = queryField("user", {
  type: list(nonNull(User)),
  async resolve(_, __, ctx: Context) {
    return await ctx.prisma.user.findMany();
  },
});

export const createUser = mutationField("createUser", {
  type: "Boolean",
  args: {
    name: nonNull(stringArg()),
    password: nonNull(stringArg()),
    email: nonNull(stringArg()),
    phone: nonNull(stringArg()),
  },
  async resolve(_, args, ctx: Context) {
    await ctx.prisma.user.create({
      data: {
        username: args.name,
        password: args.password,
        email: args.email,
        phone: args.phone,
      },
    });

    return true;
  },
});
