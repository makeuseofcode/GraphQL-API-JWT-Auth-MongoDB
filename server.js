const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
require('dotenv').config();






const  typeDefs  = require("./graphql/typeDefs");
const  resolvers  = require("./graphql/resolvers");



const server = new ApolloServer({ 
    typeDefs, 
    resolvers ,
    context: ({ req }) => ({ req }), 
});
 


const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
    
  })
  .catch(err => {
    console.log(err.message);

  });




