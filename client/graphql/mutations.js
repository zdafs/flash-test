import { gql } from "@apollo/client";
import { BENEFIT_TYPE } from "./constants";

export const CREATE_COMPANY = gql`
  mutation CreateCompany(
    $name: String!
    $tradingName: String!
    $cnpj: String!
    $address: String!
    $chosenBenefits: [${BENEFIT_TYPE}!]!
  ) {
    createCompany(
      name: $name
      tradingName: $tradingName
      cnpj: $cnpj
      address: $address
      chosenBenefits: $chosenBenefits
    ) {
      id
      name
      cnpj
      tradingName
      address
      chosenBenefits
    }
  }
`;

export const CREATE_EMPLOYEE = gql`
  mutation CreateEmployee(
    $name: String!
    $phone: String!
    $cpf: String!
    $givenBenefits: [Benefits!]!
    $address: String!
    $companies: [String!]!
  ) {
    createEmployee(
      name: $name
      phone: $phone
      cpf: $cpf
      givenBenefits: $givenBenefits
      address: $address
      companies: $companies
    ) {
      id
      name
      phone
      cpf
      givenBenefits
      address
    }
  }
`;
