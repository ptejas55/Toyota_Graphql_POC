//Install Required Packages:  npm install express apollo-server-express graphql express-graphql faker
//Create a Simple GraphQL Server:
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const { buildSchema } = require('graphql');
const faker = require('faker');

const app = express();

// Generate a large dataset for demonstration purposes
const generateLargeDataset = () => {
  const dataset = [];
  for (let i = 0; i < 10000; i++) {
    dataset.push({
      id: i.toString(),
      name: faker.name.findName(),
      email: faker.internet.email(),
    });
  }
  return dataset;
};

const typeDefs = gql`
  type Query {
    getUser(id: ID!): User
    getAllUsers: [User]
  }

  type User {
    id: ID!
    name: String
    email: String
  }
`;

const resolvers = {
  Query: {
    getUser: (parent, { id }, context, info) => {
      // Simulating a delay for illustrative purposes
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = context.dataset.find((user) => user.id === id);
          resolve(user);
        }, 100);
      });
    },
    getAllUsers: (parent, args, context, info) => {
      // Simulating a delay for illustrative purposes
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(context.dataset);
        }, 100);
      });
    },
  },
};

const dataset = generateLargeDataset();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ dataset }),
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
);
