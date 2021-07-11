import aServer from "apollo-server";
import mongoose from "mongoose";
import { describe, expect, it, jest } from "@jest/globals";
import { CompaniesAPI } from "../../company/company.data-source";
import { EmployeeAPI } from "../../employee/employee.data-source.js";
import { resolvers } from "../../graphql/resolvers.js";
import { typeDefs } from "../../graphql/schema.js";

jest.mock('../../company/company.data-source.js');
jest.mock('../../employee/employee.data-source.js');

const { ApolloServer } = aServer;

const GET_ALL_COMPANIES = `
  query GetAllCompanies {
    getAllCompanies {
      id
      name
      cnpj
      tradingName
      address
      chosenBenefits
    }
  }
`;

const FIND_BY_COMPANY_ID = `
  query FindByCompanyId($id: String!) {
    findCompanyById(id: $id) {
      id
      name
      cnpj
      tradingName
      address
      chosenBenefits
    }
  }
`;

const CREATE_COMPANY = `
  mutation CreateCompany(
    $name: String!
    $cnpj: String!
    $tradingName: String!
    $address: String!
    $chosenBenefits: [Benefits!]!
  ) {
    createCompany(
      name: $name
      cnpj: $cnpj
      tradingName: $tradingName
      address: $address
      chosenBenefits: $chosenBenefits
    ) {
      id
    }
  }
`;

const GET_ALL_EMPLOYEES = `
  query GetAllEmployees {
    getAllEmployees {
      id
      name
      cpf
      phone
      address
      givenBenefits
    }
  }
`;

const FIND_BY_EMPLOYEE_ID = `
  query FindByEmployeeId($id: String!) {
    findEmployeeById(id: $id) {
      id
      name
      cpf
      phone
      address
      givenBenefits
    }
  }
`;

const CREATE_EMPLOYEE = `
  mutation CreateEmployee(
    $name: String!
    $cpf: String!
    $phone: String!
    $address: String!
    $givenBenefits: [Benefits!]!
    $companies: [String!]!
  ) {
    createEmployee(
      name: $name
      cpf: $cpf
      phone: $phone
      address: $address
      givenBenefits: $givenBenefits
      companies: $companies
    ) {
      id
    }
  }
`;

