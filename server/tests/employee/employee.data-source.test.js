import mongoose from 'mongoose';
import { connect, clearDatabase, closeDatabase } from '../db';
import companyModel from '../../company/company.model';
import employeeModel from '../../employee/employee.model';
import { CompaniesAPI } from '../../company/company.data-source';
import { EmployeeAPI } from '../../employee/employee.data-source';

describe('EmployeeAPI', () => {
  const companiesAPI = new CompaniesAPI(companyModel);
  const employeeAPI = new EmployeeAPI(employeeModel, companiesAPI)

  beforeAll(async () => await connect());

  afterEach(async () => await clearDatabase());

  afterAll(async () => await closeDatabase());

  describe('createEmployee', () => {
    it('should create employee and updated companies if receive valid args', async () => {
      const validCompanyArgs = {
        name: 'SomeCompany',
        tradingName: 'SC',
        cnpj: '12345678998765',
        address: 'Some Address',
        chosenBenefits: ['vr', 'vt', 'gympass'],
      };
      const company = await companyModel.create(validCompanyArgs);

      const validEmployeeArgs = {
        name: 'Someone',
        phone: '11111111111',
        address: 'Some Address',
        cpf: '11111111111',
        givenBenefits: ['vr'],
        companies: [company.id],
      };

      const result = await employeeAPI.createEmployee(validEmployeeArgs);
      const updatedCompany = await companyModel.findById(company.id);

      expect(result.name).toBe(validEmployeeArgs.name);
      expect(result.phone).toBe(validEmployeeArgs.phone);
      expect(result.address).toBe(validEmployeeArgs.address);
      expect(result.cpf).toBe(validEmployeeArgs.cpf);
      expect(result.givenBenefits.toObject()).toEqual(validEmployeeArgs.givenBenefits);
      expect(updatedCompany.employees[0].equals(result.id)).toBeTruthy();
    });

    it.each(
      [undefined, []]
    )('should throw error if companies is %p', async (value) => {
      const employeeArgs = {
        name: 'Someone',
        phone: '11111111111',
        address: 'Some Address',
        cpf: '11111111111',
        givenBenefits: ['vr'],
      };

      await expect(employeeAPI.createEmployee({ ...employeeArgs, companies: value }))
        .rejects
        .toThrow('Pelo menos uma empresa deve estar relacionada ao funcionário');
    });

    it('should throw error if employee with same CPF already exists', async () => {
      const validCompanyArgs = {
        name: 'SomeCompany',
        tradingName: 'SC',
        cnpj: '12345678998765',
        address: 'Some Address',
        chosenBenefits: ['vr', 'vt', 'gympass'],
      };
      const company = await companyModel.create(validCompanyArgs);

      const validEmployeeArgs = {
        name: 'Someone',
        phone: '11111111111',
        address: 'Some Address',
        cpf: '11111111111',
        givenBenefits: ['vr'],
        companies: [company.id],
      };
      await employeeAPI.createEmployee(validEmployeeArgs);
      await expect(employeeAPI.createEmployee(validEmployeeArgs)).rejects.toThrow();
    });

    it.each([
      ['has less than 11 numbers', '1111111111'],
      ['has more than 11 numbers', '111111111111'],
      ['has charactes different from numbers', '1111111111a'],
    ])('should throw error if CPF %s', async (_, value) => {
      const validEmployeeArgs = {
        name: 'Someone',
        phone: '11111111111',
        address: 'Some Address',
        givenBenefits: ['vr'],
        companies: [mongoose.Types.ObjectId()],
      };

      await expect(employeeAPI.createEmployee({ ...validEmployeeArgs, cpf: value }))
        .rejects
        .toThrow('CPF deve possuir apenas números e 11 caracteres');
    });

    it.each([
      ['has less than 11 numbers', '1111111111'],
      ['has more than 11 numbers', '111111111111'],
      ['has charactes different from numbers', '1111111111a'],
    ])('should throw error if phone %s', async (_, value) => {
      const validEmployeeArgs = {
        name: 'Someone',
        cpf: '11111111111',
        address: 'Some Address',
        givenBenefits: ['vr'],
        companies: [mongoose.Types.ObjectId()],
      };

      await expect(employeeAPI.createEmployee({ ...validEmployeeArgs, phone: value }))
        .rejects
        .toThrow('Telefone deve possuir apenas números e 11 caracteres');
    });

    it.each(
      [
        ['name', 'Nome do funcionário é obrigatório'],
        ['phone', 'Telefone do funcionário é obrigatório'],
        ['cpf', 'CPF é obrigatório'],
        ['address', 'Endereço é obrigatório'],
        ['givenBenefits', 'Benefícios são obrigatórios'],
      ]
    )('should throw error if %s is null', async (field, errMessage) => {
      const validArgs = {
        name: 'Someone',
        phone: '11111111111',
        address: 'Some Address',
        cpf: '11111111111',
        givenBenefits: ['vr'],
        companies: [mongoose.Types.ObjectId()],
      };
      await expect(employeeAPI.createEmployee({ ...validArgs, [field]: null })).rejects.toThrow(errMessage);
    });
  });

  describe('getAllEmployees', () => {
    it('should return all saved employees', async () => {
      const validArgs1 = {
        name: 'Someone',
        phone: '11111111111',
        address: 'Some Address',
        cpf: '11111111111',
        givenBenefits: ['vr'],
      };

      const validArgs2 = {
        name: 'AnotherOne',
        phone: '11111111111',
        address: 'Another Address',
        cpf: '11111111112',
        givenBenefits: ['vr'],
      };

      const [employee1, employee2] = await Promise.all([employeeModel.create(validArgs1), employeeModel.create(validArgs2)]);
      const result = await employeeAPI.getAllEmployees();

      expect(result.length).toBe(2);
      expect(result[0].id).toEqual(employee1.id);
      expect(result[1].id).toEqual(employee2.id);
    });
  });

  describe('findById', () => {
    it('should find the correct employee if exists', async () => {
      const validArgs = {
        name: 'Someone',
        phone: '11111111111',
        address: 'Some Address',
        cpf: '11111111111',
        givenBenefits: ['vr'],
      };

      const employee = await employeeModel.create(validArgs);
      const result = await employeeAPI.findById(employee.id);

      expect(result.id).toBe(employee.id);
    });

    it('should return null if employee is not found', async () => {
      const result = await employeeAPI.findById(mongoose.Types.ObjectId());
      expect(result).toBeNull();
    });
  });
});
