const { buildSchema } = require("graphql");

const schema = buildSchema(`
    scalar DateTime

    type Contract {
        _id: ID!
        companyName: String!
        type: String!
        validFrom: DateTime!
        validTo: DateTime!
        createdAt: DateTime
        updatedAt: DateTime
    }

    input AddContractInput {
        companyName: String!
        type: String!
        validFrom: DateTime!
        validTo: DateTime!
    }

    input UpdateContractInput {
        companyName: String
        type: String
        validFrom: DateTime
        validTo: DateTime
    }

    type Query {
        getContracts: [Contract!]!
        getContractById(id: ID!): Contract
    }

    type Mutation {
        addContract(input: AddContractInput!): Contract!
        updateContract(id: ID!, input: UpdateContractInput!): Contract!
        deleteContract(id: ID!): Contract!
    }
`)

module.exports = schema;
