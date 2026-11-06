import {defineSchema, defineTable} from "convex/server";
import {v} from "convex/values";

 const schema = defineSchema({
    todos: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
})

export default schema;