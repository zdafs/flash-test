import apolloServer from "apollo-server";

const { gql } = apolloServer

export const typeDefs = gql`
  type Company {
    id: ID
    name: String
    tradingName: String
    cnpj: String
    address: String
    chosenBenefits: [String]
  }

  enum Benefits {
    vr
    vt
    gympass
  }

  type Query {
    getAllCompanies: [Company]
    findCompanyById(id: String!): Company
  }

  type Mutation {
    createCompany(
      name: String!
      tradingName: String!
      cnpj: String!
      address: String!
      chosenBenefits: [Benefits!]! # [BUG?] permits saving array with null value
    ): Company
  }
`;
