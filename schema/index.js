const grapql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = grapql;
const _ = require("lodash");
const axios = require("axios");

// Dummy
const users = [
  { id: "23", firstName: "Mark", age: 40 },
  { id: "24", firstName: "Claire", age: 41 },
  { id: "25", firstName: "Jm", age: 11 },
  { id: "25", firstName: "Basti", age: 9 },
];
// Company Type
const CompanyType = new GraphQLObjectType({
  name: "Company",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
  },
});

// User Type
const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    // Associate Company to a particular user
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        console.log(parentValue);
        return axios
          .get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then((response) => response.data);
      },
    },
  },
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        //   Dummy Data
        // return _.find(users, { id: args.id });
        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then((response) => response.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
