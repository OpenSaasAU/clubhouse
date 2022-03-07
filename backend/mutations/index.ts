import { graphQLSchemaExtension } from "@keystone-6/core";
import becomeFriend from "./becomeFriend";
import customSignup from "./customSignup";

// make a fake graphql tagged template literal
const graphql = String.raw;

export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: graphql`
    type Mutation {
      becomeFriend(
        email: String!
        name: String!
        password: String
        preferredName: String
        phone: String!
        phoneType: String
        birthYear: Int
        contact: Boolean
        feeAmount: Int!
        token: String!
        meeting: Boolean
      ): JSON
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
      becomeFriend,
      customSignup,
    },
  },
});
