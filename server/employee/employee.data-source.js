import apolloDatasource from "apollo-datasource";
const { DataSource } = apolloDatasource

export class EmployeeAPI extends DataSource {
  constructor(employeeModel, companiesAPI) {
    super();
    this.companiesAPI = companiesAPI;
    this.model = employeeModel;
  }

  async getAllEmployees() {
    return this.model.find();
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async createEmployee(args) {
    const { companies, ...restArgs } = args;
    if (companies.length === 0) {
      throw new Error('Pelo menos uma empresa deve estar relacionada ao funcionário');
    }

    const createdEmployee = await this.model.create(restArgs);

    const promises = companies.map((id) => this.companiesAPI.addEmployee(id, createdEmployee));
    const results = await Promise.allSettled(promises);
    const someSuccess = results.some((result) => result.status === 'fulfilled');

    if (!someSuccess) {
      throw new Error('Funcionário já registrado em todas as empresas providenciadas');
    }

    return createdEmployee;
  }
}
