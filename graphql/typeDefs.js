const { gql } = require("apollo-server");

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    password: String!
    role: String!
  }

  input UserInput {
    name: String!
    password: String!
    role: String!
  }

  type TokenResult {
    message: String
    token: String
  }

  type Query { 
    users: [User] 
  }

  type Mutation {
    register(userInput: UserInput): User
    login(name: String!, password: String!, role: String!): TokenResult
  }
`;

module.exports = typeDefs;
