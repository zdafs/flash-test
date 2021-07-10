import apolloServer from "apollo-server";

const { gql } = apolloServer

export const typeDefs = gql`
  enum Benefits {
    vr
    vt
    gympass
  }

  type Employee {
    id: ID
    name: String
    phone: String
    cpf: String
    givenBenefits: [Benefits]
    address: String
  }

  type Company {
    id: ID
    name: String
    tradingName: String
    cnpj: String
    address: String
    chosenBenefits: [Benefits]
    employees: [Employee]
  }

  type Query {
    getAllCompanies: [Company]
    findCompanyById(id: String!): Company
    getAllEmployees: [Employee]
    findEmployeeById(id: String!): Employee
  }

  type Mutation {
    createCompany(
      name: String!
      tradingName: String!
      cnpj: String!
      address: String!
      chosenBenefits: [Benefits!]! # [BUG?] permits saving array with null value
    ): Company

    createEmployee(
      name: String!
      phone: String!
      cpf: String!
      givenBenefits: [Benefits!]!
      address: String!
      companies: [String!]!
    ): Employee
  }
`;
