// Here's a simple example using Node.js and axios to make a GraphQL query to another endpoint:

// First, install the required dependencies:

// bash
// Copy code
// npm install axios
// Then, you can create a simple GraphQL resolver that makes a request to another GraphQL API:


const axios = require('axios');

const resolvers = {
  Query: {
    getUserWithPosts: async (parent, args, context, info) => {
      // Assume you have a GraphQL API endpoint for users
      const userApiUrl = 'https://example.com/user-graphql-endpoint';

      // Make a GraphQL query to get a user by ID
      const userQuery = `
        query {
          getUserById(userId: "${args.userId}") {
            id
            name
            email
            posts {
              id
              title
              body
            }
          }
        }
      `;

      try {
        // Make an HTTP request to the user API
        const userResponse = await axios.post(userApiUrl, { query: userQuery });

        // Return the data from the user API response
        return userResponse.data.data.getUserById;
      } catch (error) {
        console.error('Error fetching user data:', error);
        throw new Error('Failed to fetch user data');
      }
    },
  },
};

module.exports = resolvers;
// In this example:

// We have a getUserWithPosts query that takes a userId as an argument.
// We construct a GraphQL query (userQuery) to fetch the user and their posts.
// We use the axios.post method to make an HTTP request to the other GraphQL API.
// The response from the other API is then returned as the result of the getUserWithPosts query.
// Remember to adapt the code according to your specific GraphQL APIs and their endpoints. Also, consider handling errors and security aspects such as input validation and authentication based on your application's requirements.
