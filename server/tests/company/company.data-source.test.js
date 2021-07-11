import mongoose from 'mongoose';
import { connect, clearDatabase, closeDatabase } from '../db';
import model from '../../company/company.model';
import employeeModel from '../../employee/employee.model';
import { CompaniesAPI } from '../../company/company.data-source';

describe('CompaniesAPI', () => {
  const companiesAPI = new CompaniesAPI(model);

  beforeAll(async () => await connect());

  afterEach(async () => await clearDatabase());

  afterAll(async () => await closeDatabase());

  describe('createCompany', () => {
    it('should create if receive valid args', async () => {
      const validArgs = {
        name: 'SomeCompany',
        tradingName: 'SC',
        cnpj: '12345678998765',
        address: 'Some Address',
        chosenBenefits: ['vr', 'vt', 'gympass'],
      };

      const result = await companiesAPI.createCompany(validArgs);

      expect(result.name).toBe(validArgs.name);
      expect(result.tradingName).toBe(validArgs.tradingName);
      expect(result.cnpj).toBe(validArgs.cnpj);
      expect(result.address).toBe(validArgs.address);
      expect(result.chosenBenefits.toObject()).toEqual(validArgs.chosenBenefits);
    });

    it('should throw error if CNPJ is duplicated', async () => {
      const validArgs = {
        name: 'SomeCompany',
        tradingName: 'SC',
        cnpj: '12345678998765',
        address: 'Some Address',
        chosenBenefits: ['vr', 'vt', 'gympass'],
      };

      const duplicatedCnpjArgs = {
        name: 'OtherCompany',
        tradingName: 'OC',
        cnpj: '12345678998765',
        address: 'Other Address',
        chosenBenefits: ['vr', 'vt', 'gympass'],
      };

      await companiesAPI.createCompany(validArgs);
      await expect(companiesAPI.createCompany(duplicatedCnpjArgs)).rejects.toThrow();
    });

    it.each(
      [
        ['has less than 14 characters', '1111111111111'],
        ['has more than 14 characters', '111111111111111'],
        ['has some letter', '11111111s11111'],
      ]
    )('should throw error if CNPJ %s', async (_, cnpj) => {
      const args = {
        name: 'SomeCompany',
        tradingName: 'SC',
        address: 'Some Address',
        chosenBenefits: ['vr', 'vt', 'gympass'],
      };
      await expect(companiesAPI.createCompany({ ...args, cnpj })).rejects.toThrow('CNPJ deve possuir apenas números e 14 caracteres');
    });

    it('should throw error if chosen benefit does not exist', async () => {
      const args = {
        name: 'SomeCompany',
        tradingName: 'SC',
        cnpj: '12345678998765',
        address: 'Some Address',
        chosenBenefits: ['vr', 'vt', 'gympass', 'totally_exists'],
      };

      await expect(companiesAPI.createCompany(args)).rejects.toThrow();
    });

    it.each(
      [
        ['name', 'Nome da empresa é obrigatório'],
        ['tradingName', 'Nome fantasia é obrigatório'],
        ['cnpj', 'CNPJ é obrigatório'],
        ['address', 'Endereço é obrigatório'],
        ['chosenBenefits', 'Benefícios são obrigatórios'],
      ]
    )('should throw error if %s is null', async (field, errMessage) => {
      const validArgs = {
        name: 'SomeCompany',
        tradingName: 'SC',
        cnpj: '12345678998765',
        address: 'Some Address',
        chosenBenefits: ['vr', 'vt', 'gympass'],
      };
      await expect(companiesAPI.createCompany({ ...validArgs, [field]: null })).rejects.toThrow(errMessage);
    });
  });

  describe('getAllCompanies', () => {
    it('should return all saved companies', async () => {
      const validArgs1 = {
        name: 'SomeCompany',
        tradingName: 'SC',
        cnpj: '12345678998765',
        address: 'Some Address',
        chosenBenefits: ['vr', 'vt', 'gympass'],
      };

      const validArgs2 = {
        name: 'AnotherCompany',
        tradingName: 'AC',
        cnpj: '12345678998766',
        address: 'Another Address',
        chosenBenefits: ['vr', 'vt', 'gympass'],
      };

      const [company1, company2] = await Promise.all([model.create(validArgs1), model.create(validArgs2)]);
      const result = await companiesAPI.getAllCompanies();

      expect(result.length).toBe(2);
      expect(result[0].id).toEqual(company1.id);
      expect(result[1].id).toEqual(company2.id);
    });
  });

  describe('findById', () => {
    it('should find the correct company if exists', async () => {
      const validArgs = {
        name: 'SomeCompany',
        tradingName: 'SC',
        cnpj: '12345678998765',
        address: 'Some Address',
        chosenBenefits: ['vr', 'vt', 'gympass'],
      };

      const company = await model.create(validArgs);
      const result = await companiesAPI.findById(company.id);

      expect(result.id).toBe(company.id);
    });

    it('should return null if company is not found', async () => {
      const result = await companiesAPI.findById(mongoose.Types.ObjectId());
      expect(result).toBeNull();
    });
  });

  describe('addEmployee', () => {
    it('should add employee if everything is valid', async () => {
      const validArgs = {
        name: 'SomeCompany',
        tradingName: 'SC',
        cnpj: '12345678998765',
        address: 'Some Address',
        chosenBenefits: ['vr', 'vt', 'gympass'],
      };
      const company = await model.create(validArgs);

      const validEmployeeArgs = {
        name: 'Someone',
        phone: '11111111111',
        address: 'Some Address',
        cpf: '11111111111',
        givenBenefits: ['vr'],
      };
      const employee = await employeeModel.create(validEmployeeArgs);

      await companiesAPI.addEmployee(company.id, employee);
      const updatedCompany = await model.findById(company.id);

      expect(updatedCompany.employees.length).toBe(1);
      expect(updatedCompany.employees[0].equals(employee.id)).toBeTruthy();
    });

    it('should throw error if company already has employye with same CPF', async () => {
      const validArgs = {
        name: 'SomeCompany',
        tradingName: 'SC',
        cnpj: '12345678998765',
        address: 'Some Address',
        chosenBenefits: ['vr', 'vt', 'gympass'],
      };
      const company = await model.create(validArgs);

      const validEmployeeArgs = {
        name: 'Someone',
        phone: '11111111111',
        address: 'Some Address',
        cpf: '11111111111',
        givenBenefits: ['vr'],
      };
      const employee = await employeeModel.create(validEmployeeArgs);

      await companiesAPI.addEmployee(company.id, employee);
      await expect(companiesAPI.addEmployee(company.id, validEmployeeArgs)).rejects.toThrow('Funcionário já registrado na empresa');
    });

    it('should throw error if company does not exist', async () => {
      await expect(companiesAPI.addEmployee(mongoose.Types.ObjectId(), {})).rejects.toThrow('Empresa não encontrada');
    });
  });
});
