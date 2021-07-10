import companyModel from "../company/company.model.js";
import employeeModel from "../employee/employee.model.js";
import aServer from "apollo-server";
import { CompaniesAPI } from "../company/company.data-source.js";
import { EmployeeAPI } from "../employee/employee.data-source.js";
import { resolvers } from "../graphql/resolvers.js";
import { typeDefs } from "../graphql/schema.js";

const { ApolloServer } = aServer

const companiesAPI = new CompaniesAPI(companyModel);
const employeeAPI = new EmployeeAPI(employeeModel, companiesAPI);

export const apolloServer = () =>
  new ApolloServer({
    typeDefs,
    resolvers,
    playground: true,
    dataSources: () => ({
      companiesAPI,
      employeeAPI,
    }),
  });