describe('apollo-server', () => {
  const companiesAPI = {
    getAllCompanies: jest.fn(),
    findById: jest.fn(),
    createCompany: jest.fn(),
  };
  const employeeAPI = {
    getAllEmployees: jest.fn(),
    findById: jest.fn(),
    createEmployee: jest.fn(),
  };

  let server;

  beforeEach(async () => {
    server = new ApolloServer({
      typeDefs,
      resolvers,
      playground: true,
      dataSources: () => ({
        companiesAPI,
        employeeAPI,
      }),
    });
    await server.listen();
  });

  afterEach(async () => {
    await server.stop();
    jest.clearAllMocks();
  })

  describe('companies', () => {
    describe('queries', () => {
      it('should return expected result on getAllCompanies query', async () => {
        const mockCompanies = [
          {
            id: mongoose.Types.ObjectId(),
            name: 'SomeCompany',
            tradingName: 'SC',
            cnpj: '12345678998765',
            address: 'Some Address',
            chosenBenefits: ['vr', 'vt', 'gympass'],
          }
        ];
        companiesAPI.getAllCompanies.mockResolvedValue(mockCompanies);

        const { data: { getAllCompanies: res } } = await server.executeOperation({ query: GET_ALL_COMPANIES });

        expect(companiesAPI.getAllCompanies).toHaveBeenCalledTimes(1);

        expect(mockCompanies[0].id.equals(res[0].id)).toBeTruthy();
        expect(res[0].name).toBe(mockCompanies[0].name);
        expect(res[0].tradingName).toBe(mockCompanies[0].tradingName);
        expect(res[0].cnpj).toBe(mockCompanies[0].cnpj);
        expect(res[0].address).toBe(mockCompanies[0].address);
        expect(res[0].chosenBenefits).toEqual(mockCompanies[0].chosenBenefits);
      });

      it('should return expected result on findCompanyById query', async () => {
        const id = mongoose.Types.ObjectId();
        const mockCompany = {
          id,
          name: 'SomeCompany',
          tradingName: 'SC',
          cnpj: '12345678998765',
          address: 'Some Address',
          chosenBenefits: ['vr', 'vt', 'gympass'],
        };
        companiesAPI.findById.mockImplementation((someId) => someId === id.toHexString() ? mockCompany : null);

        const { data: { findCompanyById: res } } = await server
          .executeOperation({ query: FIND_BY_COMPANY_ID, variables: { id: id.toHexString() } });

        expect(companiesAPI.findById).toHaveBeenCalledTimes(1);

        expect(id.equals(res.id)).toBeTruthy();
        expect(res.name).toBe(mockCompany.name);
        expect(res.tradingName).toBe(mockCompany.tradingName);
        expect(res.cnpj).toBe(mockCompany.cnpj);
        expect(res.address).toBe(mockCompany.address);
        expect(res.chosenBenefits).toEqual(mockCompany.chosenBenefits);
      });
    });

    describe('mutation', () => {
      it('should call expected api function on createCompany mutation', async () => {
        const variables = {
          name: 'SomeCompany',
          tradingName: 'SC',
          cnpj: '12345678998765',
          address: 'Some Address',
          chosenBenefits: ['vr', 'vt', 'gympass'],
        };

        await server.executeOperation({ query: CREATE_COMPANY, variables });

        expect(companiesAPI.createCompany).toHaveBeenCalledWith(variables);
      });
    });
  });

  describe('employees', () => {
    describe('queries', () => {
      it('should return expected result on getAllEmployees query', async () => {
        const mockEmployees = [
          {
            id: mongoose.Types.ObjectId(),
            name: 'SomeCompany',
            phone: '11111111111',
            cpf: '11111111111',
            address: 'Some Address',
            givenBenefits: ['vr', 'vt', 'gympass'],
          }
        ];
        employeeAPI.getAllEmployees.mockResolvedValue(mockEmployees);

        const { data: { getAllEmployees: res } } = await server.executeOperation({ query: GET_ALL_EMPLOYEES });

        expect(employeeAPI.getAllEmployees).toHaveBeenCalledTimes(1);

        expect(mockEmployees[0].id.equals(res[0].id)).toBeTruthy();
        expect(res[0].name).toBe(mockEmployees[0].name);
        expect(res[0].phone).toBe(mockEmployees[0].phone);
        expect(res[0].cpf).toBe(mockEmployees[0].cpf);
        expect(res[0].address).toBe(mockEmployees[0].address);
        expect(res[0].givenBenefits).toEqual(mockEmployees[0].givenBenefits);
      });

      it('should return expected result on findEmployeeById query', async () => {
        const id = mongoose.Types.ObjectId();
        const mockEmployee = {
          id,
          name: 'SomeCompany',
          phone: '11111111111',
          cpf: '11111111111',
          address: 'Some Address',
          givenBenefits: ['vr', 'vt', 'gympass'],
        };
        employeeAPI.findById.mockImplementation((someId) => someId === id.toHexString() ? mockEmployee : null);

        const { data: { findEmployeeById: res } } = await server
          .executeOperation({ query: FIND_BY_EMPLOYEE_ID, variables: { id: id.toHexString() } });

        expect(employeeAPI.findById).toHaveBeenCalledTimes(1);

        expect(id.equals(res.id)).toBeTruthy();
        expect(res.name).toBe(mockEmployee.name);
        expect(res.tradingName).toBe(mockEmployee.tradingName);
        expect(res.cpf).toBe(mockEmployee.cpf);
        expect(res.address).toBe(mockEmployee.address);
        expect(res.chosenBenefits).toEqual(mockEmployee.chosenBenefits);
      });
    });

    describe('mutation', () => {
      it('should call expected api function on createEmployee mutation', async () => {
        const variables = {
          name: 'SomeCompany',
          phone: '11111111111',
          cpf: '11111111111',
          address: 'Some Address',
          givenBenefits: ['vr', 'vt', 'gympass'],
          companies: ['alsjdlakjsdlkajsld'],
        };

        await server.executeOperation({ query: CREATE_EMPLOYEE, variables });

        expect(employeeAPI.createEmployee).toHaveBeenCalledWith(variables);
      });
    });
  });
});
