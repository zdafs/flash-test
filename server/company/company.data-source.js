import apolloDatasource from "apollo-datasource";
const { DataSource } = apolloDatasource

export class CompaniesAPI extends DataSource {
  constructor(companyModel) {
    super();
    this.model = companyModel;
  }

  async getAllCompanies() {
    return this.model.find().populate('employees');
  }

  async findById(id) {
    return this.model.findById(id).populate('employees');
  }

  async createCompany(args) {
    return this.model.create(args);
  }

  async addEmployee(id, newEmployee) {
    const company = await this.findById(id);
    if (!company) {
      throw new Error('Empresa não encontrada');
    }

    const hasEmployee = company.employees.some((employee) => employee.cpf === newEmployee.cpf);
    if (hasEmployee) {
      throw new Error('Funcionário já registrado na empresa');
    }

    return this.model.findByIdAndUpdate(
      id,
      { $push: { employees: newEmployee.id } }
    );
  }
}
