import {
  getAllCompanies,
  createCompany,
  findCompanyById,
} from "../company/company.resolver.js";

import {
  getAllEmployees,
  createEmployee,
  findEmployeeById,
} from '../employee/employee.resolver.js';

export const resolvers = {
  Query: {
    getAllCompanies,
    findCompanyById,
    getAllEmployees,
    findEmployeeById,
  },
  Mutation: {
    createCompany,
    createEmployee,
  },
};
