import { list } from "@keystone-6/core";
import { text, relationship, password } from "@keystone-6/core/fields";

export const User = list({
  fields: {
    name: text({ validation: { isRequired: true } }),
    email: text({ validation: { isRequired: true }, isIndexed: true }),
    subjectId: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    preferredName: text(),
    posts: relationship({ ref: "Post.author", many: true }),
    role: relationship({
      ref: "Role.assignedTo",
      many: false,
    }),
    stripeCustomerId: text(),
    memberships: relationship({
      ref: "Membership.user",
      many: true,
    }),
  },
});
