export async function createEmployee(_parent, args, { dataSources }) {
  return dataSources.employeeAPI.createEmployee(args);
}

export async function getAllEmployees(_parent, _args, { dataSources }) {
  return dataSources.employeeAPI.getAllEmployees();
}

export async function findEmployeeById(_parent, { id }, { dataSources }) {
  return dataSources.employeeAPI.findById(id);
}
