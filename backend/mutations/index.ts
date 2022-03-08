import { graphQLSchemaExtension } from "@keystone-6/core";
import customSignup from "./customSignup";
import membershipSignup from "./membershipSignup";

// make a fake graphql tagged template literal
const graphql = String.raw;

export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: graphql`
    type Mutation {
      membershipSignup(variationId: ID!, userId: ID!, returnUrl: String!): JSON
      customSignup(
        email: String!
        name: String!
        password: String
        preferredName: String
        phone: String!
        phoneType: String
        birthYear: Int
        contact: Boolean
        createUser: Boolean
        suburb: String
      ): JSON
    }
  `,
  resolvers: {
    Mutation: {
      membershipSignup,
      customSignup,
    },
  },
});
