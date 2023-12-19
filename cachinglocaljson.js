// Server-side (Node.js with Express and Apollo Server):
// Install Required Packages:
// npm install express apollo-server-express graphql
// Create a Simple GraphQL Server:
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const fs = require('fs');

const app = express();

// Read data from a local JSON file
const rawData = fs.readFileSync('data.json');
const dataset = JSON.parse(rawData);

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

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ dataset }),
});

server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
);
// Client-side (React with Apollo Client):
// Install Required Packages:
// npm install @apollo/client react react-dom
// Create a Simple React App:
// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import App from './App';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql', // Replace with your GraphQL server URL
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);

// src/App.js
import React from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_ALL_USERS = gql`
  query GetAllUsers {
    getAllUsers {
      id
      name
      email
    }
  }
`;

const App = () => {
  const { loading, error, data } = useQuery(GET_ALL_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {data.getAllUsers.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
