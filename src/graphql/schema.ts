import { makeSchema } from "nexus";
import NexusPrismaScalars from "nexus-prisma/scalars";
import * as types from "./types";
import { join } from "path";

export const schema = makeSchema({
  types: [NexusPrismaScalars, types],
  outputs: {
    typegen: join(
      process.cwd(),
      "node_modules",
      "@types",
      "nexus-typegen",
      "index.d.ts"
    ),
    schema: join(process.cwd(), "src", "graphql", "schema.graphql"),
  },
  contextType: {
    export: "Context",
    module: join(process.cwd(), "src", "graphql", "context.ts"),
  },
});
