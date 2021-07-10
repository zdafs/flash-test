import { gql } from "@apollo/client";

export const GET_ALL_COMPANIES = gql`
  query GetAllCompanies {
    getAllCompanies {
      id
      name
      cnpj
      tradingName
      address
      chosenBenefits
      # employees [BUG] no employees field
    }
  }
`;

export const FIND_EMPLOYEES_BY_COMPANY_ID = gql`
  query FindEmployeesByCompanyId($id: String!) {
    findCompanyById(id: $id) {
      tradingName
      employees {
        id
        name
        phone
        cpf
        givenBenefits
      }
    }
  }
`;
